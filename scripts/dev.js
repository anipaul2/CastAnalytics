import localtunnel from 'localtunnel';
import { spawn } from 'child_process';
import { createServer } from 'net';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fetch from 'node-fetch';

// Load environment variables
dotenv.config({ path: '.env.local' });

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(path.normalize(path.join(__dirname, '..')));

let tunnel;
let nextDev;
let isCleaningUp = false;
let tunnelRetries = 0;
const maxTunnelRetries = 3;

// Parse command line arguments for port
const args = process.argv.slice(2);
let port = 3000; // default port

// Look for --port=XXXX, --port XXXX, -p=XXXX, or -p XXXX
args.forEach((arg, index) => {
  if (arg.startsWith('--port=')) {
    port = parseInt(arg.split('=')[1]);
  } else if (arg === '--port' && args[index + 1]) {
    port = parseInt(args[index + 1]);
  } else if (arg.startsWith('-p=')) {
    port = parseInt(arg.split('=')[1]);
  } else if (arg === '-p' && args[index + 1]) {
    port = parseInt(args[index + 1]);
  }
});

async function checkPort(port) {
  return new Promise((resolve) => {
    const server = createServer();
    
    server.once('error', () => {
      resolve(true); // Port is in use
    });
    
    server.once('listening', () => {
      server.close();
      resolve(false); // Port is free
    });
    
    server.listen(port);
  });
}

async function killProcessOnPort(port) {
  try {
    if (process.platform === 'win32') {
      // Windows: Use netstat to find the process
      const netstat = spawn('netstat', ['-ano', '|', 'findstr', `:${port}`]);
      netstat.stdout.on('data', (data) => {
        const match = data.toString().match(/\s+(\d+)$/);
        if (match) {
          const pid = match[1];
          spawn('taskkill', ['/F', '/PID', pid]);
        }
      });
      await new Promise((resolve) => netstat.on('close', resolve));
    } else {
      // Unix-like systems: Use lsof
      const lsof = spawn('lsof', ['-ti', `:${port}`]);
      lsof.stdout.on('data', (data) => {
        data.toString().split('\n').forEach(pid => {
          if (pid) {
            try {
              process.kill(parseInt(pid), 'SIGKILL');
            } catch (e) {
              if (e.code !== 'ESRCH') throw e;
            }
          }
        });
      });
      await new Promise((resolve) => lsof.on('close', resolve));
    }
  } catch (e) {
    // Ignore errors if no process found
  }
}

async function createTunnelWithRetry() {
  try {
    console.log(`Creating tunnel (attempt ${tunnelRetries + 1}/${maxTunnelRetries})...`);
    
    const tunnelInstance = await localtunnel({ 
      port: port,
      host: 'https://localtunnel.me' // Explicitly set the host
    });
    
    // Add error handler
    tunnelInstance.on('error', async (err) => {
      console.error('Tunnel error:', err.message);
      
      if (err.message.includes('connection refused') && tunnelRetries < maxTunnelRetries) {
        tunnelRetries++;
        console.log(`Retrying tunnel connection in 5 seconds...`);
        
        // Close the failed tunnel
        try {
          await tunnelInstance.close();
        } catch (e) {
          // Ignore close errors
        }
        
        // Wait and retry
        setTimeout(async () => {
          try {
            tunnel = await createTunnelWithRetry();
          } catch (e) {
            console.error('Failed to recreate tunnel:', e);
          }
        }, 5000);
      }
    });
    
    tunnelInstance.on('close', () => {
      console.log('Tunnel closed');
      if (!isCleaningUp && tunnelRetries < maxTunnelRetries) {
        tunnelRetries++;
        console.log('Tunnel closed unexpectedly, attempting to reconnect...');
        setTimeout(async () => {
          try {
            tunnel = await createTunnelWithRetry();
          } catch (e) {
            console.error('Failed to recreate tunnel:', e);
          }
        }, 2000);
      }
    });
    
    return tunnelInstance;
  } catch (error) {
    if (tunnelRetries < maxTunnelRetries) {
      tunnelRetries++;
      console.log(`Tunnel creation failed, retrying in 5 seconds...`);
      await new Promise(resolve => setTimeout(resolve, 5000));
      return createTunnelWithRetry();
    }
    throw error;
  }
}

async function startDev() {
  // Check if the specified port is already in use
  const isPortInUse = await checkPort(port);
  if (isPortInUse) {
    console.error(`Port ${port} is already in use. Running cleanup...`);
    await killProcessOnPort(port);
    
    // Check again
    const stillInUse = await checkPort(port);
    if (stillInUse) {
      console.error(`Failed to free port ${port}. Please manually kill the process and try again.`);
      process.exit(1);
    }
  }

  const useTunnel = process.env.USE_TUNNEL === 'true';
  let miniAppUrl;

  // Start Next.js first
  console.log('🚀 Starting Next.js development server...');
  const nextBin = path.normalize(path.join(projectRoot, 'node_modules', '.bin', 'next'));

  nextDev = spawn(nextBin, ['dev', '-p', port.toString()], {
    stdio: 'inherit',
    env: { 
      ...process.env, 
      NODE_ENV: 'development',
      // Remove NEXTAUTH_URL as it's not needed for mini apps
    },
    cwd: projectRoot,
    shell: process.platform === 'win32'
  });

  // Wait for Next.js to start
  console.log('⏳ Waiting for Next.js to start...');
  await new Promise(resolve => setTimeout(resolve, 5000));

  if (useTunnel) {
    try {
      // Create tunnel with retry logic
      tunnel = await createTunnelWithRetry();
      miniAppUrl = tunnel.url;
      
      let ip;
      try {
        const response = await fetch('https://ipv4.icanhazip.com');
        ip = await response.text();
        ip = ip.trim();
      } catch (error) {
        console.error('Error getting IP address:', error);
        ip = 'your_ip_address';
      }

      console.log(`
✅ Development server ready!

🌐 Local tunnel URL: ${tunnel.url}

💻 To test on desktop:
   1. Open the localtunnel URL in your browser: ${tunnel.url}
   2. Enter your IP address in the password field: ${ip}
      (Note: This IP may be incorrect if you are using a VPN)
   3. Click "Click to Submit" -- your mini app should now load in the browser
   4. Navigate to the Warpcast Mini App Developer Tools: https://warpcast.com/~/developers
   5. Enter your mini app URL: ${tunnel.url}
   6. Click "Preview" to launch your mini app within Warpcast

📱 To test in Warpcast mobile app:
   1. Open Warpcast on your phone
   2. Go to Settings > Developer > Mini Apps
   3. Enter this URL: ${tunnel.url}
   4. Click "Preview"

⚠️  If the tunnel disconnects, it will automatically retry to reconnect.
`);
    } catch (error) {
      console.error('❌ Failed to create tunnel after multiple attempts:', error.message);
      console.log('\n💡 You can still test locally without a tunnel:');
      miniAppUrl = `http://localhost:${port}`;
      showLocalInstructions(miniAppUrl);
    }
  } else {
    miniAppUrl = `http://localhost:${port}`;
    showLocalInstructions(miniAppUrl);
  }

  // Handle cleanup
  const cleanup = async () => {
    if (isCleaningUp) return;
    isCleaningUp = true;

    console.log('\n\nShutting down...');

    try {
      if (nextDev) {
        try {
          nextDev.kill('SIGTERM');
          // Give it time to shut down gracefully
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          // Force kill if still running
          if (nextDev?.pid) {
            try {
              process.kill(nextDev.pid, 'SIGKILL');
            } catch (e) {
              if (e.code !== 'ESRCH') console.error('Error killing Next.js:', e);
            }
          }
          console.log('🛑 Next.js dev server stopped');
        } catch (e) {
          console.log('Note: Next.js process already terminated');
        }
      }
      
      if (tunnel) {
        try {
          await tunnel.close();
          console.log('🌐 Tunnel closed');
        } catch (e) {
          console.log('Note: Tunnel already closed');
        }
      }

      // Force kill any remaining processes on the specified port
      await killProcessOnPort(port);
    } catch (error) {
      console.error('Error during cleanup:', error);
    } finally {
      process.exit(0);
    }
  };

  // Handle process termination
  process.on('SIGINT', cleanup);
  process.on('SIGTERM', cleanup);
  process.on('exit', cleanup);
  process.on('uncaughtException', (error) => {
    console.error('Uncaught exception:', error);
    cleanup();
  });
}

function showLocalInstructions(url) {
  console.log(`
✅ Development server ready!

💻 To test your mini app locally:
   1. Open the Warpcast Mini App Developer Tools: https://warpcast.com/~/developers
   2. Scroll down to the "Preview Mini App" tool
   3. Enter this URL: ${url}
   4. Click "Preview" to test your mini app

Note: Local testing only works on the same network.
For testing on other devices, use localtunnel by setting USE_TUNNEL=true
`);
}

startDev().catch(console.error);
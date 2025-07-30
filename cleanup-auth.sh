#!/bin/bash

echo "🧹 Cleaning up unnecessary auth files for Farcaster mini app..."

# Remove API auth routes
if [ -d "src/app/api/auth" ]; then
    echo "Removing src/app/api/auth directory..."
    rm -rf src/app/api/auth
fi

# Remove test-auth if it exists
if [ -d "src/app/api/test-auth" ]; then
    echo "Removing src/app/api/test-auth directory..."
    rm -rf src/app/api/test-auth
fi

# Update .env.local to remove NextAuth variables
if [ -f ".env.local" ]; then
    echo "Cleaning up .env.local..."
    # Create a backup
    cp .env.local .env.local.backup
    
    # Remove NextAuth related variables
    grep -v "NEXTAUTH_URL" .env.local > .env.local.tmp && mv .env.local.tmp .env.local
    grep -v "NEXTAUTH_SECRET" .env.local > .env.local.tmp && mv .env.local.tmp .env.local
    
    echo "Backup created: .env.local.backup"
fi

echo "✅ Cleanup complete!"
echo ""
echo "Next steps:"
echo "1. Run 'npm run dev' to start the development server"
echo "2. The app will use Quick Auth from Farcaster SDK instead of NextAuth"
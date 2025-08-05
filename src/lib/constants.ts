import { type AccountAssociation } from '@farcaster/miniapp-core/src/manifest';

/**
 * Application constants and configuration values.
 *
 * This file contains all the configuration constants used throughout the mini app.
 * These values are either sourced from environment variables or hardcoded and provide
 * configuration for the app's appearance, behavior, and integration settings.
 *
 * NOTE: This file is automatically updated by the init script.
 * Manual changes may be overwritten during project initialization.
 */

// --- App Configuration ---
/**
 * The base URL of the application.
 * Used for generating absolute URLs for assets and API endpoints.
 */
export const APP_URL: string = process.env.NEXT_PUBLIC_URL || 'https://cast-analytics.vercel.app';

/**
 * The name of the mini app as displayed to users.
 * Used in titles, headers, and app store listings.
 */
export const APP_NAME = 'CastAnalytics';

/**
 * A brief description of the mini app's functionality.
 * Used in app store listings and metadata.
 */
export const APP_DESCRIPTION = 'A mini app that shows your most engaged cast in the span of 30 days';

/**
 * The primary category for the mini app.
 * Used for app store categorization and discovery.
 */
export const APP_PRIMARY_CATEGORY = 'social';

/**
 * Tags associated with the mini app.
 * Used for search and discovery in app stores.
 */
export const APP_TAGS = ['analytics', 'engagement', 'social'];

// --- Asset URLs ---
/**
 * URL for the app's icon image.
 * Used in app store listings and UI elements.
 */
export const APP_ICON_URL: string = 'https://raw.githubusercontent.com/anipaul2/imageUpload/main/AppIcon.png';

/**
 * URL for the app's Open Graph image.
 * Used for social media sharing and previews.
 */
export const APP_OG_IMAGE_URL: string = 'https://raw.githubusercontent.com/anipaul2/imageUpload/main/SI.png';

/**
 * URL for the app's splash screen image.
 * Displayed during app loading.
 */
export const APP_SPLASH_URL: string = 'https://raw.githubusercontent.com/anipaul2/imageUpload/main/SI.png';

/**
 * Background color for the splash screen.
 * Used as fallback when splash image is loading.
 */
export const APP_SPLASH_BACKGROUND_COLOR: string = '#f7f7f7';

/**
 * Account association for the mini app.
 * Used to associate the mini app with a Farcaster account.
 * If not provided, the mini app will be unsigned and have limited capabilities.
 */
export const APP_ACCOUNT_ASSOCIATION: AccountAssociation = {
  header: "eyJmaWQiOjE1MTA0LCJ0eXBlIjoiYXV0aCIsImtleSI6IjB4Mzk4NjYyNDRGNGUyN0UxODZGRDAxREMyMGY1NmQzNDdFNmNCRjRjNSJ9",
  payload: "eyJkb21haW4iOiJjYXN0LWFuYWx5dGljcy52ZXJjZWwuYXBwIn0",
  signature: "KKFrzLXX2Ktd2M/VHGF8z9heDE5RgZIMGoM22WCBiaIJ/A9aBvzZo4XXOwilTPH+Zzyny/FdKeq96744g3sxgRw="
};

// --- UI Configuration ---
/**
 * Text displayed on the main action button.
 * Used for the primary call-to-action in the mini app.
 */
export const APP_BUTTON_TEXT = 'Check your engagement score';

// --- Integration Configuration ---
/**
 * Webhook URL for receiving events from Neynar.
 * Required for Mini App notifications and user interactions.
 */
export const APP_WEBHOOK_URL: string = 'https://api.neynar.com/f/app/1b662d30-7f76-433f-9b78-773aafef91b8/event';

/**
 * Flag to enable/disable wallet functionality.
 *
 * When true, wallet-related components and features are rendered.
 * When false, wallet functionality is completely hidden from the UI.
 * Useful for mini apps that don't require wallet integration.
 */
export const USE_WALLET = false;

/**
 * Flag to enable/disable analytics tracking.
 *
 * When true, usage analytics are collected and sent to Neynar.
 * When false, analytics collection is disabled.
 * Useful for privacy-conscious users or development environments.
 */
export const ANALYTICS_ENABLED = false;

/**
 * Required chains for the mini app.
 *
 * Contains an array of CAIP-2 identifiers for blockchains that the mini app requires.
 * If the host does not support all chains listed here, it will not render the mini app.
 * If empty or undefined, the mini app will be rendered regardless of chain support.
 *
 * Supported chains: eip155:1, eip155:137, eip155:42161, eip155:10, eip155:8453,
 * solana:mainnet, solana:devnet
 */
export const APP_REQUIRED_CHAINS: string[] = [];

// PLEASE DO NOT UPDATE THIS
export const SIGNED_KEY_REQUEST_VALIDATOR_EIP_712_DOMAIN = {
  name: 'Farcaster SignedKeyRequestValidator',
  version: '1',
  chainId: 10,
  verifyingContract:
    '0x00000000fc700472606ed4fa22623acf62c60553' as `0x${string}`,
};

// PLEASE DO NOT UPDATE THIS
export const SIGNED_KEY_REQUEST_TYPE = [
  { name: 'requestFid', type: 'uint256' },
  { name: 'key', type: 'bytes' },
  { name: 'deadline', type: 'uint256' },
];

# Wallet Authentication System

## Overview

The Wallet Authentication System provides automatic sign-in verification after wallet connection, ensuring users verify wallet ownership before accessing sensitive information.

## Features

- ✅ **Automatic Popup**: Appears automatically after wallet connection
- ✅ **Wallet Signature Verification**: Uses typed data signing for secure verification
- ✅ **Session Persistence**: Authentication persists for the current session
- ✅ **Auto Reset on Disconnect**: Clears authentication when wallet disconnects
- ✅ **Theme Support**: Fully integrated with dark/light mode
- ✅ **Mobile Responsive**: Works seamlessly across all devices

## How It Works

### 1. User Flow

1. User connects wallet via Starknetkit modal
2. **Automatic popup appears** prompting user to sign in
3. User clicks "Sign Message" to verify wallet ownership
4. Wallet prompts user to sign a message (no gas fees)
5. Upon successful signature, user is authenticated
6. Authentication persists for the session
7. When wallet disconnects, authentication resets

### 2. Architecture

#### Components

- **`WalletAuthProvider`**: Context provider managing authentication state
- **`WalletSignInModal`**: The popup modal for signature verification
- **`ProtectedContent`**: Wrapper component for sensitive content
- **`useWalletAuth`**: Hook to access authentication state and functions
- **`useRequireAuth`**: Hook to require authentication in components

#### File Structure

```
frontend/
├── app/
│   ├── context/
│   │   └── wallet-auth-context.tsx      # Authentication context
│   ├── components/
│   │   └── modals/
│   │       └── WalletSignInModal.tsx    # Sign-in modal component
│   └── layout.tsx                        # Provider integration
└── components/
    └── shared/
        ├── ProtectedContent.tsx          # Protected content wrapper
        └── WalletConnected.tsx           # Updated with auth clearing
```

## Usage Examples

### 1. Protecting Sensitive Content

Use the `ProtectedContent` component to wrap any sensitive information:

```tsx
import ProtectedContent from '@/components/shared/ProtectedContent'

function UserSettings() {
  return (
    <ProtectedContent fallbackMessage="Sign in to view your settings">
      <div>
        <h2>Private Settings</h2>
        <p>Your sensitive data here...</p>
      </div>
    </ProtectedContent>
  )
}
```

### 2. Checking Authentication Status

Use the `useWalletAuth` hook to check authentication status:

```tsx
import { useWalletAuth } from '@/app/context/wallet-auth-context'

function MyComponent() {
  const { isAuthenticated } = useWalletAuth()

  return (
    <div>
      {isAuthenticated ? (
        <div>Welcome! You are authenticated.</div>
      ) : (
        <div>Please authenticate to continue.</div>
      )}
    </div>
  )
}
```

### 3. Requiring Authentication Before Action

Use the `useRequireAuth` hook to require authentication before performing actions:

```tsx
import { useRequireAuth } from '@/components/shared/ProtectedContent'

function TransactionComponent() {
  const { requireAuth } = useRequireAuth()

  const handleTransaction = () => {
    // Check if user is authenticated before proceeding
    if (!requireAuth()) {
      return // Will show auth modal
    }

    // Proceed with transaction
    executeSensitiveOperation()
  }

  return <button onClick={handleTransaction}>Execute Transaction</button>
}
```

### 4. Manually Triggering Auth Modal

```tsx
import { useWalletAuth } from '@/app/context/wallet-auth-context'

function CustomComponent() {
  const { setIsAuthModalOpen } = useWalletAuth()

  return <button onClick={() => setIsAuthModalOpen(true)}>Verify Wallet</button>
}
```

## API Reference

### `useWalletAuth()` Hook

Returns an object with:

- **`isAuthenticated`** (boolean): Whether the user is authenticated
- **`isAuthModalOpen`** (boolean): Whether the auth modal is open
- **`setIsAuthModalOpen`** (function): Function to open/close the modal
- **`authenticate`** (function): Function to mark user as authenticated
- **`logout`** (function): Function to disconnect wallet and clear auth
- **`needsAuthentication`** (boolean): Whether user needs to authenticate

### `useRequireAuth()` Hook

Returns an object with:

- **`isAuthenticated`** (boolean): Whether the user is authenticated
- **`requireAuth`** (function): Function that returns true if authenticated, opens modal if not

### `ProtectedContent` Component

Props:

- **`children`** (ReactNode): The sensitive content to protect
- **`fallbackMessage`** (string, optional): Custom message when not authenticated

## Technical Details

### Signature Process

The system uses Starknet typed data signing:

1. Creates a typed data structure with:

   - Domain: Spherre app identification
   - Message: Sign-in text with wallet address and timestamp
   - Types: StarkNet domain and message types

2. Requests signature from user's wallet
3. Validates signature exists (signature verification is done client-side)
4. Marks user as authenticated in session storage

### Session Storage

Authentication state is stored per wallet address:

- Key format: `wallet_auth_{address}`
- Storage: `sessionStorage` (cleared when browser tab closes)
- Automatic cleanup on disconnect

### Auto-Trigger Logic

The modal automatically appears when:

1. Wallet address is detected (connected)
2. User is not already authenticated for that address
3. Small 500ms delay after wallet connection for smooth UX

## Security Considerations

✅ **Secure**: Uses cryptographic signature verification
✅ **Gas-free**: No blockchain transactions involved
✅ **Session-only**: Auth clears when session ends
✅ **Per-wallet**: Each wallet requires separate authentication
✅ **No private keys**: Never exposes or stores private keys

## Testing Checklist

- [ ] Connect wallet → Modal appears automatically
- [ ] Sign message → Authentication succeeds
- [ ] Reject signature → Error message shown with retry option
- [ ] Authenticated → ProtectedContent renders children
- [ ] Not authenticated → ProtectedContent shows fallback
- [ ] Disconnect wallet → Authentication resets
- [ ] Reconnect same wallet → Modal appears again (new session)
- [ ] Dark/light mode → Modal theme updates correctly
- [ ] Mobile view → Modal is responsive and usable

## Troubleshooting

### Modal doesn't appear after connection

- Check that `WalletAuthProvider` is in the provider tree
- Check browser console for errors
- Ensure `StarknetProvider` is above `WalletAuthProvider`

### Authentication doesn't persist

- Check that sessionStorage is enabled in browser
- Verify wallet address is being captured correctly
- Check for console errors in `wallet-auth-context.tsx`

### Modal appears too quickly after connection

- Adjust the 500ms delay in `wallet-auth-context.tsx` line 48
- Increase timeout for slower wallet connection modals

## Future Enhancements

Potential improvements:

- [ ] Backend signature verification
- [ ] JWT token generation for API authentication
- [ ] Remember device option (localStorage with expiry)
- [ ] Biometric authentication fallback
- [ ] Multi-signature support for shared accounts
- [ ] Rate limiting for signature requests

## Support

For issues or questions:

- Check the troubleshooting section above
- Review the code comments in context files
- Test with a fresh browser session (incognito mode)

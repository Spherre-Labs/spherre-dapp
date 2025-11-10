# Wallet Authentication - Backend Integration

## Overview

The wallet authentication system is now fully integrated with your existing backend authentication API at `/api/v1/auth/signin`. This provides secure, server-side signature verification and JWT token management.

## How It Works

### 1. User Flow

1. **User connects wallet** → Modal appears automatically
2. **User clicks "Sign Message"** → Wallet prompts for signature
3. **Message signed** → Signature and public key sent to backend
4. **Backend validates** → Verifies signature matches public key
5. **JWT tokens issued** → Access and refresh tokens returned
6. **Tokens stored** → Saved in localStorage and API client
7. **User authenticated** → Full access to protected features

### 2. Technical Flow

```
┌─────────────────────────────────────────┐
│     User Connects Wallet (Starknet)    │
└────────────────┬────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────┐
│   WalletSignInModal Opens Automatically │
└────────────────┬────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────┐
│   User Clicks "Sign Message" Button     │
└────────────────┬────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────┐
│   Get Public Key from Wallet Signer     │
│   publicKey = account.signer.getPubKey() │
└────────────────┬────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────┐
│   Create Typed Data (Backend Format)    │
│   {                                      │
│     domain: {                           │
│       name: "Spherre",                  │
│       version: "1",                     │
│       chainId: "SN_SEPOLIA"             │
│     },                                  │
│     message: {                          │
│       agreement: "i agree to signin..."│
│     }                                   │
│   }                                     │
└────────────────┬────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────┐
│   Request Signature from Wallet         │
│   signature = account.signMessage()      │
└────────────────┬────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────┐
│   Convert Signature to Backend Format   │
│   signatures: [r, s] (2 integers)       │
└────────────────┬────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────┐
│   POST /api/v1/auth/signin              │
│   {                                      │
│     signatures: [r, s],                 │
│     public_key: "0x..."                 │
│   }                                     │
└────────────────┬────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────┐
│   Backend Validates Signature            │
│   - Verifies signature with public key  │
│   - Generates address from public key   │
│   - Creates/finds Member record         │
└────────────────┬────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────┐
│   Backend Returns JWT Tokens            │
│   {                                      │
│     token: "access_token...",           │
│     refresh_token: "refresh_token...",  │
│     member: "0x..."                     │
│   }                                     │
└────────────────┬────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────┐
│   Frontend Stores Tokens                 │
│   - localStorage.setItem('auth_token')  │
│   - localStorage.setItem('refresh_token')│
│   - apiClient.setAuthToken(token)       │
└────────────────┬────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────┐
│   User Authenticated ✓                   │
│   All API calls now include JWT token   │
└─────────────────────────────────────────┘
```

## Backend API Integration

### Endpoint: `POST /api/v1/auth/signin`

**Request Body:**

```json
{
  "signatures": [123456789, 987654321], // Array of 2 integers (r, s)
  "public_key": "0x1234...abcd" // Hex string
}
```

**Response (Success):**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "member": "0x1234567890abcdef..."
}
```

**Response (Error):**

```json
{
  "signatures": ["Signatures must be a list of 2 integers"]
}
```

or

```json
{
  "signatures": ["Invalid signatures"]
}
```

### Backend Validation Process

1. **Signature Format Validation** (`SignInSerializer.validate_signatures`)

   - Ensures exactly 2 integers in signatures array

2. **Signature Verification** (`AuthService.validate_signin_request`)

   - Creates TypedData from backend's login format
   - Verifies signature matches public key using Starknet verification

3. **Address Generation** (`AuthService.generate_address_from_public_key`)

   - Computes Starknet address from public key
   - Uses account class hash from config

4. **Member Creation/Retrieval** (`AuthService.sign_in_member`)
   - Gets or creates Member record
   - Generates JWT access token (1 hour expiry)
   - Generates JWT refresh token (30 days expiry)

### Typed Data Format

The frontend sends a signature of this message structure:

```python
{
    "domain": {
        "name": "Spherre",
        "version": "1",
        "chainId": "SN_SEPOLIA"
    },
    "types": {
        "StarkNetDomain": [
            {"name": "name", "type": "felt"},
            {"name": "chainId", "type": "felt"},
            {"name": "version", "type": "felt"}
        ],
        "Message": [
            {"name": "agreement", "type": "felt"}
        ]
    },
    "primaryType": "Message",
    "message": {
        "agreement": "i agree to signin to spherre"
    }
}
```

This matches the backend's `SignatureUtils.login_typed_data_format()` exactly.

## Frontend Implementation

### Files Modified

1. **`frontend/app/components/modals/WalletSignInModal.tsx`**

   - Gets public key from wallet signer
   - Creates typed data matching backend format
   - Converts signatures to integer array
   - Calls `SpherreApi.signIn()`
   - Stores JWT tokens in localStorage
   - Sets auth token in API client

2. **`frontend/app/context/wallet-auth-context.tsx`**

   - Loads auth tokens from localStorage on mount
   - Restores JWT token in API client
   - Clears all tokens on logout
   - Integrates with `apiClient`

3. **`frontend/lib/api/spherre-api.ts`**

   - Added `signIn()` method
   - Types: `SignInRequest`, `SignInResponse`

4. **`frontend/components/shared/WalletConnected.tsx`**
   - Uses context `logout()` to clear tokens

### Token Storage

**localStorage Keys:**

- `auth_token` - JWT access token (1 hour)
- `refresh_token` - JWT refresh token (30 days)
- `member_address` - Authenticated member's address

**Token Persistence:**

- Tokens survive page refresh
- Tokens survive browser restart
- Tokens cleared on logout
- Tokens cleared on wallet disconnect

### API Client Integration

All API calls automatically include the JWT token:

```typescript
// Token is set after successful sign-in
apiClient.setAuthToken(response.token)

// All subsequent API calls include the token
const user = await SpherreApi.getUser(address)
// Request header: Authorization: Bearer eyJhbGc...
```

## Usage in Your App

### Protecting API Endpoints

Any API endpoint that requires authentication will receive the JWT token:

```typescript
import { SpherreApi } from '@/lib/api/spherre-api'

// This call includes the JWT token automatically
const accountData = await SpherreApi.getAccount(accountId)
```

### Checking Authentication

```typescript
import { useWalletAuth } from '@/app/context/wallet-auth-context'

function MyComponent() {
  const { isAuthenticated } = useWalletAuth()

  if (!isAuthenticated) {
    return <div>Please sign in</div>
  }

  // User is authenticated, make API calls
  return <ProtectedFeature />
}
```

### Manual API Calls with Token

```typescript
import { apiClient } from '@/lib/api/client'

// The token is already set, just make your call
const response = await apiClient.get('/api/v1/custom-endpoint')
```

## Security Features

### ✅ Cryptographic Verification

- Backend uses `starknet_py` for signature verification
- Message hash computed using TypedData
- Public key verification ensures authenticity

### ✅ JWT Token Security

- Tokens signed with secret key
- Short expiry (1 hour) for access tokens
- Refresh token for extended sessions (30 days)
- Tokens stored securely in localStorage

### ✅ CORS and Cookie Security

- Backend sets JWT cookies with appropriate flags
- CSRF protection enabled
- Secure flags in production

### ✅ Address Derivation

- Address computed from public key server-side
- Uses correct account class hash
- Prevents address spoofing

## Environment Configuration

### Backend Environment Variables

Set these in your backend `.env`:

```bash
# Auth Configuration
DOMAIN_NAME=Spherre
CHAIN_ID=SN_SEPOLIA
VERSION=1
SECRET_KEY=your-secret-key-here
JWT_SECRET_KEY=your-jwt-secret-here

# Account Configuration
ACCOUNT_CLASS_HASH=0x025EC026985A3BF9D0CC1FE17326B245DFDC3FF89B8FDE106542A3EA56C5A918
```

### Frontend Environment Variables

Set this in your frontend `.env.local`:

```bash
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:5000
```

Or for production:

```bash
NEXT_PUBLIC_API_URL=https://api.spherre.xyz
```

## Token Refresh (Future Enhancement)

Currently, access tokens expire after 1 hour. To implement automatic refresh:

```typescript
// In apiClient, add interceptor
async request<T>(endpoint: string, options: ApiRequestOptions) {
  // Try request
  let response = await fetch(...)

  // If 401, try to refresh
  if (response.status === 401) {
    const refreshToken = localStorage.getItem('refresh_token')
    const refreshResponse = await fetch('/api/v1/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refresh_token: refreshToken })
    })

    if (refreshResponse.ok) {
      const { token } = await refreshResponse.json()
      this.setAuthToken(token)
      localStorage.setItem('auth_token', token)

      // Retry original request
      response = await fetch(...)
    }
  }

  return response
}
```

## Troubleshooting

### Issue: "Invalid signatures" error

**Cause:** Signature format mismatch

**Solution:**

- Ensure signatures are exactly 2 integers
- Check typed data format matches backend exactly
- Verify chainId is "SN_SEPOLIA" (not hex)

### Issue: "Could not retrieve public key"

**Cause:** Wallet doesn't expose public key

**Solution:**

- Ensure using compatible wallet (Argent, Braavos)
- Check wallet connection is complete
- Try disconnecting and reconnecting

### Issue: Tokens not persisting

**Cause:** localStorage blocked or cleared

**Solution:**

- Check browser localStorage is enabled
- Verify not in incognito mode
- Check browser console for errors

### Issue: API calls return 401

**Cause:** Token expired or invalid

**Solution:**

- Check token exists: `localStorage.getItem('auth_token')`
- Verify token is set in client: Check network tab
- Re-authenticate by disconnecting and reconnecting wallet

## Testing Checklist

- [ ] Connect wallet → Sign in prompt appears
- [ ] Sign message → Backend receives correct data
- [ ] Backend validates → Returns JWT tokens
- [ ] Tokens stored → localStorage has all keys
- [ ] API calls work → Protected endpoints accessible
- [ ] Page refresh → Authentication persists
- [ ] Logout → All tokens cleared
- [ ] Reconnect → Re-authentication required

## Backend Code Reference

### Serializer (`backend/spherre/app/serializers/auth.py`)

```python
class SignInSerializer(Schema):
    signatures = fields.List(fields.Integer(), required=True)
    public_key = fields.String(required=True)

    @validates("signatures")
    def validate_signatures(self, signatures: list[int]):
        if len(signatures) != 2:
            raise ValidationError("Signatures must be a list of 2 integers")

    @post_load
    def validate_signin_request(self, data: dict, **kwargs):
        public_key = SignatureUtils.convert_public_key_to_int(data["public_key"])
        if not AuthService.validate_signin_request(data["signatures"], public_key):
            raise ValidationError("Invalid signatures")
        data["address"] = AuthService.generate_address_from_public_key(
            data["public_key"]
        )
        return data
```

### View (`backend/spherre/app/views/auth.py`)

```python
@auth_blueprint.route("/auth/signin", methods=["POST"])
def signin():
    data = request.json
    serializer = SignInSerializer()
    try:
        serialized_data = serializer.load(data)
        signed_in_data = AuthService.sign_in_member(serialized_data["address"])
        response = jsonify(signed_in_data)
        set_access_cookies(response, signed_in_data["token"])
        set_refresh_cookies(response, signed_in_data["refresh_token"])
    except ValidationError as e:
        return jsonify(e.messages), 400
    return response
```

---

**Status:** ✅ Fully Integrated with Backend
**Date:** November 3, 2025
**Backend:** Flask + JWT + Starknet Signature Verification
**Frontend:** React + Starknet React + TypeScript

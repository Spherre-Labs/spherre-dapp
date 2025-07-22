# Transactions Module - Development Guide

## Overview

This transactions module is designed with a **hybrid approach** that gracefully handles the transition from mock data to real smart contract data.

## Current Architecture

### 🔄 Hybrid Data Strategy

- **Primary**: Attempts to fetch real transaction data from smart contracts
- **Fallback**: Uses mock data when smart contract data is unavailable
- **Development-friendly**: Clear separation makes it easy to remove mock fallback later

### 📁 File Structure

```
transactions/
├── page.tsx                 # Main transactions list page
├── [id]/page.tsx           # Transaction details page
├── data.ts                 # Mock transaction data
├── components/
│   ├── transaction.tsx     # Individual transaction component
│   └── types.ts           # Type definitions
└── [id]/components/        # Detail page components
```

## Smart Contract Integration Guide

### Phase 1: Current State (Mock Fallback)

```typescript
// In page.tsx and [id]/page.tsx
const realData = useSmartContractTransactions() // Returns null/error currently
const mockFallback = getMockData() // Always available
const displayData = realData || mockFallback // Hybrid approach
```

### Phase 2: Smart Contract Integration

1. **Implement your smart contract hooks**:

   ```typescript
   // Replace the TODO comments with:
   const {
     transactions: realTransactions,
     isLoading,
     error,
   } = useSmartContractTransactions()
   ```

2. **Test with real data**:
   - Real data will automatically take precedence
   - Mock data still available as fallback during development
   - Console logs show which data source is being used

### Phase 3: Remove Mock Fallback

When smart contract integration is stable:

1. **In `page.tsx`**:

   - Delete the "MOCK DATA FALLBACK SECTION"
   - Remove mock data imports
   - Remove `convertMockToTransactionDisplayInfo` function
   - Remove development indicators

2. **In `[id]/page.tsx`**:

   - Delete the "MOCK DATA FALLBACK SECTION"
   - Remove `getMockTransactionFallback` function
   - Remove `convertMockToTransactionDisplayInfo` function
   - Update error handling to only use smart contract data

3. **Clean up**:
   - Remove `data.ts` (mock data file)
   - Remove this README if desired

## Development Features

### 🎭 Visual Indicators

- Yellow badge shows "Mock Data" when fallback is being used
- Console logs indicate data source: `📡 REAL` vs `🎭 MOCK`
- Development indicator in transaction details page

### 🔍 Debugging

```javascript
// Console output helps track data source:
console.log('📡 Using REAL transaction data from smart contract')
console.log('🎭 Using MOCK transaction data as fallback')
```

### 🚀 Benefits

- **No empty pages**: Always shows meaningful data during development
- **Easy testing**: Can test with both mock and real data
- **Smooth transition**: Gradual migration from mock to real data
- **Clear separation**: Well-documented code sections for easy removal

## Mock Data Structure

See `data.ts` for the complete mock transaction structure. The mock data includes:

- Various transaction types (withdraw, swap, limit swap)
- Different statuses (Pending, Executed, Rejected)
- Member approvals and rejections
- Realistic timestamps and amounts

## Type Safety

All mock data is converted to the same `TransactionDisplayInfo` type that real smart contract data uses, ensuring type consistency throughout the application.

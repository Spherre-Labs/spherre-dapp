import { Button } from '@/components/ui/button'

interface TransactionActionButtonsProps {
  isConnected: boolean
  transactionStatus: string
  handleApprove: () => void
  handleExecute: () => void
  handleReject: () => void
  isApproving: boolean
  isExecuting: boolean
  isRejecting: boolean
  canExecute: boolean
}

export const TransactionActionButtons = ({
  isConnected,
  transactionStatus,
  handleApprove,
  handleExecute,
  handleReject,
  isApproving,
  isExecuting,
  isRejecting,
  canExecute,
}: TransactionActionButtonsProps) => {
  return (
    <div className="mt-auto pt-3 sm:pt-4">
      {transactionStatus === 'initiated' && (
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <Button
            onClick={handleApprove}
            disabled={isApproving || !isConnected}
            className="text-theme px-4 sm:px-6 py-3.5 rounded-md transition duration-200 w-full"
          >
            {isApproving ? 'Approving...' : 'Approve'}
          </Button>
          <Button
            onClick={handleReject}
            disabled={isRejecting || !isConnected}
            className="bg-red-500 hover:bg-red-500 text-theme px-4 sm:px-6 py-3.5 rounded-md transition duration-200 w-full disabled:opacity-50"
          >
            {isRejecting ? 'Rejecting...' : 'Reject'}
          </Button>
        </div>
      )}
      {transactionStatus === 'approved' && (
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <Button
            onClick={handleExecute}
            disabled={isExecuting || !canExecute || !isConnected}
            className="text-theme px-4 sm:px-6 py-3.5 rounded-md transition duration-200 w-full"
          >
            {isExecuting ? 'Executing...' : 'Execute'}
          </Button>
        </div>
      )}
      {(transactionStatus === 'executed' ||
        transactionStatus === 'rejected') && (
        <button className="bg-[#6F2FCE] hover:bg-purple-700 text-theme px-4 sm:px-6 py-2 rounded-md transition duration-200 w-full">
          Download CSV
        </button>
      )}
    </div>
  )
}

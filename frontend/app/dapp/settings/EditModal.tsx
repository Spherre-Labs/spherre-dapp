import React from 'react'

interface EmailModalProps {
  open: boolean
  onClose: () => void
  onSign: (newEmail: string) => void
  title: string
  initialEmail: string
}

const EmailModal: React.FC<EmailModalProps> = ({
  open,
  onClose,
  onSign,
  title,
  initialEmail,
}) => {
  const [email, setEmail] = React.useState(initialEmail)

  if (!open) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        <input
          type="email"
          className="w-full border p-2 rounded mb-4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <div className="flex justify-end gap-2">
          <button className="px-4 py-2 bg-gray-200 rounded" onClick={onClose}>
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-purple-600 text-white rounded"
            onClick={() => onSign(email)}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  )
}

export default EmailModal

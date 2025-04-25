import Image from 'next/image'

interface AccountData {
  name: string
  address: string
  balance: string
  avatar: string
}

interface AccountSelectorProps {
  account: AccountData
}

export default function AccountSelector({ account }: AccountSelectorProps) {
  return (
    <div className="bg-gray-800 rounded-lg py-6 px-[18px] flex items-center justify-between">
      <div className="flex items-center gap-3 text-2xl">
        <div className="w-10 h-10 rounded-full overflow-hidden ">
          <Image
            src={'/withdraw-placeholder.svg' }
            alt={account.name}
            width={40}
            height={40}
            className="object-cover"
          />
        </div>
        <div>
          <p className="font-bold text-base">{account.name}</p>
          <p className="text-sm text-[#8E9BAE] font-medium">
            {account.address}
          </p>
        </div>
        ~<span className="font-semibold text-2xl ml-2">{account.balance}</span>
      </div>
      <div className="flex items-center">
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M6 9L12 15L18 9"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  )
}

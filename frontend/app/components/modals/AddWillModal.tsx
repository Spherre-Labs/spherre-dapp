"use client"

import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { useEffect } from "react"

interface AddWillModalProps {
    setIsWillModalOpen: (isWillModalOpen: boolean) => void;
    willAddress: string;
    setWillAddress: (willAddress: string) => void;
    initializeTimer: () => void
}

export default function AddWillModal({ setIsWillModalOpen, willAddress, setWillAddress, initializeTimer }: AddWillModalProps) {
    const confirmed = () => {
        if (!willAddress.trim()) {
            alert("Please enter a valid wallet address")
            return
        }

        localStorage.setItem("willAddress", willAddress)
        initializeTimer()
        setIsWillModalOpen(false)
    }

    useEffect(() => {
        const savedWillAddress = localStorage.getItem("willAddress")

        if (savedWillAddress && !willAddress) {
            setWillAddress(savedWillAddress)
        }
    }, [setWillAddress])

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
        >
            <div className="relative bg-gray-900 border border-gray-700 rounded-lg shadow-lg w-full max-w-xl px-4 sm:px-6 md:px-8 py-8">
                <button
                    className="absolute top-4 right-4 z-10 p-1 rounded-full bg-gray-800/50 hover:bg-gray-800/70 transition-colors"
                    onClick={() => setIsWillModalOpen(false)}
                    aria-label="Close modal"
                >
                    <X className="w-5 h-5 text-gray-400" />
                </button>

                <div className="relative w-full max-w-md h-fit mx-auto flex flex-col items-center gap-[26px]">
                    <div className="w-full flex-col flex items-center gap-2.5">
                        <h1 id="modal-title" className="font-bold text-3xl text-white">
                            Add Will Wallet
                        </h1>
                        <p className="text-base font-semibold text-gray-400 text-center">
                            Add a wallet to automatically transfer permissions. This will serve as your backup wallet.
                        </p>
                    </div>

                    <label htmlFor="willAddress" className="w-full flex flex-col gap-2.5">
                        <span className="text-sm font-normal text-white">Will Wallet Address</span>
                        <input
                            type="text"
                            value={willAddress}
                            name="willAddress"
                            id="willAddress"
                            onChange={(e) => setWillAddress(e.target.value)}
                            placeholder="0x..."
                            className="bg-gray-800 rounded-[7px] border-[1.8px] border-gray-700 outline-none text-base font-normal text-gray-400 py-3 px-4 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                        />
                    </label>

                    <div className="w-full flex items-center justify-between gap-[15px]">
                        <Button
                            onClick={() => setIsWillModalOpen(false)}
                            variant="secondary"
                            className="bg-gray-700 hover:bg-gray-600 basis-1/2"
                        >
                            Cancel
                        </Button>
                        <Button onClick={confirmed} variant="default" className="basis-1/2" disabled={!willAddress.trim()}>
                            Confirm
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

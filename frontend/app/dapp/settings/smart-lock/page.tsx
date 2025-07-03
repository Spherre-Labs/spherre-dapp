'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import CreateSmartLockPlanModal from '@/app/components/modals/CreateSmartLockPlanModal'

interface SmartLockPlan {
  id: string
  name: string
  token: string
  amount: string
  duration: string
  status: 'active' | 'expired' | 'pending'
  createdAt: string
}

interface CreatePlanData {
  name: string
  token: string
  amount: string
  duration: string
  durationType: 'days' | 'weeks' | 'months' | 'years'
}

export default function SmartLockPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [plans, setPlans] = useState<SmartLockPlan[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const handleCreatePlan = async (planData: CreatePlanData) => {
    setIsLoading(true)
    try {
      // TODO: Integrate with smart contract backend

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Add new plan to state (temporary until backend integration)
      const newPlan: SmartLockPlan = {
        id: Date.now().toString(),
        name: planData.name,
        token: planData.token,
        amount: planData.amount,
        duration: `${planData.duration} ${planData.durationType}`,
        status: 'pending',
        createdAt: new Date().toISOString(),
      }

      setPlans((prev) => [newPlan, ...prev])

      // TODO: Replace with actual smart contract transaction
    } catch (error) {
      console.error('Error creating smart lock plan:', error)
      // Handle error silently or add proper error handling here
    } finally {
      setIsLoading(false)
      setIsModalOpen(false)
    }
  }

  return (
    <>
      <div className="space-y-6 md:space-y-8 p-4 md:p-6 lg:p-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-0">
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2 md:mb-3">
              Smart Lock
            </h1>
            <p className="text-sm sm:text-base text-gray-400 leading-relaxed">
              Manage your smart lock plans and security access settings.
            </p>
          </div>
          <div className="flex-shrink-0">
            <button
              onClick={() => setIsModalOpen(true)}
              disabled={isLoading}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#6F2FCE] hover:bg-[#5B28B8] disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-4 py-2.5 sm:py-2 rounded-lg font-medium transition-colors text-sm sm:text-base"
            >
              <Plus className="w-4 h-4 flex-shrink-0" />
              <span className="sm:hidden">Create Plan</span>
              <span className="hidden sm:inline">
                Create New Smart Lock Plan
              </span>
            </button>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="bg-[#1C1C1E] border border-[#2C2C2E] rounded-lg p-6 md:p-8 text-center">
            <div className="flex items-center justify-center space-x-2">
              <div className="animate-spin rounded-full h-5 w-5 md:h-6 md:w-6 border-b-2 border-[#6F2FCE]"></div>
              <span className="text-white text-sm md:text-base">
                Creating Smart Lock Plan...
              </span>
            </div>
          </div>
        )}

        {/* Smart Lock Plans List */}
        <div className="space-y-4">
          {plans.length === 0 && !isLoading ? (
            <div className="bg-[#1C1C1E] border border-[#2C2C2E] rounded-lg p-6 md:p-8 text-center">
              <h2 className="text-lg sm:text-xl font-semibold text-white mb-2">
                No Smart Lock Plans
              </h2>
              <p className="text-sm sm:text-base text-gray-400 mb-4 leading-relaxed max-w-md mx-auto">
                Create your first smart lock plan to secure your assets with
                time-based restrictions.
              </p>
              <button
                onClick={() => setIsModalOpen(true)}
                disabled={isLoading}
                className="w-full sm:w-auto bg-[#6F2FCE] hover:bg-[#5B28B8] disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-6 py-2.5 sm:py-2 rounded-lg font-medium transition-colors text-sm sm:text-base"
              >
                Create Smart Lock Plan
              </button>
            </div>
          ) : plans.length > 0 ? (
            <div className="grid gap-4">
              {plans.map((plan) => (
                <div
                  key={plan.id}
                  className="bg-[#1C1C1E] border border-[#2C2C2E] rounded-lg p-4 md:p-6"
                >
                  {/* Plan Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 mb-4">
                    <h3 className="text-base sm:text-lg font-semibold text-white truncate">
                      {plan.name}
                    </h3>
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium self-start sm:self-auto ${
                        plan.status === 'active'
                          ? 'bg-green-500/20 text-green-400'
                          : plan.status === 'pending'
                            ? 'bg-yellow-500/20 text-yellow-400'
                            : 'bg-red-500/20 text-red-400'
                      }`}
                    >
                      {plan.status.charAt(0).toUpperCase() +
                        plan.status.slice(1)}
                    </span>
                  </div>

                  {/* Plan Details */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-sm">
                    <div className="flex justify-between sm:block">
                      <span className="text-gray-400">Token:</span>
                      <span className="text-white sm:ml-2 font-medium">
                        {plan.token}
                      </span>
                    </div>
                    <div className="flex justify-between sm:block">
                      <span className="text-gray-400">Amount:</span>
                      <span className="text-white sm:ml-2 font-medium">
                        {plan.amount}
                      </span>
                    </div>
                    <div className="flex justify-between sm:block">
                      <span className="text-gray-400">Duration:</span>
                      <span className="text-white sm:ml-2 font-medium">
                        {plan.duration}
                      </span>
                    </div>
                    <div className="flex justify-between sm:block">
                      <span className="text-gray-400">Created:</span>
                      <span className="text-white sm:ml-2 font-medium">
                        {new Date(plan.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </div>

      <div>
        <CreateSmartLockPlanModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleCreatePlan}
        />
      </div>
    </>
  )
}

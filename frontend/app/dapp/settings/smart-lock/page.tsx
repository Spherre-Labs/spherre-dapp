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
      console.log('Creating smart lock plan:', planData)

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
      alert('Smart Lock Plan created successfully! Transaction proposed.')
    } catch (error) {
      console.error('Error creating smart lock plan:', error)
      alert('Failed to create smart lock plan. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-3">Smart Lock</h1>
            <p className="text-gray-400">
              Manage your smart lock plans and security access settings.
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            disabled={isLoading}
            className="flex items-center gap-2 bg-[#6F2FCE] hover:bg-[#5B28B8] disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            <Plus className="w-4 h-4" />
            Create New Smart Lock Plan
          </button>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="bg-[#1C1C1E] border border-[#2C2C2E] rounded-lg p-8 text-center">
            <div className="flex items-center justify-center space-x-2">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#6F2FCE]"></div>
              <span className="text-white">Creating Smart Lock Plan...</span>
            </div>
          </div>
        )}

        {/* Smart Lock Plans List */}
        <div className="space-y-4">
          {plans.length === 0 && !isLoading ? (
            <div className="bg-[#1C1C1E] border border-[#2C2C2E] rounded-lg p-8 text-center">
              <h2 className="text-xl font-semibold text-white mb-2">
                No Smart Lock Plans
              </h2>
              <p className="text-gray-400 mb-4">
                Create your first smart lock plan to secure your assets with
                time-based restrictions.
              </p>
              <button
                onClick={() => setIsModalOpen(true)}
                disabled={isLoading}
                className="bg-[#6F2FCE] hover:bg-[#5B28B8] disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                Create Smart Lock Plan
              </button>
            </div>
          ) : plans.length > 0 ? (
            <div className="grid gap-4">
              {plans.map((plan) => (
                <div
                  key={plan.id}
                  className="bg-[#1C1C1E] border border-[#2C2C2E] rounded-lg p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white">
                      {plan.name}
                    </h3>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
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
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-400">Token:</span>
                      <span className="text-white ml-2">{plan.token}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Amount:</span>
                      <span className="text-white ml-2">{plan.amount}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Duration:</span>
                      <span className="text-white ml-2">{plan.duration}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Created:</span>
                      <span className="text-white ml-2">
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

      <CreateSmartLockPlanModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreatePlan}
      />
    </>
  )
}

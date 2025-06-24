'use client'

interface ToggleSwitchProps {
  enabled: boolean
  onChange: (enabled: boolean) => void
}

export default function ToggleSwitch({ enabled, onChange }: ToggleSwitchProps) {
  return (
    <button
      className={`relative inline-flex h-8 w-16 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 ${
        enabled ? 'bg-purple-500' : 'bg-gray-600'
      }`}
      onClick={() => onChange(!enabled)}
      tabIndex={0}
      aria-pressed={enabled}
      aria-label="Toggle setting"
    >
      <span
        className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
          enabled ? 'translate-x-8' : 'translate-x-1'
        }`}
      />
    </button>
  )
}

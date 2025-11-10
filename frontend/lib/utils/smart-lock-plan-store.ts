const STORAGE_KEY = 'spherre:smart-lock-plan-names'

type PlanKeyArgs = {
  account: `0x${string}` | string
  token: `0x${string}` | string | Record<string, unknown>
  amount: bigint | string | number | Record<string, unknown>
  duration: bigint | string | number | Record<string, unknown>
}

const memoryStore = new Map<string, string>()
let initialized = false

function isBrowser() {
  return typeof window !== 'undefined'
}

function normalize(value: PlanKeyArgs['amount']): string {
  if (typeof value === 'bigint') {
    return value.toString()
  }
  if (typeof value === 'number') {
    return Math.trunc(value).toString()
  }
  if (typeof value === 'string') {
    return value
  }
  if (value && typeof value === 'object') {
    try {
      return JSON.stringify(value)
    } catch {
      return Object.values(value)
        .map((item) => normalize(item as never))
        .join(',')
    }
  }
  return String(value)
}

function normalizeAddress(value: PlanKeyArgs['token']): string {
  if (typeof value === 'string') {
    return value.toLowerCase()
  }
  if (typeof value === 'object' && value !== null) {
    try {
      const serialized = JSON.stringify(value)
      return serialized.toLowerCase()
    } catch {
      return Object.values(value)
        .map((item) => normalizeAddress(item as never))
        .join(',')
    }
  }
  return String(value).toLowerCase()
}

function buildKey({ account, token, amount, duration }: PlanKeyArgs): string {
  return [
    normalizeAddress(account),
    normalizeAddress(token),
    normalize(amount).toLowerCase(),
    normalize(duration).toLowerCase(),
  ].join('|')
}

function ensureLoaded() {
  if (initialized || !isBrowser()) {
    return
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      initialized = true
      return
    }

    const parsed = JSON.parse(raw) as Record<string, string> | null
    if (parsed && typeof parsed === 'object') {
      for (const [key, value] of Object.entries(parsed)) {
        if (typeof value === 'string') {
          memoryStore.set(key, value)
        }
      }
    }
  } catch (error) {
    console.warn('Failed to load smart lock plan names:', error)
  } finally {
    initialized = true
  }
}

function persist() {
  if (!isBrowser()) return

  try {
    const serializable = Object.fromEntries(memoryStore.entries())
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(serializable))
  } catch (error) {
    console.warn('Failed to persist smart lock plan names:', error)
  }
}

export function recordSmartLockPlanName(args: PlanKeyArgs, name: string): void {
  ensureLoaded()
  memoryStore.set(buildKey(args), name)
  persist()
}

export function getSmartLockPlanName(args: PlanKeyArgs): string | null {
  ensureLoaded()
  return memoryStore.get(buildKey(args)) ?? null
}

export function deleteSmartLockPlanName(args: PlanKeyArgs): void {
  ensureLoaded()
  if (memoryStore.delete(buildKey(args))) {
    persist()
  }
}

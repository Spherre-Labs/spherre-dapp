import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const copyToClipboard = async (
  text: string,
): Promise<{ success: boolean }> => {
  try {
    await navigator.clipboard.writeText(text)
    return { success: true }
  } catch (err) {
    console.error('Clipboard copy failed', err)
    return { success: false }
  }
}

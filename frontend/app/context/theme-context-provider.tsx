'use client'
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'

export type Theme = 'light' | 'dark' | 'system'

interface ThemeContextType {
  theme: Theme
  actualTheme: 'light' | 'dark'
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  // Initialize with safe defaults to prevent hydration mismatch
  const [theme, setTheme] = useState<Theme>('system')
  const [actualTheme, setActualTheme] = useState<'light' | 'dark'>('dark')
  const [mounted, setMounted] = useState(false)

  const getSystemTheme = () => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'
    }
    return 'dark'
  }

  const applyTheme = (resolvedTheme: 'light' | 'dark') => {
    if (typeof document === 'undefined') return

    const root = document.documentElement

    if (resolvedTheme === 'dark') {
      root.classList.add('dark')
      root.classList.remove('light')
    } else {
      root.classList.add('light')
      root.classList.remove('dark')
    }

    setActualTheme(resolvedTheme)
  }

  const resolveTheme = useCallback((themeToResolve: Theme) => {
    if (themeToResolve === 'system') {
      return getSystemTheme()
    }
    return themeToResolve
  }, [])

  // Handle initial theme setup after mount
  useEffect(() => {
    setMounted(true)

    if (typeof window === 'undefined') return

    const savedTheme = localStorage.getItem('spherre-theme') as Theme
    const initialTheme = savedTheme || 'system'

    setTheme(initialTheme)
    const resolved = resolveTheme(initialTheme)
    applyTheme(resolved)

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleSystemThemeChange = () => {
      if (initialTheme === 'system') {
        const newSystemTheme = getSystemTheme()
        applyTheme(newSystemTheme)
      }
    }

    mediaQuery.addEventListener('change', handleSystemThemeChange)
    return () =>
      mediaQuery.removeEventListener('change', handleSystemThemeChange)
  }, [resolveTheme])

  // Handle theme changes after initial setup
  useEffect(() => {
    if (!mounted) return

    if (typeof window === 'undefined') return

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleSystemThemeChange = () => {
      if (theme === 'system') {
        const newSystemTheme = getSystemTheme()
        applyTheme(newSystemTheme)
      }
    }

    mediaQuery.addEventListener('change', handleSystemThemeChange)
    return () =>
      mediaQuery.removeEventListener('change', handleSystemThemeChange)
  }, [theme, mounted])

  const updateTheme = (newTheme: Theme) => {
    setTheme(newTheme)

    if (typeof window !== 'undefined') {
      localStorage.setItem('spherre-theme', newTheme)
    }

    const resolved = resolveTheme(newTheme)
    applyTheme(resolved)
  }

  const toggleTheme = () => {
    const newTheme = actualTheme === 'dark' ? 'light' : 'dark'
    updateTheme(newTheme)
  }

  // Handle system theme changes
  useEffect(() => {
    if (!mounted || theme !== 'system') return

    const resolved = resolveTheme(theme)
    if (resolved !== actualTheme) {
      applyTheme(resolved)
    }
  }, [actualTheme, resolveTheme, theme, mounted])

  return (
    <ThemeContext.Provider
      value={{
        theme,
        actualTheme,
        setTheme: updateTheme,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

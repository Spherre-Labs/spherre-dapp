'use client'
import React, { useEffect, useState, useRef } from 'react'
import Logo from '../shared/Logo'
import spherreLogo from '../../public/Images/spherrelogo.png'
// import Link from 'next/link'
import WalletConnected from '../shared/WalletConnected'
import { IoMdMenu } from 'react-icons/io'
import { IoClose } from 'react-icons/io5'
import { useAccount } from '@starknet-react/core'
import { useTheme } from '@/app/context/theme-context-provider'
import { Sun, Moon, Monitor } from 'lucide-react'
// import { useRouter, usePathname } from 'next/navigation'

const Nav = () => {
  const { theme, setTheme } = useTheme()
  const [openMenu, setOpenMenu] = useState(false)
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false)
  const themeMenuRef = useRef<HTMLDivElement>(null)
  // const router = useRouter()
  // const pathname = usePathname()

  const handleToggle = () => {
    setOpenMenu(!openMenu)
  }
  const { address } = useAccount()

  // Temporarily disabled for development
  // useEffect(() => {
  //   if (!address && !pathname?.startsWith('/dapp')) {
  //     router.replace('/')
  //   }
  // }, [address, pathname, router])

  // to avoid body scroll on menu open
  useEffect(() => {
    if (openMenu) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
  })

  // Close theme menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        themeMenuRef.current &&
        !themeMenuRef.current.contains(event.target as Node)
      ) {
        setIsThemeMenuOpen(false)
      }
    }

    if (isThemeMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isThemeMenuOpen])

  const toggleThemeMenu = () => {
    setIsThemeMenuOpen(!isThemeMenuOpen)
  }

  const getThemeIcon = () => {
    switch (theme) {
      case 'light':
        return <Sun size={20} className="text-theme" />
      case 'dark':
        return <Moon size={20} className="text-theme" />
      case 'system':
        return <Monitor size={20} className="text-theme" />
      default:
        return <Moon size={20} className="text-theme" />
    }
  }

  const themeOptions = [
    { value: 'light', label: 'Light', icon: <Sun size={16} /> },
    { value: 'dark', label: 'Dark', icon: <Moon size={16} /> },
    { value: 'system', label: 'System', icon: <Monitor size={16} /> },
  ]

  return (
    <header className="w-full flex justify-between items-center">
      {/* Logo */}
      <Logo
        href={'/'}
        className="md:w-[50px] w-[40px] "
        image={spherreLogo}
        textColor="white"
      />

      {/* Connect button, Theme Toggle & Hamburger Menu Button */}
      <div className="flex items-center gap-4">
        {/* Theme Toggle */}
        <div className="relative" ref={themeMenuRef}>
          <button
            onClick={toggleThemeMenu}
            className="p-2 hover:bg-theme-bg-secondary rounded-lg transition-colors duration-200 border border-theme-border"
            aria-label="Toggle theme"
          >
            {getThemeIcon()}
          </button>

          {/* Theme Menu Dropdown */}
          {isThemeMenuOpen && (
            <div className="absolute right-0 top-full mt-2 z-50 w-40 bg-theme-bg-secondary border border-theme-border rounded-lg shadow-lg py-1">
              {themeOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    setTheme(option.value as 'light' | 'dark' | 'system')
                    setIsThemeMenuOpen(false)
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2 text-sm transition-colors ${
                    theme === option.value
                      ? 'bg-primary text-white'
                      : 'text-theme-secondary hover:bg-theme-bg-tertiary hover:text-theme'
                  }`}
                >
                  {option.icon}
                  <span>{option.label}</span>
                  {theme === option.value && (
                    <span className="ml-auto text-xs">✓</span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Connected wallet */}
        <WalletConnected address={address || 'Wallet not connected'} />

        {/* Hamburger Menu */}
        <button
          type="button"
          className="md:hidden block text-3xl text-theme transition-colors duration-300"
          onClick={handleToggle}
        >
          <IoMdMenu />
        </button>
      </div>

      <div
        className={`fixed top-0 z-[99] w-full h-screen bg-black/60 transition-all duration-[500ms] ease-[cubic-bezier(0.86,0,0.07,1)] lg:hidden flex justify-end ${openMenu ? 'left-0' : 'left-[100%]'}`}
      >
        <div
          className={`w-[80%] h-full bg-theme border-l border-theme-border flex flex-col gap-10 transition-all duration-[500ms] ease-[cubic-bezier(0.86,0,0.07,1)] px-6 py-8 delay-300 ${openMenu ? 'translate-x-0' : 'translate-x-full'}`}
        >
          <header className="flex justify-between items-center w-full">
            {/* Logo */}
            <Logo
              href={'/'}
              className="md:w-[50px] w-[40px]"
              image={spherreLogo}
            />
            {/* Close Menu Button*/}
            <button
              type="button"
              className="text-3xl text-theme transition-colors duration-300"
              onClick={handleToggle}
            >
              <IoClose />
            </button>
          </header>

          {/* Mobile Theme Toggle */}
          <div className="flex flex-col gap-4">
            <h3 className="text-theme font-semibold">Theme</h3>
            <div className="flex flex-col gap-2">
              {themeOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    setTheme(option.value as 'light' | 'dark' | 'system')
                    setOpenMenu(false)
                  }}
                  className={`flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors ${
                    theme === option.value
                      ? 'bg-primary text-white'
                      : 'text-theme-secondary hover:bg-theme-bg-tertiary hover:text-theme'
                  }`}
                >
                  {option.icon}
                  <span>{option.label}</span>
                  {theme === option.value && (
                    <span className="ml-auto text-xs">✓</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Nav

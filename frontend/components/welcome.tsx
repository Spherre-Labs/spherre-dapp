'use client'
import Image from 'next/image'
import logo from '../public/Images/spherrelogo.png'
import wall from '../public/Images/wall.png'
import add from '../public/Images/Add.png'
import Logo from './shared/Logo'
import { useRouter } from 'next/navigation'
import { Connector, useAccount, useConnect } from '@starknet-react/core'
import { StarknetkitConnector, useStarknetkitConnectModal } from 'starknetkit'
import { useTheme } from '@/app/context/theme-context-provider'
import { Sun, Moon, Monitor } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'

const Welcome = () => {
  // for navigation
  const router = useRouter()
  const { actualTheme, theme, setTheme } = useTheme()
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false)
  const themeMenuRef = useRef<HTMLDivElement>(null)

  const { connect, connectors } = useConnect()
  const { starknetkitConnectModal } = useStarknetkitConnectModal({
    connectors: connectors as StarknetkitConnector[],
  })

  async function connectWallet() {
    const { connector } = await starknetkitConnectModal()
    if (!connector) {
      return
    }
    await connect({ connector: connector as Connector })
  }

  const { address } = useAccount()

  async function checkForAccount() {
    // Check for addresses in localStorage
    const storedAddress = localStorage.getItem('SpherreAddress');
    if (!storedAddress){
      console.log("No account found in localStorage.");
      return;
    }
           
    router.push(`/${storedAddress[0]}`);
  }


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
  useEffect(()=>{
    // check for accont and navigate to the first account
    checkForAccount();
  },[address])
  return (
    <div className="flex flex-col lg:flex-row bg-theme transition-colors duration-300 min-h-screen">
      {/* Left Section with Image */}
      <div className="lg:w-[40vw]">
        <Image
          src={wall}
          alt={''}
          className="h-32 lg:h-screen p-4 rounded-lg"
        />
      </div>

      {/* Right Section */}
      <div className="flex-1 flex flex-col justify-between p-4 lg:p-14">
        <div className="flex items-center justify-between">
          <Logo className="w-[50px]" href="/" image={logo} />

          <div className="relative" ref={themeMenuRef}>
            <button
              onClick={toggleThemeMenu}
              className="p-2 hover:bg-theme-bg-secondary rounded-lg transition-colors duration-200 border border-theme-border"
              aria-label="Toggle theme"
            >
              {getThemeIcon()}
            </button>

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
        </div>

        {/* Centered Content */}
        <div className="flex flex-col justify-center items-center flex-1 gap-4">
          <p className="opacity-40 text-theme transition-colors duration-300">
            Welcome to Spherre!
          </p>
          <div className="text-center">
            {/* Responsive Text */}
            <p className="text-lg md:text-2xl lg:text-4xl w-full md:w-[80%] lg:w-[60%] mx-auto text-theme transition-colors duration-300">
              The Future of Secure, Collaborative Crypto Management!
            </p>

            {/* Responsive Button */}
            {address ? (
              <button
                onClick={() => router.push('/create-account/step-1')}
                className={`w-full sm:w-72 flex items-center justify-center gap-1 px-6 py-2 rounded-lg mx-auto my-3 transition-all duration-200 ${
                  actualTheme === 'dark'
                    ? 'bg-white text-black hover:bg-gray-200'
                    : 'bg-gray-900 text-white hover:bg-gray-800'
                }`}
              >
                <Image src={add} height={30} width={24} alt={'add'} />
                <p
                  className={
                    actualTheme === 'dark' ? 'text-black' : 'text-white'
                  }
                >
                  Create Spherre
                </p>
              </button>
            ) : (
              <button
                onClick={connectWallet}
                className={`w-full sm:w-72 flex items-center justify-center gap-1 px-6 py-2 rounded-lg mx-auto my-3 transition-all duration-200 ${
                  actualTheme === 'dark'
                    ? 'bg-white text-black hover:bg-gray-200'
                    : 'bg-gray-900 text-white hover:bg-gray-800'
                }`}
              >
                <p
                  className={
                    actualTheme === 'dark' ? 'text-black' : 'text-white'
                  }
                >
                  Connect Wallet
                </p>
              </button>
            )}
          </div>
        </div>

        <div className="h-8"></div>
      </div>
    </div>
  )
}

export default Welcome

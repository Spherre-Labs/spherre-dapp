'use client'
import Image from 'next/image'
import logo from '../public/Images/spherrelogo.png'
import wall from '../public/Images/wall.png'
import add from '../public/Images/Add.png'
import Logo from './shared/Logo'
import { useRouter } from 'next/navigation'

const Welcome = () => {
  // for navigation
  const router = useRouter()

  return (
    <div className="flex flex-col lg:flex-row">
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
        {/* Logo and Title */}
        <Logo className="w-[50px]" href="/" image={logo} />

        {/* Centered Content */}
        <div className="flex flex-col justify-center items-center flex-1 gap-4">
          <p className="opacity-40">Welcome to Spherre!</p>
          <div className="text-center">
            {/* Responsive Text */}
            <p className="text-lg md:text-2xl lg:text-4xl w-full md:w-[80%] lg:w-[60%] mx-auto">
              The Future of Secure, Collaborative Crypto Management!
            </p>

            {/* Responsive Button */}
            <button
              onClick={() => router.push('/onboarding/step1')}
              className="bg-white w-full sm:w-72 flex items-center justify-center gap-1 px-6 py-2 rounded-lg mx-auto my-3"
            >
              <Image src={add} height={30} width={24} alt={'add'} />
              <p className="text-black">Create Spherre</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Welcome

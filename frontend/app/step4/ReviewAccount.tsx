import Image from 'next/image'
const SphereLogo = '/Images/spherre-vector.svg'
const InfoLogo = '/Images/info-icon.svg'

const ReviewAccount = () => {
  return (
    <div className=" w-full max-w-[628px] bg-[#1C1D1F]  md:h-[326px] rounded-[10px] flex flex-col items-start justify-start  overflow-hidden ">
      <div className="w-full bg-[#272729] py-[18px] px-[26px] ">
        <h2 className=" text-white font-bold text-lg md:text-xl leading-[27.28px] ">
          Review your Spherre Account
        </h2>
      </div>

      <section className="w-full h-full py-[24px] px-[26px] flex flex-col items-start gap-5 ">
        <div className="w-full flex items-center justify-start flex-row gap-4 ">
          <span className=" w-10 h-10 bg-[#272729] rounded-full flex items-center justify-center ">
            <Image src={SphereLogo} alt="logo" height={19.5} width={19.5} />
          </span>

          <h1 className=" font-bold text-2xl md:text-[32px] text-white ">Backstage Boys </h1>
        </div>



        <p className='text-[#8E9BAE] font-normal text-sm  ' >Members: Deon, John and Joshua</p>





        <div className='flex items-center gap-[44px] my-3  ' >

            <div className='w-full flex items-center gap-[10px]  ' >
                <p className='font-normal  text-sm md:text-base text-[#8E9BAE] ' >Deploy Fee</p>
                <Image src={InfoLogo} alt="logo" height={20} width={20} />
                
            </div>
            <h1 className='text-white font-bold text-xl md:text-[32px] whitespace-nowrap ' >
            ~0.0530 SOL
            </h1>

        </div>

        <div className=' flex items-start gap-[5px] p-0 ' > 
        <Image src={InfoLogo} alt="logo" height={20} width={20} className= ' mt-[4px] ' />
            <p className='text-sm font-normal text-[#8E9BAE] ' >This info section should explain why there is a ~0.0530 SOL deploy fee. Please the information should be quite detailed </p>
        </div>
      </section>
    </div>
  )
}

export default ReviewAccount

import Image from 'next/image'
const group = '/Images/group.svg'
const bookNum = '/Images/book-num.svg'

const ConfirmationFooter = () => {
  return (
    <div className=" w-full max-w-[628px] min-w-[300px] px-[26px] py-[28px] bg-[#1C1D1F]  md:h-[283px] rounded-[10px] flex flex-col items-start justify-center gap-7  ">
      <div className=" w-full flex items-center justify-between gap-5  ">
        <div className="basis-1/2 bg-[#272729] rounded-[10px] w-[130px] md:max-w-[281px] h-[139px] flex flex-row items-center justify-between gap-3 py-[33px] px-[14px] md:px-[26px] ">
          <div className=" h-[90px] flex flex-col justify-between items-start  ">
            <Image src={group} alt="logo" height={26} width={26} />
            <small className="text-[#8E9BAE] font-semibold text-xs md:text-base ">
              Members
            </small>
          </div>

          <h1 className="font-bold text-2xl md:text-[40px] text-white ">3</h1>
        </div>

        <div className="basis-1/2 bg-[#272729] rounded-[10px] w-[130px] md:max-w-[281px] h-[139px] flex flex-row items-center justify-between md:gap-3 py-[33px] px-[14px] md:px-[26px] ">
          <div className=" h-[90px] flex flex-col justify-between items-start  ">
            <Image src={bookNum} alt="logo" height={26} width={26} />
            <small className="text-[#8E9BAE] font-semibold text-xs md:text-base  ">
              Threshold
            </small>
          </div>

          <h1 className="font-bold text-2xl md:text-[40px] text-white ">1/2</h1>
        </div>
      </div>

      <div className=" w-full flex items-center justify-between gap-5  ">
        <button className="basis-1/2 bg-[#272729] rounded-[7px] max-w-[281px] h-[50px] flex items-center justify-center text-white text-center text-base font-medium ">
          {' '}
          Back{' '}
        </button>

        <button className="basis-1/2 bg-white rounded-[7px] max-w-[281px] h-[50px] flex items-center justify-center text-[#101213] text-center text-base font-medium">
          Confirm
        </button>
      </div>
    </div>
  )
}

export default ConfirmationFooter

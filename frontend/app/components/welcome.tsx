import Image from "next/image";
import logo from "../../public/Images/spherrelogo.png";
import wall from "../../public/Images/wall.png";
import add from "../../public/Images/Add.png";

const Welcome = () => {
    return (
        <div className="flex h-screen">
            <Image
                src={wall}
                style={{ height: '100vh', width: '40vw' }}
                alt={""}
                className="p-4"
            />
            <div className="flex-1 flex flex-col justify-between p-14">
                <div className="flex items-center gap-2">
                    <Image src={logo} height={50} width={50} alt={""} />
                    <p className="text-xl font-semibold">Spherre</p>
                </div>
                <div className="flex flex-col justify-center items-center flex-1 gap-4">
                    <p className="opacity-40">Welcome to Spherre!</p>
                    <div className="text-center">
                        <p className="text-4xl w-[40%] mx-auto">The Future of Secure, Collaborative Crypto Management!</p>
                        <button className="bg-white w-72 flex items-center justify-center gap-1 px-6 py-2 rounded-lg mx-auto my-3">
                            <Image src={add} height={30} width={24} alt={"add"} />
                            <p className="text-black">Create Spherre</p>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Welcome;
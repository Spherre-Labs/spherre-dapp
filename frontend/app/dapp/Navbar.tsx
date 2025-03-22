import Link from "next/link";

interface NavbarProps {
    title: string;
}

const Navbar: React.FC<NavbarProps> = ({ title }) => {
    return (
        <nav className="bg-[#1C1D1F] p-4 border-b-[1px] border-gray-600">
            <div className="mx-auto flex justify-start items-center">
                <Link href="/" className="text-white font-bold text-xl">
                    {title}
                </Link>
            </div>
        </nav>
    );
};

export default Navbar;
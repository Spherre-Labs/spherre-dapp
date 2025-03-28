import React from "react";
import Image from "next/image"; 

// Import images
import nft1 from "../assets/3d-rendering-holographic-layering.png";
import nft2 from "../assets/beautiful-vintage-collage-composition.png";
import nft3 from "../assets/3d-view-adorable-pet-cat.png";
import nft4 from "../assets/7705305.png";
import nft5 from "../assets/2631268 (1).png";
import nft6 from "../assets/9121999.png";
import nft7 from "../assets/5086933.png";
import nft8 from "../assets/6398924.png";

import { StaticImageData } from "next/image"; // Import StaticImageData

interface NFTCardProps {
  image: StaticImageData; 
  username: string;
  price: string;
}


const NFTCard: React.FC<NFTCardProps> = ({ image, username, price }) => {
  return (
    <div className="bg-[#272729]  rounded-sm shadow-lg">
      <Image src={image} alt="NFT" width={300} height={200} className="object-cover " />
      <div className="flex justify-between p-3 items-center mt-3">
        <span className="text-white text-sm">{username}</span>
        <span className="text-gray-300">${price}</span>
      </div>
    </div>
  );
};

const NFTVaults: React.FC = () => {
  const nfts = [
    { image: nft1, username: "Jackfackson24", price: "23" },
    { image: nft2, username: "yhahhiHIHI", price: "25" },
    { image: nft3, username: "Unami45", price: "30" },
    { image: nft4, username: "Yamalilfon", price: "50" },
    { image: nft5, username: "Jackfackson24", price: "45" },
    { image: nft6, username: "Jackfackson24", price: "40" },
    { image: nft7, username: "Jackfackson24", price: "10" },
    { image: nft8, username: "Jackfackson24", price: "20" },
  ];

  return (
    <div className="bg-black min-h-screen p-10">
      <div className="grid grid-cols-4 gap-6">
        {nfts.map((nft, index) => (
          <NFTCard key={index} {...nft} />
        ))}
      </div>
    </div>
  );
};

export default NFTVaults;

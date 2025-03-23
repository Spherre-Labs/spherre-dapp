import React from "react";

interface NFTCardProps {
  image: string;
  username: string;
  price: string;
}

const NFTCard: React.FC<NFTCardProps> = ({ image, username, price }) => {
  return (
    <div className="bg-gray-900 p-4 rounded-2xl shadow-lg">
      <img src={image} alt="NFT" className="w-full h-40 object-cover rounded-lg" />
      <div className="flex justify-between items-center mt-3">
        <span className="text-white text-sm">{username}</span>
        <span className="text-gray-300">${price}</span>
      </div>
    </div>
  );
};

const NFTVaults: React.FC = () => {
  const nfts = [
    { image: "/nft1.png", username: "Jackfackson24", price: "23" },
    { image: "/nft2.png", username: "yhahhiHIHI", price: "25" },
    { image: "/nft3.png", username: "Unami45", price: "30" },
    { image: "/nft4.png", username: "Yamalilfon", price: "50" },
    { image: "/nft5.png", username: "Jackfackson24", price: "45" },
    { image: "/nft6.png", username: "Jackfackson24", price: "40" },
    { image: "/nft7.png", username: "Jackfackson24", price: "10" },
    { image: "/nft8.png", username: "Jackfackson24", price: "20" },
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

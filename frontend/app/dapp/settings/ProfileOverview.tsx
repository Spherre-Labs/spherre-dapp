import React, { useState } from 'react';
import AddEmailModal from './AddEmailModal';

interface ProfileOverviewProps {
  onEditProfile: () => void;
}

const ProfileOverview: React.FC<ProfileOverviewProps> = ({ onEditProfile }) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="bg-[#181A20] min-h-screen pl-0 pr-8 pt-4 pb-8 text-white">

      <div className="w-[1130px] rounded-[10px] p-4 flex items-center justify-between mb-8 gap-[10px] bg-[#232325] ml-4">
        <span>
          <svg className="w-6 h-6 text-[#A3ADC2]" fill="none" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="12" fill="currentColor" />
            <text x="12" y="17" textAnchor="middle" fontSize="18" fill="#181A20" fontWeight="bold">!</text>
          </svg>
        </span>
        <div className="flex-1">
          <span className="text-xl font-semibold text-white">Add Email Address</span>
          <p className="text-[#8E9BAE] text-sm mt-1">
            This email will be used to notify you on the account multisig transactions
            <a href="#" className="text-[#6F2FCE] ml-1 hover:underline">Learn More</a>
          </p>
        </div>
        <button
          className="bg-[#464655] text-white rounded-[7px] px-6 py-2 font-medium ml-4"
          onClick={() => setShowModal(true)}
        >
          Add Email Address
        </button>
      </div>

      <div className="flex flex-col items-center w-full mb-8 ml-4">
        <div className="relative w-32 h-32 mb-2">
          <img
            src="/Images/profile2.png"
            alt="Avatar"
            className="w-32 h-32 rounded-full object-cover border-4 border-[#181A20]"
          />
          <span className="absolute bottom-2 right-2 bg-[#6C47FF] p-2 rounded-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-white">
              <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" />
              <circle cx="8.5" cy="10.5" r="1.5" fill="currentColor" />
              <path stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M21 19l-5.5-7-4.5 6-3-4-4 5" />
            </svg>
          </span>
        </div>
        <div className="text-2xl font-semibold text-white mb-2">Han Solo</div>
        <div className="bg-[#23242B] text-[#8E9BAE] px-4 py-2 rounded-lg text-sm mb-4">
          G2520xec7Spherre520bb71f30523bcce4c10ad62teyw
        </div>
        <button className="bg-[#6F2FCE] hover:bg-[#7d5fff] text-white rounded-[7px] px-6 py-2 font-semibold transition" onClick={onEditProfile}>
          Edit Profile
        </button>
      </div>

      <div className="w-[910px] h-[122px] bg-[#232325] rounded-[10px] p-[20px_40px] mx-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-[#8E9BAE] text-base">
              <th className="pb-2 pr-[119px]">Email Address</th>
              <th className="pb-2 pr-[119px]">Wallet Assigned Name</th>
              <th className="pb-2 pr-[119px]">Wallet ID</th>
              <th className="pb-2">Date Joined</th>
            </tr>
          </thead>
          <tbody>
            <tr className="text-white text-lg">
              <td className="py-2 pr-[119px]">-------------</td>
              <td className="py-2 pr-[119px]">Han Solo</td>
              <td className="py-2 pr-[119px]">352By...wtuya</td>
              <td className="py-2">May 2025</td>
            </tr>
          </tbody>
        </table>
      </div>

      <AddEmailModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onSign={() => {
          setShowModal(false);
        }}
      />
    </div>
  );
};

export default ProfileOverview;

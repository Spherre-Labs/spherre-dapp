"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Delete from '../../public/Images/trash-bin.png'

const AddSphereMembers = () => {
  const [members, setMembers] = useState([
    'elbbababaahhajaagsahv77278191912a',
    '',
  ]);

  const addMember = () => {
    setMembers([...members, '']);
  };

  // Remove a member by index
  const removeMember = (index: number) => {
    setMembers(members.filter((_, i) => i !== index));
  };

  // Update a member's address
  const updateMember = (index: number, value: string) => {
    const updatedMembers = [...members];
    updatedMembers[index] = value;
    setMembers(updatedMembers);
  };

  return (
    <div className='w-full max-w-md'>
        <h1 className="text-lg font-semibold bg-gray-800 text-white rounded-t-lg mb-[-2] p-6">Add Sphere Members</h1>
        <div className="w-full max-w-md bg-gray-900 rounded-b-lg p-6">        
            {/* Member List */}
            {members.map((member, index) => (
            <div key={index} className="mb-4">
                <div className="flex items-center justify-between">
                    <label className="text-sm text-white mb-1">Member {index + 1}</label>
                    {members.length > 1 && (
                    <button
                        onClick={() => removeMember(index)}
                        className="text-gray-400 hover:text-gray-200"
                    >
                        <Image src ={Delete} alt='' ></Image>
                    </button>
                    )}
                </div>
                <input
                    type="text"
                    value={member}
                    onChange={(e) => updateMember(index, e.target.value)}
                    placeholder="Enter team member’s address"
                    className="w-full bg-gray-800 text-white text-sm rounded-lg p-2 border border-gray-700 focus:outline-none focus:border-purple-600"
                />
            </div>
        ))}

        <button
            onClick={addMember}
            className="flex items-center bg-gray-800 w-full p-4 text-center items-center justify-center rounded-lg hover:text-purple-500 text-sm"
        >
            <span className="mr-1">+</span> Add Member
        </button>
        </div>
    </div>
    
  );
};

export default AddSphereMembers;
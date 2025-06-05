"use client";
import React, { useState } from 'react';
import ProfileOverview from './ProfileOverview';
import EditProfile from './EditProfile';

export default function Page() {
  const [editing, setEditing] = useState(false);

  return (
    <>
      {editing ? (
        <EditProfile onCancel={() => setEditing(false)} />
      ) : (
        <ProfileOverview onEditProfile={() => setEditing(true)} />
      )}
    </>
  );
} 
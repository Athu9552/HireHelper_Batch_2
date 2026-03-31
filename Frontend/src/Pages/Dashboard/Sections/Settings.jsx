import React, { useEffect, useState } from 'react'
import axios from 'axios';
import './Settings.css';


const Settings = () => {
  const [user, setUser] = useState({
    first_name: '',
    last_name: '',
    email_id: '',
    phone_number: '',
    profile_picture: '',
    bio: ''
  });

  const [previewUrl, setPreviewUrl] = useState(null);
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

  useEffect(() => {
    const loadUser = async () => {
      try {
        const res = await axios.get(`/api/auth/me`, {
          headers: { 'x-auth-token': localStorage.getItem('token') }
        });

        setUser({
          ...res.data,
          phone_number: res.data.phone_number || '',
          bio: res.data.bio || '',
          profile_picture: res.data.profile_picture
            ? `${res.data.profile_picture}`
            : ''
        });

      } catch (err) {
        console.log('Error fetching user:', err);
      }
    };

    loadUser();
  }, []);

  const handleChange = (e) =>
    setUser({ ...user, [e.target.name]: e.target.value });

  const getProfileImage = (profilePicture, firstName, lastName) => {
    if (!profilePicture) {
      return `https://ui-avatars.com/api/?name=${firstName}+${lastName}`;
    }
    if (profilePicture.startsWith("http")) return profilePicture;
    return `${apiBaseUrl}${profilePicture}`;
  };

  // 🔥 Upload Profile Picture
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setPreviewUrl(URL.createObjectURL(file));

    const formData = new FormData();
    formData.append('profile_picture', file);

    try {
      const res = await axios.post(
        `/api/auth/upload-profile-picture`,
        formData,
        {
          headers: {
            'x-auth-token': localStorage.getItem('token')
          }
        }
      );

      if (res.data.profile_picture) {
        const newPicUrl = `${res.data.profile_picture}`;
        setUser(prev => ({ ...prev, profile_picture: newPicUrl }));
        setPreviewUrl(null);
        window.dispatchEvent(new Event('profileUpdated'));
        alert('Profile picture updated!');
      }

    } catch (err) {
      console.error('Upload error:', err.response?.data || err.message);
      alert('Failed to upload profile picture');
      setPreviewUrl(null);
    }
  };

  // 🔥 Remove Profile Picture
  const handleRemove = async () => {
    try {
      await axios.delete(
        `/api/auth/remove-profile-picture`,
        {
          headers: { 'x-auth-token': localStorage.getItem('token') }
        }
      );

      setUser(prev => ({ ...prev, profile_picture: '' }));
      window.dispatchEvent(new Event('profileUpdated'));
      alert('Profile picture removed!');

    } catch {
      alert('Failed to remove picture');
    }
  };

  // 🔥 Save Profile
  const handleSaveChanges = async () => {
    try {
      await axios.put(
        `/api/auth/update-profile`,
        {
          first_name: user.first_name,
          last_name: user.last_name,
          phone_number: user.phone_number,
          bio: user.bio
        },
        {
          headers: { 'x-auth-token': localStorage.getItem('token') }
        }
      );

      window.dispatchEvent(new Event('profileUpdated'));
      alert('Profile updated successfully!');

    } catch (err) {
      console.error(err);
      alert('Failed to update profile');
    }
  };

  return (
    <div className='box'>
      <h2>Settings</h2>

      <img
        src={
          previewUrl ||
          getProfileImage(user.profile_picture, user.first_name, user.last_name)
        }
        alt="profile"
        width="120"
      />

      <input type="file" onChange={handleFileChange} />

      <button onClick={handleRemove}>Remove</button>

      <input
        name="first_name"
        value={user.first_name}
        onChange={handleChange}
        placeholder="First Name"
      />

      <input
        name="last_name"
        value={user.last_name}
        onChange={handleChange}
        placeholder="Last Name"
      />

      <button onClick={handleSaveChanges}>Save</button>

    </div>
  );
};

export default Settings;
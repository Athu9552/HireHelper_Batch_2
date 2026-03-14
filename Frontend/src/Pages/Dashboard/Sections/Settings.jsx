import React, { useEffect, useState } from 'react'
import axios from 'axios';
import './Settings.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera } from '@fortawesome/free-solid-svg-icons';
import API_BASE_URL from '../../../config/api';

const Settings = () => {
  const [user, setUser] = useState({
    first_name: '',
    last_name: '',
    email_id: '',
    phone_number: '',
    profile_picture: '',
    bio: ''
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    const loadUser = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/auth/me`, {
          headers: { 'x-auth-token': localStorage.getItem('token') }
        });
        setUser({
          ...res.data,
          phone_number: res.data.phone_number || '',
          bio: res.data.bio || '',
          profile_picture: res.data.profile_picture
            ? `${API_BASE_URL}${res.data.profile_picture}`
            : ''
        });
      } catch (err) {
        console.log('Error fetching user:', err);
      }
    };
    loadUser();
  }, []);

  const handleChange = (e) => setUser({ ...user, [e.target.name]: e.target.value });

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    
    const formData = new FormData();
    formData.append('profile_picture', file);
    
    try {
      const res = await axios.post(`${API_BASE_URL}/api/auth/upload-profile-picture`, formData, {
        headers: {
          'x-auth-token': localStorage.getItem('token'),
          'Content-Type': 'multipart/form-data'
        }
      });
      if (res.data.profile_picture) {
        const newPicUrl = `${API_BASE_URL}${res.data.profile_picture}`;
        setUser(prev => ({ ...prev, profile_picture: newPicUrl }));
        setPreviewUrl(null);
        window.dispatchEvent(new Event('profileUpdated'));
        alert('Profile picture updated!');
      }
    } catch (err) {
      console.error('Upload error:', err.response?.data || err.message);
      alert(err.response?.data?.message || 'Failed to upload photo.');
      setPreviewUrl(null);
    }
  };

  const handleRemove = async () => {
    try {
      await axios.delete(`${API_BASE_URL}/api/auth/remove-profile-picture`, {
        headers: { 'x-auth-token': localStorage.getItem('token') }
      });
      setUser(prev => ({ ...prev, profile_picture: '' }));
      window.dispatchEvent(new Event('profileUpdated'));
      alert('Profile picture removed!');
    } catch (err) {
      alert('Failed to remove picture');
    }
  };

  const handleSaveChanges = async () => {
    try {
      await axios.put(`${API_BASE_URL}/api/auth/update-profile`, {
        first_name: user.first_name,
        last_name: user.last_name,
        phone_number: user.phone_number,
        bio: user.bio
      }, {
        headers: { 'x-auth-token': localStorage.getItem('token') }
      });
      window.dispatchEvent(new Event('profileUpdated'));
      alert('Profile updated successfully!');
    } catch (err) {
      console.error('Update error:', err.response?.data || err.message);
      alert(err.response?.data?.message || 'Failed to update profile');
    }
  };

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return alert("New passwords don't match!");
    }
    if (passwordData.newPassword.length < 6) {
      return alert("Password must be at least 6 characters!");
    }

    try {
      await axios.put(`${API_BASE_URL}/api/auth/change-password`, {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      }, {
        headers: { 'x-auth-token': localStorage.getItem('token') }
      });
      alert('Password changed successfully!');
      setShowPasswordModal(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      console.error('Password change error:', err.response?.data || err.message);
      alert(err.response?.data?.message || 'Failed to change password');
    }
  };

  return (
    <div className='box'>
      <div className="parentDiv">
        <div className="profilePic">
          <h2>Profile Picture</h2>
          <div className='centerBtn'>
          <div className="circleImg">
            <img src={previewUrl || user.profile_picture || `https://ui-avatars.com/api/?name=${user.first_name}+${user.last_name}&background=3b82f6&color=fff`} alt="Profile" />
          </div>
          <div className="btnFlex">
          <input type="file" id="file-input" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
          <button className='SettingsBtn' onClick={() => document.getElementById('file-input').click()}><FontAwesomeIcon icon={faCamera} /> Change Image</button>
          <button className='plainBtn' onClick={handleRemove}>Remove</button>
          </div>
          </div>
        </div>
        <div className="profilePic box2">
          <h2>Personal Information</h2>
          <form onSubmit={(e) => e.preventDefault()}>
            <div className='top-sec topP1'>
            <div className="left-form">
              <label style={{color: '#000'}}><b>First Name</b></label>
              <input style={{color: '#000', background: '#fff'}}
                type="text"
                name="first_name"
                value={user.first_name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="right-form">
              <label style={{color: '#000'}}><b>Last Name</b></label>
              <input style={{color: '#000', background: '#fff'}}
                type="text"
                name="last_name"
                value={user.last_name}
                onChange={handleChange}
                required
              />
            </div>
            </div>
            <div className="bottom-sec">
            <label style={{color: '#000'}}><b>Email</b></label>
            <input style={{color: '#000', background: '#fff'}}
              type="email"
              value={user.email_id}
              disabled
            />

            <label style={{color: '#000'}}><b>Phone Number</b></label>
            <input style={{color: '#000', background: '#fff'}}
              type="tel"
              name="phone_number"
              value={user.phone_number}
              onChange={handleChange}
            />
            <label style={{color: '#000'}}><b>Bio (Optional)</b></label>
            <textarea name="bio" value={user.bio} onChange={handleChange} cols="30" rows="10"></textarea>
            </div>
            <button type="button" className='SettingsBtn btn2' onClick={handleSaveChanges}>Save Changes</button>
          </form>
        </div>
        <div className="profilePic">
          <h2>Account Security</h2>
          <div className="changeP">
          <p>Password</p>
          <button onClick={() => setShowPasswordModal(true)}>Change Password</button>
          </div>
        </div>
      </div>

      {showPasswordModal && (
        <div className="modal-overlay" onClick={() => setShowPasswordModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Change Password</h2>
            <div className="input-group">
              <label><b>Current Password</b></label>
              <input
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
              />
            </div>
            <div className="input-group">
              <label><b>New Password</b></label>
              <input
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
              />
            </div>
            <div className="input-group">
              <label><b>Confirm New Password</b></label>
              <input
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
              />
            </div>
            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <button className='SettingsBtn' onClick={handlePasswordChange}>Update Password</button>
              <button className='plainBtn' onClick={() => setShowPasswordModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Settings;
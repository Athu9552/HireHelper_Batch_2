import React, { useState } from 'react';
import axios from 'axios';
import '../Dashboard.css';
import { FiCloud, FiCalendar, FiClock } from "react-icons/fi";

const AddTask = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
    category: 'moving',
  });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check required fields manually if needed, but HTML5 'required' handles most
    if (!formData.startDate || !formData.startTime) {
      alert("Start Date and Time are required.");
      return;
    }

    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('location', formData.location);
    data.append('startDate', formData.startDate);
    data.append('startTime', formData.startTime);
    if(formData.endDate) data.append('endDate', formData.endDate);
    if(formData.endTime) data.append('endTime', formData.endTime);
    data.append('category', formData.category);
    if (file) {
      data.append('image', file);
    }
    // Budget is not in the design image, removing for now or defaulting to 0? keeping it optional in controller.

    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/tasks', data, {
        headers: { 
          'x-auth-token': token,
          'Content-Type': 'multipart/form-data' 
        }
      });
      alert('Task created successfully!');
      // Reset form
      setFormData({
        title: '',
        description: '',
        location: '',
        startDate: '',
        startTime: '',
        endDate: '',
        endTime: '',
        category: 'moving',
      });
      setFile(null);
      setPreview(null);
    } catch (err) {
      alert(err.response?.data?.message || 'Error creating task');
      console.error(err);
    }
  };

  return (
    <div className="page" style={{ padding: '0' }}> {/* Clean full width look inside main area */}
      <h2 style={{ marginBottom: '8px', fontSize: '24px' }}>Add New Task</h2>
      <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '32px' }}>
        Create a task and find someone to help you
      </p>

      <div className="form-container-clean">
        <form onSubmit={handleSubmit}>
          
          {/* Task Title */}
          <div className="form-group">
            <label className="form-label">Task Title</label>
            <input 
              type="text" name="title" 
              className="form-input clean-input" 
              placeholder="e.g. Help moving furniture"
              value={formData.title} onChange={handleChange} required 
            />
          </div>

          {/* Description */}
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea 
              name="description" 
              className="form-textarea clean-input" 
              rows="4" 
              placeholder="Describe what help you need, any requirements, and what you'll provide..."
              value={formData.description} onChange={handleChange} required
            ></textarea>
             <div style={{ textAlign: 'right', fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>
              
             </div>
          </div>

          {/* Location */}
          <div className="form-group">
            <label className="form-label">Location</label>
            <input 
              type="text" name="location" 
              className="form-input clean-input" 
              placeholder="e.g. Downtown Seattle, WA or specific address"
              value={formData.location} onChange={handleChange} required
            />
          </div>

          {/* Date & Time Grid */}
          <div className="grid-2-col">
            <div className="form-group">
              <label className="form-label">Start Date</label>
              <div className="input-icon-wrapper">
                 <input 
                   type="date" name="startDate" 
                   className="form-input clean-input" 
                   value={formData.startDate} onChange={handleChange} required
                 />
                 {/* Calendar icon handled by browser input usually, custom icon tricky without libraries */}
                 {/* <FiCalendar className="input-icon-right" /> */} 
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Start Time</label>
              <div className="input-icon-wrapper">
                <input 
                  type="time" name="startTime" 
                  className="form-input clean-input" 
                  value={formData.startTime} onChange={handleChange} required
                />
                 {/* <FiClock className="input-icon-right" /> */}
              </div>
            </div>
          </div>

          <div className="grid-2-col">
            <div className="form-group">
              <label className="form-label">End Date (Optional)</label>
              <input 
                type="date" name="endDate" 
                className="form-input clean-input" 
                value={formData.endDate} onChange={handleChange}
              />
            </div>
            <div className="form-group">
               <label className="form-label">End Time (Optional)</label>
               <input 
                 type="time" name="endTime" 
                 className="form-input clean-input" 
                 value={formData.endTime} onChange={handleChange}
               />
            </div>
          </div>

           {/* Category */}
           <div className="form-group">
            <label className="form-label">Category</label>
            <select name="category" className="form-select clean-input" value={formData.category} onChange={handleChange}>
              <option value="" disabled>Select a category</option>
              <option value="moving">Moving</option>
              <option value="gardening">Gardening</option>
              <option value="painting">Painting</option>
              <option value="cleaning">Cleaning</option>
              <option value="tech">Tech Support</option>
              <option value="Plumbing">Plumbing</option>
              <option value="Electrical">Electrical</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* File Upload */}
          <div className="form-group">
             <label className="form-label">Task Image (Optional)</label>
             <div className="file-upload-box">
                {preview ? (
                  <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                     <img src={preview} alt="Preview" style={{ maxWidth: '100%', maxHeight: '150px', objectFit: 'contain' }} />
                     <button type="button" onClick={() => { setFile(null); setPreview(null); }} className="remove-file-btn">Remove</button>
                  </div>
                ) : (
                  <>
                    <FiCloud style={{ fontSize: '32px', color: '#cbd5e1', marginBottom: '12px' }} />
                    <p style={{ fontSize: '14px', color: '#3b82f6', fontWeight: '500', marginBottom: '4px' }}>
                      Upload a file <span style={{ color: '#64748b', fontWeight: '400' }}>or drag and drop</span>
                    </p>
                    <p style={{ fontSize: '12px', color: '#94a3b8' }}>PNG, JPG, GIF up to 10MB</p>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleFileChange}
                      className="file-input-hidden"
                    />
                  </>
                )}
             </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-lg btn-primary">Post Task</button>
            <button type="button" className="btn-lg btn-secondary">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTask;
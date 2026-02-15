import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../Dashboard.css';
import { FiMapPin, FiClock } from "react-icons/fi";

const Feed = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const getImage = (category) => {
    const map = {
      moving: 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      gardening: 'https://images.unsplash.com/photo-1416879156412-ee60738e4a73?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      painting: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      tech: 'https://images.unsplash.com/photo-1531297424005-06fa60e7e171?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      cleaning: 'https://images.unsplash.com/photo-1581578731117-104f2a8923fb?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    };
    return map[category?.toLowerCase()] || 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80';
  };

  const getBadgeColor = (category) => {
    const map = {
      moving: 'badge-blue',
      gardening: 'badge-green',
      painting: 'badge-purple',
      tech: 'badge-orange',
    };
    return map[category?.toLowerCase()] || 'badge-blue';
  };

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/tasks', {
          headers: { 'x-auth-token': token }
        });
        setTasks(res.data);
      } catch (err) {
        console.error("Failed to fetch tasks", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const handleRequest = async (taskId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/requests', 
        { taskId, msg: "I can help with this!" },
        { headers: { 'x-auth-token': token } }
      );
      alert('Request sent!');
    } catch (err) {
      alert(err.response?.data?.message || 'Error sending request');
    }
  };

  if (loading) return <div>Loading tasks...</div>;

  return (
    <div className="grid-container">
      {tasks.map(task => (
        <div key={task._id} className="card">
          <img src={getImage(task.category)} alt={task.category} className="card-img" />
          
          <div className="card-body">
            <div className="card-meta">
              <span className={`badge ${getBadgeColor(task.category)}`}>
                {task.category}
              </span>
              <span className="date-text">
                {new Date(task.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </span>
            </div>
            
            <h3 className="card-title">{task.title}</h3>
            <p className="card-desc">{task.description}</p>
            
            <div className="info-row">
              <FiMapPin style={{ marginRight: '6px' }} /> {task.location}
            </div>
            <div className="info-row">
              <FiClock style={{ marginRight: '6px' }} /> {new Date(task.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - 5:00 PM
            </div>

            <div className="user-row">
              <img 
                src={`https://ui-avatars.com/api/?name=${task.createdBy?.first_name}+${task.createdBy?.last_name}&background=3b82f6&color=fff&bold=true`}
                alt="user" 
                className="card-avatar" 
              />

              <span className="user-name">
                {task.createdBy?.first_name} {task.createdBy?.last_name}
              </span>
              
              <button 
                className="btn-sm btn-success"
                onClick={() => handleRequest(task._id)}
              >
                Request Sent
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Feed;
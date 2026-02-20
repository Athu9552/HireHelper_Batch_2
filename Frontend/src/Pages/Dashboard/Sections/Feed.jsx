import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../Dashboard.css';
import { FiMapPin, FiClock } from "react-icons/fi";
import { useToast } from "../../../components/ToastProvider.jsx";

const Feed = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState(null);
  const toast = useToast();

  const getImage = (category) => {
    const map = {
      moving: 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      gardening: 'https://images.unsplash.com/photo-1416879156412-ee60738e4a73?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      painting: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      tech: 'https://cdn.pixabay.com/photo/2023/09/28/07/25/technology-8280863_1280.jpg',
      cleaning: 'https://images.unsplash.com/photo-1581578731117-104f2a8923fb?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      plumbing: "https://wallpapers.com/images/hd/close-up-plumber-fixing-plumbing-system-dd8m1skb7w7io73q.jpg",
      electrical: "https://tse1.mm.bing.net/th/id/OIP.-IFXBIk5dBO5ti38yi5ttAHaE7?pid=Api&P=0&h=180",
    };
    return map[category?.toLowerCase()] || 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80';
  };

  const getBadgeColor = (category) => {
    const map = {
      moving: 'badge-blue',
      gardening: 'badge-green',
      painting: 'badge-purple',
      tech: 'badge-orange',
      plumbing: 'badge-red',
      electrical: 'badge-yellow',
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
      toast?.success("Request sent! Watch your notifications for updates.");
    } catch (err) {
      toast?.error(err.response?.data?.message || 'Error sending request');
    }
  };

  const handleViewDetails = (task) => {
    setSelectedTask(task);
  };

  const closeModal = () => setSelectedTask(null);

  if (loading) return <div>Loading tasks...</div>;

  return (
    <>
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
                  {new Date(task.startDate || task.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
              </div>
              
              <h3 className="card-title">{task.title}</h3>
              <p className="card-desc">{task.description}</p>
              
              {task.mapsLink ? (
                <a
                  href={task.mapsLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="info-row"
                  style={{ textDecoration: 'none' }}
                >
                  <FiMapPin style={{ marginRight: '6px', color: '#3b82f6' }} />
                  <span style={{ color: '#0f172a' }}>{task.location}</span>
                </a>
              ) : (
                <div className="info-row">
                  <FiMapPin style={{ marginRight: '6px' }} /> {task.location}
                </div>
              )}
              <div className="info-row">
                <FiClock style={{ marginRight: '6px' }} />
                {task.startDate ? new Date(task.startDate).toLocaleDateString() : ''}
                {task.startTime && (
                  <>
                    {" • "}
                    {new Date(`1970-01-01T${task.startTime}`).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true
                    })}
                  </>
                )}
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
                
                <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
                  <button 
                    className="btn-sm btn-outline"
                    onClick={() => handleViewDetails(task)}
                  >
                    View Details
                  </button>
                  <button 
                    className="btn-sm btn-success"
                    onClick={() => handleRequest(task._id)}
                  >
                    Request Task
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedTask && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{selectedTask.title}</h2>
            <p>{selectedTask.description}</p>
            <p>
              <strong>Location:</strong>{" "}
              {selectedTask.mapsLink ? (
                <a
                  href={selectedTask.mapsLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: '#3b82f6' }}
                >
                  {selectedTask.location} (Open in Maps)
                </a>
              ) : (
                selectedTask.location
              )}
            </p>
            <p><strong>Category:</strong> {selectedTask.category}</p>
            <p><strong>Owner:</strong> {selectedTask.createdBy?.first_name} {selectedTask.createdBy?.last_name}</p>
            <div style={{ marginTop: '16px', display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              <button className="btn-sm btn-outline" onClick={closeModal}>
                Close
              </button>
              <button className="btn-sm btn-success" onClick={() => handleRequest(selectedTask._id)}>
                Request Task
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Feed;
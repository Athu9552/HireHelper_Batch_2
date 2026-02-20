import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../Dashboard.css';
import { FiMapPin, FiClock, FiTrash2 } from "react-icons/fi";
import { useToast } from "../../../components/ToastProvider.jsx";

const MyTasks = () => {
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

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/tasks/my', {
        headers: { 'x-auth-token': token }
      });
      setTasks(res.data || []);
    } catch (err) {
      console.error("Failed to fetch my tasks", err);
      toast?.error("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleViewDetails = (task) => {
    setSelectedTask(task);
  };

  const closeModal = () => setSelectedTask(null);

  const handleDelete = async (taskId, taskTitle) => {
    if (!window.confirm(`Delete task "${taskTitle}"? This cannot be undone.`)) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/tasks/${taskId}`, {
        headers: { 'x-auth-token': token }
      });
      toast?.success("Task deleted");
      setTasks((prev) => prev.filter((t) => t._id !== taskId));
      if (selectedTask?._id === taskId) closeModal();
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to delete task";
      toast?.error(msg);
    }
  };

  if (loading) return <div>Loading...</div>;

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
                <span className={`badge ${task.status === 'open' ? 'badge-green' : 'badge-orange'}`} style={{ marginLeft: 'auto' }}>
                  {task.status === 'open' ? 'active' : 'in progress'}
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
              </div>

              <div className="user-row" style={{ marginTop: 'auto', gap: '8px' }}>
                <button
                  className="btn-sm btn-primary-soft"
                  style={{ flex: 1 }}
                  onClick={() => handleViewDetails(task)}
                >
                  View Details
                </button>
                <button
                  className="btn-sm"
                  style={{ 
                    background: '#fee2e2', 
                    color: '#dc2626',
                    padding: '8px 12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  onClick={() => handleDelete(task._id, task.title)}
                  title="Delete task"
                >
                  <FiTrash2 size={16} />
                </button>
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
            <p>
              <strong>Start:</strong>{" "}
              {selectedTask.startDate ? new Date(selectedTask.startDate).toLocaleDateString() : 'N/A'}
              {selectedTask.startTime && ` • ${new Date(`1970-01-01T${selectedTask.startTime}`).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true
              })}`}
            </p>
            <div style={{ marginTop: '16px', display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              <button
                className="btn-sm"
                style={{ 
                  background: '#fee2e2', 
                  color: '#dc2626',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
                onClick={() => handleDelete(selectedTask._id, selectedTask.title)}
              >
                <FiTrash2 size={16} />
                Delete Task
              </button>
              <button className="btn-sm btn-outline" onClick={closeModal}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MyTasks;
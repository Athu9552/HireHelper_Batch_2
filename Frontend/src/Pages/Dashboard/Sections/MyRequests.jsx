import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../Dashboard.css';
import { FiCalendar, FiMapPin } from "react-icons/fi";

const CATEGORY_IMAGES = {
  moving: 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  gardening: 'https://images.unsplash.com/photo-1416879156412-ee60738e4a73?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  painting: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  tech: 'https://cdn.pixabay.com/photo/2023/09/28/07/25/technology-8280863_1280.jpg',
  cleaning: 'https://images.unsplash.com/photo-1581578731117-104f2a8923fb?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  plumbing: 'https://wallpapers.com/images/hd/close-up-plumber-fixing-plumbing-system-dd8m1skb7w7io73q.jpg',
  electrical: 'https://tse1.mm.bing.net/th/id/OIP.-IFXBIk5dBO5ti38yi5ttAHaE7?pid=Api&P=0&h=180',
};

const MyRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/requests/my', {
        headers: { 'x-auth-token': token }
      });
      setRequests(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const getTaskImage = (category) =>
    CATEGORY_IMAGES[category?.toLowerCase()] ||
    'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80';

  if (loading) return <div>Loading...</div>;

  return (
    <div className="request-list">
      {requests.map((req) => (
        <div key={req._id} className="request-card">
          <div className="request-header" style={{ marginBottom: '10px' }}>
            <div className="requester-details">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h4>{req.task?.title || 'Task'}</h4>
                <span className="badge badge-blue">{req.task?.category || '—'}</span>
              </div>
              <div style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>
                Task owner: {req.task?.createdBy?.first_name} {req.task?.createdBy?.last_name}
              </div>
            </div>
            <span
              className={`badge ${
                req.status === 'accepted' ? 'badge-green' : req.status === 'rejected' ? 'badge-purple' : 'badge-orange'
              }`}
            >
              {req.status === 'pending' ? 'Pending' : req.status}
            </span>
          </div>

          <div className="request-context-box" style={{ background: '#f8fafc' }}>
            <strong>Your message:</strong> {req.msg || '—'}
          </div>

          {req.task && (
            <div style={{ marginTop: '16px' }}>
              <div className="info-row" style={{ marginBottom: '6px' }}>
                <FiCalendar style={{ marginRight: '6px' }} />
                {req.task.startDate ? new Date(req.task.startDate).toLocaleDateString() : '—'}
              </div>
              {req.task.location && (
                <div className="info-row">
                  <FiMapPin style={{ marginRight: '6px' }} /> {req.task.location}
                </div>
              )}
              <img
                src={getTaskImage(req.task.category)}
                alt={req.task.category}
                style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '8px', marginTop: '8px' }}
              />
            </div>
          )}
        </div>
      ))}
      {requests.length === 0 && <p>You haven&apos;t sent any requests. Request a task from the Feed to see it here.</p>}
    </div>
  );
};

export default MyRequests;
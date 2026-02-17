import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../Dashboard.css';
import { FiCheck, FiX, FiCalendar, FiMapPin } from "react-icons/fi";
import { FaStar } from "react-icons/fa"; // Importing FontAwesome Star for better filled look

const Requests = () => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/requests/incoming', {
        headers: { 'x-auth-token': token }
      });
      setRequests(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleStatus = async (id, status) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put('http://localhost:5000/api/requests/status', 
        { requestId: id, status },
        { headers: { 'x-auth-token': token } }
      );
      fetchRequests();
    } catch (err) {
      alert('Error updating status');
    }
  };

  return (
    <div className="request-list">
      {requests.map(req => (
        <div key={req._id} className="request-card">
          <div className="request-header">
            <div className="requester-info">
              <img 
                 src={`https://ui-avatars.com/api/?name=${req.requester?.first_name}+${req.requester?.last_name}&background=3b82f6&color=fff&bold=true`}
                 alt="requester" 
                 className="requester-avatar" 
              />

              <div className="requester-details">
                 <h4>{req.requester?.first_name} {req.requester?.last_name} <span className="rating"><FaStar style={{ marginBottom: '-2px', marginRight: '4px' }}/> 4.8 <span>(18 reviews)</span></span></h4>
                 <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                    IT Specialist • 5+ years exp
                 </div>
              </div>
            </div>

            <div className="request-actions">
              {req.status === 'pending' ? (
                <>
                  <button className="btn-accept" onClick={() => handleStatus(req._id, 'accepted')}>Accept</button>
                  <button className="btn-decline" onClick={() => handleStatus(req._id, 'rejected')}>Decline</button>
                </>
              ) : (
                <span className={`badge ${req.status === 'accepted' ? 'badge-green' : 'badge-purple'}`}>
                  {req.status}
                </span>
              )}
            </div>
          </div>

          <p className="request-body">
            {req.msg || "Hi! I'd love to help with your task. I have experience in this field and can assist you effectively."}
          </p>

          <div className="request-context-box">
             Requesting for: <strong>{req.task?.title}</strong>
             <div style={{ marginTop: '4px', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span><FiCalendar style={{ marginRight: '4px', marginBottom: '-2px' }}/> {new Date(req.task?.createdAt).toLocaleDateString()}</span>
                <span><FiMapPin style={{ marginRight: '4px', marginBottom: '-2px' }}/> {req.task?.location || 'Within 5 miles'}</span>
             </div>
          </div>
        </div>
      ))}
      {requests.length === 0 && <p>No incoming requests.</p>}
    </div>
  );
};

export default Requests;
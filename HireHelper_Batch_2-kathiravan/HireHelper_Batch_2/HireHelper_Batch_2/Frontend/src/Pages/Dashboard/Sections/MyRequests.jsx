import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../Dashboard.css';

const MyRequests = () => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/requests/my', {
          headers: { 'x-auth-token': token }
        });
        setRequests(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchRequests();
  }, []);

  return (
    <div className="request-list">
      {requests.map(req => (
        <div key={req._id} className="request-card">
           <div className="request-header" style={{ marginBottom: '10px' }}>
              <div className="requester-details">
                 <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                     <h4>Help Moving Furniture</h4> 
                     <span className="badge badge-blue">moving</span>
                 </div>
                 <div style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>
                    Task Owner: Sarah Johnson
                 </div>
              </div>
              
              <span className={`badge ${
                req.status === 'accepted' ? 'badge-green' : 
                req.status === 'rejected' ? 'badge-purple' : 'badge-orange'
              }`}>
                {req.status === 'pending' ? 'Pending' : req.status}
              </span>
           </div>

           <div className="request-context-box" style={{ background: '#f8fafc' }}>
              <strong>Your message:</strong>
              {req.msg}
           </div>

           <div style={{ marginTop: '16px' }}>
               <img 
                 src="https://images.unsplash.com/photo-1600585152220-90363fe7e115?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                 alt="task" 
                 style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '8px' }}
               />
           </div>
        </div>
      ))}
      {requests.length === 0 && <p>You haven't sent any requests.</p>}
    </div>
  );
};

export default MyRequests;
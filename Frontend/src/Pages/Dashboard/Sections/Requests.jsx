import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../Dashboard.css';
import { FiCheck, FiX, FiCalendar, FiMapPin } from "react-icons/fi";
import { FaStar } from "react-icons/fa"; // Importing FontAwesome Star for better filled look
import { useToast } from "../../../components/ToastProvider.jsx";

const Requests = () => {
  const [requests, setRequests] = useState([]);
  const [ratings, setRatings] = useState({});
  const toast = useToast();

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
      const uniqueUserIds = Array.from(
        new Set(res.data.map((r) => r.requester?._id).filter(Boolean))
      );
      const tokenHeader = { headers: { 'x-auth-token': token } };
      const ratingMap = {};
      await Promise.all(
        uniqueUserIds.map(async (id) => {
          try {
            const reviewRes = await axios.get(`http://localhost:5000/api/reviews/user/${id}`, tokenHeader);
            const userReviews = reviewRes.data || [];
            if (userReviews.length > 0) {
              const sum = userReviews.reduce((acc, r) => acc + (r.rating || 0), 0);
              ratingMap[id] = {
                avg: (sum / userReviews.length).toFixed(1),
                count: userReviews.length
              };
            } else {
              ratingMap[id] = { avg: null, count: 0 };
            }
          } catch {
            ratingMap[id] = { avg: null, count: 0 };
          }
        })
      );
      setRatings(ratingMap);
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
      toast?.success(`Request ${status}`);
      fetchRequests();
    } catch (err) {
      toast?.error('Error updating status');
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
                 <h4>
                  {req.requester?.first_name} {req.requester?.last_name}
                  <span className="rating">
                    <FaStar style={{ marginBottom: '-2px', marginRight: '4px' }}/>
                    {ratings[req.requester?._id]?.avg ?? 'New'}
                    {ratings[req.requester?._id]?.count > 0 && (
                      <span> ({ratings[req.requester?._id]?.count} reviews)</span>
                    )}
                  </span>
                 </h4>
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
                {req.task?.mapsLink ? (
                  <a
                    href={req.task.mapsLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ display: 'flex', alignItems: 'center', color: '#3b82f6', textDecoration: 'none' }}
                  >
                    <FiMapPin style={{ marginRight: '4px', marginBottom: '-2px' }}/>
                    {req.task.location || 'View location'}
                  </a>
                ) : (
                  <span><FiMapPin style={{ marginRight: '4px', marginBottom: '-2px' }}/> {req.task?.location || 'Within 5 miles'}</span>
                )}
             </div>
          </div>
        </div>
      ))}
      {requests.length === 0 && <p>No incoming requests.</p>}
    </div>
  );
};

export default Requests;
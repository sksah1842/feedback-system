import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import store from '../stores/feedbackStore.js';
import { Chart } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

import { Bar } from 'react-chartjs-2';

// Register required chart components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

import axios from 'axios';

export default function AdminDashboard() {
  const [fb, setFb] = useState([]);
  const [stats, setStats] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if we have a token
    const token = localStorage.getItem('admin_token');
    if (!token) {
      navigate('/login');
      return;
    }
    
    loadAll();
    setupRealtimeUpdates();
    
    // Cleanup function
    return () => {
      const socket = store.getSocket();
      if (socket) {
        socket.off('new-feedback');
        socket.off('connect');
        socket.off('disconnect');
      }
    };
  }, [navigate]);

  const setupRealtimeUpdates = () => {
    const socket = store.getSocket();
    
    // Check initial connection status
    setIsConnected(socket.connected);
    
    // Listen for connection events
    socket.on('connect', () => {
      console.log('Dashboard: Socket connected');
      setIsConnected(true);
    });
    
    socket.on('disconnect', () => {
      console.log('Dashboard: Socket disconnected');
      setIsConnected(false);
    });
    
    // Listen for new feedback
    socket.on('new-feedback', (newFeedback) => {
      console.log('Dashboard: New feedback received:', newFeedback);
      
      // Add new feedback to the top of the list with a flag
      const feedbackWithFlag = { ...newFeedback, isNew: true };
      setFb(prev => [feedbackWithFlag, ...prev]);
      
      // Update stats in real-time
      updateStatsWithNewFeedback(newFeedback);
      
      // Show a notification
      showNewFeedbackNotification(newFeedback);
      
      // Remove the new flag after animation
      setTimeout(() => {
        setFb(prev => prev.map(f => f._id === newFeedback._id ? { ...f, isNew: false } : f));
      }, 3000);
    });
  };

  const updateStatsWithNewFeedback = (newFeedback) => {
    setStats(prevStats => {
      const newStats = [...prevStats];
      
      // Find if we already have stats for this product
      const existingProductIndex = newStats.findIndex(stat => stat._id === newFeedback.productId);
      
      if (existingProductIndex >= 0) {
        // Update existing product stats
        const existingStat = newStats[existingProductIndex];
        const newTotal = existingStat.total + 1;
        const newAvgRating = ((existingStat.avgRating * existingStat.total) + newFeedback.rating) / newTotal;
        
        newStats[existingProductIndex] = {
          ...existingStat,
          total: newTotal,
          avgRating: newAvgRating
        };
      } else {
        // Add new product stats
        newStats.push({
          _id: newFeedback.productId,
          avgRating: newFeedback.rating,
          total: 1
        });
      }
      
      return newStats;
    });
  };

  const showNewFeedbackNotification = (feedback) => {
    // Create a temporary notification element
    const notification = document.createElement('div');
    notification.className = 'realtime-notification';
    notification.innerHTML = `
      <div class="notification-content">
        <span class="notification-icon">✨</span>
        <div class="notification-text">
          <strong>New feedback received!</strong>
          <span>${feedback.name || 'Anonymous'} rated ${feedback.productId} with ${feedback.rating} stars</span>
        </div>
      </div>
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Remove after 5 seconds
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 5000);
  };

  const loadAll = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const items = await store.getAll();
      setFb(items);
      const s = await store.getStats();
      setStats(s);
    } catch (err) {
      console.error('Load error:', err);
      if (err.response?.status === 401) {
        // Token expired or invalid, clear it and redirect to login
        localStorage.removeItem('admin_token');
        navigate('/login');
      } else {
        setError("Failed to load data: " + (err.response?.data?.message || err.message));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('admin_token');
    navigate('/');
  };

  const chartData = {
    labels: stats.map(s => s._id || 'All Products'),
    datasets: [{
      label: 'Average Rating',
      data: stats.map(s => parseFloat(s.avgRating.toFixed(2))),
      backgroundColor: 'rgba(99, 102, 241, 0.8)',
      borderColor: 'rgba(99, 102, 241, 1)',
      borderWidth: 1
    }]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Average Ratings by Product'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 5
      }
    }
  };

  if (isLoading) {
    return (
      <div className="main-layout">
        <div className="container">
          <div className="loading">
            <div className="loading-spinner"></div>
            <span>Loading dashboard...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="main-layout">
        <div className="container">
          <div className="error">
            <span>⚠️</span>
            <span>{error}</span>
            <button onClick={loadAll} style={{ marginLeft: 'var(--spacing-4)' }}>
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="main-layout">
      <div className="container">
        <div className="admin-container">
          <div className="admin-header">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-6)' }}>
              <div>
                <h1>Admin Dashboard</h1>
                <p>Monitor feedback and analytics</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)', marginTop: 'var(--spacing-2)' }}>
                  <div className={`connection-indicator ${isConnected ? 'connected' : 'disconnected'}`}></div>
                  <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>
                    {isConnected ? 'Real-time connected' : 'Connecting...'}
                  </span>
                </div>
              </div>
              <button 
                onClick={logout}
                style={{
                  backgroundColor: 'var(--danger-color)',
                  color: 'white',
                  padding: 'var(--spacing-3) var(--spacing-6)',
                  border: 'none',
                  borderRadius: 'var(--radius-lg)',
                  cursor: 'pointer',
                  fontSize: 'var(--font-size-sm)',
                  fontWeight: '500',
                  transition: 'all var(--transition-fast)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#dc2626';
                  e.target.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'var(--danger-color)';
                  e.target.style.transform = 'translateY(0)';
                }}
              >
                🚪 Logout
              </button>
            </div>
          </div>

          {/* Main Row: Two Columns */}
          <div className="admin-main-row">
            <div className="admin-main-col admin-main-col-left">
              <div className="admin-stats">
                <div className="stat-card">
                  <div className="stat-number">{fb.length}</div>
                  <div className="stat-label">Total Feedback</div>
                </div>
                <div className="stat-card">
                  <div className="stat-number">
                    {fb.length > 0 ? (fb.reduce((sum, item) => sum + item.rating, 0) / fb.length).toFixed(1) : '0'}
                  </div>
                  <div className="stat-label">Average Rating</div>
                </div>
                <div className="stat-card">
                  <div className="stat-number">
                    {fb.filter(item => item.rating >= 4).length}
                  </div>
                  <div className="stat-label">Positive Reviews (4+ stars)</div>
                </div>
                <div className="stat-card">
                  <div className="stat-number">
                    {new Set(fb.map(item => item.productId)).size}
                  </div>
                  <div className="stat-label">Products Reviewed</div>
                </div>
              </div>
              <div className="admin-chart">
                <Bar data={chartData} options={chartOptions} />
              </div>
            </div>
            <div className="admin-main-col admin-main-col-right">
              <div className="admin-table">
                <h3>Recent Feedback</h3>
                <table>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Product</th>
                      <th>Rating</th>
                      <th>Name</th>
                      <th>Feedback</th>
                    </tr>
                  </thead>
                  <tbody>
                    {fb.map(f => (
                      <tr key={f._id} className={f.isNew ? 'new-feedback-row' : ''}>
                        <td>{new Date(f.createdAt).toLocaleDateString()}</td>
                        <td>{f.productId}</td>
                        <td>
                          <span style={{ color: '#f59e0b' }}>
                            {'★'.repeat(f.rating)}
                            {'☆'.repeat(5 - f.rating)}
                          </span>
                        </td>
                        <td>{f.name || 'Anonymous'}</td>
                        <td style={{ maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {f.text}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

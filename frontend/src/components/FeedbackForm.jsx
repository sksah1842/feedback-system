import { useState } from 'react';
import StarRating from './StarRating.jsx';
import { useNavigate } from 'react-router-dom';
import store from '../stores/feedbackStore.js';

export default function FeedbackForm({ productId = 'default' }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [text, setText] = useState('');
  const [rating, setRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const nav = useNavigate();

  const submit = async e => {
    e.preventDefault();
    if (!text || rating < 1) {
      alert('Please provide both feedback text and a rating');
      return;
    }
    
    setIsSubmitting(true);
    try {
      await store.submit({ productId, name, email, text, rating });
      nav('/thank-you');
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('Failed to submit feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container">
      <div className="card">
        <div className="card-header">
          <h1 className="card-title">Share Your Feedback</h1>
          <p className="card-subtitle">We value your opinion! Help us improve by sharing your experience.</p>
        </div>
        
        <form onSubmit={submit} className="form-container">
          <div className="form-group">
            <label htmlFor="name" className="form-label">Name (Optional)</label>
            <input
              id="name"
              type="text"
              className="form-input"
              placeholder="Enter your name"
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="email" className="form-label">Email (Optional)</label>
            <input
              id="email"
              type="email"
              className="form-input"
              placeholder="Enter your email"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="feedback" className="form-label">Your Feedback *</label>
            <textarea
              id="feedback"
              className="form-input form-textarea"
              placeholder="Tell us about your experience..."
              value={text}
              onChange={e => setText(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <div className="star-rating-label">Rate Your Experience *</div>
            <StarRating rating={rating} onRate={setRating} />
          </div>
          
          <button 
            type="submit" 
            className="form-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
          </button>
        </form>
      </div>
    </div>
  );
}

import { Link } from 'react-router-dom';

export default function ThankYou() {
  return (
    <div className="main-layout">
      <div className="container">
        <div className="thank-you-container">
          <div className="thank-you-icon">✓</div>
          <h1 className="thank-you-title">Thank You!</h1>
          <p className="thank-you-message">
            Your feedback has been submitted successfully. We appreciate you taking the time to share your thoughts with us. Your input helps us improve and provide better experiences for everyone.
          </p>
          <Link to="/" className="thank-you-button">
            Submit More Feedback
          </Link>
        </div>
      </div>
    </div>
  );
}

import FeedbackForm from '../components/FeedbackForm.jsx';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="main-layout">
      <header className="header">
        <div className="container">
          <div className="header-content">
            <Link to="/" className="logo">Feedback System</Link>
            <nav>
              <Link to="/login" style={{ marginLeft: 'var(--spacing-4)' }}>Admin Login</Link>
            </nav>
          </div>
        </div>
      </header>
      <FeedbackForm />
    </div>
  );
}

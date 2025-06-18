export default function StarRating({ rating, onRate }) {
  return (
    <div className="star-rating">
      {[1, 2, 3, 4, 5].map(n => (
        <span 
          key={n} 
          className={`star ${n <= rating ? 'active' : ''}`}
          onClick={() => onRate(n)}
          onMouseEnter={() => {
            // Optional: Add hover preview effect
          }}
          title={`${n} star${n > 1 ? 's' : ''}`}
        >
          ★
        </span>
      ))}
    </div>
  );
}

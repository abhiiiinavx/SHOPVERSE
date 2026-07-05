import { FaStar } from 'react-icons/fa';

const ReviewItem = ({ review }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-4 border border-gray-200 dark:border-gray-700">
      <div className="flex items-start justify-between mb-2">
        <div>
          <h4 className="font-semibold text-gray-900 dark:text-white">{review.user?.name}</h4>
          <p className="text-sm text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</p>
        </div>
        <div className="flex gap-1">
          {[...Array(5)].map((_, i) => (
            <FaStar
              key={i}
              className={i < review.rating ? 'text-yellow-400' : 'text-gray-300'}
            />
          ))}
        </div>
      </div>
      {review.title && (
        <h5 className="font-semibold mb-2 text-gray-900 dark:text-white">{review.title}</h5>
      )}
      <p className="text-gray-700 dark:text-gray-300">{review.comment}</p>
      {review.verified && (
        <span className="inline-block mt-3 px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-semibold">
          ✓ Verified Purchase
        </span>
      )}
    </div>
  );
};

export default ReviewItem;

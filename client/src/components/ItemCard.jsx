import { Link } from 'react-router-dom';

const TypeBadge = ({ type }) => (
  <span className={`text-xs font-bold px-2.5 py-1 rounded-full tracking-wide ${
    type === 'lost'
      ? 'bg-red-50 text-red-600 border border-red-100'
      : 'bg-green-50 text-green-700 border border-green-100'
  }`}>
    {type?.toUpperCase()}
  </span>
);

const StatusBadge = ({ status }) => (
  <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${
    status === 'resolved'
      ? 'bg-gray-100 text-gray-500'
      : 'bg-purple-50 text-purple-700 border border-purple-100'
  }`}>
    {status}
  </span>
);

const ItemCard = ({ item, index = 0 }) => {
  return (
    <Link
      to={`/items/${item._id}`}
      className="block bg-white rounded-2xl shadow-sm border border-gray-100 card-hover overflow-hidden animate-fade-up group"
      style={{ animationDelay: `${index * 0.07}s` }}
    >
      {/* Image */}
      <div className="h-48 bg-gray-50 overflow-hidden relative">
        {item.imageURL && item.imageURL !== '' ? (
          <img
            src={item.imageURL}
            alt={item.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-gray-300 gap-2">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-xs text-gray-400">No image</span>
          </div>
        )}
        {/* Type badge overlay */}
        <div className="absolute top-3 left-3">
          <TypeBadge type={item.type} />
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 text-base leading-snug mb-1 line-clamp-1" style={{ fontFamily: 'Plus Jakarta Sans' }}>
          {item.title}
        </h3>

        <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed mb-3">
          {item.description}
        </p>

        <div className="flex items-center justify-between text-xs text-gray-400 mb-3">
          <span className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {item.location}
          </span>
          <span>
            {item.date ? new Date(item.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : '—'}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <StatusBadge status={item.status} />
          <span className="text-xs text-gray-400 font-medium">{item.category}</span>
        </div>
      </div>
    </Link>
  );
};

export default ItemCard;
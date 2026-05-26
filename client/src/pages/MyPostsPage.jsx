import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';
import ClaimsPanel from '../components/ClaimsPanel';

const MyPostsPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    const fetchMyItems = async () => {
      try {
        const { data } = await api.get('/items/my');
        setItems(data);
      } catch (err) {
        setError('Failed to load your items');
      } finally {
        setLoading(false);
      }
    };
    fetchMyItems();
  }, []);

  const handleDelete = async (itemId) => {
    const confirmed = window.confirm('Are you sure you want to delete this item?');
    if (!confirmed) return;

    setDeletingId(itemId);
    try {
      await api.delete(`/items/${itemId}`);
      setItems((prev) => prev.filter((item) => item._id !== itemId));
      toast.success('Item deleted successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete item');
    } finally {
      setDeletingId(null);
    }
  };

  const activeItems = items.filter((i) => i.status === 'active');
  const resolvedItems = items.filter((i) => i.status === 'resolved');

  if (loading) return (
    <div className="max-w-2xl mx-auto space-y-4">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 flex gap-4 animate-pulse">
          <div className="w-20 h-20 rounded-xl bg-gray-100 shrink-0" />
          <div className="flex-1 space-y-3 py-1">
            <div className="h-4 bg-gray-100 rounded w-1/2" />
            <div className="h-3 bg-gray-100 rounded w-3/4" />
            <div className="h-3 bg-gray-100 rounded w-1/3" />
          </div>
        </div>
      ))}
    </div>
  );

  if (error) return (
    <div className="text-center py-24 text-red-500 text-sm">{error}</div>
  );

  const ItemRow = ({ item }) => (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex gap-4 items-start card-hover animate-fade-up">

      {/* Thumbnail */}
      <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-50 shrink-0 border border-gray-100">
        {item.imageURL && item.imageURL !== '' ? (
          <img src={item.imageURL} alt={item.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start gap-2 mb-1">
          <h3 className="font-bold text-gray-900 truncate text-sm" style={{ fontFamily: 'Plus Jakarta Sans' }}>
            {item.title}
          </h3>
          <div className="flex gap-1.5 shrink-0">
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
              item.type === 'lost'
                ? 'bg-red-50 text-red-600 border border-red-100'
                : 'bg-green-50 text-green-700 border border-green-100'
            }`}>
              {item.type?.toUpperCase()}
            </span>
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
              item.status === 'resolved'
                ? 'bg-gray-100 text-gray-500'
                : 'bg-purple-50 text-purple-700 border border-purple-100'
            }`}>
              {item.status}
            </span>
          </div>
        </div>

        <p className="text-xs text-gray-500 line-clamp-1 mb-2">{item.description}</p>

        <div className="flex gap-3 text-xs text-gray-400 mb-3">
          <span className="flex items-center gap-1">
            <svg className="w-3 h-3 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            </svg>
            {item.location}
          </span>
          <span>· {item.category}</span>
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <Link
            to={`/items/${item._id}`}
            className="text-xs font-semibold text-purple-600 hover:text-purple-800 transition-colors flex items-center gap-1"
          >
            View →
          </Link>
          <button
            onClick={() => handleDelete(item._id)}
            disabled={deletingId === item._id}
            className="text-xs font-semibold text-red-400 hover:text-red-600 transition-colors disabled:opacity-50"
          >
            {deletingId === item._id ? 'Deleting...' : 'Delete'}
          </button>
        </div>
        {/* Claims panel — add this right here */}
        <ClaimsPanel itemId={item._id} itemStatus={item.status} />
      </div>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto animate-fade-up">

      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900" style={{ fontFamily: 'Plus Jakarta Sans' }}>
            My Posts
          </h1>
          <p className="text-sm text-gray-400 mt-0.5">
            {items.length} {items.length === 1 ? 'item' : 'items'} posted
            {resolvedItems.length > 0 && ` · ${resolvedItems.length} resolved`}
          </p>
        </div>
        <Link
          to="/post-item"
          className="btn-primary text-sm font-bold px-4 py-2.5 rounded-xl"
        >
          + Post Item
        </Link>
      </div>

      {/* Empty state */}
      {items.length === 0 && (
        <div className="text-center py-24 animate-fade-in">
          <div className="text-5xl mb-4">📭</div>
          <p className="font-semibold text-gray-600">No items posted yet</p>
          <p className="text-sm text-gray-400 mt-1 mb-6">Start by reporting a lost or found item</p>
          <Link
            to="/post-item"
            className="btn-primary inline-block text-sm font-bold px-6 py-2.5 rounded-xl"
          >
            Post Your First Item
          </Link>
        </div>
      )}

      {/* Active items */}
      {activeItems.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-2 h-2 rounded-full bg-purple-500" />
            <h2 className="text-sm font-bold text-gray-600 uppercase tracking-wider">
              Active · {activeItems.length}
            </h2>
          </div>
          <div className="flex flex-col gap-3">
            {activeItems.map((item) => (
              <ItemRow key={item._id} item={item} />
            ))}
          </div>
        </div>
      )}

      {/* Resolved items */}
      {resolvedItems.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <span className="w-2 h-2 rounded-full bg-gray-400" />
            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider">
              Resolved · {resolvedItems.length}
            </h2>
          </div>
          <div className="flex flex-col gap-3 opacity-75">
            {resolvedItems.map((item) => (
              <ItemRow key={item._id} item={item} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MyPostsPage;
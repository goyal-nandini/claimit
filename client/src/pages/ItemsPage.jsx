import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import ItemCard from '../components/ItemCard';

const categories = ['Electronics', 'Clothing', 'Books', 'Accessories', 'Other'];

const ItemsPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  const fetchItems = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = {};
      if (search) params.search = search;
      if (typeFilter) params.type = typeFilter;
      if (categoryFilter) params.category = categoryFilter;
      const { data } = await api.get('/items', { params });
      setItems(data);
    } catch (err) {
      setError('Failed to load items');
    } finally {
      setLoading(false);
    }
  }, [search, typeFilter, categoryFilter]);

  useEffect(() => {
    const debounce = setTimeout(() => { fetchItems(); }, 400);
    return () => clearTimeout(debounce);
  }, [fetchItems]);

  const hasFilters = search || typeFilter || categoryFilter;

  return (
    <div className="animate-fade-up">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900" style={{ fontFamily: 'Plus Jakarta Sans' }}>
          Lost & Found
        </h1>
        <p className="text-gray-500 text-sm mt-1">Browse all reported lost and found items on campus</p>
      </div>

      {/* Search + Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search by title, description, location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent bg-white transition"
          />
        </div>

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 bg-white text-gray-700 transition"
        >
          <option value="">All Types</option>
          <option value="lost">Lost</option>
          <option value="found">Found</option>
        </select>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 bg-white text-gray-700 transition"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        {hasFilters && (
          <button
            onClick={() => { setSearch(''); setTypeFilter(''); setCategoryFilter(''); }}
            className="text-sm text-purple-600 hover:text-purple-800 font-medium whitespace-nowrap transition-colors"
          >
            Clear ×
          </button>
        )}
      </div>

      {/* Count */}
      {!loading && (
        <p className="text-sm text-gray-400 mb-5">
          Showing <span className="font-semibold text-gray-700">{items.length}</span> {items.length === 1 ? 'item' : 'items'}
          {hasFilters && ' matching your filters'}
        </p>
      )}

      {/* Loading skeletons */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-pulse">
              <div className="h-48 bg-gray-100" />
              <div className="p-4 space-y-3">
                <div className="h-4 bg-gray-100 rounded w-3/4" />
                <div className="h-3 bg-gray-100 rounded w-full" />
                <div className="h-3 bg-gray-100 rounded w-2/3" />
              </div>
            </div>
          ))}
        </div>
      )}

      {error && (
        <div className="text-center py-20 text-red-500 text-sm">{error}</div>
      )}

      {/* Empty state */}
      {!loading && !error && items.length === 0 && (
        <div className="text-center py-24 animate-fade-in">
          <div className="text-6xl mb-4">🔍</div>
          <p className="text-gray-700 font-semibold text-lg mb-1">No items found</p>
          <p className="text-gray-400 text-sm mb-6">Try adjusting your search or filters</p>
          <Link
            to="/post-item"
            className="btn-primary inline-block text-sm font-bold px-6 py-2.5 rounded-xl"
          >
            Report an Item
          </Link>
        </div>
      )}

      {/* Items grid */}
      {!loading && !error && items.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item, i) => (
            <ItemCard key={item._id} item={item} index={i} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ItemsPage;
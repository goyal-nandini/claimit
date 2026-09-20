import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center text-center px-4 animate-fade-up">

      {/* Big 404 */}
      <div className="relative mb-6">
        <p className="text-[120px] font-extrabold text-purple-50 leading-none select-none" style={{ fontFamily: 'Plus Jakarta Sans' }}>
          404
        </p>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-5xl">🔍</span>
        </div>
      </div>

      <h1 className="text-2xl font-extrabold text-gray-900 mb-2" style={{ fontFamily: 'Plus Jakarta Sans' }}>
        Page Not Found
      </h1>
      <p className="text-gray-500 text-sm max-w-xs leading-relaxed mb-8">
        Looks like this page got lost on campus too. Let's get you back to something familiar.
      </p>

      <div className="flex gap-3 flex-wrap justify-center">
        <Link
          to="/"
          className="btn-primary text-sm font-bold px-6 py-2.5 rounded-xl"
        >
          Back to Home
        </Link>
        <Link
          to="/post-item"
          className="btn-outline text-sm font-bold px-6 py-2.5 rounded-xl"
        >
          Report an Item
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
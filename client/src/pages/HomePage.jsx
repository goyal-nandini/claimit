import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import ItemCard from "../components/ItemCard.jsx";

const StepCard = ({ number, icon, title, desc, delay }) => (
  <div
    className={`flex flex-col items-center text-center animate-fade-up ${delay}`}
  >
    <div
      className="w-12 h-12 rounded-2xl bg-purple-600 text-white flex items-center justify-center text-lg font-bold mb-4 shadow-lg shadow-purple-200"
      style={{ fontFamily: "Plus Jakarta Sans" }}
    >
      {number}
    </div>
    <div className="text-2xl mb-3">{icon}</div>
    <h3
      className="font-bold text-gray-900 mb-1"
      style={{ fontFamily: "Plus Jakarta Sans" }}
    >
      {title}
    </h3>
    <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
  </div>
);

const StatItem = ({ value, label, loading }) => (
  <div className="flex flex-col items-center py-4">
    <span
      className="text-3xl font-extrabold text-purple-600 mb-1"
      style={{ fontFamily: "Plus Jakarta Sans" }}
    >
      {loading ? "—" : value}
    </span>
    <span className="text-xs text-gray-500 font-medium text-center">
      {label}
    </span>
  </div>
);

const HomePage = () => {
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [recentItems, setRecentItems] = useState([]);
  const [recentLoading, setRecentLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get("/items/stats");
        setStats(data);
      } catch (err) {
        // silently fail — stats are non-critical
      } finally {
        setStatsLoading(false);
      }
    };

    const fetchRecent = async () => {
      try {
        const { data } = await api.get("/items");
        setRecentItems(data.slice(0, 6));
      } catch (err) {
        // silently fail
      } finally {
        setRecentLoading(false);
      }
    };

    fetchStats();
    fetchRecent();
  }, []);

  return (
    <div>
      {/*  Hero  */}
      <section className="bg-gradient-to-br from-purple-50 via-violet-50 to-indigo-50 -mx-4 sm:-mx-6 px-4 sm:px-6 py-16 border-b border-purple-100">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-up">
            {/* <span className="inline-block text-xs font-bold text-purple-600 bg-purple-100 px-3 py-1 rounded-full mb-4 tracking-wider uppercase">
              Campus Lost & Found
            </span> */}
            <h1
              className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-tight mb-4"
              style={{ fontFamily: "Plus Jakarta Sans" }}
            >
              Find What's Lost.
               <br /> 
              <span className="text-purple-600">Return What's Found.</span> 
            </h1>
            <p className="text-gray-500 text-lg leading-relaxed mb-8">
              Report, search and reconnect with lost belongings.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/items"
                className="btn-primary font-semibold px-6 py-3 rounded-xl text-sm"
              >
                Browse Items
              </Link>
              <Link
                to="/post-item"
                className="btn-outline font-semibold px-6 py-3 rounded-xl text-sm"
              >
                Report Item
              </Link>
            </div>
          </div>
          <div className="animate-fade-up delay-200 hidden md:block">
            <div className="hidden md:flex justify-center items-center animate-fade-up delay-200">
              <img
                src="https://plus.unsplash.com/premium_vector-1720891748672-f7e8abfee4ca?q=80&w=1267&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Lost and found"
                className="w-full max-w-md rounded-3xl shadow-2xl object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/*  Stats Bar  */}
      <section className="bg-white border-b border-gray-100 -mx-4 sm:-mx-6 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-4 divide-x divide-gray-100">
          <StatItem
            value={`${stats?.totalItems ?? 0}+`}
            label="Items Reported"
            loading={statsLoading}
          />
          <StatItem
            value={`${stats?.resolvedItems ?? 0}+`}
            label="Items Resolved"
            loading={statsLoading}
          />
          <StatItem
            value={`${stats?.totalUsers ?? 0}+`}
            label="Students Helped"
            loading={statsLoading}
          />
          <StatItem
            value={`${stats?.totalClaims ?? 0}+`}
            label="Claims Made"
            loading={statsLoading}
          />
        </div>
      </section>

      {/*  How It Works  */}
      <section className="py-16" id="how-it-works">
        <div className="text-center mb-10 animate-fade-up">
          <h2
            className="text-2xl font-bold text-gray-900"
            style={{ fontFamily: "Plus Jakarta Sans" }}
          >
            How It Works
          </h2>
          <p className="text-gray-500 text-sm mt-2">
            Three simple steps to reunite with your belongings
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          <StepCard
            number="1"
            icon="📋"
            title="Report Item"
            desc="Post a lost or found item with details and a photo"
            delay="delay-100"
          />
          <StepCard
            number="2"
            icon="🔍"
            title="Find Matches"
            desc="Search and filter through reported items on campus"
            delay="delay-200"
          />
          <StepCard
            number="3"
            icon="🤝"
            title="Claim Securely"
            desc="Submit a claim and connect with the item owner"
            delay="delay-300"
          />
        </div>
      </section>

      {/*  Recent Items  */}
      <section className="py-8">
        <div className="flex justify-between items-end mb-6">
          <div>
            <h2
              className="text-xl font-bold text-gray-900"
              style={{ fontFamily: "Plus Jakarta Sans", color: "#1E1B4B" }}
            >
              Recently Reported
            </h2>
            <p className="text-sm text-gray-400 mt-0.5">
              Latest lost and found items from campus
            </p>
          </div>
          <Link
            to="/items"
            className="text-sm font-semibold text-purple-600 hover:text-purple-800 transition-colors whitespace-nowrap"
          >
            View all →
          </Link>
        </div>

        {recentLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-pulse"
              >
                <div className="h-48 bg-gray-100" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-100 rounded w-3/4" />
                  <div className="h-3 bg-gray-100 rounded w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : recentItems.length === 0 ? (
          <div className="text-center py-16 text-gray-400 text-sm">
            No items reported yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentItems.map((item, i) => (
              <ItemCard key={item._id} item={item} index={i} />
            ))}
          </div>
        )}

        {recentItems.length > 0 && (
          <div className="text-center mt-8">
            <Link
              to="/items"
              className="btn-outline inline-block font-semibold px-8 py-3 rounded-xl text-sm"
            >
              View All Items →
            </Link>
          </div>
        )}
      </section>

      {/*  CTA Banner  */}
      <section
        className="mt-16 -mx-4 sm:-mx-6 px-4 sm:px-6 py-16 text-center"
        style={{ backgroundColor: "#7C3AED" }}
      >
        <h2
          className="text-3xl font-extrabold text-white mb-3"
          style={{ fontFamily: "Plus Jakarta Sans" }}
        >
          Lost something on campus?
        </h2>
        <p className="text-purple-200 mb-8 text-sm leading-relaxed max-w-md mx-auto">
          Report it now and let the community help you find it.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Link
            to="/post-item"
            className="bg-white text-purple-700 font-bold px-6 py-3 rounded-xl text-sm hover:bg-purple-50 transition-colors"
          >
            Report Lost Item
          </Link>
          <Link
            to="/items"
            className="border-2 border-white text-white font-bold px-6 py-3 rounded-xl text-sm hover:bg-white hover:text-purple-700 transition-colors"
          >
            Browse Found Items
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

const StatusBadge = ({ status }) => {
  const styles = {
    pending: "bg-amber-50 text-amber-600 border border-amber-100",
    approved: "bg-green-50 text-green-700 border border-green-100",
    rejected: "bg-red-50 text-red-600 border border-red-100",
  };
  const icons = {
    pending: "⏳",
    approved: "✅",
    rejected: "❌",
  };
  return (
    <span
      className={`text-xs font-bold px-2.5 py-1 rounded-full ${styles[status]}`}
    >
      {icons[status]} {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

const MyClaimsPage = () => {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMyClaims = async () => {
      try {
        const { data } = await api.get("/claims/my/all");
        setClaims(data);
      } catch (err) {
        setError("Failed to load your claims");
      } finally {
        setLoading(false);
      }
    };
    fetchMyClaims();
  }, []);

  const pending = claims.filter((c) => c.status === "pending");
  const approved = claims.filter((c) => c.status === "approved");
  const rejected = claims.filter((c) => c.status === "rejected");

  if (loading)
    return (
      <div className="max-w-2xl mx-auto space-y-4">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl border border-gray-100 p-5 flex gap-4 animate-pulse"
          >
            <div className="w-16 h-16 rounded-xl bg-gray-100 shrink-0" />
            <div className="flex-1 space-y-3 py-1">
              <div className="h-4 bg-gray-100 rounded w-1/2" />
              <div className="h-3 bg-gray-100 rounded w-1/3" />
            </div>
          </div>
        ))}
      </div>
    );

  if (error)
    return (
      <div className="text-center py-24 text-red-500 text-sm">{error}</div>
    );

  const ClaimRow = ({ claim }) => (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex gap-4 items-center animate-fade-up">
      {/* Item thumbnail */}
      <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 shrink-0">
        {claim.item?.imageURL && claim.item.imageURL !== "" ? (
          <img
            src={claim.item.imageURL}
            alt={claim.item.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300 text-xl">
            📦
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p
          className="font-bold text-gray-900 text-sm truncate"
          style={{ fontFamily: "Plus Jakarta Sans" }}
        >
          {claim.item?.title ?? "Item deleted"}
        </p>
        <div className="flex gap-2 mt-0.5 text-xs text-gray-400 flex-wrap">
          <span>📍 {claim.item?.location}</span>
          <span>·</span>
          <span
            className={`font-medium ${claim.item?.type === "lost" ? "text-red-500" : "text-green-600"}`}
          >
            {claim.item?.type?.toUpperCase()}
          </span>
        </div>
        <div className="flex items-center gap-3 mt-2">
          <StatusBadge status={claim.status} />
          {claim.status === "approved" && claim.item?.postedBy && (
            <div className="mt-2 bg-green-50 border border-green-100 rounded-xl px-3 py-2.5">
              <p className="text-xs font-bold text-green-700 mb-1">
                ✅ Claim approved — contact the owner to collect your item
              </p>
              <p className="text-xs text-gray-700 font-medium">
                👤 {claim.item.postedBy.name}
              </p>
              <a
                href={`mailto:${claim.item.postedBy.email}`}
                className="text-xs text-purple-600 font-semibold hover:underline"
              >
                ✉️ {claim.item.postedBy.email}
              </a>
            </div>
          )}
          {/* {claim.item?.status === 'resolved' && claim.status === 'approved' && (
            <span className="text-xs text-green-600 font-medium">· Item returned to owner</span>
          )} */}
        </div>
      </div>

      {/* View link */}
      {claim.item?._id && (
        <Link
          to={`/items/${claim.item._id}`}
          className="text-xs font-semibold text-purple-600 hover:text-purple-800 transition-colors shrink-0"
        >
          View →
        </Link>
      )}
    </div>
  );

  const Section = ({ title, dot, items }) =>
    items.length > 0 && (
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <span className={`w-2 h-2 rounded-full ${dot}`} />
          <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider">
            {title} · {items.length}
          </h2>
        </div>
        <div className="flex flex-col gap-3">
          {items.map((claim) => (
            <ClaimRow key={claim._id} claim={claim} />
          ))}
        </div>
      </div>
    );

  return (
    <div className="max-w-2xl mx-auto animate-fade-up">
      {/* Header */}
      <div className="mb-8">
        <h1
          className="text-2xl font-extrabold text-gray-900"
          style={{ fontFamily: "Plus Jakarta Sans" }}
        >
          My Claims
        </h1>
        <p className="text-sm text-gray-400 mt-0.5">
          {claims.length} {claims.length === 1 ? "claim" : "claims"} submitted
        </p>
      </div>

      {/* Empty state */}
      {claims.length === 0 && (
        <div className="text-center py-24 animate-fade-in">
          <div className="text-5xl mb-4">🙋</div>
          <p className="font-semibold text-gray-600">No claims yet</p>
          <p className="text-sm text-gray-400 mt-1 mb-6">
            Browse items and claim what belongs to you
          </p>
          <Link
            to="/items"
            className="btn-primary inline-block text-sm font-bold px-6 py-2.5 rounded-xl"
          >
            Browse Items
          </Link>
        </div>
      )}

      {/* Grouped sections */}
      <Section title="Pending" dot="bg-amber-400" items={pending} />
      <Section title="Approved" dot="bg-green-500" items={approved} />
      <Section title="Rejected" dot="bg-red-400" items={rejected} />
    </div>
  );
};

export default MyClaimsPage;

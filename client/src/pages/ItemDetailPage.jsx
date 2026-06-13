import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const DetailRow = ({ icon, label, value }) => (
  <div className="flex items-start gap-3">
    <span className="text-lg">{icon}</span>
    <div>
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
        {label}
      </p>
      <p className="text-sm font-medium text-gray-800 mt-0.5">{value}</p>
    </div>
  </div>
);

const ItemDetailPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [lightbox, setLightbox] = useState(false);

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [claiming, setClaiming] = useState(false);
  const [claimSuccess, setClaimSuccess] = useState("");
  const [claimError, setClaimError] = useState("");

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const { data } = await api.get(`/items/${id}`);
        setItem(data);
      } catch (err) {
        setError("Item not found");
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [id]);

  const handleClaim = async () => {
    setClaimError("");
    setClaimSuccess("");
    setClaiming(true);
    try {
      await api.post(`/claims/${id}`);
      setClaimSuccess("Claim submitted! The owner will review your request.");
    } catch (err) {
      setClaimError(err.response?.data?.message || "Failed to submit claim");
    } finally {
      setClaiming(false);
    }
  };

  if (loading)
    return (
      <div className="max-w-2xl mx-auto animate-pulse">
        <div className="h-72 bg-gray-100 rounded-2xl mb-6" />
        <div className="space-y-4">
          <div className="h-6 bg-gray-100 rounded w-1/2" />
          <div className="h-4 bg-gray-100 rounded w-full" />
          <div className="h-4 bg-gray-100 rounded w-2/3" />
        </div>
      </div>
    );

  if (error)
    return (
      <div className="text-center py-24 animate-fade-in">
        <div className="text-5xl mb-4">😕</div>
        <p className="text-gray-600 font-medium">{error}</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 text-sm text-purple-600 hover:underline"
        >
          Go back
        </button>
      </div>
    );

  const isOwner = user && item && item.postedBy._id === user._id;
  const isLoggedIn = !!user;
  const isResolved = item?.status === "resolved";

  return (
    <div className="max-w-2xl mx-auto animate-fade-up">
      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-purple-600 transition-colors mb-6 group"
      >
        <span className="group-hover:-translate-x-0.5 transition-transform">
          ←
        </span>{" "}
        Back
      </button>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Image */}
        {/* {item.imageURL && item.imageURL !== '' ? (
          <img src={item.imageURL} alt={item.title} className="w-full h-72 object-cover" />
        ) : (
          <div className="w-full h-72 bg-gradient-to-br from-purple-50 to-indigo-50 flex flex-col items-center justify-center text-gray-300 gap-3">
            <svg className="w-14 h-14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-sm text-gray-400">No image provided</span>
          </div>
        )} */}
        {item.imageURL && item.imageURL !== "" ? (
          <>
            <img
              src={item.imageURL}
              alt={item.title}
              onClick={() => setLightbox(true)}
              className="w-full h-72 object-cover cursor-zoom-in transition-opacity hover:opacity-90"
            />
            {/* Lightbox overlay */}
            {lightbox && (
              <div
                className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4 animate-fade-in"
                onClick={() => setLightbox(false)}
              >
                <div className="relative max-w-3xl w-full">
                  <img
                    src={item.imageURL}
                    alt={item.title}
                    className="w-full max-h-[85vh] object-contain rounded-xl shadow-2xl"
                  />
                  <button
                    onClick={() => setLightbox(false)}
                    className="absolute top-3 right-3 w-8 h-8 bg-black bg-opacity-50 text-white rounded-full flex items-center justify-center hover:bg-opacity-80 transition text-lg"
                  >
                    ×
                  </button>
                  <p className="text-center text-white text-xs mt-3 opacity-60">
                    Click anywhere to close
                  </p>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="w-full h-72 bg-gradient-to-br from-purple-50 to-indigo-50 flex flex-col items-center justify-center text-gray-300 gap-3">
            <svg
              className="w-14 h-14"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span className="text-sm text-gray-400">No image provided</span>
          </div>
        )}

{/* Why cursor-zoom-in? It signals to the user that clicking will zoom in — standard UX pattern used by Twitter, LinkedIn, every e-commerce site.
Why click overlay to close? Reduces friction. User doesn't have to find the X button — just click anywhere outside. */}

        <div className="p-6 sm:p-8">
          {/* Title + badges */}
          <div className="flex justify-between items-start gap-3 mb-6">
            <h1
              className="text-2xl font-extrabold text-gray-900 leading-tight"
              style={{ fontFamily: "Plus Jakarta Sans" }}
            >
              {item.title}
            </h1>
            <div className="flex flex-col items-end gap-2 shrink-0">
              <span
                className={`text-xs font-bold px-3 py-1 rounded-full border ${
                  item.type === "lost"
                    ? "bg-red-50 text-red-600 border-red-100"
                    : "bg-green-50 text-green-700 border-green-100"
                }`}
              >
                {item.type?.toUpperCase()}
              </span>
              <span
                className={`text-xs font-medium px-3 py-0.5 rounded-full ${
                  isResolved
                    ? "bg-gray-100 text-gray-500"
                    : "bg-purple-50 text-purple-700 border border-purple-100"
                }`}
              >
                {item.status}
              </span>
            </div>
          </div>

          {/* Details grid */}
          <div className="grid grid-cols-2 gap-5 mb-6 p-5 bg-gray-50 rounded-xl">
            <DetailRow icon="📁" label="Category" value={item.category} />
            <DetailRow icon="📍" label="Location" value={item.location} />
            <DetailRow
              icon="📅"
              label="Date"
              value={
                item.date
                  ? new Date(item.date).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })
                  : "—"
              }
            />
            <DetailRow
              icon="👤"
              label="Posted by"
              value={item.postedBy?.name}
            />
          </div>

          {/* Description */}
          <div className="mb-8">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
              Description
            </p>
            <p className="text-sm text-gray-700 leading-relaxed">
              {item.description}
            </p>
          </div>

          {/* Claim section */}
          {isResolved && (
            <div className="bg-gray-50 border border-gray-200 rounded-xl px-5 py-4 text-center">
              <p className="text-sm font-semibold text-gray-500">
                ✅ This item has been resolved
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Someone successfully claimed this item
              </p>
            </div>
          )}

          {!isResolved && isOwner && (
            <div className="bg-purple-50 border border-purple-100 rounded-xl px-5 py-4 text-center">
              <p className="text-sm font-semibold text-purple-700">
                🏷️ This is your posted item
              </p>
              <p className="text-xs text-purple-500 mt-1">
                You'll be notified when someone claims it
              </p>
            </div>
          )}

          {!isResolved && !isOwner && !isLoggedIn && (
            <button
              onClick={() => navigate("/login")}
              className="btn-primary w-full py-3 rounded-xl font-bold text-sm"
            >
              Login to Claim This Item
            </button>
          )}

          {!isResolved && !isOwner && isLoggedIn && (
            <div>
              {claimSuccess && (
                <div className="bg-green-50 border border-green-100 text-green-700 px-4 py-3 rounded-xl mb-4 text-sm flex items-center gap-2">
                  <span>✅</span> {claimSuccess}
                </div>
              )}
              {claimError && (
                <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl mb-4 text-sm flex items-center gap-2">
                  <span>⚠️</span> {claimError}
                </div>
              )}
              <button
                onClick={handleClaim}
                disabled={claiming || !!claimSuccess}
                className="btn-primary w-full py-3 rounded-xl font-bold text-sm disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
              >
                {claiming ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg
                      className="animate-spin w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                    Submitting...
                  </span>
                ) : claimSuccess ? (
                  "✅ Claim Submitted"
                ) : (
                  "🙋 Claim This Item"
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ItemDetailPage;

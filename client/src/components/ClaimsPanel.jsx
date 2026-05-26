import { useState, useEffect } from "react";
import api from "../services/api";
import toast from "react-hot-toast";

const ClaimsPanel = ({ itemId, itemStatus }) => {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actioningId, setActioningId] = useState(null);

  useEffect(() => {
    const fetchClaims = async () => {
      try {
        const { data } = await api.get(`/claims/${itemId}`);
        setClaims(data);
      } catch (err) {
        toast.error("Failed to load claims");
      } finally {
        setLoading(false);
      }
    };
    fetchClaims();
  }, [itemId]);

  //   const handleAction = async (claimId, action) => {
  //     setActioningId(claimId);
  //     try {
  //       await api.put(`/claims/${claimId}/${action}`);
  //       setClaims((prev) =>
  //         prev.map((c) =>
  //           c._id === claimId
  //             ? { ...c, status: action === "approve" ? "approved" : "rejected" }
  //             : c,
  //         ),
  //       );
  //       toast.success(
  //         `Claim ${action === "approve" ? "approved" : "rejected"} successfully`,
  //       );
  //     } catch (err) {
  //       toast.error(err.response?.data?.message || "Action failed");
  //     } finally {
  //       setActioningId(null);
  //     }
  //   };
  const handleAction = async (claimId, action) => {
    const label = action === "approve" ? "approve" : "reject";
    const confirmed = window.confirm(
      `Are you sure you want to ${label} this claim? This action cannot be undone.`,
    );
    if (!confirmed) return;

    setActioningId(claimId);
    try {
      await api.put(`/claims/${claimId}/${action}`);
      setClaims((prev) =>
        prev.map((c) =>
          c._id === claimId
            ? { ...c, status: action === "approve" ? "approved" : "rejected" }
            : c,
        ),
      );
      toast.success(`Claim ${label}d successfully`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Action failed");
    } finally {
      setActioningId(null);
    }
  };

  if (loading)
    return (
      <div className="mt-3 pt-3 border-t border-gray-100">
        <div className="animate-pulse h-4 bg-gray-100 rounded w-1/3" />
      </div>
    );

  if (claims.length === 0)
    return (
      <div className="mt-3 pt-3 border-t border-gray-100">
        <p className="text-xs text-gray-400 italic">No claims yet</p>
      </div>
    );

  return (
    <div className="mt-3 pt-3 border-t border-gray-100">
      <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
        Claims · {claims.length}
      </p>

      <div className="flex flex-col gap-2">
        {claims.map((claim) => (
          <div
            key={claim._id}
            className="flex items-center justify-between bg-gray-50 rounded-xl px-3 py-2.5"
          >
            {/* Claimant info */}
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-purple-100 text-purple-700 text-xs font-bold flex items-center justify-center shrink-0">
                {claim.claimedBy?.name?.[0]?.toUpperCase() ?? "?"}
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-800">
                  {claim.claimedBy?.name}
                </p>
                <p className="text-xs text-gray-400">
                  {claim.claimedBy?.email}
                </p>
              </div>
            </div>

            {/* Status or action buttons */}
            <div className="shrink-0">
              {claim.status === "pending" && itemStatus !== "resolved" ? (
                <div className="flex gap-1.5">
                  <button
                    onClick={() => handleAction(claim._id, "approve")}
                    disabled={actioningId === claim._id}
                    className="text-xs font-bold px-3 py-1.5 rounded-lg bg-green-500 text-white hover:bg-green-600 transition-colors disabled:opacity-50"
                  >
                    {actioningId === claim._id ? "..." : "Approve"}
                  </button>
                  <button
                    onClick={() => handleAction(claim._id, "reject")}
                    disabled={actioningId === claim._id}
                    className="text-xs font-bold px-3 py-1.5 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-colors disabled:opacity-50"
                  >
                    {actioningId === claim._id ? "..." : "Reject"}
                  </button>
                </div>
              ) : (
                <span
                  className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                    claim.status === "approved"
                      ? "bg-green-50 text-green-700 border border-green-100"
                      : claim.status === "rejected"
                        ? "bg-red-50 text-red-600 border border-red-100"
                        : "bg-amber-50 text-amber-600 border border-amber-100"
                  }`}
                >
                  {claim.status}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClaimsPanel;

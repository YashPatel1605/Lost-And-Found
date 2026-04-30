import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAllItems,
  deleteItem,
  markItemAsClaimed,
} from "../authApi/authApi";
import { toast } from "react-toastify";
import Footer from "../Footer/Footer";

const myPostsStore = {
  userId: null,
  items: null,
  promise: null,
};

export default function MyPosts() {
  const [items, setItems] = useState([]);
  const [claimingItemId, setClaimingItemId] = useState(null);
  const claimingItemsRef = useRef(new Set());
  const navigate = useNavigate();

  const fetchItems = async (userId, forceRefresh = false) => {
    try {
      if (
        !forceRefresh &&
        myPostsStore.userId === userId &&
        Array.isArray(myPostsStore.items)
      ) {
        setItems(myPostsStore.items);
        return;
      }

      if (!forceRefresh && myPostsStore.userId === userId && myPostsStore.promise) {
        const cachedItems = await myPostsStore.promise;
        setItems(cachedItems);
        return;
      }

      myPostsStore.userId = userId;
      myPostsStore.promise = getAllItems().then((res) => {
        const data = res?.data?.data?.items || res?.data?.data || res?.data || [];
        const allItems = Array.isArray(data) ? data : [];

        const myItems = allItems.filter((item) => {
          return String(item.userId) === String(userId);
        });

        myPostsStore.items = myItems;
        return myItems;
      });

      const myItems = await myPostsStore.promise;

      setItems(myItems);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load items");
      setItems([]);
      myPostsStore.items = null;
    }
    finally {
      myPostsStore.promise = null;
    }
  };

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      toast.error("Please login to see your posts");
      navigate("/");
      return;
    }
    fetchItems(userId);
  }, [navigate]);

  // DELETE ITEM
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;

    try {
      await deleteItem(id);
      toast.success("Item deleted successfully");
      setItems((prev) => {
        const updatedItems = prev.filter((item) => item._id !== id);
        myPostsStore.items = updatedItems;
        return updatedItems;
      });
    } catch (error) {
      console.error(error);
      toast.error("Delete failed");
    }
  };

  // EDIT NAVIGATION
  const handleEdit = (id) => {
    navigate(`/edit-item/${id}`);
  };

  const handleMakeAsClaim = async (id) => {
    const currentItem = items.find((item) => item._id === id);

    if (currentItem?.find || claimingItemsRef.current.has(id)) {
      return;
    }

    try {
      claimingItemsRef.current.add(id);
      setClaimingItemId(id);
      await markItemAsClaimed(id, true);

      setItems((prevItems) => {
        const updatedItems = prevItems.map((item) =>
          item._id === id
            ? {
                ...item,
                find: true,
                status: "CLAIMED",
                itemStatus: "CLAIMED",
              }
            : item,
        );

        myPostsStore.items = updatedItems;
        return updatedItems;
      });

      toast.success("Item marked as claimed");
    } catch (error) {
      console.error(error);
      toast.error(
        error?.response?.data?.message || "Failed to mark item as claimed",
      );
    } finally {
      claimingItemsRef.current.delete(id);
      setClaimingItemId(null);
    }
  };

  const getDisplayStatus = (item) => {
    if (item.find || item.status === "CLAIMED" || item.itemStatus === "CLAIMED") {
      return {
        label: "CLAIMED",
        className: "bg-blue-100 text-blue-700",
      };
    }

    const baseStatus = (
      item.itemStatus ||
      item.status ||
      item.type ||
      "PENDING"
    ).toUpperCase();

    if (baseStatus === "LOST") {
      return {
        label: "LOST",
        className: "bg-red-100 text-red-700",
      };
    }

    if (baseStatus === "FOUND") {
      return {
        label: "FOUND",
        className: "bg-green-100 text-green-700",
      };
    }

    return {
      label: baseStatus,
      className: "bg-yellow-100 text-yellow-700",
    };
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            My Posts
          </h1>
          <p className="text-gray-500 text-sm">
            Manage all items you've reported.
          </p>
        </div>

        <button
          onClick={() => navigate("/report")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg w-full md:w-auto"
        >
          + New Report
        </button>
      </div>

      {/* DESKTOP TABLE */}
      <div className="hidden md:block bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-100 text-gray-600 text-sm uppercase">
            <tr>
              <th className="p-4">Item</th>
              <th className="p-4">Type</th>
              <th className="p-4">Date</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {Array.isArray(items) && items.length > 0 ? (
              items.map((item) => {
                const displayStatus = getDisplayStatus(item);

                return (
                <tr key={item._id} className="border-t">
                  <td className="p-4 flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                      📦
                    </div>
                    <span className="font-medium">
                      {item.itemTitle || item.title || "No Title"}
                    </span>
                  </td>

                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        item.type === "lost"
                          ? "bg-red-100 text-red-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {item.type || "N/A"}
                    </span>
                  </td>

                  <td className="p-4 text-gray-600">
                    {item.createdAt
                      ? new Date(item.createdAt).toLocaleDateString()
                      : "N/A"}
                  </td>

                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${displayStatus.className}`}>
                      {displayStatus.label}
                    </span>
                  </td>

                  <td className="p-4 flex justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleMakeAsClaim(item._id)}
                      disabled={item.find || claimingItemId === item._id}
                      className={`px-3 py-1 rounded-md text-sm font-medium transition ${
                        item.find
                          ? "bg-emerald-100 text-emerald-700 cursor-not-allowed"
                          : claimingItemId === item._id
                            ? "bg-blue-300 text-white cursor-wait"
                            : "bg-blue-600 text-white hover:bg-blue-700"
                      }`}
                    >
                      {item.find
                        ? "Claimed"
                        : claimingItemId === item._id
                          ? "Claiming..."
                          : "Make as Claim"}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleEdit(item._id)}
                      className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-md text-sm hover:bg-yellow-200"
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(item._id)}
                      className="bg-red-100 text-red-600 px-3 py-1 rounded-md text-sm hover:bg-red-200"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="5" className="text-center p-6 text-gray-500">
                  No items found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* MOBILE CARDS */}
      <div className="md:hidden space-y-4">
        {Array.isArray(items) && items.length > 0 ? (
          items.map((item) => {
            const displayStatus = getDisplayStatus(item);

            return (
            <div
              key={item._id}
              className="bg-white rounded-xl shadow p-4 space-y-3"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                  📦
                </div>
                <h2 className="font-semibold text-gray-800">
                  {item.itemTitle || item.title || "No Title"}
                </h2>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Type</span>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    item.type === "lost"
                      ? "bg-red-100 text-red-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {item.type || "N/A"}
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Date</span>
                <span>
                  {item.createdAt
                    ? new Date(item.createdAt).toLocaleDateString()
                    : "N/A"}
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Status</span>
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${displayStatus.className}`}>
                  {displayStatus.label}
                </span>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => handleMakeAsClaim(item._id)}
                  disabled={item.find || claimingItemId === item._id}
                  className={`flex-1 py-2 rounded-md text-sm font-medium transition ${
                    item.find
                      ? "bg-emerald-100 text-emerald-700 cursor-not-allowed"
                      : claimingItemId === item._id
                        ? "bg-blue-300 text-white cursor-wait"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                >
                  {item.find
                    ? "Claimed"
                    : claimingItemId === item._id
                      ? "Claiming..."
                      : "Make as Claim"}
                </button>

                <button
                  type="button"
                  onClick={() => handleEdit(item._id)}
                  className="flex-1 bg-yellow-100 text-yellow-700 py-2 rounded-md text-sm hover:bg-yellow-200"
                >
                  Edit
                </button>

                <button
                  type="button"
                  onClick={() => handleDelete(item._id)}
                  className="flex-1 bg-red-100 text-red-600 py-2 rounded-md text-sm hover:bg-red-200"
                >
                  Delete
                </button>
              </div>
            </div>
            );
          })
        ) : (
          <p className="text-center text-gray-500">No items found</p>
        )}
      </div>
      <Footer />
    </div>
  );
}

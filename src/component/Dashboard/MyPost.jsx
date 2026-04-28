import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllItems, deleteItem } from "../authApi/authApi";
import { toast } from "react-toastify";

export default function MyPosts() {
  const [items, setItems] = useState([]);
  const navigate = useNavigate();

  //  FETCH ITEMS
  const fetchItems = async () => {
    try {
      const res = await getAllItems();

      console.log("API RESPONSE ", res.data);

      //  Handle all possible API formats
      const data =
        res?.data?.data?.items ||
        res?.data?.data ||
        res?.data ||
        [];

      //  Ensure always array
      setItems(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load items");
      setItems([]); 
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  //  DELETE ITEM
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;

    try {
      await deleteItem(id);
      toast.success("Item deleted successfully");

      // update UI instantly
      setItems((prev) => prev.filter((item) => item._id !== id));
    } catch (error) {
      console.error(error);
      toast.error("Delete failed");
    }
  };

  //  EDIT NAVIGATION
  const handleEdit = (id) => {
    navigate(`/edit-item/${id}`);
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

      {/*  DESKTOP TABLE  */}
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
              items.map((item) => (
                <tr key={item._id} className="border-t">
                  <td className="p-4 flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                      📦
                    </div>
                    <span className="font-medium">
                      {item.title || item.name || "No Title"}
                    </span>
                  </td>

                  <td className="p-4">
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs">
                      {item.type || "N/A"}
                    </span>
                  </td>

                  <td className="p-4 text-gray-600">
                    {item.createdAt
                      ? new Date(item.createdAt).toLocaleDateString()
                      : "N/A"}
                  </td>

                  <td className="p-4">
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs">
                      {item.status || "Active"}
                    </span>
                  </td>

                  <td className="p-4 flex justify-center gap-2">
                    <button
                      onClick={() => handleEdit(item._id)}
                      className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-md text-sm hover:bg-yellow-200"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(item._id)}
                      className="bg-red-100 text-red-600 px-3 py-1 rounded-md text-sm hover:bg-red-200"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
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

      {/* MOBILE CARDS  */}
      <div className="md:hidden space-y-4">
        {Array.isArray(items) && items.length > 0 ? (
          items.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-xl shadow p-4 space-y-3"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                  📦
                </div>
                <h2 className="font-semibold text-gray-800">
                  {item.title || item.name || "No Title"}
                </h2>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Type</span>
                <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">
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
                <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">
                  {item.status || "Active"}
                </span>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => handleEdit(item._id)}
                  className="flex-1 bg-yellow-100 text-yellow-700 py-2 rounded-md text-sm hover:bg-yellow-200"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(item._id)}
                  className="flex-1 bg-red-100 text-red-600 py-2 rounded-md text-sm hover:bg-red-200"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No items found</p>
        )}
      </div>
    </div>
  );
}
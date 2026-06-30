import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();
  const [listings, setListings] = useState([]);
  const [swaps, setSwaps] = useState([]);

  useEffect(() => {
    if (user) {
      fetchUserListings();
      fetchUserSwaps();
    }
  }, [user]);

  const fetchUserListings = async () => {
    const res = await fetch(`http://localhost:3001/api/user/${user.id}/listings`);
    const data = await res.json();
    setListings(data);
  };

  const fetchUserSwaps = async () => {
    const res = await fetch(`http://localhost:3001/api/swaps/user/${user.id}`);
    const data = await res.json();
    setSwaps(data);
  };

  const deleteListing = async (id) => {
    if (confirm('Are you sure you want to delete this listing?')) {
      await fetch(`http://localhost:3001/api/listings/${id}`, { method: 'DELETE' });
      fetchUserListings();
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">My Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-gray-600 mb-2">My Listings</h3>
          <p className="text-3xl font-bold text-purple-600">{listings.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-gray-600 mb-2">Active Swaps</h3>
          <p className="text-3xl font-bold text-purple-600">{swaps.filter(s => s.status === 'pending').length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-gray-600 mb-2">Completed Swaps</h3>
          <p className="text-3xl font-bold text-purple-600">{swaps.filter(s => s.status === 'accepted').length}</p>
        </div>
      </div>

      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">My Listings</h2>
          <Link to="/create" className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">
            + Add New Item
          </Link>
        </div>
        {listings.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <p className="text-gray-500">You haven't listed any items yet.</p>
            <Link to="/create" className="text-purple-600 hover:underline mt-2 inline-block">
              List your first item
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map(listing => (
              <div key={listing.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <img src={listing.image} alt={listing.title} className="w-full h-48 object-cover" />
                <div className="p-4">
                  <h3 className="text-xl font-semibold mb-2">{listing.title}</h3>
                  <p className="text-gray-600 mb-2">₹{listing.estimatedValue}</p>
                  <p className={`text-sm mb-4 ${listing.available ? 'text-green-600' : 'text-red-600'}`}>
                    {listing.available ? 'Available' : 'Swapped'}
                  </p>
                  <div className="flex gap-2">
                    <Link to={`/listing/${listing.id}`} className="flex-1 bg-blue-600 text-white py-2 rounded text-center hover:bg-blue-700">
                      View
                    </Link>
                    <button onClick={() => deleteListing(listing.id)} className="flex-1 bg-red-600 text-white py-2 rounded hover:bg-red-700">
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Recent Swap Requests</h2>
        {swaps.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <p className="text-gray-500">No swap requests yet.</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {swaps.slice(0, 5).map(swap => (
              <div key={swap.id} className="border-b last:border-b-0 p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold">Swap with {swap.fromUserId === user.id ? swap.toUserName : swap.fromUserName}</p>
                    <p className="text-gray-600 text-sm">{swap.fromListingTitle} ↔ {swap.toListingTitle}</p>
                  </div>
                  <span className={`px-3 py-1 rounded ${swap.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : swap.status === 'accepted' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {swap.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

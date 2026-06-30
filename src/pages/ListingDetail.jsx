import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ListingDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);
  const [userListings, setUserListings] = useState([]);
  const [selectedItem, setSelectedItem] = useState('');
  const [message, setMessage] = useState('');
  const [showSwapModal, setShowSwapModal] = useState(false);

  useEffect(() => {
    fetchListing();
    if (user) fetchUserListings();
  }, [id, user]);

  const fetchListing = async () => {
    const res = await fetch(`http://localhost:3001/api/listings/${id}`);
    const data = await res.json();
    setListing(data);
  };

  const fetchUserListings = async () => {
    const res = await fetch(`http://localhost:3001/api/user/${user.id}/listings`);
    const data = await res.json();
    setUserListings(data.filter(l => l.available));
  };

  const handleSwapRequest = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (listing.userId === user.id) {
      alert('You cannot swap with yourself!');
      return;
    }
    if (!selectedItem) {
      alert('Please select an item to swap');
      return;
    }
    setShowSwapModal(true);
  };

  const submitSwapRequest = async () => {
    const res = await fetch('http://localhost:3001/api/swaps', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fromUserId: user.id,
        fromUserName: user.name,
        toUserId: listing.userId,
        toUserName: listing.userName,
        fromListingId: parseInt(selectedItem),
        toListingId: listing.id,
        message
      })
    });
    if (res.ok) {
      alert('Swap request sent successfully!');
      navigate('/swaps');
    }
  };

  if (!listing) return <div className="text-center py-12">Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <img src={listing.image} alt={listing.title} className="w-full rounded-lg shadow-lg" />
        </div>
        <div>
          <h1 className="text-4xl font-bold mb-4">{listing.title}</h1>
          <div className="bg-gray-100 p-6 rounded-lg mb-6">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div><strong>Brand:</strong> {listing.brand}</div>
              <div><strong>Size:</strong> {listing.size}</div>
              <div><strong>Type:</strong> {listing.type}</div>
              <div><strong>Condition:</strong> {listing.condition}</div>
              <div><strong>Estimated Value:</strong> ₹{listing.estimatedValue}</div>
              <div><strong>Location:</strong> {listing.userLocation}</div>
            </div>
            <p className="text-gray-700 mt-4">{listing.description}</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg mb-6">
            <p className="text-gray-700"><strong>Listed by:</strong> {listing.userName}</p>
            <p className="text-gray-600 text-sm">Member since {listing.createdAt}</p>
          </div>
          {user && user.id !== listing.userId && (
            <button
              onClick={handleSwapRequest}
              className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 text-lg font-semibold"
            >
              Request Swap
            </button>
          )}
        </div>
      </div>

      {showSwapModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">Send Swap Request</h2>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Select your item to swap:</label>
              <select
                value={selectedItem}
                onChange={(e) => setSelectedItem(e.target.value)}
                className="w-full p-3 border rounded-lg"
              >
                <option value="">Choose an item...</option>
                {userListings.map(item => (
                  <option key={item.id} value={item.id}>
                    {item.title} (₹{item.estimatedValue})
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Message (optional):</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full p-3 border rounded-lg"
                rows="3"
                placeholder="Add a message to the seller..."
              />
            </div>
            <div className="flex gap-4">
              <button
                onClick={submitSwapRequest}
                className="flex-1 bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700"
              >
                Send Request
              </button>
              <button
                onClick={() => setShowSwapModal(false)}
                className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

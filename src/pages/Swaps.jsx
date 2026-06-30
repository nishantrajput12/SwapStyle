import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Swaps() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [swaps, setSwaps] = useState([]);
  const [tab, setTab] = useState('sent');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchSwaps();
  }, [user]);

  const fetchSwaps = async () => {
    const res = await fetch(`http://localhost:3001/api/swaps/user/${user.id}`);
    const data = await res.json();
    setSwaps(data);
  };

  const handleAccept = async (id) => {
    await fetch(`http://localhost:3001/api/swaps/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'accepted' })
    });
    fetchSwaps();
  };

  const handleReject = async (id) => {
    await fetch(`http://localhost:3001/api/swaps/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'rejected' })
    });
    fetchSwaps();
  };

  const sentSwaps = swaps.filter(s => s.fromUserId === user.id);
  const receivedSwaps = swaps.filter(s => s.toUserId === user.id);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">My Swap Requests</h1>
      
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setTab('sent')}
          className={`px-6 py-2 rounded ${tab === 'sent' ? 'bg-purple-600 text-white' : 'bg-gray-200'}`}
        >
          Sent ({sentSwaps.length})
        </button>
        <button
          onClick={() => setTab('received')}
          className={`px-6 py-2 rounded ${tab === 'received' ? 'bg-purple-600 text-white' : 'bg-gray-200'}`}
        >
          Received ({receivedSwaps.length})
        </button>
      </div>

      <div className="space-y-4">
        {(tab === 'sent' ? sentSwaps : receivedSwaps).length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <p className="text-gray-500">No {tab} swap requests.</p>
          </div>
        ) : (
          (tab === 'sent' ? sentSwaps : receivedSwaps).map(swap => (
            <div key={swap.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-gray-600 text-sm">
                    {tab === 'sent' ? 'To' : 'From'}: <strong>{tab === 'sent' ? swap.toUserName : swap.fromUserName}</strong>
                  </p>
                  <p className="text-sm text-gray-500">{new Date(swap.createdAt).toLocaleDateString()}</p>
                </div>
                <span className={`px-3 py-1 rounded ${
                  swap.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  swap.status === 'accepted' ? 'bg-green-100 text-green-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {swap.status.charAt(0).toUpperCase() + swap.status.slice(1)}
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="bg-gray-50 p-4 rounded">
                  <p className="text-sm text-gray-600 mb-1">Your Item:</p>
                  <p className="font-semibold">{swap.fromListingTitle}</p>
                </div>
                <div className="flex items-center justify-center text-2xl text-purple-600">↔</div>
                <div className="bg-gray-50 p-4 rounded">
                  <p className="text-sm text-gray-600 mb-1">Their Item:</p>
                  <p className="font-semibold">{swap.toListingTitle}</p>
                </div>
              </div>

              {swap.message && (
                <div className="bg-blue-50 p-3 rounded mb-4">
                  <p className="text-sm text-gray-700"><strong>Message:</strong> {swap.message}</p>
                </div>
              )}

              {tab === 'received' && swap.status === 'pending' && (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleAccept(swap.id)}
                    className="flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-700"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleReject(swap.id)}
                    className="flex-1 bg-red-600 text-white py-2 rounded hover:bg-red-700"
                  >
                    Reject
                  </button>
                </div>
              )}

              {(swap.status === 'accepted') && (
                <button
                  onClick={() => navigate(`/chat/${swap.id}`)}
                  className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700"
                >
                  Open Chat
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

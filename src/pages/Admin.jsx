import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Admin() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({});
  const [usersList, setUsersList] = useState([]);
  const [listingsList, setListingsList] = useState([]);
  const [swapsList, setSwapsList] = useState([]);
  const [tab, setTab] = useState('overview');

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }
    fetchData();
  }, [user]);

  const fetchData = async () => {
    const [statsRes, usersRes, listingsRes, swapsRes] = await Promise.all([
      fetch('http://localhost:3001/api/admin/stats'),
      fetch('http://localhost:3001/api/admin/users'),
      fetch('http://localhost:3001/api/admin/listings'),
      fetch('http://localhost:3001/api/admin/swaps')
    ]);
    
    setStats(await statsRes.json());
    setUsersList(await usersRes.json());
    setListingsList(await listingsRes.json());
    setSwapsList(await swapsRes.json());
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>

      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setTab('overview')}
          className={`px-6 py-2 rounded ${tab === 'overview' ? 'bg-purple-600 text-white' : 'bg-gray-200'}`}
        >
          Overview
        </button>
        <button
          onClick={() => setTab('users')}
          className={`px-6 py-2 rounded ${tab === 'users' ? 'bg-purple-600 text-white' : 'bg-gray-200'}`}
        >
          Users
        </button>
        <button
          onClick={() => setTab('listings')}
          className={`px-6 py-2 rounded ${tab === 'listings' ? 'bg-purple-600 text-white' : 'bg-gray-200'}`}
        >
          Listings
        </button>
        <button
          onClick={() => setTab('swaps')}
          className={`px-6 py-2 rounded ${tab === 'swaps' ? 'bg-purple-600 text-white' : 'bg-gray-200'}`}
        >
          Swaps
        </button>
      </div>

      {tab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-gray-600 mb-2">Total Users</h3>
            <p className="text-3xl font-bold text-purple-600">{stats.totalUsers}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-gray-600 mb-2">Total Listings</h3>
            <p className="text-3xl font-bold text-purple-600">{stats.totalListings}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-gray-600 mb-2">Total Swaps</h3>
            <p className="text-3xl font-bold text-purple-600">{stats.totalSwaps}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-gray-600 mb-2">Completed Swaps</h3>
            <p className="text-3xl font-bold text-green-600">{stats.completedSwaps}</p>
          </div>
        </div>
      )}

      {tab === 'users' && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-4 text-left">ID</th>
                <th className="p-4 text-left">Name</th>
                <th className="p-4 text-left">Email</th>
                <th className="p-4 text-left">Location</th>
                <th className="p-4 text-left">Joined</th>
              </tr>
            </thead>
            <tbody>
              {usersList.map(u => (
                <tr key={u.id} className="border-t">
                  <td className="p-4">{u.id}</td>
                  <td className="p-4">{u.name}</td>
                  <td className="p-4">{u.email}</td>
                  <td className="p-4">{u.location}</td>
                  <td className="p-4">{u.joinDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'listings' && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-4 text-left">ID</th>
                <th className="p-4 text-left">Title</th>
                <th className="p-4 text-left">Owner</th>
                <th className="p-4 text-left">Value</th>
                <th className="p-4 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {listingsList.map(l => (
                <tr key={l.id} className="border-t">
                  <td className="p-4">{l.id}</td>
                  <td className="p-4">{l.title}</td>
                  <td className="p-4">{l.userName}</td>
                  <td className="p-4">₹{l.estimatedValue}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-sm ${l.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {l.available ? 'Available' : 'Swapped'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'swaps' && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-4 text-left">ID</th>
                <th className="p-4 text-left">From</th>
                <th className="p-4 text-left">To</th>
                <th className="p-4 text-left">Items</th>
                <th className="p-4 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {swapsList.map(s => (
                <tr key={s.id} className="border-t">
                  <td className="p-4">{s.id}</td>
                  <td className="p-4">{s.fromUserName}</td>
                  <td className="p-4">{s.toUserName}</td>
                  <td className="p-4 text-sm">{s.fromListingTitle} ↔ {s.toListingTitle}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-sm ${
                      s.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      s.status === 'accepted' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {s.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

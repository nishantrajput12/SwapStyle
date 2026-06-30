import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-purple-600">
          SwapStyle
        </Link>
        
        <div className="flex gap-6 items-center">
          <Link to="/" className="hover:text-purple-600">Browse</Link>
          {user ? (
            <>
              <Link to="/dashboard" className="hover:text-purple-600">Dashboard</Link>
              <Link to="/create" className="hover:text-purple-600">Add Item</Link>
              <Link to="/swaps" className="hover:text-purple-600">My Swaps</Link>
              {user.role === 'admin' && (
                <Link to="/admin" className="hover:text-purple-600">Admin</Link>
              )}
              <span className="text-gray-600">Hi, {user.name}</span>
              <button onClick={logout} className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-purple-600">Login</Link>
              <Link to="/register" className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  const [listings, setListings] = useState([]);
  const [filters, setFilters] = useState({
    location: '',
    type: '',
    size: '',
    brand: '',
    search: ''
  });

  useEffect(() => {
    fetchListings();
  }, [filters]);

  const fetchListings = async () => {
    const params = new URLSearchParams();
    if (filters.location) params.append('location', filters.location);
    if (filters.type) params.append('type', filters.type);
    if (filters.size) params.append('size', filters.size);
    if (filters.brand) params.append('brand', filters.brand);
    if (filters.search) params.append('search', filters.search);

    const res = await fetch(`http://localhost:3001/api/listings?${params}`);
    const data = await res.json();
    setListings(data);
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">Browse Available Items</h1>
      
      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <input
            type="text"
            name="search"
            placeholder="Search..."
            value={filters.search}
            onChange={handleFilterChange}
            className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
          <input
            type="text"
            name="location"
            placeholder="Location"
            value={filters.location}
            onChange={handleFilterChange}
            className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
          <select
            name="type"
            value={filters.type}
            onChange={handleFilterChange}
            className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
          >
            <option value="">All Types</option>
            <option value="Jacket">Jacket</option>
            <option value="Dress">Dress</option>
            <option value="Shoes">Shoes</option>
            <option value="Coat">Coat</option>
            <option value="Shirt">Shirt</option>
            <option value="Pants">Pants</option>
          </select>
          <select
            name="size"
            value={filters.size}
            onChange={handleFilterChange}
            className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
          >
            <option value="">All Sizes</option>
            <option value="XS">XS</option>
            <option value="S">S</option>
            <option value="M">M</option>
            <option value="L">L</option>
            <option value="XL">XL</option>
          </select>
          <input
            type="text"
            name="brand"
            placeholder="Brand"
            value={filters.brand}
            onChange={handleFilterChange}
            className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
        </div>
      </div>

      {/* Listings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {listings.map(listing => (
          <Link key={listing.id} to={`/listing/${listing.id}`} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
            <img src={listing.image} alt={listing.title} className="w-full h-64 object-cover" />
            <div className="p-4">
              <h3 className="text-xl font-semibold mb-2">{listing.title}</h3>
              <p className="text-gray-600 mb-2">{listing.brand} - {listing.size}</p>
              <p className="text-gray-500 text-sm mb-2">{listing.condition}</p>
              <div className="flex justify-between items-center">
                <span className="text-purple-600 font-bold">₹{listing.estimatedValue}</span>
                <span className="text-gray-500 text-sm">{listing.userLocation}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {listings.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-xl">No items found. Try adjusting your filters.</p>
        </div>
      )}
    </div>
  );
}

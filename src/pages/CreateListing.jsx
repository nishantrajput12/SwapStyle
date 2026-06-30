import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function CreateListing() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    type: '',
    brand: '',
    size: '',
    condition: '',
    description: '',
    estimatedValue: '',
    image: ''
  });
  const [estimatedValue, setEstimatedValue] = useState(0);

  const calculateValue = async () => {
    const res = await fetch('http://localhost:3001/api/calculate-value', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: formData.type,
        brand: formData.brand,
        condition: formData.condition,
        size: formData.size
      })
    });
    const data = await res.json();
    setEstimatedValue(data.estimatedValue);
    setFormData({ ...formData, estimatedValue: data.estimatedValue });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }

    const res = await fetch('http://localhost:3001/api/listings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...formData,
        userId: user.id,
        userName: user.name,
        userLocation: user.location
      })
    });

    if (res.ok) {
      navigate('/dashboard');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-4xl font-bold text-center mb-8">List Your Item</h1>
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md">
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-gray-700 mb-2">Type</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
              required
            >
              <option value="">Select type...</option>
              <option value="Jacket">Jacket</option>
              <option value="Dress">Dress</option>
              <option value="Shoes">Shoes</option>
              <option value="Coat">Coat</option>
              <option value="Shirt">Shirt</option>
              <option value="Pants">Pants</option>
              <option value="Accessories">Accessories</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Brand</label>
            <input
              type="text"
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
              required
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-gray-700 mb-2">Size</label>
            <select
              name="size"
              value={formData.size}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
              required
            >
              <option value="">Select size...</option>
              <option value="XS">XS</option>
              <option value="S">S</option>
              <option value="M">M</option>
              <option value="L">L</option>
              <option value="XL">XL</option>
              <option value="9">9 (Shoes)</option>
              <option value="10">10 (Shoes)</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Condition</label>
            <select
              name="condition"
              value={formData.condition}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
              required
            >
              <option value="">Select condition...</option>
              <option value="Excellent">Excellent</option>
              <option value="Good">Good</option>
              <option value="Fair">Fair</option>
              <option value="Poor">Poor</option>
            </select>
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
            rows="4"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Image URL (optional)</label>
          <input
            type="url"
            name="image"
            value={formData.image}
            onChange={handleChange}
            placeholder="https://example.com/image.jpg"
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
        </div>
        <div className="mb-6">
          <button
            type="button"
            onClick={calculateValue}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 mb-2"
          >
            Calculate Estimated Value
          </button>
          {estimatedValue > 0 && (
            <div className="bg-green-100 p-3 rounded-lg text-center">
              <strong>Estimated Value: ₹{estimatedValue}</strong>
            </div>
          )}
          <input
            type="number"
            name="estimatedValue"
            value={formData.estimatedValue}
            onChange={handleChange}
            placeholder="Or enter manually"
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 mt-2"
          />
        </div>
        <button type="submit" className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700">
          List Item
        </button>
      </form>
    </div>
  );
}

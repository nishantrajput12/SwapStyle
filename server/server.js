const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// In-memory data storage (will be replaced with database in production)
let users = [
  {
    id: 1,
    email: 'admin@swapstyle.com',
    password: 'admin123',
    name: 'Admin User',
    role: 'admin',
    location: 'Mumbai, India',
    joinDate: '2024-01-01'
  },
  {
    id: 2,
    email: 'demo@swapstyle.com',
    password: 'demo123',
    name: 'Demo User',
    role: 'user',
    location: 'Delhi, India',
    joinDate: '2024-01-15'
  }
];

let listings = [
  {
    id: 1,
    userId: 2,
    userName: 'Demo User',
    userLocation: 'Delhi, India',
    title: 'Vintage Denim Jacket',
    type: 'Jacket',
    brand: 'Levi\'s',
    size: 'M',
    condition: 'Good',
    description: 'Classic vintage denim jacket, slightly faded, perfect for casual wear',
    estimatedValue: 800,
    image: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=400&h=400&fit=crop',
    available: true,
    createdAt: '2024-02-01'
  },
  {
    id: 2,
    userId: 2,
    userName: 'Demo User',
    userLocation: 'Delhi, India',
    title: 'Cotton Floral Dress',
    type: 'Dress',
    brand: 'Zara',
    size: 'S',
    condition: 'Excellent',
    description: 'Beautiful floral pattern dress, worn only twice, perfect for summer',
    estimatedValue: 1200,
    image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=400&fit=crop',
    available: true,
    createdAt: '2024-02-05'
  },
  {
    id: 3,
    userId: 2,
    userName: 'Demo User',
    userLocation: 'Delhi, India',
    title: 'Designer Sneakers',
    type: 'Shoes',
    brand: 'Nike',
    size: '9',
    condition: 'Good',
    description: 'Comfortable Nike sneakers, great condition, perfect for daily wear',
    estimatedValue: 1500,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop',
    available: true,
    createdAt: '2024-02-10'
  },
  {
    id: 4,
    userId: 2,
    userName: 'Demo User',
    userLocation: 'Delhi, India',
    title: 'Wool Winter Coat',
    type: 'Coat',
    brand: 'H&M',
    size: 'L',
    condition: 'Excellent',
    description: 'Warm wool coat, perfect for winters, barely used',
    estimatedValue: 2000,
    image: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=400&h=400&fit=crop',
    available: true,
    createdAt: '2024-02-15'
  }
];

let swapRequests = [];
let messages = [];
let nextUserId = 3;
let nextListingId = 5;
let nextRequestId = 1;
let nextMessageId = 1;

// Authentication endpoints
app.post('/api/auth/register', (req, res) => {
  const { email, password, name, location } = req.body;
  
  if (users.find(u => u.email === email)) {
    return res.status(400).json({ message: 'Email already registered' });
  }
  
  const newUser = {
    id: nextUserId++,
    email,
    password,
    name,
    role: 'user',
    location: location || 'Not specified',
    joinDate: new Date().toISOString().split('T')[0]
  };
  
  users.push(newUser);
  res.json({ 
    message: 'Registration successful',
    user: { id: newUser.id, email: newUser.email, name: newUser.name, role: newUser.role }
  });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email && u.password === password);
  
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  
  res.json({
    message: 'Login successful',
    user: { id: user.id, email: user.email, name: user.name, role: user.role }
  });
});

// User endpoints
app.get('/api/users/:id', (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  res.json({ id: user.id, name: user.name, location: user.location, joinDate: user.joinDate });
});

// Listing endpoints
app.get('/api/listings', (req, res) => {
  const { location, type, size, brand, search } = req.query;
  let filtered = listings.filter(l => l.available);
  
  if (location && location !== 'all') {
    filtered = filtered.filter(l => l.userLocation.toLowerCase().includes(location.toLowerCase()));
  }
  if (type && type !== 'all') {
    filtered = filtered.filter(l => l.type.toLowerCase() === type.toLowerCase());
  }
  if (size && size !== 'all') {
    filtered = filtered.filter(l => l.size.toLowerCase() === size.toLowerCase());
  }
  if (brand && brand !== 'all') {
    filtered = filtered.filter(l => l.brand.toLowerCase().includes(brand.toLowerCase()));
  }
  if (search) {
    filtered = filtered.filter(l => 
      l.title.toLowerCase().includes(search.toLowerCase()) ||
      l.description.toLowerCase().includes(search.toLowerCase())
    );
  }
  
  res.json(filtered);
});

app.get('/api/listings/:id', (req, res) => {
  const listing = listings.find(l => l.id === parseInt(req.params.id));
  if (!listing) {
    return res.status(404).json({ message: 'Listing not found' });
  }
  res.json(listing);
});

app.get('/api/user/:userId/listings', (req, res) => {
  const userListings = listings.filter(l => l.userId === parseInt(req.params.userId));
  res.json(userListings);
});

app.post('/api/listings', (req, res) => {
  const { userId, userName, userLocation, title, type, brand, size, condition, description, estimatedValue, image } = req.body;
  
  const newListing = {
    id: nextListingId++,
    userId,
    userName,
    userLocation,
    title,
    type,
    brand,
    size,
    condition,
    description,
    estimatedValue: parseInt(estimatedValue),
    image: image || 'https://images.unsplash.com/photo-1558171813-4c088753af8f?w=400&h=400&fit=crop',
    available: true,
    createdAt: new Date().toISOString().split('T')[0]
  };
  
  listings.push(newListing);
  res.json(newListing);
});

app.put('/api/listings/:id', (req, res) => {
  const listingId = parseInt(req.params.id);
  const index = listings.findIndex(l => l.id === listingId);
  
  if (index === -1) {
    return res.status(404).json({ message: 'Listing not found' });
  }
  
  listings[index] = { ...listings[index], ...req.body };
  res.json(listings[index]);
});

app.delete('/api/listings/:id', (req, res) => {
  const listingId = parseInt(req.params.id);
  const index = listings.findIndex(l => l.id === listingId);
  
  if (index === -1) {
    return res.status(404).json({ message: 'Listing not found' });
  }
  
  listings.splice(index, 1);
  res.json({ message: 'Listing deleted successfully' });
});

// Swap request endpoints
app.get('/api/swaps/user/:userId', (req, res) => {
  const userId = parseInt(req.params.userId);
  const userSwaps = swapRequests.filter(s => 
    s.fromUserId === userId || s.toUserId === userId
  );
  res.json(userSwaps);
});

app.post('/api/swaps', (req, res) => {
  const { fromUserId, fromUserName, toUserId, toUserName, fromListingId, toListingId, message } = req.body;
  
  const fromListing = listings.find(l => l.id === fromListingId);
  const toListing = listings.find(l => l.id === toListingId);
  
  if (!fromListing || !toListing) {
    return res.status(400).json({ message: 'One or both listings not found' });
  }
  
  const newSwap = {
    id: nextRequestId++,
    fromUserId,
    fromUserName,
    toUserId,
    toUserName,
    fromListingId,
    fromListingTitle: fromListing.title,
    toListingId,
    toListingTitle: toListing.title,
    status: 'pending',
    message: message || '',
    createdAt: new Date().toISOString()
  };
  
  swapRequests.push(newSwap);
  res.json(newSwap);
});

app.put('/api/swaps/:id', (req, res) => {
  const swapId = parseInt(req.params.id);
  const index = swapRequests.findIndex(s => s.id === swapId);
  
  if (index === -1) {
    return res.status(404).json({ message: 'Swap request not found' });
  }
  
  const { status } = req.body;
  swapRequests[index].status = status;
  
  if (status === 'accepted') {
    // Mark both listings as unavailable
    const fromListing = listings.find(l => l.id === swapRequests[index].fromListingId);
    const toListing = listings.find(l => l.id === swapRequests[index].toListingId);
    if (fromListing) fromListing.available = false;
    if (toListing) toListing.available = false;
  }
  
  res.json(swapRequests[index]);
});

// Messaging endpoints
app.get('/api/messages/swap/:swapId', (req, res) => {
  const swapId = parseInt(req.params.swapId);
  const swapMessages = messages.filter(m => m.swapId === swapId);
  res.json(swapMessages);
});

app.post('/api/messages', (req, res) => {
  const { swapId, senderId, senderName, content } = req.body;
  
  const newMessage = {
    id: nextMessageId++,
    swapId,
    senderId,
    senderName,
    content,
    timestamp: new Date().toISOString()
  };
  
  messages.push(newMessage);
  res.json(newMessage);
});

// Admin endpoints
app.get('/api/admin/stats', (req, res) => {
  res.json({
    totalUsers: users.length,
    totalListings: listings.length,
    totalSwaps: swapRequests.length,
    pendingSwaps: swapRequests.filter(s => s.status === 'pending').length,
    completedSwaps: swapRequests.filter(s => s.status === 'accepted').length
  });
});

app.get('/api/admin/users', (req, res) => {
  res.json(users.map(u => ({ id: u.id, name: u.name, email: u.email, location: u.location, joinDate: u.joinDate })));
});

app.get('/api/admin/listings', (req, res) => {
  res.json(listings);
});

app.get('/api/admin/swaps', (req, res) => {
  res.json(swapRequests);
});

// Swap value calculator
app.post('/api/calculate-value', (req, res) => {
  const { type, brand, condition, size } = req.body;
  
  // Base value calculation
  let baseValue = 500;
  
  // Brand multiplier
  const brandMultipliers = {
    'zara': 1.2, 'h&m': 1.0, 'nike': 1.5, 'adidas': 1.4,
    'levi\'s': 1.3, 'gucci': 3.0, 'prada': 2.8, 'generic': 0.8
  };
  const brandMult = brandMultipliers[brand.toLowerCase()] || 1.0;
  
  // Condition multiplier
  const conditionMultipliers = {
    'excellent': 1.5, 'good': 1.2, 'fair': 0.9, 'poor': 0.6
  };
  const conditionMult = conditionMultipliers[condition.toLowerCase()] || 1.0;
  
  // Type multiplier
  const typeMultipliers = {
    'jacket': 1.4, 'coat': 1.6, 'dress': 1.3, 'shirt': 1.0,
    'pants': 1.1, 'shoes': 1.5, 'accessories': 0.8
  };
  const typeMult = typeMultipliers[type.toLowerCase()] || 1.0;
  
  const estimatedValue = Math.round(baseValue * brandMult * conditionMult * typeMult);
  
  res.json({ estimatedValue });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

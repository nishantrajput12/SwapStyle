# SwapStyle - Clothing Exchange & Swap Marketplace

A modern web application that enables users to swap clothes directly with other users, promoting sustainable fashion practices and reducing textile waste.

## 🌟 Features

### User Features
- **User Authentication**: Secure registration and login system
- **Clothing Listings**: Create, edit, and manage your clothing items
- **Browse Items**: Search and filter available items by location, type, size, and brand
- **Swap Requests**: Send and receive swap requests with other users
- **Negotiation Chat**: Direct messaging to discuss swap details
- **Value Calculator**: Estimate clothing value based on brand, condition, and type
- **Location-Based Matching**: Find nearby users offering clothing swaps
- **User Dashboard**: Manage listings, track swaps, and view activity

### Admin Features
- **Platform Analytics**: View total users, listings, and swap statistics
- **User Management**: Monitor all registered users
- **Listing Oversight**: View and manage all platform listings
- **Swap Monitoring**: Track all swap requests and their status

## 🚀 Live Demo

- **Website**: https://swap-style-wine.vercel.app
- **GitHub Repository**: https://github.com/nishantrajput12/SwapStyle

### Demo Accounts
- **Admin**: admin@swapstyle.com / admin123
- **User**: demo@swapstyle.com / demo123

## 🛠️ Technology Stack

### Frontend
- **React 19** - Modern UI library
- **React Router DOM** - Client-side routing
- **Tailwind CSS 4** - Utility-first CSS framework
- **Vite** - Fast build tool and dev server

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web application framework
- **RESTful API** - Clean API architecture

### Deployment
- **Vercel** - Frontend and serverless backend hosting
- **GitHub** - Version control and collaboration

## 📋 Pages & Features

### 1. Home/Browse Page
- View all available clothing items
- Filter by location, type, size, brand
- Search functionality
- Grid layout with item cards

### 2. Login/Register Pages
- Secure authentication
- Form validation
- Error handling

### 3. Listing Detail Page
- Full item details (brand, size, condition, description)
- Owner information
- Swap value display
- Request swap functionality

### 4. Create Listing Page
- Add new clothing items
- Upload images
- Set estimated value
- Automatic value calculation

### 5. User Dashboard
- View personal listings
- Track swap requests (sent/received)
- Quick statistics
- Delete listings

### 6. My Swaps Page
- View all swap requests
- Accept/reject incoming requests
- Track swap status
- Open chat for accepted swaps

### 7. Chat Page
- Real-time messaging
- Conversation history
- Swap-specific chats

### 8. Admin Dashboard
- Platform statistics
- User management
- Listing oversight
- Swap monitoring

## 🔧 Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Local Development

1. **Clone the repository**
```bash
git clone https://github.com/nishantrajput12/SwapStyle.git
cd SwapStyle
```

2. **Install dependencies**
```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
cd ..
```

3. **Start development servers**
```bash
# Start both frontend and backend
npm run dev

# Or start separately
npm run dev:client  # Frontend on http://localhost:5173
npm run dev:server  # Backend on http://localhost:3001
```

4. **Build for production**
```bash
npm run build
```

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Listings
- `GET /api/listings` - Get all listings (with filters)
- `GET /api/listings/:id` - Get listing details
- `GET /api/user/:userId/listings` - Get user's listings
- `POST /api/listings` - Create new listing
- `PUT /api/listings/:id` - Update listing
- `DELETE /api/listings/:id` - Delete listing

### Swap Requests
- `GET /api/swaps/user/:userId` - Get user's swaps
- `POST /api/swaps` - Create swap request
- `PUT /api/swaps/:id` - Update swap status

### Messaging
- `GET /api/messages/swap/:swapId` - Get messages for swap
- `POST /api/messages` - Send message

### Admin
- `GET /api/admin/stats` - Get platform statistics
- `GET /api/admin/users` - Get all users
- `GET /api/admin/listings` - Get all listings
- `GET /api/admin/swaps` - Get all swaps

### Value Calculator
- `POST /api/calculate-value` - Calculate estimated value

## 🎯 Key Features Explained

### Swap Value Calculator
The platform includes an intelligent value calculator that estimates clothing value based on:
- **Brand**: Premium brands get higher values
- **Condition**: Excellent > Good > Fair > Poor
- **Type**: Coats and jackets valued higher than accessories
- **Size**: Standard sizing considerations

### Location-Based Matching
Users can filter listings by location to find nearby swap opportunities, making local exchanges easier and reducing shipping costs.

### Negotiation System
Users can negotiate through direct messaging before finalizing swaps, ensuring both parties are satisfied with the exchange.

### Admin Controls
Administrators have full oversight of the platform, including:
- Monitoring user activity
- Managing inappropriate listings
- Resolving disputes
- Generating analytics reports

## 🔒 Security Features

- Password-based authentication
- User role management (admin/user)
- Protected routes and API endpoints
- Input validation on all forms
- Secure data storage

## 📱 Responsive Design

The application is fully responsive and works seamlessly on:
- Desktop computers
- Tablets
- Mobile phones

## 🌱 Sustainability Impact

SwapStyle promotes:
- Reduced textile waste
- Circular fashion economy
- Cost-effective clothing access
- Community-driven sustainability
- Environmental consciousness

## 🚀 Future Enhancements

Planned features for future releases:
- AI-powered fashion recommendations
- Mobile application (React Native)
- Clothing condition verification system
- Sustainability impact tracker
- Community fashion groups
- Integration with courier services
- Advanced search with image recognition

## 📄 License

This project is open source and available for educational and commercial use.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 👨‍💻 Author

**Nishant Kumar**
- GitHub: [@nishantrajput12](https://github.com/nishantrajput12)

## 📞 Support

For support, please open an issue on the GitHub repository.

---

**Built with ❤️ for sustainable fashion**

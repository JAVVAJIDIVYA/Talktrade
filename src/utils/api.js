// Mock API using localStorage

const getFromStorage = (key) => JSON.parse(localStorage.getItem(key)) || [];
const saveToStorage = (key, data) => localStorage.setItem(key, JSON.stringify(data));

// Initialize data
if (!localStorage.getItem('users') || JSON.parse(localStorage.getItem('users')).length < 15) {
  const mockUsers = [
    { _id: '101', username: 'Alice', country: 'USA', img: 'https://randomuser.me/api/portraits/women/1.jpg' },
    { _id: '102', username: 'Bob', country: 'Canada', img: 'https://randomuser.me/api/portraits/men/2.jpg' },
    { _id: '103', username: 'Charlie', country: 'UK', img: 'https://randomuser.me/api/portraits/men/3.jpg' },
    { _id: '104', username: 'Diana', country: 'Australia', img: 'https://randomuser.me/api/portraits/women/4.jpg' },
    { _id: '105', username: 'Eve', country: 'New Zealand', img: 'https://randomuser.me/api/portraits/women/5.jpg' },
    { _id: '106', username: 'Frank', country: 'USA', img: 'https://randomuser.me/api/portraits/men/6.jpg' },
    { _id: '107', username: 'Grace', country: 'Canada', img: 'https://randomuser.me/api/portraits/women/7.jpg' },
    { _id: '108', username: 'Heidi', country: 'UK', img: 'https://randomuser.me/api/portraits/women/8.jpg' },
    { _id: '109', username: 'Ivan', country: 'Australia', img: 'https://randomuser.me/api/portraits/men/9.jpg' },
    { _id: '110', username: 'Judy', country: 'New Zealand', img: 'https://randomuser.me/api/portraits/women/10.jpg' },
    { _id: '111', username: 'Mallory', country: 'USA', img: 'https://randomuser.me/api/portraits/women/11.jpg' },
    { _id: '112', username: 'Niaj', country: 'Canada', img: 'https://randomuser.me/api/portraits/men/12.jpg' },
    { _id: '113', username: 'Oscar', country: 'UK', img: 'https://randomuser.me/api/portraits/men/13.jpg' },
    { _id: '114', username: 'Peggy', country: 'Australia', img: 'https://randomuser.me/api/portraits/women/14.jpg' },
    { _id: '115', username: 'Sybil', country: 'New Zealand', img: 'https://randomuser.me/api/portraits/women/15.jpg' },
  ];
  saveToStorage('users', mockUsers);
}
{
  const users = getFromStorage('users');
  const hasAdmin = users.some(u => u.isAdmin === true);
  if (!hasAdmin) {
    const adminUser = {
      _id: 'admin',
      username: 'admin',
      email: 'admin@talktrade.local',
      password: 'admin123',
      isAdmin: true,
      country: 'USA',
      img: 'https://randomuser.me/api/portraits/men/1.jpg'
    };
    users.push(adminUser);
    saveToStorage('users', users);
  }
}
if (!localStorage.getItem('gigs') || JSON.parse(localStorage.getItem('gigs')).length < 15) {
  const mockGigs = [
    // Graphics & Design
    { _id: '1', userId: '101', title: 'I will create a professional logo design', desc: 'Unique and professional logo for your business.', totalStars: 4, starNumber: 1, category: 'design', price: 500, cover: 'https://images.pexels.com/photos/1779487/pexels-photo-1779487.jpeg?auto=compress&cs=tinysrgb&w=1600', images: [], shortTitle: 'Logo Design', shortDesc: 'Professional logo design service', deliveryTime: 3, revisionNumber: 2, features: ['Source file', '3D mockup', 'High resolution'], sales: 10, createdAt: new Date('2023-10-01T10:00:00Z').toISOString() },
    { _id: '2', userId: '102', title: 'I will design a stunning business card', desc: 'Eye-catching business cards that leave a lasting impression.', totalStars: 5, starNumber: 1, category: 'design', price: 300, cover: 'https://images.pexels.com/photos/3585088/pexels-photo-3585088.jpeg?auto=compress&cs=tinysrgb&w=1600', images: [], shortTitle: 'Business Card', shortDesc: 'Stunning business card design', deliveryTime: 2, revisionNumber: 3, features: ['Print-ready', 'Double-sided'], sales: 5, createdAt: new Date('2023-10-02T11:00:00Z').toISOString() },
    // Digital Marketing
    { _id: '3', userId: '103', title: 'I will manage your social media accounts', desc: 'Grow your online presence with expert social media management.', totalStars: 4, starNumber: 1, category: 'marketing', price: 1500, cover: 'https://images.pexels.com/photos/265087/pexels-photo-265087.jpeg?auto=compress&cs=tinysrgb&w=1600', images: [], shortTitle: 'Social Media Manager', shortDesc: 'Expert social media management', deliveryTime: 30, revisionNumber: 5, features: ['Content creation', 'Scheduled posts'], sales: 20, createdAt: new Date('2023-10-03T12:00:00Z').toISOString() },
    { _id: '4', userId: '104', title: 'I will create a high-converting SEO strategy', desc: 'Boost your search engine rankings and drive organic traffic.', totalStars: 5, starNumber: 1, category: 'marketing', price: 2000, cover: 'https://images.pexels.com/photos/6476587/pexels-photo-6476587.jpeg?auto=compress&cs=tinysrgb&w=1600', images: [], shortTitle: 'SEO Strategy', shortDesc: 'High-converting SEO strategy', deliveryTime: 14, revisionNumber: 3, features: ['Keyword research', 'On-page SEO'], sales: 12, createdAt: new Date('2023-10-04T13:00:00Z').toISOString() },
    // Writing & Translation
    { _id: '5', userId: '105', title: 'I will write a compelling blog post', desc: 'Engaging and well-researched content for your blog.', totalStars: 4, starNumber: 1, category: 'writing', price: 200, cover: 'https://images.pexels.com/photos/3184454/pexels-photo-3184454.jpeg?auto=compress&cs=tinysrgb&w=1600', images: [], shortTitle: 'Blog Post Writing', shortDesc: 'Compelling blog post', deliveryTime: 2, revisionNumber: 2, features: ['500 words', 'Topic research'], sales: 30, createdAt: new Date('2023-10-05T14:00:00Z').toISOString() },
    { _id: '6', userId: '106', title: 'I will translate your document from English to Spanish', desc: 'Accurate and professional translation services.', totalStars: 5, starNumber: 1, category: 'writing', price: 100, cover: 'https://images.pexels.com/photos/5082579/pexels-photo-5082579.jpeg?auto=compress&cs=tinysrgb&w=1600', images: [], shortTitle: 'English to Spanish', shortDesc: 'Professional translation', deliveryTime: 1, revisionNumber: 1, features: ['Up to 1000 words'], sales: 18, createdAt: new Date('2023-10-06T15:00:00Z').toISOString() },
    // Video & Animation
    { _id: '7', userId: '107', title: 'I will create a professional animated explainer video', desc: 'Engage your audience with a captivating animated video.', totalStars: 5, starNumber: 1, category: 'video', price: 2500, cover: 'https://images.pexels.com/photos/4057738/pexels-photo-4057738.jpeg?auto=compress&cs=tinysrgb&w=1600', images: [], shortTitle: 'Animated Explainer', shortDesc: 'Professional animated video', deliveryTime: 7, revisionNumber: 3, features: ['60 seconds', 'Voice over'], sales: 8, createdAt: new Date('2023-10-07T16:00:00Z').toISOString() },
    { _id: '8', userId: '108', title: 'I will edit your YouTube videos', desc: 'Professional video editing to make your content shine.', totalStars: 4, starNumber: 1, category: 'video', price: 800, cover: 'https://images.pexels.com/photos/4489749/pexels-photo-4489749.jpeg?auto=compress&cs=tinysrgb&w=1600', images: [], shortTitle: 'YouTube Video Editor', shortDesc: 'Professional video editing', deliveryTime: 3, revisionNumber: 2, features: ['Color correction', 'Transitions'], sales: 25, createdAt: new Date('2023-10-08T17:00:00Z').toISOString() },
    // Programming & Tech
    { _id: '9', userId: '109', title: 'I will build a responsive WordPress website', desc: 'A professional and mobile-friendly website for your business.', totalStars: 5, starNumber: 1, category: 'programming', price: 5000, cover: 'https://images.pexels.com/photos/1089438/pexels-photo-1089438.jpeg?auto=compress&cs=tinysrgb&w=1600', images: [], shortTitle: 'WordPress Website', shortDesc: 'Responsive WordPress website', deliveryTime: 10, revisionNumber: 3, features: ['5 pages', 'Contact form'], sales: 6, createdAt: new Date('2023-10-09T18:00:00Z').toISOString() },
    { _id: '10', userId: '110', title: 'I will fix bugs in your Python script', desc: 'Fast and efficient bug fixing for your Python code.', totalStars: 4, starNumber: 1, category: 'programming', price: 400, cover: 'https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg?auto=compress&cs=tinysrgb&w=1600', images: [], shortTitle: 'Python Bug Fix', shortDesc: 'Fast bug fixing', deliveryTime: 1, revisionNumber: 1, features: ['Code review'], sales: 40, createdAt: new Date('2023-10-10T19:00:00Z').toISOString() },
    // Business
    { _id: '11', userId: '111', title: 'I will be your virtual assistant', desc: 'Reliable virtual assistant for your administrative tasks.', totalStars: 5, starNumber: 1, category: 'business', price: 1000, cover: 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=1600', images: [], shortTitle: 'Virtual Assistant', shortDesc: 'Reliable virtual assistant', deliveryTime: 7, revisionNumber: 0, features: ['Data entry', 'Email management'], sales: 15, createdAt: new Date('2023-10-11T20:00:00Z').toISOString() },
    { _id: '12', userId: '112', title: 'I will create a professional business plan', desc: 'A comprehensive business plan to secure funding.', totalStars: 4, starNumber: 1, category: 'business', price: 3000, cover: 'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=1600', images: [], shortTitle: 'Business Plan', shortDesc: 'Professional business plan', deliveryTime: 14, revisionNumber: 2, features: ['Financial projections', 'Market analysis'], sales: 7, createdAt: new Date('2023-10-12T21:00:00Z').toISOString() },
    // Music & Audio
    { _id: '13', userId: '113', title: 'I will produce a custom beat for your song', desc: 'High-quality, original beats for your music projects.', totalStars: 5, starNumber: 1, category: 'music', price: 1200, cover: 'https://images.pexels.com/photos/3783471/pexels-photo-3783471.jpeg?auto=compress&cs=tinysrgb&w=1600', images: [], shortTitle: 'Custom Beat', shortDesc: 'Original beats', deliveryTime: 5, revisionNumber: 2, features: ['WAV file', 'Exclusive rights'], sales: 9, createdAt: new Date('2023-10-13T22:00:00Z').toISOString() },
    { _id: '14', userId: '114', title: 'I will mix and master your audio track', desc: 'Professional audio mixing and mastering services.', totalStars: 5, starNumber: 1, category: 'music', price: 900, cover: 'https://images.pexels.com/photos/164821/pexels-photo-164821.jpeg?auto=compress&cs=tinysrgb&w=1600', images: [], shortTitle: 'Mix and Master', shortDesc: 'Professional audio mixing', deliveryTime: 3, revisionNumber: 1, features: ['Noise reduction', 'EQ and compression'], sales: 11, createdAt: new Date('2023-10-14T23:00:00Z').toISOString() },
    // AI Services
    { _id: '15', userId: '115', title: 'I will build a custom AI chatbot', desc: 'An intelligent chatbot to automate your customer support.', totalStars: 4, starNumber: 1, category: 'ai', price: 4000, cover: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=1600', images: [], shortTitle: 'AI Chatbot', shortDesc: 'Custom AI chatbot', deliveryTime: 10, revisionNumber: 3, features: ['Integration with website', 'NLP'], sales: 4, createdAt: new Date('2023-10-15T23:59:00Z').toISOString() },
  ];
  saveToStorage('gigs', mockGigs);
}
if (!localStorage.getItem('orders')) {
  saveToStorage('orders', []);
}
if (!localStorage.getItem('reviews')) {
  saveToStorage('reviews', []);
}
if (!localStorage.getItem('conversations')) {
  saveToStorage('conversations', []);
}
if (!localStorage.getItem('messages')) {
  saveToStorage('messages', []);
}

// Auth API
export const authAPI = {
  register: async (data) => {
    const users = getFromStorage('users');
    const existingUser = users.find(u => u.username === data.username || u.email === data.email);
    if (existingUser) {
      throw new Error('User already exists!');
    }
    const newUser = { ...data, _id: Date.now().toString(), isSeller: false, sellerRequestStatus: data.isSeller ? 'pending' : 'none' };
    users.push(newUser);
    saveToStorage('users', users);
    return { data: { message: 'User has been created successfully!' } };
  },
  login: async (data) => {
    const users = getFromStorage('users');
    const user = users.find(u => u.username === data.username && u.password === data.password);
    if (!user) {
      throw new Error('Wrong password or username!');
    }
    localStorage.setItem('currentUser', JSON.stringify(user));
    return { data: user };
  },
  logout: async () => {
    localStorage.removeItem('currentUser');
    return { data: { message: 'User has been logged out.' } };
  },
};

// User API
export const userAPI = {
  getUser: async (id) => {
    const users = getFromStorage('users');
    const user = users.find(u => u._id === id);
    return { data: user };
  },
  updateUser: async (id, data) => {
    let users = getFromStorage('users');
    users = users.map(u => (u._id === id ? { ...u, ...data } : u));
    saveToStorage('users', users);
    return { data: users.find(u => u._id === id) };
  },
  deleteUser: async (id) => {
    let users = getFromStorage('users');
    users = users.filter(u => u._id !== id);
    saveToStorage('users', users);
    return { data: { message: 'User deleted' } };
  },
  requestSeller: async (data) => {
    // This would require admin logic, for now, we can just update the user
    return { data: { message: 'Seller request sent' } };
  },
  toggleFavouriteGig: async (gigId) => {
    const users = getFromStorage('users');
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) throw new Error('Not authenticated');
    const favourites = Array.isArray(currentUser.favourites) ? currentUser.favourites : [];
    const updatedFavourites = favourites.includes(gigId) ? favourites.filter(id => id !== gigId) : [...favourites, gigId];
    const updatedUser = { ...currentUser, favourites: updatedFavourites };
    const updatedUsers = users.map(u => (u._id === currentUser._id ? updatedUser : u));
    saveToStorage('users', updatedUsers);
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    return { data: { favourites: updatedFavourites } };
  },
  getFavouriteGigs: async () => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) return { data: [] };
    const gigs = getFromStorage('gigs');
    const favourites = Array.isArray(currentUser.favourites) ? currentUser.favourites : [];
    const favGigs = gigs.filter(g => favourites.includes(g._id));
    return { data: favGigs };
  },
};

// Gig API
export const gigAPI = {
  createGig: async (data) => {
    const gigs = getFromStorage('gigs');
    const newGig = { ...data, _id: Date.now().toString() };
    gigs.push(newGig);
    saveToStorage('gigs', gigs);
    return { data: newGig };
  },
  getGigs: async (params) => {
    let gigs = getFromStorage('gigs');

    if (params) {
      if (params.category && params.category !== "") {
        gigs = gigs.filter(g => g.category === params.category);
      }
      if (params.search && params.search.trim() !== "") {
        gigs = gigs.filter(g => g.title.toLowerCase().includes(params.search.toLowerCase()));
      }
      if (params.min) {
        gigs = gigs.filter(g => g.price >= parseInt(params.min));
      }
      if (params.max) {
        gigs = gigs.filter(g => g.price <= parseInt(params.max));
      }
      if (params.sort) {
        switch (params.sort) {
          case 'createdAt':
            gigs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            break;
          case 'sales':
            gigs.sort((a, b) => b.sales - a.sales);
            break;
          case 'rating':
            gigs.sort((a, b) => {
            const aRating = a.starNumber ? a.totalStars / a.starNumber : 0;
            const bRating = b.starNumber ? b.totalStars / b.starNumber : 0;
            return bRating - aRating;
          });
            break;
          case 'price_asc':
            gigs.sort((a, b) => a.price - b.price);
            break;
          case 'price_desc':
            gigs.sort((a, b) => b.price - a.price);
            break;
          default:
            break;
        }
      }
    }

    return { data: gigs };
  },
  getGig: async (id) => {
    const gigs = getFromStorage('gigs');
    const gig = gigs.find(g => g._id === id);
    return { data: gig };
  },
  getMyGigs: async () => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const gigs = getFromStorage('gigs');
    const myGigs = gigs.filter(g => g.userId === currentUser._id);
    return { data: myGigs };
  },
  deleteGig: async (id) => {
    let gigs = getFromStorage('gigs');
    gigs = gigs.filter(g => g._id !== id);
    saveToStorage('gigs', gigs);
    return { data: { message: 'Gig deleted' } };
  },
};

// Order API
export const orderAPI = {
  createOrder: async (data) => {
    const orders = getFromStorage('orders');
    const newOrder = { ...data, _id: Date.now().toString() };
    orders.push(newOrder);
    saveToStorage('orders', orders);
    return { data: newOrder };
  },
  getOrders: async () => {
    const orders = getFromStorage('orders');
    return { data: orders };
  },
  confirmOrder: async (id) => {
    let orders = getFromStorage('orders');
    orders = orders.map(o => (o._id === id ? { ...o, isCompleted: true } : o));
    saveToStorage('orders', orders);
    return { data: { message: 'Order confirmed' } };
  },
};

// Review API
export const reviewAPI = {
  createReview: async (data) => {
    const reviews = getFromStorage('reviews');
    const newReview = { ...data, _id: Date.now().toString() };
    reviews.push(newReview);
    saveToStorage('reviews', reviews);
    return { data: newReview };
  },
  getReviews: async (gigId) => {
    const reviews = getFromStorage('reviews');
    const gigReviews = reviews.filter(r => r.gigId === gigId);
    return { data: gigReviews };
  },
  deleteReview: async (id) => {
    let reviews = getFromStorage('reviews');
    reviews = reviews.filter(r => r._id !== id);
    saveToStorage('reviews', reviews);
    return { data: { message: 'Review deleted' } };
  },
};

// Conversation API
export const conversationAPI = {
  createConversation: async (data) => {
    const conversations = getFromStorage('conversations');
    const newConversation = { ...data, _id: Date.now().toString() };
    conversations.push(newConversation);
    saveToStorage('conversations', conversations);
    return { data: newConversation };
  },
  getConversations: async () => {
    const conversations = getFromStorage('conversations');
    return { data: conversations };
  },
  getSingleConversation: async (id) => {
    const conversations = getFromStorage('conversations');
    const conversation = conversations.find(c => c._id === id);
    return { data: conversation };
  },
  updateConversation: async (id) => {
    let conversations = getFromStorage('conversations');
    // Mock update logic
    saveToStorage('conversations', conversations);
    return { data: { message: 'Conversation updated' } };
  },
};

// Message API
export const messageAPI = {
  createMessage: async (data) => {
    const messages = getFromStorage('messages');
    const newMessage = { ...data, _id: Date.now().toString() };
    messages.push(newMessage);
    saveToStorage('messages', messages);
    return { data: newMessage };
  },
  getMessages: async (id) => {
    const messages = getFromStorage('messages');
    const conversationMessages = messages.filter(m => m.conversationId === id);
    return { data: conversationMessages };
  },
};

// Admin API (mocked, no real admin logic)
export const adminAPI = {
  getStats: async () => {
    const users = getFromStorage('users');
    const gigs = getFromStorage('gigs');
    const orders = getFromStorage('orders');
    const totalSellers = users.filter(u => u.isSeller).length;
    return { data: { totalUsers: users.length, totalSellers, totalGigs: gigs.length, totalOrders: orders.length } };
  },
  getUsers: async () => ({ data: getFromStorage('users') }),
  getGigs: async () => ({ data: getFromStorage('gigs') }),
  getSellerRequests: async () => ({ data: [] }),
  approveSeller: async (userId) => ({ data: { message: 'Seller approved' } }),
  rejectSeller: async (userId) => ({ data: { message: 'Seller rejected' } }),
  createEmployee: async (data) => ({ data: {} }),
  createGig: async (data) => ({ data: {} }),
  deleteGig: async (id) => ({ data: { message: 'Gig deleted' } }),
};

const api = {}; // No default export needed as we export named functions

export default api;

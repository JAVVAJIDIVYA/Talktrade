# Quick Start Guide - Enhanced Features

## 🎉 Talk Trade is Running!

**Access your website at:** http://localhost:5173

---

## Seed Sample Data (Employees & Gigs in INR)

To populate the app with up to **13 employees (sellers) per category** and their gigs, all with **Indian Rupees (₹)** pricing:

1. From the project root, go to the server folder: `cd "fsd pr2/server"`
2. Ensure `.env` has `MONGO_URI` set.
3. Run: `npm run seed`

This creates seller profiles (Indian names, cities) and one gig per seller in each category (design, marketing, writing, video, programming, business, music, ai). All prices are in INR. Seed seller password: **Seller@123**.

---

## New Features You Can Try

### 1. **Create a Professional Seller Profile**

1. Register as a seller (check "Activate seller account")
2. Go to your profile
3. Add professional details:
   - Skills (e.g., "Web Development", "Graphic Design")
   - Experience and Education
   - Languages you speak
   - Hourly rate in INR
   - Portfolio links

### 2. **Create Services with INR Pricing**

1. Click "Create New Service"
2. Set price in Indian Rupees (₹) - minimum ₹100
3. Add service details:
   - Title, description, category
   - Delivery time and revisions
   - Features included
   - Cover image and gallery

### 3. **Browse Employee Profiles**

1. Go to any service
2. Click on the seller's name or profile picture
3. View their complete profile:
   - **Professional Info**: Skills, experience, education
   - **Performance Stats**: Earnings, completed orders, ratings
   - **Detailed Ratings**: Communication, quality, delivery time, value
   - **All Services**: Browse their service portfolio

### 4. **Place Orders with INR Payment**

1. Browse services at `/gigs`
2. Click on a service you like
3. Review service details and seller profile
4. Click "Continue (₹X,XXX)" button
5. Payment details will show:
   - Amount in INR
   - Transaction ID
   - Payment method options:
     - UPI (GPay, PhonePe, Paytm)
     - Net Banking
     - Credit/Debit Card
     - Wallet

### 5. **Leave Detailed Reviews**

After completing an order:

1. Go to the service page
2. Find the "Leave a Review" section
3. Rate on multiple parameters:
   - ⭐ Overall rating (1-5 stars)
   - 💬 Communication
   - ⚡ Service Quality
   - ⏰ Delivery Time
   - 💰 Value for Money
4. Write your experience
5. Mark if you would recommend

### 6. **Track Your Performance (Sellers)**

View your profile to see:
- **Total Earnings**: In ₹ (Indian Rupees)
- **Completed Orders**: Number of successful projects
- **Average Rating**: Overall star rating
- **Detailed Ratings Breakdown**:
  - Communication: X/5
  - Service Quality: X/5
  - Delivery Time: X/5
  - Value for Money: X/5
- **Recommendation Rate**: % of clients who recommend you

### 7. **View Payment Details**

Go to "Orders" page to see:
- Order amount in ₹
- Payment method used
- Transaction ID
- Payment status

---

## Example Test Flow

### For Sellers (Employees)
```
1. Register → Enable seller account
2. Complete profile → Add skills, experience
3. Create service → Set ₹2,500 price
4. Wait for orders → Check notifications
5. Complete work → Mark order complete
6. View earnings → Check total in INR
```

### For Buyers (Clients)
```
1. Register → Create buyer account
2. Browse services → Filter by category
3. View seller profile → Check ratings & experience
4. Place order → Choose payment method
5. Receive work → Review and accept
6. Leave review → Rate on all parameters
```

---

## Currency Examples

- ₹500 = Five Hundred Rupees
- ₹5,000 = Five Thousand Rupees
- ₹50,000 = Fifty Thousand Rupees (₹50.00 K)
- ₹5,00,000 = Five Lakh Rupees (₹5.00 L)
- ₹1,00,00,000 = One Crore Rupees (₹1.00 Cr)

---

## Payment Methods

### UPI
- Google Pay
- PhonePe
- Paytm
- BHIM

### Net Banking
- All major banks supported

### Cards
- Credit Cards
- Debit Cards

### Wallets
- Paytm Wallet
- PhonePe Wallet
- Other digital wallets

---

## Tips for Best Results

### For Sellers
✅ Complete your profile 100%
✅ Add professional skills
✅ Upload quality service images
✅ Set competitive INR prices
✅ Respond quickly to buyers
✅ Deliver quality work on time
✅ Maintain high ratings

### For Buyers
✅ Check seller ratings before ordering
✅ Read detailed performance metrics
✅ Review seller's past work
✅ Communicate clearly
✅ Leave honest reviews
✅ Help others make informed decisions

---

## Keyboard Shortcuts

- `Ctrl + K` - Quick search
- `F5` - Refresh page
- `Esc` - Close modals/dropdowns

---

## Need Help?

- All features are working locally
- Data is stored in your local MongoDB
- For deployment, see [DEPLOYMENT.md](./DEPLOYMENT.md)
- For technical details, see [ENHANCED_FEATURES.md](./ENHANCED_FEATURES.md)

---

**Enjoy using Talk Trade! 🚀**

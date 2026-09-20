# 🎒 ClaimIt — Campus Lost & Found Platform

> A full-stack MERN web application where university students can report lost and found items, search for matches, upload images, manage claims, and receive email notifications — all in one place.

🌐 **Live Demo:** [claimit-campus.vercel.app](https://claimit-campus.vercel.app)  
📦 **Backend API:** [claimit-api.onrender.com](https://claimit-api.onrender.com)

---

## Features

### Core Functionality
- 🔍 **Browse & Search** — debounced search across title, description, and location with type and category filters
- 📋 **Report Items** — post lost or found items with image upload, preview, and Cloudinary storage
- 🙋 **Claim System** — submit claims with owner confirmation dialog before approve/reject
- ✅ **Contact Reveal** — owner's contact details revealed to claimant only after approval
- 🔐 **JWT Authentication** — stateless auth with protected routes and ownership checks

### Notifications
- 📧 **Email Notifications** — automatic emails via Nodemailer on claim submission, approval, and rejection
- 🔔 **Toast Notifications** — real-time in-app success and error feedback with spam folder reminders

### User Dashboard
- 🗂️ **My Posts** — manage your posted items with inline claims panel showing all claim requests
- 📬 **My Claims** — track all submitted claims grouped by pending, approved, rejected
- 📊 **Live Stats** — platform-wide items reported, resolved, students helped, claims made

### Security
- 🛡️ **Rate Limiting** — 100 requests per 15 minutes per IP via express-rate-limit
- 🧹 **NoSQL Injection Prevention** — express-mongo-sanitize on all inputs
- 🔒 **Ownership Checks** — every protected action verifies the requesting user owns the resource
- ⏱️ **Token Expiry Handling** — automatic logout and redirect on JWT expiry

### UX Polish
- 🖼️ **Image Lightbox** — click any item image to view fullscreen, click anywhere to close
- ⬆️ **Scroll to Top** — automatic scroll reset on every page navigation
- 💀 **Skeleton Loading** — animated placeholders while data loads
- 📱 **Fully Responsive** — works on mobile, tablet, and desktop
- 🎨 **Premium UI** — Plus Jakarta Sans font, purple brand identity, smooth CSS animations

---

## 🛠️ Tech Stack

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| React | 18 | UI library — functional components and hooks |
| Vite | Latest | Build tool and dev server |
| Tailwind CSS | v4 | Utility-first styling |
| React Router | v6 | Client-side routing with protected routes |
| Axios | Latest | HTTP client with request and response interceptors |
| Context API | Built-in | Global auth state — no Redux needed |
| react-hot-toast | Latest | Toast notification system |

### Backend
| Technology | Purpose |
|---|---|
| Node.js | Runtime environment |
| Express.js | Web framework with Router pattern |
| MongoDB | NoSQL document database |
| Mongoose | ODM with schema validation and populate |
| JWT + bcryptjs | Stateless authentication and password hashing |
| Multer | Multipart form data handling for file uploads |
| Cloudinary | Cloud image storage and CDN |
| Nodemailer | Transactional email notifications via Gmail |
| express-rate-limit | API rate limiting per IP |
| express-mongo-sanitize | NoSQL injection prevention |

### Deployment
| Service | What runs there |
|---|---|
| Vercel | React frontend — auto-deploys on git push |
| Render | Node/Express backend API |
| MongoDB Atlas | Cloud database — M0 free tier |
| Cloudinary | Image storage — free tier, claimit folder |

---

## 📁 Project Structure

```
claimit/
├── client/                         # React frontend
│   ├── public/
│   │   ├── claimit-logo.png
│   │   └── favicon.png
│   └── src/
│       ├── components/
│       │   ├── Navbar.jsx          # Sticky nav with avatar dropdown
│       │   ├── Footer.jsx          # Navy footer with social links
│       │   ├── ItemCard.jsx        # Reusable card with hover animation
│       │   ├── ClaimsPanel.jsx     # Inline claim manager for item owners
│       │   ├── ProtectedRoute.jsx  # Auth guard for private pages
│       │   └── ScrollToTop.jsx     # Auto scroll reset on navigation
│       ├── pages/
│       │   ├── HomePage.jsx        # Hero + Stats + How It Works + Recent Items
│       │   ├── ItemsPage.jsx       # Full browse with search and filters
│       │   ├── ItemDetailPage.jsx  # Single item + lightbox + claim button
│       │   ├── PostItemPage.jsx    # Report form with image preview
│       │   ├── MyPostsPage.jsx     # User's posts + inline claims management
│       │   ├── MyClaimsPage.jsx    # User's submitted claims with status
│       │   ├── LoginPage.jsx       # Login with toast feedback
│       │   ├── RegisterPage.jsx    # Register with toast feedback
│       │   └── NotFoundPage.jsx    # Custom 404 page
│       ├── context/
│       │   └── AuthContext.jsx     # Global auth state + login/logout
│       └── services/
│           └── api.js              # Axios instance with interceptors
│
└── server/                         # Node.js backend
    ├── controllers/
    │   ├── authController.js       # Register, login, JWT generation
    │   ├── itemController.js       # Item CRUD + stats + search
    │   └── claimController.js      # Claim lifecycle + email triggers
    ├── middleware/
    │   └── authMiddleware.js       # JWT verification + req.user attachment
    ├── models/
    │   ├── User.js                 # User schema with bcrypt password
    │   ├── Item.js                 # Item schema with enum validation
    │   └── Claim.js                # Claim schema with status tracking
    ├── routes/
    │   ├── authRoutes.js           # /api/auth
    │   ├── itemRoutes.js           # /api/items
    │   └── claimRoutes.js          # /api/claims
    ├── utils/
    │   ├── cloudinary.js           # Multer + Cloudinary storage config
    │   └── sendEmail.js            # Nodemailer transporter + email templates
    └── server.js                   # Entry point — middleware, routes, DB connect
```

---

## 🗄️ Data Models

### User
```js
{
  name:      String, required
  email:     String, required, unique, lowercase
  password:  String, required, bcrypt hashed
  createdAt: Date,   auto
}
```

### Item
```js
{
  title:       String, required
  description: String, required
  category:    String, enum: ['Electronics','Clothing','Books','Accessories','Other']
  type:        String, enum: ['lost', 'found']
  imageURL:    String, Cloudinary URL
  location:    String, required
  date:        Date,   required
  status:      String, enum: ['active', 'resolved'], default: 'active'
  postedBy:    ObjectId → ref User
  createdAt:   Date, auto
}
```

### Claim
```js
{
  item:       ObjectId → ref Item
  claimedBy:  ObjectId → ref User
  status:     String, enum: ['pending', 'approved', 'rejected'], default: 'pending'
  createdAt:  Date, auto
}
```


---

## 🔌 API Endpoints

### Auth — `/api/auth`
| Method | Route | Access | Description |
|---|---|---|---|
| POST | `/register` | Public | Register new user, returns JWT |
| POST | `/login` | Public | Login with credentials, returns JWT |

### Items — `/api/items`
| Method | Route | Access | Description |
|---|---|---|---|
| GET | `/` | Public | All items — supports ?search, ?type, ?category |
| GET | `/stats` | Public | Platform stats — total items, resolved, users, claims |
| GET | `/my` | Protected | Logged-in user's posted items |
| GET | `/:id` | Public | Single item with populated owner |
| POST | `/` | Protected | Create item with optional image upload |
| PUT | `/:id` | Protected + Owner | Update item fields |
| DELETE | `/:id` | Protected + Owner | Delete item + cascade delete its claims |

### Claims — `/api/claims`
| Method | Route | Access | Description |
|---|---|---|---|
| POST | `/:itemId` | Protected | Submit claim — sends email to item owner |
| GET | `/my/all` | Protected | All claims submitted by logged-in user |
| GET | `/:itemId` | Protected | All claims on a specific item |
| PUT | `/:id/approve` | Protected + Owner | Approve claim → resolves item → emails claimant |
| PUT | `/:id/reject` | Protected + Owner | Reject claim → emails claimant |

---

## ⚙️ Local Development

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (free)
- Cloudinary account (free)
- Gmail account with 2FA enabled for App Password

### 1. Clone the repository

```bash
git clone https://github.com/goyal-nandini/claimit.git
cd claimit
```

### 2. Backend setup

```bash
cd server
npm install --legacy-peer-deps
```

Create `server/.env`:

```env
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_random_secret_string
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
PORT=5000
CLIENT_URL=http://localhost:5173
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_gmail_app_password
```

> 💡 **Gmail App Password:** Google Account → Security → 2-Step Verification → App Passwords → Generate

```bash
npm run dev
```

Backend runs at `http://localhost:5000`

### 3. Frontend setup

```bash
cd client
npm install
```

Create `client/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

```bash
npm run dev
```

Frontend runs at `http://localhost:5173`

---

## 🚀 Deployment Guide

### Backend → Render

| Setting | Value |
|---|---|
| Root Directory | `server` |
| Build Command | `npm install --legacy-peer-deps` |
| Start Command | `node server.js` |

Add all `.env` variables to Render's Environment settings. Update `CLIENT_URL` to your Vercel URL.

### Frontend → Vercel

| Setting | Value |
|---|---|
| Root Directory | `client` |
| Build Command | `npm run build` |
| Output Directory | `dist` |

Add `VITE_API_URL=https://your-render-url.onrender.com/api` to Vercel's Environment Variables. Redeploy after adding.

| Layer | Service | Config |
|---|---|---|
| Frontend | Vercel | Root: `client`, Build: `npm run build`, Output: `dist` |
| Backend | Render | Root: `server`, Build: `npm install --legacy-peer-deps`, Start: `node server.js` |
| Database | MongoDB Atlas | Free tier M0 cluster |
| Images | Cloudinary | Free tier, `claimit` folder |

---

## 🧠 Key Engineering Decisions

**JWT Stateless Auth**
After login the server signs a token containing the user's ID. The client sends this token on every request. No server-side sessions — any server instance can verify the token independently.

**Mongoose Schema Validation**
All data rules live in the model — required fields, enum values, type constraints. Controllers stay clean and validation is consistent across every entry point.

**Debounced Search**
A 400ms debounce on the search input prevents an API call on every keystroke. Only one clean request fires after the user stops typing — reducing unnecessary DB queries by ~80%.

**Separate Claim Model**
Claims are their own collection instead of an array inside Item. This allows multiple independent claims per item, clean status tracking per claim, and simple cascade deletion when an item is removed.

**Ownership Checks in Controller**
After JWT verification confirms who you are, the controller compares `req.user.id` against `item.postedBy`. Authorization happens at two layers — authentication then ownership.

**Contact Reveal After Approval**
Instead of building a messaging system, the owner's contact details are revealed to the claimant only after approval. Closes the handover loop without extra infrastructure.

**FormData for Image Upload**
JSON cannot carry binary file data. FormData bundles text fields and the image file together. Multer on the backend processes the multipart request, validates type and size, and streams directly to Cloudinary before the controller runs.

**Cascade Delete on Item Removal**
When an item is deleted, all associated claims are deleted first — `Claim.deleteMany({ item: item._id })` — preventing orphaned records in the database.

**Email Notifications via Nodemailer**
Three automated emails trigger inside claim controllers — claim submitted (to owner), claim approved (to claimant with owner contact), claim rejected (to claimant). Email failures are caught silently so the main flow never breaks.

---

## 🔒 Security Checklist

- [x] Passwords hashed with bcrypt (cost factor 10)
- [x] JWT signed with secret from environment variable
- [x] All secrets stored in `.env` — never committed to git
- [x] CORS restricted to allowed origins only
- [x] Rate limiting — 100 requests per 15 min per IP
- [x] NoSQL injection prevention via mongo-sanitize
- [x] File upload validation — type and size limits
- [x] Ownership verified before every write operation
- [x] Token expiry handled — auto logout on 401
- [x] Claim blocked on resolved items

---

## 🗺️ Future Improvements

- [ ] Email notifications on claim submission *(Nodemailer — in progress)*
- [ ] Pagination on items list
- [ ] Redis caching for stats endpoint
- [ ] MongoDB text indexes for search performance
- [ ] Refresh token implementation
- [ ] Smart item matching by category and location
- [ ] In-app notification bell
- [ ] Soft delete for user accounts
- [ ] Admin panel for moderation

---

## Author

**Nandini Goyal**  
B.Tech Computer Science Engineering  
[GitHub](https://github.com/goyal-nandini) · [LinkedIn](https://www.linkedin.com/in/nandini-goyal29/)

---

> Built from scratch as a portfolio project — demonstrating full-stack MERN development, REST API design, JWT authentication, cloud image storage, transactional email, and production deployment across three cloud services.
<!--# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.-->

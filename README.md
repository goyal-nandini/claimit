# 🎒 ClaimIt — Campus Lost & Found Platform

> A full-stack MERN web application where university students can report lost and found items, search for matches, upload images, and manage claims.

🌐 **Live Demo:** [claimit-campus.vercel.app](https://claimit-campus.vercel.app)  
📦 **Backend API:** [claimit-api.onrender.com](https://claimit-api.onrender.com)

---

## Features

### Core
- 🔍 **Browse & Search** — search by title, description, location with debounced backend queries
- 📋 **Report Items** — post lost or found items with image upload via Cloudinary
- 🙋 **Claim System** — claim items, owner approves or rejects with confirmation
- ✅ **Contact Reveal** — claimant sees owner's contact details after claim approval
- 🔐 **JWT Authentication** — secure register, login, protected routes

### User Experience
- 📊 **Live Stats** — items reported, resolved, students helped, claims made
- 🗂️ **My Posts** — manage your posted items, view and action incoming claims
- 📬 **My Claims** — track status of all your submitted claims (pending/approved/rejected)
- 🔔 **Toast Notifications** — real-time success and error feedback
- 📱 **Fully Responsive** — works on mobile and desktop
- 🎨 **Premium UI** — Plus Jakarta Sans font, purple brand, smooth animations

---

## Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 18 | UI library with functional components and hooks |
| Vite | Build tool and dev server |
| Tailwind CSS | Utility-first styling |
| React Router v6 | Client-side routing |
| Axios | HTTP client with request interceptors |
| Context API | Global auth state management |
| react-hot-toast | Toast notification system |

### Backend
| Technology | Purpose |
|---|---|
| Node.js | Runtime environment |
| Express.js | Web framework with Router pattern |
| MongoDB | NoSQL database |
| Mongoose | ODM with schema validation |
| JWT + bcryptjs | Authentication and password hashing |
| Multer + Cloudinary | Image upload and cloud storage |

### Deployment
| Service | Purpose |
|---|---|
| Vercel | Frontend hosting |
| Render | Backend API hosting |
| MongoDB Atlas | Cloud database |
| Cloudinary | Image CDN |

---

## Project Structure

```
claimit/
├── client/                   # React frontend
│   ├── public/
│   │   └── claimit-logo.png
│   └── src/
│       ├── components/
│       │   ├── Navbar.jsx
│       │   ├── Footer.jsx
│       │   ├── ItemCard.jsx
│       │   ├── ClaimsPanel.jsx
│       │   └── ProtectedRoute.jsx
│       ├── pages/
│       │   ├── HomePage.jsx
│       │   ├── ItemsPage.jsx
│       │   ├── ItemDetailPage.jsx
│       │   ├── PostItemPage.jsx
│       │   ├── MyPostsPage.jsx
│       │   ├── MyClaimsPage.jsx
│       │   ├── LoginPage.jsx
│       │   ├── RegisterPage.jsx
│       │   └── NotFoundPage.jsx
│       ├── context/
│       │   └── AuthContext.jsx
│       └── services/
│           └── api.js
│
└── server/                   # Node.js backend
    ├── controllers/
    │   ├── authController.js
    │   ├── itemController.js
    │   └── claimController.js
    ├── middleware/
    │   └── authMiddleware.js
    ├── models/
    │   ├── User.js
    │   ├── Item.js
    │   └── Claim.js
    ├── routes/
    │   ├── authRoutes.js
    │   ├── itemRoutes.js
    │   └── claimRoutes.js
    ├── utils/
    │   └── cloudinary.js
    └── server.js
```

---

## Data Models

### User
```js
{ name, email, password (bcrypt hashed), createdAt }
```

### Item
```js
{ title, description, category, type (lost/found),
  imageURL, location, date, status (active/resolved),
  postedBy → ref User }
```

### Claim
```js
{ item → ref Item, claimedBy → ref User,
  status (pending/approved/rejected) }
```

---

## API Endpoints

### Auth
| Method | Route | Access | Description |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Register new user |
| POST | `/api/auth/login` | Public | Login, returns JWT |

### Items
| Method | Route | Access | Description |
|---|---|---|---|
| GET | `/api/items` | Public | Get all items (with search/filter query params) |
| GET | `/api/items/stats` | Public | Get platform statistics |
| GET | `/api/items/my` | Protected | Get logged-in user's items |
| GET | `/api/items/:id` | Public | Get single item |
| POST | `/api/items` | Protected | Create item with image |
| PUT | `/api/items/:id` | Protected + Owner | Update item |
| DELETE | `/api/items/:id` | Protected + Owner | Delete item |

### Claims
| Method | Route | Access | Description |
|---|---|---|---|
| POST | `/api/claims/:itemId` | Protected | Submit a claim |
| GET | `/api/claims/my/all` | Protected | Get user's submitted claims |
| GET | `/api/claims/:itemId` | Protected | Get claims for an item |
| PUT | `/api/claims/:id/approve` | Protected + Owner | Approve claim |
| PUT | `/api/claims/:id/reject` | Protected + Owner | Reject claim |

---

## Local Development

### Prerequisites
- Node.js 18+
- MongoDB Atlas account
- Cloudinary account

### Setup

**1. Clone the repo**
```bash
git clone https://github.com/goyal-nandini/claimit.git
cd claimit
```

**2. Backend setup**
```bash
cd server
npm install
```

Create `server/.env`:
```
MONGO_URI=your_mongodb_atlas_uri
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
PORT=5000
CLIENT_URL=http://localhost:5173
```

```bash
npm run dev
```

**3. Frontend setup**
```bash
cd client
npm install
```

Create `client/.env`:
```
VITE_API_URL=http://localhost:5000/api
```

```bash
npm run dev
```

**4. Open** `http://localhost:5173`

---

## Key Engineering Decisions

**JWT Stateless Auth** — After you login, the server gives you a token — like a wristband at an event. You show that wristband on every request instead of logging in again every time.

**Mongoose Schema Validation** — I defined rules for my data in the model file — like "type must be lost or found, nothing else". So I never have to check this manually in my code, MongoDB rejects bad data automatically.

**Debounced Search** — Without this, typing "wallet" fires 6 API calls — one per letter. With debounce, it waits until you stop typing then fires just one. Saves unnecessary server load.

**Ownership Middleware Pattern** — Before letting someone delete or edit an item, I check that the person making the request is the same person who posted it. This check runs automatically before the controller — so I never forget it.

**Separate Claim Model** — I could have stored claims as an array inside the Item — but then one item can only track one claim. Making it a separate table means many people can claim the same item, each with their own status.

**Contact Reveal After Approval** — Instead of building WhatsApp inside my app, I just show the owner's email to the claimant after approval. Simple solution, same result — they can coordinate offline.

**FormData for Image Upload** — You can't send a photo as JSON — it's binary data. FormData is the browser's way of packaging text fields and files together so the server can receive both at once.


---

## Deployment

| Layer | Service | Config |
|---|---|---|
| Frontend | Vercel | Root: `client`, Build: `npm run build`, Output: `dist` |
| Backend | Render | Root: `server`, Build: `npm install --legacy-peer-deps`, Start: `node server.js` |
| Database | MongoDB Atlas | Free tier M0 cluster |
| Images | Cloudinary | Free tier, `claimit` folder |

---

## Author

**Nandini Goyal**  
B.Tech Computer Science Engineering  
[GitHub](https://github.com/goyal-nandini) · [LinkedIn](https://www.linkedin.com/in/nandini-goyal29/)

---

> Built from scratch as a portfolio project demonstrating full-stack MERN development, REST API design, JWT authentication, cloud image storage, and production deployment.
<!--# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.-->

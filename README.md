# 🤝 Volunteer Connect

A social media platform for volunteers and social service workers. It works as a portfolio to showcase volunteer impact, a community space to connect and socialize, and a source of inspiration for new volunteers.

🔗 **Live demo:** [volunteer-connect-sandy.vercel.app](https://volunteer-connect-sandy.vercel.app/)

> ⏳ **Note:** The backend runs on a free tier on Render and may sleep after periods of inactivity. The first request can take 30–60 seconds to wake up.

---

## 📸 Screenshots

| Landing | Feed |
| :---: | :---: |
| *(Landing Preview)* | *(Feed Preview)* |

| Profile (Portfolio) | Explore |
| :---: | :---: |
| *(Portfolio Preview)* | *(Explore Preview)* |

---

## ✨ Features

- **Authentication:** Sign up and log in with JWT-based auth and hashed passwords with bcrypt.
- **Two Roles:** Volunteer and Social Service Worker, each with role-specific profile fields.
- **Portfolio Profile:** Bio, causes, location, volunteer activities list, and total verified hours contributed.
- **Community Feed:** Create posts (text + optional image), like, and comment.
- **Explore:** Discover volunteers and social workers filtered by cause or location.
- **Impact Stories:** A dedicated Inspire section to motivate new volunteers with milestone metrics.
- **Protected Routes:** Private pages require login; unauthenticated requests are smoothly redirected.
- **Responsive Design:** 60-30-10 color palette with seamless mobile and desktop experience.

---

## 🛠️ Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React (Vite), React Router, Axios, CSS (Design System) |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB, Mongoose |
| **Auth** | JSON Web Tokens (JWT), bcryptjs |
| **Deployment** | Vercel (frontend), Render (backend), MongoDB Atlas (database) |
| **Tools** | Git, GitHub, Postman, VS Code |

---

## 📁 Project Structure

```text
volunteer-connect/
├── client/                     # React frontend (Vite)
│   ├── src/
│   │   ├── components/         # Reusable UI components (Navbar, Footer, PostCard, Modals)
│   │   ├── pages/              # Landing, Login, Signup, Home, Explore, Stories, Profile, Settings
│   │   ├── context/            # AuthContext (state & session management)
│   │   ├── services/           # API (Axios setup with JWT interceptors)
│   │   ├── constants/          # Causes, availability, and skills constants
│   │   ├── App.jsx             # React Router route definitions & layouts
│   │   └── main.jsx
│   ├── vercel.json             # Vercel SPA client-side routing rewrites
│   └── package.json
│
├── server/                     # Node/Express backend
│   ├── models/                 # User, Activity, Post, Story
│   ├── routes/                 # auth, users, posts, stories, activities
│   ├── middleware/             # JWT auth middleware
│   ├── seed/                   # Pre-seeded community data
│   ├── services/               # Mock data store fallback
│   ├── index.js                # Express app entry point & MongoDB connection
│   └── package.json
│
└── README.md
```

---

## 🗺️ App Routes

| Route | Page | Access |
| :--- | :--- | :--- |
| `/` | Landing | Public |
| `/login` | Login | Public |
| `/signup` | Sign up (choose role) | Public |
| `/home` | Community feed | Private |
| `/explore` | Find people by cause / location | Public / Private |
| `/stories` | Impact stories | Public / Private |
| `/profile/:id` | Portfolio profile | Private |
| `/settings` | Edit profile, change password | Private |

---

## 🗃️ Data Models

- **User**: `name`, `email`, `password` (hashed), `role` (`volunteer` or `worker`), `location`, `causes`, `bio`, `avatar`, `skills`, `totalHours`, plus role-specific fields (`availability` for volunteers; `organization`, `designation`, `website` for workers).
- **Activity**: `user`, `title`, `organization`, `date`, `hours`, `description`, `cause`.
- **Post**: `author`, `content`, `image`, `cause`, `likes`, `comments`.
- **Story**: `author`, `authorName`, `organization`, `title`, `story`, `keyImpact`, `hoursServed`, `cause`, `coverImage`, `inspires`.

---

## 🚀 Getting Started (Run Locally)

### Prerequisites
- [Node.js](https://nodejs.org/) v18 or later
- [MongoDB](https://www.mongodb.com/try/download/community) running locally, or a MongoDB Atlas connection string
- Git

### 1. Clone the repository
```bash
git clone https://github.com/<your-username>/volunteer-connect.git
cd volunteer-connect
```

### 2. Set up the backend
```bash
cd server
npm install
```

Create a `server/.env` file:
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/volunteer_connect
JWT_SECRET=your_long_random_secret
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

> **Tip:** Generate a strong `JWT_SECRET`:
> ```bash
> node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
> ```

Start the server:
```bash
npm run dev
```
*The API runs at `http://localhost:5000`. Check health at `http://localhost:5000/api/health`.*

### 3. Set up the frontend
Open a new terminal:
```bash
cd client
npm install
```

Create a `client/.env` file:
```env
VITE_API_URL=http://localhost:5000/api
```

Start the app:
```bash
npm run dev
```
*The app runs at `http://localhost:5173`.*

---

## 🔐 Environment Variables

### Server (`server/.env`)
| Variable | Description |
| :--- | :--- |
| `PORT` | Port the server runs on (e.g. `5000`) |
| `MONGODB_URI` | MongoDB connection string (local or Atlas) |
| `JWT_SECRET` | Secret used to sign JWT tokens |
| `CLIENT_URL` | Frontend URL allowed by CORS |
| `NODE_ENV` | `development` or `production` |

### Client (`client/.env`)
| Variable | Description |
| :--- | :--- |
| `VITE_API_URL` | Base URL of the backend API (e.g. `https://your-api.onrender.com/api`) |

> ⚠️ **Never commit `.env` files.** They are ignored in `.gitignore`.

---

## 🔌 API Overview

### Auth
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Create an account (Volunteer or Worker) |
| `POST` | `/api/auth/login` | Log in and receive a JWT token |
| `GET` | `/api/auth/me` | Get the currently authenticated user |
| `POST` | `/api/auth/forgot-password` | Generate password reset code |
| `POST` | `/api/auth/reset-password` | Reset password using reset code |

### Users
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/users/explore` | Search & filter users (`?cause=&location=&search=&role=`) |
| `GET` | `/api/users/:id` | Get a user's impact portfolio and activities |
| `PUT` | `/api/users/profile` | Update current user's profile |
| `PUT` | `/api/users/change-password` | Change account password |

### Activities (Portfolio)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/activities` | Add a volunteer activity & recalculate hours |
| `PUT` | `/api/activities/:id` | Edit an activity |
| `DELETE` | `/api/activities/:id` | Delete an activity & update total hours |

### Posts & Inspire Stories
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/posts` | List community feed posts (`?cause=`) |
| `POST` | `/api/posts` | Create a post with optional image |
| `POST` | `/api/posts/:id/like` | Like or unlike a post |
| `POST` | `/api/posts/:id/comment` | Comment on a post |
| `DELETE` | `/api/posts/:id` | Delete a post |
| `GET` | `/api/stories` | List impact stories (`?cause=`) |
| `POST` | `/api/stories` | Publish an impact story |
| `POST` | `/api/stories/:id/inspire` | React/inspire on an impact story |

*Protected endpoints require the header `Authorization: Bearer <token>`.*

---

## ☁️ Deployment

- **Frontend:** Vercel. Set `VITE_API_URL` to the backend URL with `/api`. A `vercel.json` rewrite routes all traffic to `index.html` for React Router.
- **Backend:** Render. Set `MONGODB_URI`, `JWT_SECRET`, `CLIENT_URL`, and `NODE_ENV=production`.
- **Database:** MongoDB Atlas with network access enabled (`0.0.0.0/0`).

---

## 🔮 Future Improvements

- Image uploads for posts and profile photos via Cloudinary or S3
- Follow and connection system for a personalized feed
- Real-time notifications bell
- Volunteer badges and hour milestone rewards
- Events and volunteer recruitment calls (Opportunity Board)
- Public shareable portfolio link with verified badges
- Password reset via transactional email service (Resend / SendGrid)

---

## 🧠 What I Learned

- Building a full MERN stack app from scratch, from UI/UX design tokens to deployment
- Implementing secure JWT authentication with bcrypt and protected routes
- Designing clean, scalable REST APIs and MongoDB schemas
- Managing global state with React hooks and Context API
- Handling CORS, environment variables, and zero-downtime production deployment

---

## 👤 Author

**Abishek K**  
Frontend Developer (React.js) | MCA Graduate  
📧 [abishek014k@gmail.com](mailto:abishek014k@gmail.com)  
💼 [LinkedIn](https://www.linkedin.com/in/abishek-k-a426302a6)  
🐙 [GitHub](https://github.com/Abishek-1401)

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

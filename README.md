# CRUDZASO - Academic Task Management System

A complete web application for managing academic tasks with role-based access control (students and administrators).

## ⚡ Quick Start

### Prerequisites
- Node.js installed
- Modern web browser

### Installation

1. **Install dependencies**
```bash
npm install
```

2. **Start JSON Server** (in one terminal)
```bash
npm run server
```
This will start the API on `http://localhost:3000`

3. **Open the application**
Simply open `index.html` in your browser or use a local server:
```bash
npx serve
```

## 🗂️ Project Structure

```
ejemplo/
├── index.html              # Login page
├── pages/
│   ├── register.html       # User registration
│   ├── dashboard.html      # Admin dashboard
│   ├── tasks.html          # Task management (students)
│   ├── create-task.html    # Create/edit tasks
│   └── profile.html        # User profile
├── assets/
│   ├── css/
│   │   └── styles.css      # Custom styles
│   └── js/
│       ├── login.js        # Authentication logic
│       ├── register.js     # Registration logic
│       ├── dashboard.js    # Admin dashboard logic
│       ├── tasks.js        # Task management logic
│       ├── create-task.js  # Task creation/editing
│       └── profile.js      # Profile management
├── db.json                 # JSON Server database
└── package.json
```

## ⭐ Features

### For Students (role: student)
- ✅ Register new account
- ✅ Login with credentials
- ✅ View only their own tasks
- ✅ Create new tasks
- ✅ Edit their tasks
- ✅ Delete their tasks
- ✅ Change task status (Pending → In Progress → Completed)
- ✅ View and edit profile
- ✅ Logout

### For Administrators (role: admin)
- ✅ Login with admin credentials
- ✅ View dashboard with metrics
- ✅ View ALL tasks from all users
- ✅ Edit any task
- ✅ Delete any task
- ✅ Change task statuses
- ✅ View and edit profile
- ✅ Logout

## 🛠️ API Endpoints

The application uses JSON Server which provides the following endpoints:

### Users
- `GET /users` - Get all users
- `GET /users/:id` - Get user by ID
- `POST /users` - Create new user
- `PATCH /users/:id` - Update user
- `DELETE /users/:id` - Delete user

### Tasks
- `GET /tasks` - Get all tasks
- `GET /tasks/:id` - Get task by ID
- `GET /tasks?userId=:userId` - Get tasks by user
- `POST /tasks` - Create new task
- `PATCH /tasks/:id` - Update task
- `DELETE /tasks/:id` - Delete task

## 💡 Test Credentials

### Administrator
- Email: `admin@crudzaso.edu`
- Password: `admin123`
- Role: admin

### Student 1
- Email: `maria@university.edu`
- Password: `12345`
- Role: student

### Student 2
- Email: `juan@university.edu`
- Password: `password`
- Role: student

## 🔒 Security Features

- ✅ Session persistence with localStorage
- ✅ Role-based access control
- ✅ Route protection (redirects if not authenticated)
- ✅ Users can only see/edit their own tasks
- ✅ Admins have full access to all tasks

## 🎨 Technologies Used

- **HTML5** - Structure
- **CSS3** - Styling
- **Bootstrap 5.3.2** - UI Framework
- **Bootstrap Icons** - Icons
- **JavaScript (Vanilla)** - Logic
- **SweetAlert2** - Beautiful alerts
- **JSON Server** - Fake REST API

## 📝 Development Notes

- All user-facing text is in English
- All code comments are in Spanish
- The application follows a clean, modern design based on Figma mockups
- Fully responsive design for mobile and desktop
- No frameworks like React/Vue/Angular - pure JavaScript

## 🚀 Building for Production

For production, you would:
1. Replace JSON Server with a real backend API
2. Add password hashing (bcrypt)
3. Implement JWT tokens for authentication
4. Add input sanitization
5. Implement proper error handling
6. Add unit and integration tests

## 📱 Browser Compatibility

- Chrome (recommended)
- Firefox
- Safari
- Edge

## 👨‍💻 Author

Created for the JavaScript Module 3 Performance Assessment

---

**Note**: This is an educational project. In a real-world scenario, never store passwords in plain text or use localStorage for sensitive authentication data.

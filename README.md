# 📊 Subscription Tracker

A full-stack application that helps users automatically track and manage subscriptions using **Google OAuth**, **OpenAI**, and a clean **React + Express** architecture.

---

## 🚀 Features

### 🔐 Authentication
- Google OAuth login  
- Secure user session handling  
- Token stored safely on server (never exposed to frontend)

### 📬 Gmail Integration
- Reads Gmail emails using Google API  
- Extracts subscription info automatically  
- Identifies:
  - Renewal dates  
  - Subscription names  
  - Prices  
  - Free trials  
  - Service categories  

### 🤖 AI Processing
- Uses OpenAI model to:
  - Summarize subscription emails  
  - Detect subscription renewals  
  - Extract structured data  
  - Provide insights and reminders  

### 📊 Dashboard
- Clean React dashboard  
- Shows all subscriptions  
- Filters: Active, Expired, Trial  
- Visual analytics (optional)

### 🧩 Tech Stack
#### **Backend**
- Node.js + Express
- Google OAuth2
- Gmail API
- OpenAI API
- Token & session management
- REST API endpoints

#### **Frontend**
- React + Vite / CRA (your setup)
- Axios for API calls
- Modern UI components
- Authentication flow with Google OAuth

---

## 📁 Project Structure

Subscription-tracker/
│
├── Backend/
│ ├── src/
│ │ ├── routes/
│ │ ├── controllers/
│ │ ├── services/
│ │ ├── config/
│ │ └── index.js
│ ├── package.json
│ └── .env (NOT committed)
│
├── frontend/
│ ├── src/
│ ├── public/
│ └── package.json
│
├── docker-compose.yml
└── README.md 




---

## 🔧 Installation

### 1️⃣ Clone the repository

```bash
git clone https://github.com/Tjeyy777/Subscription-tracker-.git
cd Subscription-tracker


🛠 Backend Setup
Install dependencies
cd Backend
npm install

Create .env file
GOOGLE_CLIENT_ID=your_id
GOOGLE_CLIENT_SECRET=your_secret
OPENAI_API_KEY=your_openai_key
SESSION_SECRET=some_random_string

Start the server
npm start


💻 Frontend Setup
cd frontend
npm install
npm start


🔄 Running Full Stack with Docker
docker-compose up --build


🔐 Security Rules
Make sure your .gitignore contains:
Backend/config/tokens.json
*.env
.env

Never commit:
tokens.json
.env
Google credential files
OpenAI API keys


🤝 Contributing
Pull requests are welcome!
If you have ideas, improvements, or bug fixes — feel free to open an issue.

👨‍💻 Author
Built by Abhimanue T J
Kerala, India
🚀 Passionate about automation, AI, and full-stack development.

---

If you want, I can also generate:

✅ Logo for your project  
✅ Badges (build passing, node version, etc.)  
✅ Screenshot section  
✅ Setup video tutorial section  
✅ API documentation (Swagger-style)

Just tell me — **“Add more sections”**

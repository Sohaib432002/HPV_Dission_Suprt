HPV Research & Prediction System (Final Year Project)

A full-stack web-based healthcare platform for analyzing, predicting, and visualizing Human Papillomavirus (HPV) infection and cervical cancer risk using Machine Learning, mathematical modeling, and modern web technologies.

🚀 Project Overview

This project integrates:

🧠 Machine Learning model (ResNet-based / Python TensorFlow)
🌐 Frontend (React + TypeScript)
⚙️ Backend (Django REST Framework)
📊 Data visualization dashboards
🔐 JWT-based authentication system
📈 Medical report generation & risk classification

It is designed to assist researchers, lab engineers, and healthcare professionals in understanding HPV progression and risk analysis through image-based prediction and analytical dashboards.

🏗️ Tech Stack

Frontend:

React.js
TypeScript
Tailwind CSS
Framer Motion
Recharts

Backend:

Django
Django REST Framework
Python

Machine Learning:

TensorFlow / Keras
ResNet Model
NumPy, Pandas

Database:

SQLite 

📁 Project Structure

project-root/
│
├── FrontEnd/              # React frontend
├── Backend/              # Django backend
├── model/                # ML model (ResNet / training scripts)
├── requirements.txt     # Python dependencies
├── package.json         # Frontend dependencies
└── README.md
⚙️ Installation & Setup
1️⃣ Clone Repository

https://github.com/Sohaib432002/HPV_Dission_Suprt.git

cd your-repo-name
2️⃣ Backend Setup (Django)
cd Backend
python -m venv env
source env/bin/activate   # (Linux/Mac)
env\Scripts\activate      # (Windows)

pip install -r requirements.txt

python manage.py migrate
python manage.py runserver



3️⃣ Frontend Setup (React)
cd FrontEnd
npm install
npm run dev

Frontend will run at:

http://localhost:5173/
4️⃣ ML Model Setup (if separate)
cd model
pip install -r requirements.txt
python app.py
🔐 Environment Variables

Create a .env file in backend:

SECRET_KEY=your_secret_key
DEBUG=True
ALLOWED_HOSTS=*
📊 Features
🧠 HPV image-based classification
📉 Risk level prediction (Low / Medium / High)
📊 Interactive dashboards with charts
👩‍⚕️ Patient & lab engineer roles
📄 Automated report generation
🔐 Secure authentication (JWT)
🌙 Dark / Light theme support
🧪 Model Details
Architecture: ResNet-based CNN
Framework: TensorFlow/Keras
Input: Medical image dataset
Output: HPV risk classification
🚀 Deployment

Frontend:

Vercel / Netlify

Backend:

Hugging Face Spaces 
👨‍💻 Author

Sohaib Maqsood
Final Year Project – BS Mathematics

📌 Note

This project is developed for academic purposes and research demonstration in healthcare AI systems.

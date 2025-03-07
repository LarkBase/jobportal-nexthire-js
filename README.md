# AI-Powered Job Portal - Microservices Architecture

## Overview
This is an **AI-powered job portal** designed for a **single company’s hiring process**. It features **AI-driven resume screening, automated interview assessment**, and a **real-time code editor** for technical evaluations. The platform is **Dockerized** and deployed on **Azure Kubernetes Service (AKS)**.

---
## Tech Stack

### **Frontend:**
- **React.js + Next.js** (SEO-optimized job listings)
- **Tailwind CSS / Material-UI**
- **Redux Toolkit / React Query** (for state management)
- **OAuth2 / JWT** (Google, LinkedIn, GitHub login)

### **Backend (Microservices in Docker Containers):**
- **Node.js (Express.js) / FastAPI (Python for AI services)**
- **Databases:** PostgreSQL, Redis (caching), MongoDB (resume storage)
- **Message Queue:** RabbitMQ / Kafka
- **AI:** OpenAI API, spaCy, TensorFlow, or Scikit-learn
- **Cloud:** Azure AKS (Kubernetes), GitHub Actions (CI/CD)

---
## Microservices Architecture

### **1. User Service**
- Handles **authentication, user profiles**
- **DB:** PostgreSQL
- Features:
  - JWT-based authentication
  - Role management (Job Seeker, Recruiter, Admin)

### **2. Job Service**
- Manages **job postings, categories, and applications**
- **DB:** PostgreSQL + Redis (caching popular searches)
- Features:
  - CRUD operations for job listings
  - Full-text search, filters

### **3. Application Service**
- Tracks **job applications**
- **DB:** PostgreSQL
- Features:
  - Apply to jobs, track application status

### **4. Resume Screening AI Service**
- Uses **NLP models (spaCy, BERT, OpenAI API)** to analyze resumes
- **DB:** MongoDB (structured resume storage)
- Features:
  - Extract **skills, experience, keywords**
  - Suggest **resume improvements**
  - Rank candidates based on job description

### **5. AI Interview Assessment Service**
- Conducts **AI-driven initial interviews**
- **DB:** PostgreSQL
- Features:
  - AI-powered **question-answer evaluation**
  - **Speech-to-text processing** for verbal interviews
  - Automated **candidate scoring**

### **6. Code Editor & Evaluation Service**
- **Real-time coding environment** for technical assessments
- **Tech:** Node.js, WebSockets, Docker (for containerized execution)
- Features:
  - Supports **multiple programming languages**
  - AI-assisted **code quality analysis**
  - Automated **test case validation**

### **7. Chat & Interview Scheduling Service**
- **Real-time messaging** between recruiters & candidates
- **Tech:** WebSockets + Node.js
- Features:
  - Live chat (like LinkedIn messages)
  - Google Calendar API integration for scheduling

### **8. Notification Service**
- Sends **Email, SMS, Push Notifications**
- **Tech:** Node.js + Firebase/SendGrid
- Features:
  - Job alerts, application status updates

---
## Communication Between Microservices
- **API Gateway (Nginx/Traefik)** for routing
- **REST/gRPC** for internal communication
- **RabbitMQ/Kafka** for async messaging (e.g., AI resume processing, notifications)

---
## Deployment Strategy
1. **Docker & Kubernetes** for microservices
2. **Azure Kubernetes Service (AKS)** for cloud deployment
3. **CI/CD using GitHub Actions**
4. **Prometheus + Grafana** for monitoring

---
## Getting Started
### **1. Clone the Repository**
```sh
git clone https://github.com/your-repo/job-portal.git
cd job-portal
```

### **2. Run with Docker Compose (Local Development)**
```sh
docker-compose up --build
```

### **3. Deploy to Kubernetes (Azure AKS)**
```sh
kubectl apply -f k8s/
```

### **4. Access the Application**
- **Frontend:** `http://localhost:3000`
- **API Gateway:** `http://localhost:8000`

---
## Contributing
1. Fork the repository
2. Create a feature branch (`git checkout -b feature-xyz`)
3. Commit changes (`git commit -m "Add feature xyz"`)
4. Push to branch (`git push origin feature-xyz`)
5. Create a PR

---
## License
MIT License

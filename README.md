# CareVita: Advanced Healthcare Management Platform

CareVita is a state-of-the-art healthcare management system designed to bridge the gap between patients, doctors, and hospitals. It features real-time notifications, AI-driven health insights, and a premium visual experience.

## 🚀 Key Features
- **Role-Based Portals**: Tailored interfaces for Users, Doctors, Receptionists, and Admins.
- **Health Pattern Predictor**: Automated AI insights based on daily health logs (Symptoms, Mood, Hydration, Sleep).
- **Emergency SOS System**: Real-time identification of nearest hospitals with direct contact options.
- **Integrated Workflows**: Seamless appointment booking, doctor consultations, and prescription management.
- **Express Pay**: Simulated secure payment gateway for healthcare services.

## 🛠 Tech Stack
- **Frontend**: React, Framer Motion, Axios, React Router.
- **Backend**: Spring Boot, Java, JPA, Hibernate, Spring Security (JWT).
- **Database**: H2 (In-memory for development).

## 🚦 Getting Started

### 1. Backend Setup
```bash
cd backend/demo
mvn spring-boot:run
```
- The server will start on `http://localhost:8081`.
- H2 Console available at `/h2-console`.

### 2. Frontend Setup
```bash
cd frontend
npm install
npm start
```
- The application will launch on `http://localhost:3000`.

## 🔒 Security & Access
- **Admin**: Full platform oversight and entity management.
- **Hospital/Reception**: Appointment allocation and prescription dispatch.
- **Doctor**: Clinical insights and consultation writing.
- **User**: Health tracking, family circle, and appointment history.

---
Built with ❤️ by CareVita Team.
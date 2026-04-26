# 🏥 MedTrack Pro — Enterprise Medical Asset Management System

**MedTrack Pro** is a modern full-stack application designed for healthcare facilities to manage, track, and audit medical equipment in real-time. Built with a focus on data integrity and intuitive UX, it bridges the gap between hospital administration and technical maintenance.

![Status](https://img.shields.io/badge/Status-Production--Ready-success?style=for-the-badge)
![Year](https://img.shields.io/badge/Year-2026-blue?style=for-the-badge)

## 🌟 Key Features

* **Intelligent Dashboard:** Instant visualization of asset distribution (Total, Operational, and Maintenance required).
* **Dynamic Inventory Table:** A high-performance data grid featuring server-side integration and client-side pagination.
* **Smart Filtering System:** Multi-layered filtering allowing users to combine full-text search with status-based toggles (Online, Maintenance, Offline).
* **Professional PDF Reporting:** One-click generation of localized inventory reports using `jsPDF`, tailored for technical audits.
* **Secure CRUD Operations:** Comprehensive lifecycle management for medical devices with data protection triggers (Confirmation Dialogs).
* **Modern UI/UX:** Built with Angular Material, featuring responsive layouts, interactive status badges, and real-time event notifications (Snackbars).

## 🛠️ Technology Stack

### Frontend
- **Framework:** Angular 18+ (Standalone Architecture)
- **UI Components:** Angular Material
- **Reporting:** jsPDF & jspdf-autotable
- **Styling:** SCSS (Advanced Grid & Flexbox)

### Backend
- **Framework:** Spring Boot 3.x
- **Language:** Java 17
- **Database:** H2 Database (In-memory for seamless demonstration)
- **Architecture:** RESTful API with clean separation of concerns (Controller-Service-Repository pattern)

## 🚀 Getting Started

### 1. Prerequisites
- **JDK 17** or higher
- **Node.js** v18+ & **Angular CLI**

### 2. Backend Setup
```bash
cd backend
./mvnw spring-boot:run
The API will be accessible at http://localhost:8080.

3. Frontend Setup
Bash
cd frontend/device-app
npm install
ng serve
Open your browser at http://localhost:4200.

📈 Roadmap 2026
[ ] Data Visualization: Integration of Chart.js for graphical maintenance trends.

[ ] Containerization: Docker Compose setup for easy deployment.

[ ] Authentication: Role-based access control (RBAC) via Keycloak.

Developer: Adam Katrenič

This project serves as a showcase of modern Full-Stack development, solving real-world domain challenges in the HealthTech sector.
# **CodeHaven**

**CodeHaven** is a custom-built deployment platform inspired by Vercel, engineered to streamline web app hosting. It automates the process from cloning and building a Git repository to serving the live application—all within a robust, scalable architecture. Initially designed for static frameworks like React and Vite, CodeHaven is extensible to dynamic setups (e.g., Express, Next.js), showcasing expertise in distributed systems, containerization, and real-time communication.

---
<img width="1710" alt="image" src="https://github.com/user-attachments/assets/5c7f6ebd-fa58-4a1e-b4a5-3ee895993341" />
<img width="1709" alt="image" src="https://github.com/user-attachments/assets/8ec8d10a-621c-4e71-a869-f74c3b9315d9" />


## **Highlights**

- **Automated Workflow:**  
  From Git repository to live app deployment in minutes.

- **Real-Time Updates:**  
  WebSocket-driven status tracking for an interactive deployment experience.

- **Modular Design:**  
  Independent services for scalability and maintainability.

- **Cloud-Native:**  
  Leverages Cloudflare R2 for storage and Docker for containerization.

- **Architectural Diagram:**  
  _Insert an image here depicting the following components and their data flows:_
  - React Frontend
  - Upload Service
  - Redis
  - WebSocket
  - MongoDB
  - Deploy Service
  - Request Service
  - Cloudflare R2

---
![Untitled-2025-03-14-1422](https://github.com/user-attachments/assets/de59cb2f-3860-4e5c-b600-b2d1fae34825)


## **Technology Stack**

| **Component**       | **Technology**     | **Purpose**                               | **Why I Chose It**                    |
| ------------------- | ------------------ | ----------------------------------------- | ------------------------------------- |
| **Frontend**        | React              | Dynamic UI for project submission         | Fast, component-based, widely adopted |
| **Upload Service**  | Node.js, WebSocket | Cloning repos, R2 uploads, status updates | Async I/O, real-time communication    |
| **Deploy Service**  | Node.js, Docker    | Building & containerizing projects        | Portable, isolated environments       |
| **Request Service** | Node.js            | Serving static files (dynamic planned)    | Lightweight, extensible routing       |
| **Queue**           | Redis              | Task queuing & status tracking            | High-performance, in-memory storage   |
| **Database**        | MongoDB            | Project metadata storage                  | Flexible schema, scalable             |
| **Storage**         | Cloudflare R2 (S3) | Raw and built file storage                | Cost-effective, S3-compatible         |
| **AWS Integration** | AWS SDK v3         | Interacting with R2                       | Modular, modern, efficient            |

---

## **Prerequisites**

- **Node.js:** v16.20+ (for runtime compatibility)
- **Docker:** For building and running containers
- **Redis:** For task queues and status tracking
- **MongoDB:** For persistent metadata storage
- **Cloudflare R2 Account:** For file storage
- **Docker Hub Account:** For image storage

---

# **CodeHaven**

**CodeHaven** is a custom-built deployment platform inspired by Vercel, engineered to streamline web app hosting. It automates the process from cloning and building a Git repository to serving the live application—all within a robust, scalable architecture. Initially designed for static frameworks like React and Vite, CodeHaven is extensible to dynamic setups (e.g., Express, Next.js), showcasing expertise in distributed systems, containerization, and real-time communication.

---

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

## **Installation**

### **Step 1: Clone the Project**

```bash
git clone https://github.com/yourusername/codehaven.git
cd codehaven
Step 2: Install Dependencies
Install backend dependencies:

npm install express cors simple-git redis @clerk/clerk-sdk-node @clerk/clerk-sdk-express
If using Node 16/17, install node-fetch v2:

npm install node-fetch@2
Install frontend dependencies (if using Create React App or similar):

npm install @clerk/clerk-react
Step 3: Configure Environment
Create a .env file in the root directory and add:

REDIS_URL=redis://localhost:6379
MONGODB_URI=mongodb://localhost:27017/codehaven
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
S3_BUCKET=your-r2-bucket
DOCKER_USERNAME=your-docker-username
DOCKER_PASSWORD=your-docker-password
CLERK_SECRET_KEY=your-clerk-secret-key
Replace placeholder values with your actual credentials.

Step 4: Launch Dependencies
Redis:

docker run -d -p 6379:6379 redis
MongoDB:

docker run -d -p 27017:27017 mongo
Step 5: Start Services
Service	Command	Port
Frontend	cd frontend && npm install && npm start	3000
Upload Service	cd upload-service && npm install && node upload-service.js	(Internal service)
Deploy Service	cd deploy-service && npm install && node deploy-service.js	(Internal service)
Request Service	cd request-service && npm install && node request-service.js	Custom (configured)
How to Use

Submit a Project
Navigate:
Visit http://localhost:3000 in your browser.
Enter Repository URL:
Provide a Git repository URL (e.g., https://github.com/yourusername/my-react-app.git).
Submit:
Submit the project and monitor live status updates (via WebSockets).
Deployment Process
Upload Service:
Clones the repository, uploads files to Cloudflare R2, and enqueues a job in Redis.
Deploy Service:
Builds, containerizes, and pushes the project to Docker Hub.
Request Service:
Serves static files from Cloudflare R2.
Access Your App
After deployment, access your live app at:

http://localhost:<request-service-port>/<project-id>
Replace <request-service-port> with your Request Service port and <project-id> with the identifier returned during deployment.

Architecture Overview

CodeHaven is built with a modular design to ensure scalability and maintainability. The system consists of independent services for each task:

React Frontend:
Handles project submissions and real-time status updates.
Upload Service:
Clones repositories and uploads files to Cloudflare R2, then enqueues jobs via Redis.
Deploy Service:
Builds and containerizes projects using Docker, pushing images to Docker Hub.
Request Service:
Serves static files (and plans for dynamic content in the future).
Queue & Status:
Redis is used to manage task queues and track deployment status.
Metadata Storage:
MongoDB stores project metadata.
Cloud Storage:
Cloudflare R2 is used for storing both raw and built files.
AWS SDK Integration:
Interacts with R2 using AWS SDK v3.
Insert an architectural diagram image here to illustrate the data flows and interactions between components.
```

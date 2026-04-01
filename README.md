
# HireHelper


HireHelper is a full-stack web application designed to connect individuals who need help with various tasks to those in their community who are willing to provide assistance. Users can post tasks, browse available jobs, and manage requests in a streamlined dashboard interface.

## Features

-   **User Authentication**: Secure registration and login system with JWT, including OTP email verification and password reset functionality.
-   **Task Management**: Users can create, view, and delete their own tasks.
-   **Task Feed**: A central feed where users can browse all available tasks posted by others.
-   **Request System**: Users can send requests to help with tasks, which the task owner can then accept or reject.
-   **Dashboard**: A comprehensive user dashboard to manage "My Tasks", incoming "Requests", and sent "My Requests".
-   **Notifications**: Real-time notifications for new requests and status updates on existing requests.
-   **User Profiles & Settings**: Users can update their personal information, change their password, and upload a profile picture.
-   **Image Uploads**: Support for uploading task and profile images, handled via Cloudinary.
-   **Review System**: A basic framework for users to review each other after a task is completed.

## Tech Stack

### Backend

-   **Runtime**: Node.js
-   **Framework**: Express.js
-   **Database**: MongoDB with Mongoose ODM
-   **Authentication**: JSON Web Tokens (JWT), bcrypt.js
-   **File Uploads**: Multer & Cloudinary
-   **Email Service**: Nodemailer for OTP and notifications
-   **Environment Variables**: dotenv

### Frontend

-   **Library**: React
-   **Bundler**: Vite
-   **Routing**: React Router
-   **HTTP Client**: Axios
-   **Styling**: Plain CSS with a responsive design

## Project Structure

The repository is organized as a monorepo with two main directories:

-   `Frontend/`: Contains the complete React client-side application.
-   `backend/`: Contains the Node.js/Express server, including all API routes, controllers, models, and middleware.

## Getting Started

Follow these instructions to set up and run the project locally.

### Prerequisites

-   Node.js (v18 or higher)
-   npm (or a compatible package manager)
-   A MongoDB database instance (local or remote like MongoDB Atlas)
-   A Cloudinary account for file storage
-   A Gmail account with an "App Password" for email sending

### 1. Clone the Repository

```bash
git clone https://github.com/Athu9552/HireHelper_Batch_2.git
cd HireHelper_Batch_2
```

### 2. Backend Setup

1.  Navigate to the backend directory:
    ```bash
    cd backend
    ```

2.  Install the dependencies:
    ```bash
    npm install
    ```

3.  Create a `.env` file by copying the example file:
    ```bash
    cp .env.example .env
    ```

4.  Populate the `.env` file with your specific credentials:
    ```env
    PORT=5000
    MONGO_URI=<YOUR_MONGODB_CONNECTION_STRING>
    JWT_SECRET=<YOUR_JWT_SECRET>
    EMAIL_USER=<YOUR_GMAIL_ADDRESS>
    EMAIL_PASS=<YOUR_GMAIL_APP_PASSWORD>
    CLOUDINARY_CLOUD_NAME=<YOUR_CLOUDINARY_CLOUD_NAME>
    CLOUDINARY_API_KEY=<YOUR_CLOUDINARY_API_KEY>
    CLOUDINARY_API_SECRET=<YOUR_CLOUDINARY_API_SECRET>
    FRONTEND_URL=http://localhost:5173
    ```

5.  Start the backend server:
    ```bash
    npm start
    ```
    The server will be running on `http://localhost:5000`.

### 3. Frontend Setup

1.  Open a new terminal and navigate to the frontend directory:
    ```bash
    cd Frontend
    ```

2.  Install the dependencies:
    ```bash
    npm install
    ```

3.  The frontend is configured to proxy API requests to `http://localhost:5000` via `vite.config.js`. No additional configuration is needed.

4.  Start the frontend development server:
    ```bash
    npm run dev
    ```
    The application will be accessible at `http://localhost:5173`.

## API Routes

The backend server exposes the following API routes:

-   `/api/auth/`: Handles user registration, login, OTP verification, password management, and profile updates.
-   `/api/tasks/`: Manages CRUD operations for tasks.
-   `/api/requests/`: Handles the creation and management of help requests for tasks.
-   `/api/notifications/`: Fetches and manages user notifications.
-   `/api/reviews/`: Manages the review system.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

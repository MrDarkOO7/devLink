# DevLink Backend API

This is the backend for **DevLink**, a platform for developers to connect and collaborate.
This backend is build using **NodeJS**, **express** and **mongoDB**

## Overview

This API provides authentication, profile management, and user connection features.

## Routes

### Auth Router

- **POST** `/auth/signup` – Register a new user.
- **POST** `/auth/login` – Log in a user.
- **POST** `/auth/logout` – Log out the current user.

### Profile Router

- **GET** `/profile/view` – View your profile.
- **PATCH** `/profile/edit` – Edit profile details.
- **PATCH** `/profile/password` – Change or reset password.

### Connection Request Router

- **POST** `/request/send/:status/:userId` – Send a connection request.
- **POST** `/request/review/:status/:requestId` – Review (accept/reject) a request.

### User Router

- **GET** `/user/requests/received` – Get all received connection requests.
- **GET** `/user/connections` – Get all your connections.
- **GET** `/user/feed` – View other users’ profiles.

## Status Values

`ignored`, `interested`, `accepted`, `rejected`

---

### Setup

1. Clone the repo and install dependencies:
   ```bash
   npm install
   ```
2. Create a `.env` file with required variables.
3. Run the project:
   ```bash
   npm run dev
   ```

---

This README lists the core endpoints. For detailed request/response structures, refer to the code.

## ✍️ Turn your ideas into organized notes — with words and images.

A simple full-stack note-taking application that allows users to create, organize, and manage personal notes. Users can also add images to their notes for better visualization and organization.

Users can register, log in securely, and start managing their notes efficiently.

## 🚀 Features
- User authentication with JWT
- Create, update, and delete notes
- Add images along with text notes
- Clean and user-friendly interface

## 🛠️ Tech Stack
Frontend
- React.js
- CSS
- JavaScript

Backend
- Node.js
- Express.js
- MongoDB
- JWT for authentication
- CORS

## 🧠 Architecture Overview
The frontend provides a clean interface for users to create, view, and organize notes. When a user performs an action, requests are sent to the Node.js/Express backend, which securely handles data and authentication using JWT. The backend interacts with MongoDB to store and retrieve notes, then sends only the necessary data back to the frontend. This structure ensures security, smooth performance, and easy maintainability.


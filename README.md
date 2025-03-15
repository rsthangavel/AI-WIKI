
# AI Chat Application

This is a full-stack AI chat application with a React frontend, Node.js/Express backend, and Python AI agent.

## Project Structure

- Frontend: React with Vite, Ant Design, and Tailwind CSS
- Backend: Node.js with Express and TypeScript
- AI Agent: Python with Flask

## Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- Python (v3.8 or higher)
- npm or yarn

### Environment Setup

1. Create a `.env` file based on `.env.example`:
```
cp .env.example .env
```

2. Install frontend dependencies:
```
npm install
```

3. Install Python dependencies:
```
pip install flask flask-cors
```

### Running the Application

1. Start the Python AI agent:
```
cd src/python_agent
python agent.py
```

2. Start the Express backend (in a new terminal):
```
npm run server
```

3. Start the React frontend (in a new terminal):
```
npm run dev
```

## Features

- Real-time chat with AI agent
- Dark mode support
- File uploads
- Responsive design
- Smooth animations

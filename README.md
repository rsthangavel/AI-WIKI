
# AI Chat Application with YouTube Support

This is a full-stack AI chat application with a React frontend, Node.js/Express backend, and Python AI agent that supports YouTube queries.

## Project Structure

- `./` - Frontend: React with Vite, Ant Design, and Tailwind CSS
- `./backend/` - Backend: Node.js with Express and TypeScript
- `./python-agent/` - AI Agent: Python with Flask, phidata, and DeepSeek LLM

## Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- Python (v3.8 or higher)
- npm or yarn

### Frontend Setup

1. Install dependencies in the root directory:
```
npm install
```

2. Create a `.env` file based on `.env.example` in the root directory.

### Backend Setup

1. Navigate to the backend directory and install dependencies:
```
cd backend
npm install
```

2. Create a `.env` file based on `.env.example` in the backend directory.

### Python Agent Setup

1. Navigate to the python-agent directory:
```
cd python-agent
```

2. Create a virtual environment (recommended):
```
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install Python dependencies:
```
pip install -r requirements.txt
```

4. Create a `.env` file based on `.env.example` in the python-agent directory.

5. Add your DeepSeek API key to the `.env` file:
```
DEEPSEEK_API_KEY=your-api-key-here
```

6. (Optional) Add YouTube API key for YouTube search functionality:
```
YOUTUBE_API_KEY=your-youtube-api-key-here
```

### Running the Application

1. Start the Python AI agent:
```
cd python-agent
python agent.py
```

2. Start the Express backend (in a new terminal):
```
cd backend
npm run dev
```

3. Start the React frontend (in a new terminal):
```
npm run dev
```

## Features

- Real-time chat with AI agent
- YouTube search functionality
- File uploads and multimedia responses
- Dark mode support
- Responsive design
- Smooth animations

## Using YouTube Functionality

You can ask questions about YouTube videos in natural language, such as:
- "Search for videos about machine learning"
- "Show me popular cooking channels"
- "Find videos related to space exploration"

The AI will use the DeepSeek LLM to enhance responses and provide YouTube video recommendations.

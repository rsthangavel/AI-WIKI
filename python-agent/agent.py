
from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import json
from typing import Dict, Any, List, Optional
import re
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
import phidata as phi
from phi.assistant import Assistant
from phi.llm.groq import GroqLLM
from phi.tools.youtube import YoutubeSearchTool
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# Initialize Groq LLM with API key
api_key = os.environ.get("GROQ_API_KEY")
llm = GroqLLM(model="mixtral-8x7b-32768", api_key=api_key)

# Initialize YouTube API
YOUTUBE_API_KEY = os.environ.get("YOUTUBE_API_KEY", "")
youtube_tool = None
if YOUTUBE_API_KEY:
    youtube_tool = YoutubeSearchTool(
        api_key=YOUTUBE_API_KEY, 
        num_results=5
    )

# Create a phidata assistant with YouTube capabilities using the phi.assistant approach
assistant = Assistant(
    llm=llm,
    name="YouTube Expert",
    description="I am an AI assistant specialized in providing information about YouTube videos, channels, and trends.",
    tools=[youtube_tool] if youtube_tool else []
)

def extract_youtube_query(text: str) -> Optional[str]:
    """Extract YouTube-related query from user input."""
    youtube_patterns = [
        r"(?i)(?:search|find|look up|show me)\s+(?:videos?|channels?)\s+(?:about|on|related to)?\s+(.*?)(?:\?|$|\.)",
        r"(?i)(?:youtube|video)\s+(?:about|on|related to)?\s+(.*?)(?:\?|$|\.)",
        r"(?i)(?:trending|popular)\s+(?:videos?|channels?|content)\s+(?:about|on)?\s+(.*?)(?:\?|$|\.)"
    ]
    
    for pattern in youtube_patterns:
        match = re.search(pattern, text)
        if match:
            return match.group(1).strip()
    
    return None

@app.route('/api/agent', methods=['POST'])
def process_query():
    data = request.json
    query = data.get('query', '')
    
    # Check if query is YouTube-related
    youtube_query = extract_youtube_query(query)
    
    if youtube_query and youtube_tool:
        # Use the assistant with YouTube tool
        response = assistant.run(
            f"Find YouTube videos about: {youtube_query}"
        )
        
        # Try to extract video data from the response
        try:
            # The assistant may return structured data about videos
            videos = youtube_tool.get_last_search_results()
            formatted_videos = []
            
            if videos:
                for video in videos:
                    formatted_videos.append({
                        "title": video.get("title", ""),
                        "url": f"https://www.youtube.com/watch?v={video.get('id', {}).get('videoId', '')}",
                        "thumbnail": video.get("snippet", {}).get("thumbnails", {}).get("medium", {}).get("url", ""),
                        "channel": video.get("snippet", {}).get("channelTitle", "")
                    })
                
                return jsonify({
                    "text": response,
                    "type": "youtube_results",
                    "videos": formatted_videos
                })
        except Exception as e:
            print(f"Error processing YouTube results: {e}")
    
    # For non-YouTube queries or if YouTube search fails, use the assistant
    response = assistant.run(query)
    
    return jsonify({
        "text": response,
        "type": "text"
    })

@app.route('/api/process-file', methods=['POST'])
def process_file():
    data = request.json
    file_path = data.get('filePath', '')
    file_type = data.get('fileType', '')
    
    # This would be expanded to handle files with AI processing
    response = {
        "text": f"Processed file at {file_path} of type {file_type}",
        "type": "text",
        "file": {
            "url": file_path,
            "type": file_type
        }
    }
    
    return jsonify(response)

if __name__ == '__main__':
    port = int(os.environ.get('PYTHON_AGENT_PORT', 5000))
    debug = os.environ.get('FLASK_DEBUG', 'False').lower() == 'true'
    app.run(host='0.0.0.0', port=port, debug=debug)

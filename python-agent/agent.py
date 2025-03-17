
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
from phi.llm.deepseek import DeepSeekLLM

app = Flask(__name__)
CORS(app)

# Initialize DeepSeek LLM with API key
api_key = os.environ.get("DEEPSEEK_API_KEY")
llm = DeepSeekLLM(model="deepseek-coder", api_key=api_key)

# Initialize YouTube API
YOUTUBE_API_KEY = os.environ.get("YOUTUBE_API_KEY", "")
youtube = None
if YOUTUBE_API_KEY:
    youtube = build('youtube', 'v3', developerKey=YOUTUBE_API_KEY)

# Create a phidata assistant
assistant = Assistant(
    llm=llm,
    name="YouTube Expert",
    description="I am an AI assistant specialized in providing information about YouTube videos, channels, and trends."
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

def search_youtube_videos(query: str, max_results: int = 5) -> List[Dict[str, Any]]:
    """Search YouTube for videos matching the query."""
    if not youtube or not YOUTUBE_API_KEY:
        return [{"title": "YouTube API key not configured", "url": "", "thumbnail": "", "channel": ""}]
    
    try:
        search_response = youtube.search().list(
            q=query,
            part='snippet',
            maxResults=max_results,
            type='video'
        ).execute()
        
        videos = []
        for item in search_response.get('items', []):
            video_id = item['id']['videoId']
            video_url = f"https://www.youtube.com/watch?v={video_id}"
            thumbnail = item['snippet']['thumbnails']['medium']['url']
            
            videos.append({
                "title": item['snippet']['title'],
                "url": video_url,
                "thumbnail": thumbnail,
                "channel": item['snippet']['channelTitle']
            })
        
        return videos
    except HttpError as e:
        print(f"An HTTP error occurred: {e}")
        return []

@app.route('/api/agent', methods=['POST'])
def process_query():
    data = request.json
    query = data.get('query', '')
    
    # Check if query is YouTube-related
    youtube_query = extract_youtube_query(query)
    
    if youtube_query:
        # Search for YouTube videos
        videos = search_youtube_videos(youtube_query)
        
        if videos:
            # Format response with video information
            text_response = f"Here are some YouTube videos about '{youtube_query}':\n\n"
            for i, video in enumerate(videos, 1):
                text_response += f"{i}. {video['title']} by {video['channel']}\n   {video['url']}\n\n"
            
            # Use assistant to enhance the response
            enhanced_response = assistant.run(
                f"The user asked about YouTube videos on '{youtube_query}'. Here are the results: {text_response} " +
                "Please provide a helpful, concise summary of these results and any additional context that might be useful."
            )
            
            return jsonify({
                "text": enhanced_response,
                "type": "youtube_results",
                "videos": videos
            })
    
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

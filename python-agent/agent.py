
from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import json
from typing import Dict, Any, List, Optional
import re
from phi.agent import Agent, RunResponse
from phi.model.groq import Groq
from phi.tools.wikipedia import WikipediaTools
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)
# Initialize Groq LLM with API key
api_key = os.environ.get("GROQ_API_KEY")

# Initialize YouTube API
YOUTUBE_API_KEY = os.environ.get("YOUTUBE_API_KEY", "")
youtube_tool = None

# Create a phidata assistant with YouTube capabilities using the phi.assistant approach
agent = Agent(
    tools=[WikipediaTools()], 
    model=Groq(id="deepseek-r1-distill-llama-70b"),
    show_tool_calls=True)

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
    
    # # Check if query is YouTube-related
    # youtube_query = extract_youtube_query(query)
    # print(f"Extracted YouTube query: {youtube_query}")
    # if youtube_query and youtube_tool:
    #     # Use the assistant with YouTube tool
    #     response = agent.run(
    #         f"Find YouTube videos about: {youtube_query}"
    #     )
        
    #     # Try to extract video data from the response
    #     try:
    #         # The assistant may return structured data about videos
    #         videos = youtube_tool.get_last_search_results()
    #         formatted_videos = []
            
    #         if videos:
    #             for video in videos:
    #                 formatted_videos.append({
    #                     "title": video.get("title", ""),
    #                     "url": f"https://www.youtube.com/watch?v={video.get('id', {}).get('videoId', '')}",
    #                     "thumbnail": video.get("snippet", {}).get("thumbnails", {}).get("medium", {}).get("url", ""),
    #                     "channel": video.get("snippet", {}).get("channelTitle", "")
    #                 })
                
    #             return jsonify({
    #                 "text": response,
    #                 "type": "youtube_results",
    #                 "videos": formatted_videos
    #             })
    #     except Exception as e:
    #         print(f"Error processing YouTube results: {e}")
    
    # For non-YouTube queries or if YouTube search fails, use the assistant
    # response: RunResponse = agent.run(query)
    response = agent.run(
            f"Search wikipedia for: {query}"
        )
    print(f"Assistant response: {response.content}")
    return jsonify({
        "text": response.content,
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

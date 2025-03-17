
import axios from 'axios';

export class AiService {
  private pythonAgentUrl: string;

  constructor() {
    // Default to localhost:5000 if not specified in environment variables
    this.pythonAgentUrl = process.env.PYTHON_AGENT_URL || 'http://localhost:5000';
  }

  // Send query to Python AI agent and get response
  async getAiResponse(query: string): Promise<any> {
    try {
      const response = await axios.post(`${this.pythonAgentUrl}/api/agent`, {
        query
      });

      return response.data;
    } catch (error) {
      console.error('Error communicating with AI agent:', error);
      throw new Error('Failed to communicate with AI agent');
    }
  }

  // Process file with AI agent
  async processFile(filePath: string, fileType: string): Promise<any> {
    try {
      const response = await axios.post(`${this.pythonAgentUrl}/api/process-file`, {
        filePath,
        fileType
      });

      return response.data;
    } catch (error) {
      console.error('Error processing file with AI agent:', error);
      throw new Error('Failed to process file with AI agent');
    }
  }
}

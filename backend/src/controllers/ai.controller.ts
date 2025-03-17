
import { Request, Response } from 'express';
import { AiService } from '../services/ai.service';

export class AiController {
  private aiService: AiService;

  constructor() {
    this.aiService = new AiService();
  }

  // Process text query
  processQuery = async (req: Request, res: Response): Promise<void> => {
    try {
      const { query } = req.body;
      
      if (!query) {
        res.status(400).json({ error: 'Query is required' });
        return;
      }

      const response = await this.aiService.getAiResponse(query);
      res.json(response);
    } catch (error) {
      console.error('Error processing query:', error);
      res.status(500).json({ error: 'Failed to process query' });
    }
  };

  // Process file upload
  processFileUpload = async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.file) {
        res.status(400).json({ error: 'No file uploaded' });
        return;
      }

      const filePath = req.file.path;
      const fileUrl = `/uploads/${req.file.filename}`;
      
      res.json({ 
        success: true, 
        file: {
          url: fileUrl,
          name: req.file.originalname,
          type: req.file.mimetype
        }
      });
    } catch (error) {
      console.error('Error processing file upload:', error);
      res.status(500).json({ error: 'Failed to process file upload' });
    }
  };
}

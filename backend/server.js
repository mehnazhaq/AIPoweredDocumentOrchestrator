const express = require('express');
const cors = require('cors');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const axios = require('axios');
require('dotenv').config();

// Groq configuration — OpenAI-compatible API (groq.com)
const GROK_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROK_MODEL = 'llama-3.3-70b-versatile';

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Set up Multer for in-memory file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Basic health check route
app.get('/', (req, res) => {
  res.send('Backend API is running. Please use the frontend application to interact with this service.');
});

// Validation middleware — ensures GROQ_API_KEY is set
const checkGrokKey = (req, res, next) => {
  if (!process.env.GROQ_API_KEY) {
    return res.status(500).json({ error: 'GROQ_API_KEY is not configured in the backend.' });
  }
  next();
};

// Endpoint: Extract Data
app.post('/api/extract', upload.single('document'), checkGrokKey, async (req, res) => {
  try {
    const { query } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: 'No document uploaded' });
    }
    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }

    let extractedText = '';

    // Handle PDF and TXT
    if (file.mimetype === 'application/pdf') {
       const pdfData = await pdfParse(file.buffer);
       extractedText = pdfData.text;
    } else if (file.mimetype === 'text/plain') {
       extractedText = file.buffer.toString('utf-8');
    } else {
       return res.status(400).json({ error: 'Unsupported file type. Please upload a PDF or TXT file.' });
    }

    if (!extractedText || extractedText.trim() === '') {
       return res.status(400).json({ error: 'Could not extract text from document.' });
    }

    // Call Grok (xAI) API
    const systemPrompt = 'You are an expert data extraction assistant. Always respond with a valid JSON object only — no markdown, no code fences, no extra text.';
    const userPrompt = `A user has uploaded a document and asked: "${query}"

Extract 5-8 most relevant key-value pairs related to the question from the document text below.
Respond ONLY with a JSON object. Example: {"key1": "value1", "key2": "value2"}

Document text:
${extractedText.substring(0, 15000)}`;

    const grokResponse = await axios.post(
      GROK_API_URL,
      {
        model: GROK_MODEL,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    let jsonString = grokResponse.data.choices[0].message.content.trim();
    // Strip any accidental markdown fences
    jsonString = jsonString.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```\s*$/i, '').trim();

    let extractedJson = {};
    try {
      extractedJson = JSON.parse(jsonString);
    } catch(e) {
      console.error('Failed to parse Grok response as JSON:', jsonString);
      return res.status(500).json({ error: 'AI did not return valid JSON. Response was: ' + jsonString });
    }

    return res.json({ 
      success: true, 
      data: extractedJson,
      extractedText
    });

  } catch (error) {
    console.error('Extraction error:', error);
    res.status(500).json({ error: 'An error occurred during extraction.', details: error.message });
  }
});

// Endpoint: Trigger n8n Automation
app.post('/api/trigger-automation', async (req, res) => {
  try {
    const { documentText, extractedData, query, recipientEmail } = req.body;

    if (!recipientEmail) {
       return res.status(400).json({ error: 'Recipient email is required.' });
    }

    const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL;
    
    // Fallback response if n8n is not configured or fails
    const mockResponse = { 
       answer: "Mock AI Answer: The document contains some interesting points related to your query.",
       email_body: `Hi,\n\nHere is the automated alert based on your query: "${query}".\n\nBest,\nSystem`,
       status: "Mocked: n8n webhook call skipped (URL not configured) or simulated."
    };

    if (!n8nWebhookUrl) {
       return res.json(mockResponse);
    }

    // Send data to n8n webhook
    const n8nResponse = await axios.post(n8nWebhookUrl, {
      documentText,
      extractedData,
      query,
      recipientEmail
    });

    // n8n should ideally respond with { answer, email_body, status }
    // but if it responds with something else, we return what it gives
    if(n8nResponse.data && n8nResponse.data.answer) {
      return res.json(n8nResponse.data);
    } else {
      // In case the n8n webhook is a default one that simply returns success message
      return res.json({
        answer: "Execution completed in n8n.",
        email_body: "Email generated by n8n workflow.",
        status: "Automation Triggered",
        n8nRawData: n8nResponse.data
      });
    }

  } catch (error) {
    console.error('n8n trigger error:', error.message);
    // Return a mock response so the UI doesn't crash if the webhook is invalid
    res.status(200).json({ 
       answer: "Error: Could not reach n8n webhook. Mock Answer used.",
       email_body: "Hi,\n\nWebhook failed. Mock email content.\n\nBest,\nSystem",
       status: "Failed: " + error.message
    });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

# AI-Powered Document Orchestrator

An intelligent document processing system that leverages AI to extract, analyze, and automate workflows from uploaded documents. The application combines Google Gemini for data extraction with Groq AI for advanced analysis and automated email notifications through n8n workflows.

## Features

- **Document Upload**: Support for PDF and TXT file formats
- **AI-Powered Extraction**: Uses Google Gemini to extract key-value pairs based on user queries
- **Intelligent Analysis**: Groq AI provides detailed analysis and insights
- **Automated Workflows**: Integration with n8n for workflow automation
- **Email Notifications**: Automated email alerts with formatted content
- **Modern UI**: Clean React interface with Tailwind CSS styling

## Tech Stack

### Frontend
- React 18
- Vite (build tool)
- Tailwind CSS (styling)
- Axios (HTTP client)
- Lucide React (icons)

### Backend
- Node.js with Express
- Google Gemini AI (data extraction)
- PDF parsing with pdf-parse
- Multer (file uploads)
- CORS support

### Automation
- n8n (workflow automation)
- Groq AI (advanced analysis)

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Google Gemini API key
- Groq API key (for n8n workflow)
- n8n instance (optional, for full automation)

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd AIPoweredDocumentOrchestrator
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```

3. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   ```

## Configuration

### Backend Environment Variables

Create a `.env` file in the `backend` directory:

```env
GEMINI_API_KEY=your_google_gemini_api_key_here
N8N_WEBHOOK_URL=your_n8n_webhook_url_here
PORT=5000
```

### n8n Workflow Setup

1. Import the `n8n-workflow-template.json` into your n8n instance
2. Update the Groq API key in the workflow
3. Configure the webhook URL in your backend `.env` file

## Usage

1. **Start the Backend**
   ```bash
   cd backend
   npm run dev
   ```

2. **Start the Frontend**
   ```bash
   cd frontend
   npm run dev
   ```

3. **Access the Application**

   Open your browser and navigate to `http://localhost:5173`

### How to Use

1. **Upload Document**: Select a PDF or TXT file
2. **Enter Query**: Specify what information you want to extract
3. **Extract Data**: Click "Extract Data" to process the document with AI
4. **Trigger Automation**: Enter recipient email and click "Trigger Automation" to send automated analysis via email

## API Endpoints

### POST `/api/extract`
Extracts data from uploaded documents using AI.

**Request:**
- `document`: File (PDF/TXT)
- `query`: String (extraction query)

**Response:**
```json
{
  "success": true,
  "data": {
    "key1": "value1",
    "key2": "value2"
  },
  "extractedText": "full text content"
}
```

### POST `/api/trigger-automation`
Triggers n8n workflow for advanced analysis and email notification.

**Request:**
```json
{
  "documentText": "extracted text",
  "extractedData": {},
  "query": "user query",
  "recipientEmail": "user@example.com"
}
```

## Development

### Running Tests
```bash
cd backend
npm test
```

### Building for Production
```bash
cd frontend
npm run build
```

## Project Structure

```
AIPoweredDocumentOrchestrator/
├── backend/
│   ├── package.json
│   ├── server.js
│   └── search.js
├── frontend/
│   ├── package.json
│   ├── vite.config.js
│   ├── index.html
│   └── src/
│       ├── App.jsx
│       ├── main.jsx
│       └── index.css
├── n8n-workflow-template.json
└── README.md
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.

## Acknowledgments

- Google Gemini for AI-powered data extraction
- Groq for advanced AI analysis
- n8n for workflow automation
- React and Vite for the frontend framework</content>
<parameter name="filePath">c:\Users\Admin\.gemini\antigravity\AIPoweredDocumentOrchestrator\README.md
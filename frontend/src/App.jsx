import React, { useState } from 'react';
import axios from 'axios';
import { UploadCloud, FileText, Send, CheckCircle2, AlertCircle, Loader2, Mail, LayoutTemplate, Settings2 } from 'lucide-react';

const API_URL = 'http://localhost:5000/api';

function App() {
  const [file, setFile] = useState(null);
  const [query, setQuery] = useState('');
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractedData, setExtractedData] = useState(null);
  const [extractedText, setExtractedText] = useState('');
  const [error, setError] = useState('');

  const [recipientEmail, setRecipientEmail] = useState('');
  const [isAutomating, setIsAutomating] = useState(false);
  const [automationResult, setAutomationResult] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleExtract = async (e) => {
    e.preventDefault();
    if (!file || !query) {
      setError('Please provide both a document and a query.');
      return;
    }

    setIsExtracting(true);
    setError('');
    setExtractedData(null);
    setAutomationResult(null);

    const formData = new FormData();
    formData.append('document', file);
    formData.append('query', query);

    try {
      const response = await axios.post(`${API_URL}/extract`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setExtractedData(response.data.data);
      setExtractedText(response.data.extractedText);
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred during extraction.');
    } finally {
      setIsExtracting(false);
    }
  };

  const handleAutomate = async (e) => {
    e.preventDefault();
    if (!recipientEmail) {
      setError('Please provide a recipient email.');
      return;
    }

    setIsAutomating(true);
    setError('');

    try {
      const response = await axios.post(`${API_URL}/trigger-automation`, {
        documentText: extractedText,
        extractedData,
        query,
        recipientEmail
      });
      setAutomationResult(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to trigger automation.');
    } finally {
      setIsAutomating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center p-3 bg-blue-600 rounded-2xl shadow-soft mb-4">
            <LayoutTemplate className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
            AI Document Orchestrator
          </h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Upload documents, ask questions, and dynamically extract structured data.
            Trigger automated n8n workflows based on AI context.
          </p>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 text-red-700 animate-in fade-in slide-in-from-top-4 max-w-2xl mx-auto">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <p className="font-medium">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Upload & Extract */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-soft border border-gray-100">
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <UploadCloud className="w-5 h-5 text-blue-500" />
                1. Document & Query
              </h2>
              
              <form onSubmit={handleExtract} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Upload File (.pdf, .txt)</label>
                  <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-gray-300 border-dashed rounded-2xl cursor-pointer hover:bg-blue-50 hover:border-blue-400 transition-colors bg-white">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <FileText className={`w-10 h-10 mb-3 ${file ? 'text-blue-500' : 'text-gray-400'}`} />
                      <p className="text-sm text-gray-600 font-medium text-center px-4">
                        {file ? file.name : (
                          <>
                            <span className="text-blue-600 font-semibold">Click to upload</span> or drag and drop
                          </>
                        )}
                      </p>
                    </div>
                    <input type="file" className="hidden" accept=".pdf,.txt" onChange={handleFileChange} />
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Analytical Question</label>
                  <textarea 
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none resize-none h-28 bg-white"
                    placeholder="E.g., What are the total costs and key deliverables mentioned in this document?"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={isExtracting}
                  className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 px-6 rounded-xl transition-all shadow-md hover:shadow-lg focus:ring-4 focus:ring-blue-100 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isExtracting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Settings2 className="w-5 h-5" />}
                  {isExtracting ? 'Extracting Data...' : 'Extract Data'}
                </button>
              </form>
            </div>

            {/* Automation Trigger - Shows only after extraction */}
            {extractedData && (
              <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-8 shadow-lg text-white">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Mail className="w-5 h-5 text-blue-200" />
                  2. Conditional Automation
                </h2>
                <p className="text-blue-100 text-sm mb-6">
                  Trigger an n8n workflow to analyze the extracted context and draft an alert email based on your logic.
                </p>
                <form onSubmit={handleAutomate} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-blue-100 mb-2">Recipient Email ID</label>
                    <input 
                      type="email" 
                      required
                      className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-blue-300 focus:ring-2 focus:ring-white focus:border-transparent transition-all outline-none"
                      placeholder="alerts@company.com"
                      value={recipientEmail}
                      onChange={(e) => setRecipientEmail(e.target.value)}
                    />
                  </div>
                  <button 
                    type="submit" 
                    disabled={isAutomating}
                    className="w-full flex items-center justify-center gap-2 bg-white text-blue-700 hover:bg-blue-50 font-bold py-3.5 px-6 rounded-xl transition-all shadow-md disabled:opacity-80 disabled:cursor-not-allowed mt-2"
                  >
                    {isAutomating ? <Loader2 className="w-5 h-5 animate-spin w-5 h-5" /> : <Send className="w-5 h-5" />}
                    {isAutomating ? 'Processing Workflow...' : 'Send Alert Mail'}
                  </button>
                </form>
              </div>
            )}
          </div>

          {/* Right Column: Results */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Extraction Results */}
            {extractedData && (
              <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-soft border border-gray-100">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  Structured Data Extracted (JSON)
                </h3>
                <div className="bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="py-3 px-4 font-semibold text-gray-700">Key</th>
                        <th className="py-3 px-4 font-semibold text-gray-700">Value</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {Object.entries(extractedData).map(([key, value]) => (
                        <tr key={key} className="hover:bg-gray-50/50 transition-colors">
                          <td className="py-3 px-4 font-medium text-gray-800 whitespace-nowrap align-top">{key}</td>
                          <td className="py-3 px-4 text-gray-600 align-top">{typeof value === 'object' ? JSON.stringify(value) : String(value)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Automation Results */}
            {automationResult && (
              <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-soft border border-gray-100 space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-3">Final Analytical Answer</h3>
                  <div className="bg-indigo-50/60 p-5 rounded-xl border border-indigo-100 text-indigo-900 text-sm leading-relaxed">
                    {automationResult.answer}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-3">Generated Email Body</h3>
                  <div className="bg-gray-50 p-5 rounded-xl border border-gray-200 text-gray-700 text-sm whitespace-pre-wrap font-mono leading-relaxed relative overflow-x-auto">
                    {automationResult.email_body}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-3">Automation Status</h3>
                  <div className={`p-4 rounded-xl border text-sm font-medium flex items-center gap-2 ${
                    automationResult.status?.toLowerCase().includes('failed') || automationResult.status?.toLowerCase().includes('skipped')
                      ? 'bg-amber-50 border-amber-200 text-amber-700'
                      : 'bg-green-50 border-green-200 text-green-700'
                  }`}>
                    {automationResult.status}
                  </div>
                </div>
              </div>
            )}

            {/* Empty State */}
            {!extractedData && !isExtracting && (
               <div className="h-full min-h-[450px] flex flex-col items-center justify-center text-center p-8 bg-white/40 border border-gray-200 border-dashed rounded-3xl">
                  <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center mb-5 rotate-3 shadow-sm">
                    <LayoutTemplate className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Awaiting Document</h3>
                  <p className="text-gray-500 max-w-sm text-sm">
                    Upload a file and ask a question to see the AI dynamically extract structured data here.
                  </p>
               </div>
            )}
            
            {/* Loading State */}
            {isExtracting && (
              <div className="h-full min-h-[450px] flex flex-col items-center justify-center text-center p-8 bg-white/40 border border-gray-200 border-dashed rounded-3xl">
                <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-5" />
                <h3 className="text-lg font-bold text-gray-800">Analyzing Document...</h3>
                <p className="text-gray-500 text-sm mt-2 max-w-xs mx-auto">Extracting key data points using advanced AI models. This might take a few seconds.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

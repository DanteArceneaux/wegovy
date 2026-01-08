import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// #region agent log
fetch('http://127.0.0.1:7244/ingest/ac060163-e445-4721-afc7-75c1daab8bb8',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'main.tsx:8',message:'Entry point executing',data:{hasDocument:typeof document!=='undefined',hasWindow:typeof window!=='undefined'},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
// #endregion

const rootElement = document.getElementById('root');

// #region agent log
fetch('http://127.0.0.1:7244/ingest/ac060163-e445-4721-afc7-75c1daab8bb8',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'main.tsx:12',message:'Root element check',data:{rootElementExists:!!rootElement,rootElementId:rootElement?.id},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
// #endregion

if (!rootElement) {
  // #region agent log
  fetch('http://127.0.0.1:7244/ingest/ac060163-e445-4721-afc7-75c1daab8bb8',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'main.tsx:16',message:'Root element NOT FOUND - CRITICAL ERROR',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
  // #endregion
  throw new Error('Root element not found');
}

// #region agent log
fetch('http://127.0.0.1:7244/ingest/ac060163-e445-4721-afc7-75c1daab8bb8',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'main.tsx:22',message:'Attempting React render',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
// #endregion

try {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
  // #region agent log
  fetch('http://127.0.0.1:7244/ingest/ac060163-e445-4721-afc7-75c1daab8bb8',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'main.tsx:32',message:'React render SUCCESS',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
  // #endregion
} catch (error) {
  // #region agent log
  fetch('http://127.0.0.1:7244/ingest/ac060163-e445-4721-afc7-75c1daab8bb8',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'main.tsx:35',message:'React render ERROR',data:{errorMessage:error instanceof Error?error.message:String(error),errorStack:error instanceof Error?error.stack:undefined},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
  // #endregion
  throw error;
}


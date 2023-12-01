import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';
import { QueryClient, QueryClientProvider } from 'react-query';
import { AuthProviderContext } from './context/AuthContext';
import { WebSocketProvider, socket } from './context/webSocketContext';
import { SelectedUserProviderContext } from './context/selectedUserContext';
import { CallInitiatorProviderContext } from './context/CallInitiatorContext';





const queryClient = new QueryClient();

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement

);
root.render(
  <QueryClientProvider client={queryClient}>
    <WebSocketProvider value={socket}>
      <AuthProviderContext>
        <SelectedUserProviderContext>
          <CallInitiatorProviderContext>
          <React.StrictMode>
            <App />
          </React.StrictMode>
          </CallInitiatorProviderContext>
        </SelectedUserProviderContext>
      </AuthProviderContext>
    </WebSocketProvider>
  </QueryClientProvider>
);

reportWebVitals();

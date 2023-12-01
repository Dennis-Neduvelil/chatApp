import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import './App.css';
import Login from './views/Login';
import Main from './views/Main';
import Chat from './views/Chat';
import CreateProfile from './views/CreateProfile';
import ProtectedOutlet from './components/protctedOutlet';
import VideoChat from './views/VideoChat';



const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signUp" element={<CreateProfile />} />
        <Route element={<ProtectedOutlet />}>
          <Route path="/chat" element={<Chat />} />
          <Route path="/" element={<Main />} />
          <Route path="/video-call" element={<VideoChat />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;

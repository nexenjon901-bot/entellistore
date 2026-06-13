import React, { useState } from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import AdminPanel from './pages/AdminPanel';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Payment from './pages/Payment';
import SellRequest from './pages/SellRequest';
import Catalog from './pages/Catalog';
import Support from './pages/Support';
import SupportChat from './pages/SupportChat';
import { AuthProvider } from './AuthContext';
import './index.css';
import './App.css';

const Layout = ({ lang, setLang }) => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <div className={isAdmin ? "admin-layout" : "app-container"}>
      {!isAdmin && <Navbar lang={lang} setLang={setLang} />}
      <main className={isAdmin ? "admin-main-full" : ""}>
        <Routes>
          <Route path="/" element={<Home lang={lang} />} />
          <Route path="/catalog" element={<Catalog lang={lang} />} />
          <Route path="/sell-request" element={<SellRequest lang={lang} />} />
          <Route path="/support" element={<Support lang={lang} />} />
          <Route path="/admin" element={<AdminPanel lang={lang} />} />
          <Route path="/login" element={<Login lang={lang} />} />
          <Route path="/profile" element={<Profile lang={lang} />} />
          <Route path="/chat" element={<SupportChat lang={lang} />} />
          <Route path="/payment/:id" element={<Payment lang={lang} />} />
        </Routes>
      </main>
      {!isAdmin && <Footer lang={lang} />}
    </div>
  );
};

const App = () => {
  const [lang, setLang] = useState(() => localStorage.getItem('entelli_lang') || 'uz');

  const handleSetLang = (newLang) => {
    setLang(newLang);
    localStorage.setItem('entelli_lang', newLang);
  };

  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

  return (
    <GoogleOAuthProvider clientId={googleClientId || 'placeholder.apps.googleusercontent.com'}>
    <AuthProvider setLang={handleSetLang}>
      <Router>
        <Layout lang={lang} setLang={handleSetLang} />
      </Router>
    </AuthProvider>
    </GoogleOAuthProvider>
  );
};

export default App;

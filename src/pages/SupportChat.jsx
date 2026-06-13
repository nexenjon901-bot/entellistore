import React, { useContext, useState, useEffect, useRef } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import { Send, CheckCircle } from 'lucide-react';

const SupportChat = ({ lang }) => {
  const { user, supportChats, sendSupportMessage } = useContext(AuthContext);
  const [msgInput, setMsgInput] = useState('');
  const messagesEndRef = useRef(null);

  const chatThread = user
    ? (supportChats.find(c => c.userId === user.id || c.userId === user.username) || { messages: [] })
    : { messages: [] };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatThread.messages]);

  if (!user) return <Navigate to="/login" />;

  const handleSend = () => {
    if (!msgInput.trim()) return;
    sendSupportMessage(user.id, 'user', msgInput.trim());
    setMsgInput('');
  };

  return (
    <div style={{ padding: '60px 0 80px', minHeight: '100vh' }}>
      <div className="container" style={{ maxWidth: '600px' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{ fontSize: '2rem' }}>Online <span className="gradient-text">Chat</span></h1>
          <p style={{ color: 'var(--text-secondary)' }}>Admin bilan to'g'ridan-to'g'ri bog'lanish</p>
        </div>

        <div className="glass-panel admin-chat-panel" style={{ height: '600px', display: 'flex', flexDirection: 'column' }}>
          <div className="chat-main" style={{ flex: 1, padding: '20px', display: 'flex', flexDirection: 'column' }}>
            
            <div className="chat-messages" style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px', paddingBottom: '20px' }}>
              {chatThread.messages.length === 0 ? (
                <div style={{ textAlign: 'center', color: 'var(--text-muted)', margin: 'auto' }}>
                  Xabar yozing. Admin tez orada javob beradi.
                </div>
              ) : (
                chatThread.messages.map((msg, idx) => (
                  <div key={idx} className={`chat-bubble ${msg.from === 'admin' ? 'admin' : 'user'}`} style={{ alignSelf: msg.from === 'admin' ? 'flex-start' : 'flex-end', maxWidth: '80%' }}>
                    {msg.text}
                    <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.5)', marginTop: '4px', textAlign: 'right' }}>
                      {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="chat-input-row" style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid var(--border-color)' }}>
              <input
                type="text"
                placeholder="Xabar yozish..."
                value={msgInput}
                onChange={(e) => setMsgInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                className="admin-input"
                style={{ flex: 1 }}
              />
              <button onClick={handleSend} className="btn btn-primary" style={{ padding: '12px 24px' }}>
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SupportChat;

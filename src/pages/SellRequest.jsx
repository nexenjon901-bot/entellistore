import React, { useContext, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import { translations } from '../translations';
import { Upload, Send, CheckCircle } from 'lucide-react';

const SellRequest = ({ lang }) => {
  const { user } = useContext(AuthContext);
  const t = translations[lang] || translations['uz'];
  const [submitted, setSubmitted] = useState(false);

  const [images, setImages] = useState([]);
  const [isDragging, setIsDragging] = useState(false);

  if (!user) {
    return <Navigate to="/login" />;
  }

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragging(true);
    } else if (e.type === 'dragleave') {
      setIsDragging(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (files) => {
    const newImages = Array.from(files).map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));
    setImages(prev => [...prev, ...newImages]);
  };

  const removeImage = (index) => {
    setImages(prev => {
      const newImages = [...prev];
      URL.revokeObjectURL(newImages[index].preview);
      newImages.splice(index, 1);
      return newImages;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="container" style={{ padding: '60px 20px', maxWidth: '600px', margin: '0 auto' }}>
      <div className="glass-panel" style={{ padding: '40px' }}>
        <h2 style={{ marginBottom: '24px', textAlign: 'center' }}>Akkaunt Sotish</h2>
        
        {!submitted ? (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px' }}>Akkaunt rasmlari / Abzor (Rasm yuklang)</label>
              
              <div 
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                style={{ 
                  border: `2px dashed ${isDragging ? 'var(--accent-primary)' : 'var(--border-color)'}`, 
                  padding: '40px 20px', 
                  textAlign: 'center', 
                  borderRadius: '12px', 
                  background: isDragging ? 'rgba(230, 46, 45, 0.05)' : 'var(--bg-tertiary)', 
                  position: 'relative',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }}
                onClick={() => document.getElementById('file-upload').click()}
              >
                <Upload size={32} style={{ margin: '0 auto 12px', color: isDragging ? 'var(--accent-primary)' : 'var(--text-secondary)' }} />
                <p style={{ color: 'var(--text-secondary)', marginBottom: '8px' }}>
                  Rasmlarni bu yerga tashlang yoki fayl tanlang
                </p>
                <input 
                  id="file-upload"
                  type="file" 
                  multiple 
                  accept="image/*" 
                  onChange={handleChange}
                  style={{ display: 'none' }} 
                />
              </div>

              {images.length > 0 && (
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '16px' }}>
                  {images.map((img, idx) => (
                    <div key={idx} style={{ position: 'relative', width: '80px', height: '80px', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
                      <img src={img.preview} alt={`preview-${idx}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <button 
                        type="button"
                        onClick={(e) => { e.stopPropagation(); removeImage(idx); }}
                        style={{ position: 'absolute', top: '4px', right: '4px', background: 'rgba(0,0,0,0.6)', color: 'white', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', border: 'none', cursor: 'pointer' }}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px' }}>Akkaunt haqida ma'lumot</label>
              <textarea 
                required
                rows="4" 
                placeholder="Level, Rank, Qanday skinlar bor..."
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-tertiary)', color: 'white', outline: 'none', resize: 'vertical' }}
              ></textarea>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px' }}>Sotmoqchi bo'lgan narxingiz ($)</label>
              <input 
                type="number" 
                required
                placeholder="Masalan: 50"
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-tertiary)', color: 'white', outline: 'none' }}
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ marginTop: '12px', padding: '16px' }}>
              Adminga Yuborish <Send size={18} />
            </button>
          </form>
        ) : (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <CheckCircle size={64} color="var(--success)" style={{ margin: '0 auto 24px' }} />
            <h3 style={{ marginBottom: '16px' }}>So'rov muvaffaqiyatli yuborildi!</h3>
            <p style={{ color: 'var(--text-secondary)' }}>
              Akkaunt ma'lumotlari adminga yuborildi. Admin tekshirib chiqqandan so'ng siz bilan bog'lanadi.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SellRequest;

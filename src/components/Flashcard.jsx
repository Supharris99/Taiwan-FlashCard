import { useState, useEffect } from 'react';
import { Volume2, RotateCw } from 'lucide-react';

export default function Flashcard({ word, autoPlay = false }) {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const playAudio = (e) => {
    if (e) e.stopPropagation(); // Prevent flipping when clicking audio
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // Stop current speech
      const utterance = new SpeechSynthesisUtterance(word.traditional);
      utterance.lang = 'zh-TW';
      utterance.rate = 0.8; // slightly slower for learning
      window.speechSynthesis.speak(utterance);
    }
  };

  // Auto-play pronunciation when the word changes
  useEffect(() => {
    if (autoPlay) {
      // Small timeout to ensure component is ready and not too jarring
      const timer = setTimeout(() => playAudio(), 300);
      return () => clearTimeout(timer);
    }
  }, [word.id, autoPlay]);

  return (
    <div className="flashcard-container">
      <div 
        className={`flashcard ${isFlipped ? 'is-flipped' : ''}`}
        onClick={handleFlip}
      >
        {/* Front of card */}
        <div className="card-face front">
          <div className="card-meta-top-left">
            <span className="subcategory-badge">{word.subcategory}</span>
            <div className="tags-row">
              {word.tags && word.tags.map(tag => (
                <span key={tag} className="tag-badge">{tag}</span>
              ))}
            </div>
          </div>

          <button className="audio-btn top-right" onClick={playAudio} title="Dengarkan pengucapan">
            <Volume2 size={20} />
          </button>
          
          <div className={`char-main ${word.traditional.length > 3 ? 'char-long' : ''}`}>
            {word.traditional}
          </div>
          
          <div className="click-hint">
            <RotateCw size={14} /> Klik untuk melihat arti
          </div>
        </div>
        
        {/* Back of card */}
        <div className="card-face back">
          <button className="audio-btn top-right" onClick={playAudio} title="Dengarkan pengucapan">
            <Volume2 size={20} />
          </button>
          
          <div className="pinyin">{word.pinyin}</div>
          <div className="meaning">{word.meaning}</div>
          
          <div className="click-hint">
            <RotateCw size={14} /> Klik untuk kembali
          </div>
        </div>
      </div>
    </div>
  );
}


import { useState } from 'react';
import { Volume2, RotateCw } from 'lucide-react';

export default function Flashcard({ word }) {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const playAudio = (e) => {
    e.stopPropagation(); // Prevent flipping when clicking audio
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(word.traditional);
      utterance.lang = 'zh-TW';
      utterance.rate = 0.8; // slightly slower for learning
      window.speechSynthesis.speak(utterance);
    } else {
      alert("Browser Anda tidak mendukung fitur Text-to-Speech.");
    }
  };

  return (
    <div className="flashcard-container">
      <div 
        className={`flashcard ${isFlipped ? 'is-flipped' : ''}`}
        onClick={handleFlip}
      >
        {/* Front of card */}
        <div className="card-face front">
          <button className="audio-btn" onClick={playAudio} title="Dengarkan pengucapan">
            <Volume2 size={20} />
          </button>
          
          <div className="char-main tchinese">{word.traditional}</div>
          
          <div className="click-hint">
            <RotateCw size={14} /> Klik untuk melihat arti
          </div>
        </div>
        
        {/* Back of card */}
        <div className="card-face back">
          <button className="audio-btn" onClick={playAudio} title="Dengarkan pengucapan">
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

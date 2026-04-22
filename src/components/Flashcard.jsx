import { useState, useEffect } from 'react';
import { Volume2, RotateCw, Headphones } from 'lucide-react';

export default function Flashcard({ word, autoPlay = false }) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const playAudio = (e) => {
    if (e) e.stopPropagation(); 
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(word.traditional);
      utterance.lang = 'zh-TW';
      utterance.rate = 0.8;
      
      utterance.onstart = () => setIsAudioPlaying(true);
      utterance.onend = () => setIsAudioPlaying(false);
      utterance.onerror = () => setIsAudioPlaying(false);
      
      window.speechSynthesis.speak(utterance);
    }
  };

  useEffect(() => {
    if (autoPlay) {
      const timer = setTimeout(() => playAudio(), 300);
      return () => clearTimeout(timer);
    }
  }, [word.id, autoPlay]);

  return (
    <div className="flashcard-container animate-scale-in">
      <div 
        className={`flashcard ${isFlipped ? 'is-flipped' : ''}`}
        onClick={handleFlip}
      >
        {/* Front of card */}
        <div className="card-face front">
          <div className="card-meta-top-left">
            <span className="subcategory-badge">{word.subcategory}</span>
          </div>

          <button 
            className={`audio-btn top-right ${isAudioPlaying ? 'playing' : ''}`} 
            onClick={playAudio} 
            title="Dengarkan pengucapan"
          >
            {isAudioPlaying ? <Headphones size={20} /> : <Volume2 size={20} />}
          </button>
          
          <div className={`char-main ${word.traditional.length > 3 ? 'char-long' : ''}`}>
            {word.traditional}
          </div>
          
          <div className="click-hint">
            <RotateCw size={16} /> <span>Sentuh untuk arti</span>
          </div>
        </div>
        
        {/* Back of card */}
        <div className="card-face back">
          <button 
            className={`audio-btn top-right ${isAudioPlaying ? 'playing' : ''}`} 
            onClick={playAudio} 
            title="Dengarkan pengucapan"
          >
             {isAudioPlaying ? <Headphones size={20} /> : <Volume2 size={20} />}
          </button>
          
          <div className="pinyin">{word.pinyin}</div>
          <div className="meaning">{word.meaning}</div>
          
          <div className="click-hint">
            <RotateCw size={16} /> <span>Sentuh untuk Hanzi</span>
          </div>
        </div>
      </div>
    </div>
  );
}


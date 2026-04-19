import { useState, useEffect } from 'react';
import { vocabularyData } from './data/vocabulary';
import Flashcard from './components/Flashcard';
import CategoryTabs from './components/CategoryTabs';
import { CheckCircle2, BrainCircuit, Frown } from 'lucide-react';
import './index.css';

function App() {
  // Application states
  const [activeTab, setActiveTab] = useState('all');
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Vocabulary state with local storage persistence
  const [vocabStatus, setVocabStatus] = useState(() => {
    const saved = localStorage.getItem('taiwanFlashcards');
    if (saved) {
      return JSON.parse(saved);
    }
    // Initialize all as 'unmarked'
    const initial = {};
    vocabularyData.forEach(v => initial[v.id] = 'unmarked');
    return initial;
  });

  // Save to local storage whenever status changes
  useEffect(() => {
    localStorage.setItem('taiwanFlashcards', JSON.stringify(vocabStatus));
  }, [vocabStatus]);

  // Derived state to get cards for current tab
  const getFilteredCards = () => {
    if (activeTab === 'all') return vocabularyData;
    return vocabularyData.filter(v => vocabStatus[v.id] === activeTab);
  };

  const currentCards = getFilteredCards();
  const currentCard = currentCards.length > 0 ? currentCards[currentIndex] : null;

  // Counts for tabs
  const counts = {
    all: vocabularyData.length,
    hafal: Object.values(vocabStatus).filter(s => s === 'hafal').length,
    ragu: Object.values(vocabStatus).filter(s => s === 'ragu').length,
    lupa: Object.values(vocabStatus).filter(s => s === 'lupa').length,
  };

  // Actions
  const markVocab = (status) => {
    if (!currentCard) return;
    
    setVocabStatus(prev => ({
      ...prev,
      [currentCard.id]: status
    }));

    // Move to next card
    if (currentIndex < currentCards.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Loop back or reset index if list changes
      setCurrentIndex(0);
    }
  };

  // Reset index when changing tabs to prevent out of bounds
  useEffect(() => {
    setCurrentIndex(0);
  }, [activeTab]);

  return (
    <div className="app-container">
      <div className="header">
        <h1>Mandarin Flashcards</h1>
        <p>Belajar Kosa Kata Mandarin Taiwan (Sekolah, Kerja, Lingkungan)</p>
      </div>

      <CategoryTabs 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        counts={counts} 
      />

      {currentCard ? (
        <>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>
            Kartu {currentIndex + 1} dari {currentCards.length}
          </p>
          
          <Flashcard key={currentCard.id} word={currentCard} />

          <div className="actions">
            <button className="action-btn btn-lupa" onClick={() => markVocab('lupa')}>
              <Frown size={24} />
              Lupa
            </button>
            <button className="action-btn btn-ragu" onClick={() => markVocab('ragu')}>
              <BrainCircuit size={24} />
              Ragu-ragu
            </button>
            <button className="action-btn btn-hafal" onClick={() => markVocab('hafal')}>
              <CheckCircle2 size={24} />
              Hafal Banget
            </button>
          </div>
        </>
      ) : (
        <div className="empty-state">
          <h3>Tidak ada kartu di sini.</h3>
          <p>
            {activeTab === 'all' 
              ? 'Belum ada kosa kata yang ditambahkan.'
              : `Kamu belum menandai kartu manapun sebagai "${activeTab}".`}
          </p>
        </div>
      )}

      <div className="progress-info">
        <span>Progress: {Math.round((counts.hafal / counts.all) * 100)}% Hafal Semua</span>
        <span>Total Kosa Kata: {counts.all}</span>
      </div>
    </div>
  );
}

export default App;

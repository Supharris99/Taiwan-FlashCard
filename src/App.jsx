import { useState, useEffect, useMemo, useCallback } from 'react';
import { vocabularyData } from './data/vocabulary';
import Flashcard from './components/Flashcard';
import CategoryTabs from './components/CategoryTabs';
import TopicSelector from './components/TopicSelector';
import { 
  CheckCircle2, BrainCircuit, Frown, List, 
  LayoutGrid, RotateCcw, Volume2, Shuffle, 
  Keyboard, ChevronLeft, Layout
} from 'lucide-react';
import './index.css';

function App() {
  const STORAGE_KEY = 'taiwanFlashcards_v4';

  const [appState, setAppState] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
    
    const initialStatus = {};
    vocabularyData.forEach(v => initialStatus[v.id] = 'unmarked');
    
    return {
      vocabStatus: initialStatus,
      activeTab: 'all',
      activeTopic: 'all',
      currentIndex: 0,
      viewMode: 'flashcard',
      currentView: 'dashboard', // NEW: 'dashboard' or 'study'
      isAutoAudio: true,
      isShuffle: false
    };
  });

  const { 
    vocabStatus, activeTab, activeTopic, 
    currentIndex, viewMode, currentView, isAutoAudio, isShuffle 
  } = appState;

  const updateState = (updates) => {
    setAppState(prev => ({ ...prev, ...updates }));
  };

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(appState));
  }, [appState]);

  const currentCards = useMemo(() => {
    let filtered = vocabularyData.filter(v => {
      const topicMatch = activeTopic === 'all' || v.category === activeTopic;
      const status = vocabStatus[v.id];
      const statusMatch = activeTab === 'all' ? status !== 'hafal' : status === activeTab;
      return topicMatch && statusMatch;
    });

    if (isShuffle) {
      return [...filtered].sort((a, b) => (a.traditional.length % 2) - 0.5);
    }
    return filtered;
  }, [vocabStatus, activeTab, activeTopic, isShuffle]);

  const currentCard = currentCards.length > 0 ? currentCards[currentIndex] : null;

  const counts = useMemo(() => {
    const topicData = vocabularyData.filter(v => activeTopic === 'all' || v.category === activeTopic);
    return {
      all: topicData.length,
      hafal: topicData.filter(v => vocabStatus[v.id] === 'hafal').length,
      ragu: topicData.filter(v => vocabStatus[v.id] === 'ragu').length,
      lupa: topicData.filter(v => vocabStatus[v.id] === 'lupa').length,
    };
  }, [vocabStatus, activeTopic]);

  const markVocab = useCallback((status) => {
    if (!currentCard) return;
    const newStatus = { ...vocabStatus, [currentCard.id]: status };
    
    const willBeRemoved = (activeTab === 'all') ? (status === 'hafal') : (status !== activeTab);
    
    let nextIndex = currentIndex;
    if (willBeRemoved) {
      if (currentIndex >= currentCards.length - 1) {
        nextIndex = 0;
      }
    } else {
      nextIndex = (currentIndex + 1) % currentCards.length;
    }
    
    updateState({
      vocabStatus: newStatus,
      currentIndex: nextIndex
    });
  }, [currentCard, vocabStatus, currentIndex, currentCards.length, activeTab]);

  const nextCard = useCallback(() => {
    updateState({ currentIndex: (currentIndex + 1) % currentCards.length });
  }, [currentIndex, currentCards.length]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (currentView !== 'study' || viewMode !== 'flashcard' || !currentCard) return;
      
      switch(e.key) {
        case ' ':
        case 'ArrowUp':
          e.preventDefault();
          document.querySelector('.flashcard')?.click();
          break;
        case 'ArrowRight':
          nextCard();
          break;
        case '1': markVocab('lupa'); break;
        case '2': markVocab('ragu'); break;
        case '3': markVocab('hafal'); break;
        default: break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentView, viewMode, currentCard, markVocab, nextCard]);

  const resetProgress = () => {
    if (window.confirm("Hapus semua progress belajar Anda?")) {
      const initialStatus = {};
      vocabularyData.forEach(v => initialStatus[v.id] = 'unmarked');
      updateState({
        vocabStatus: initialStatus,
        currentIndex: 0,
        activeTab: 'all',
        activeTopic: 'all',
        currentView: 'dashboard'
      });
    }
  };

  useEffect(() => {
    updateState({ currentIndex: 0 });
  }, [activeTab, activeTopic]);

  const enterStudyMode = (topic) => {
    updateState({ activeTopic: topic, currentView: 'study', currentIndex: 0 });
  };

  const getEmptyStateMessage = () => {
    if (activeTab === 'all') {
      return { title: 'Topik Selesai!', message: 'Semua kosa kata di kategori ini sudah kamu kuasai.' };
    }
    if (activeTab === 'hafal') {
      return { title: 'Belum Ada', message: 'Kamu belum mempunyai kosa kata yang "Hafal" di topik ini.' };
    }
    if (activeTab === 'ragu') {
      return { title: 'Belum Ada', message: 'Tidak ada kata yang ditandai "Ragu-ragu".' };
    }
    return { title: 'Kosong', message: 'Hebat! Kamu tidak menandai apapun sebagai "Lupa" di topik ini.' };
  };
  const emptyStateMsg = getEmptyStateMessage();

  return (
    <div className={`app-container ${currentView}-view`}>
      {/* HEADER SECTION - Persistent but adaptive */}
      <div className="header">
        <div className="title-section" onClick={() => updateState({currentView: 'dashboard'})} style={{cursor: 'pointer'}}>
          <h1>Mandarin Flashcards</h1>
          <p>Speak Mandarin in Taiwan</p>
        </div>

        {currentView === 'study' && (
          <div className="study-controls animate-fade-in">
            <button className="back-btn" onClick={() => updateState({ currentView: 'dashboard' })}>
              <ChevronLeft size={20} />
              <span>Kembali</span>
            </button>
            
            <div className="settings-pills">
              <button 
                className={`pill ${isAutoAudio ? 'active' : ''}`}
                onClick={() => updateState({ isAutoAudio: !isAutoAudio })}
              >
                <Volume2 size={16} /> <span>Audio</span>
              </button>
              <button 
                className={`pill ${isShuffle ? 'active' : ''}`}
                onClick={() => updateState({ isShuffle: !isShuffle })}
              >
                <Shuffle size={16} /> <span>Acak</span>
              </button>
            </div>

            <div className="view-toggle">
              <button className={viewMode === 'flashcard' ? 'active' : ''} onClick={() => updateState({ viewMode: 'flashcard' })}>
                <LayoutGrid size={18} />
              </button>
              <button className={viewMode === 'table' ? 'active' : ''} onClick={() => updateState({ viewMode: 'table' })}>
                <List size={18} />
              </button>
            </div>
          </div>
        )}
      </div>

      {currentView === 'dashboard' ? (
        <div className="dashboard-content animate-fade-in">
          <div className="stats-overview">
            <div className="main-stat-circle">
              <svg className="progress-ring" width="220" height="220">
                <circle
                  className="progress-ring-bg"
                  stroke="rgba(255,255,255,0.05)"
                  strokeWidth="12"
                  fill="transparent"
                  r="90"
                  cx="110"
                  cy="110"
                />
                <circle
                  className="progress-ring-circle"
                  stroke="var(--primary)"
                  strokeWidth="12"
                  strokeDasharray={`${2 * Math.PI * 90}`}
                  strokeDashoffset={`${2 * Math.PI * 90 * (1 - (vocabularyData.length > 0 ? (Object.values(vocabStatus).filter(s=>s==='hafal').length / Object.keys(vocabStatus).length) : 0))}`}
                  strokeLinecap="round"
                  fill="transparent"
                  r="90"
                  cx="110"
                  cy="110"
                />
              </svg>
              <div className="main-stat-content">
                <span className="value">{vocabularyData.length > 0 ? Math.round((Object.values(vocabStatus).filter(s=>s==='hafal').length / Object.keys(vocabStatus).length) * 100) : 0}%</span>
                <span className="label">Terhafalkan</span>
              </div>
            </div>
            
            <div className="mini-stats-grid">
              <div className="m-stat-card total">
                <div className="m-stat-info">
                  <label>Total Kata</label>
                  <span>{Object.keys(vocabStatus).length}</span>
                </div>
              </div>
              <div className="m-stat-card hafal">
                <div className="m-stat-info">
                  <label>Hafal</label>
                  <span>{Object.values(vocabStatus).filter(s=>s==='hafal').length}</span>
                </div>
              </div>
              <div className="m-stat-card ragu">
                <div className="m-stat-info">
                  <label>Ragu</label>
                  <span>{Object.values(vocabStatus).filter(s=>s==='ragu').length}</span>
                </div>
              </div>
              <div className="m-stat-card lupa">
                <div className="m-stat-info">
                  <label>Lupa</label>
                  <span>{Object.values(vocabStatus).filter(s=>s==='lupa').length}</span>
                </div>
              </div>
            </div>
          </div>

          <TopicSelector 
            activeTopic={activeTopic} 
            onSelect={enterStudyMode}
            vocabStatus={vocabStatus}
            vocabularyData={vocabularyData}
          />
          
          <div className="dashboard-footer">
            <button className="reset-btn" onClick={resetProgress}>
              <RotateCcw size={14} /> Reset Semua Progress
            </button>
          </div>
        </div>
      ) : (
        <div className="study-content animate-fade-in">
          <div className="study-header">
            <div className="topic-badge">
              <Layout size={14} /> {activeTopic.toUpperCase()}
            </div>
            <CategoryTabs 
              activeTab={activeTab} 
              setActiveTab={(tab) => updateState({ activeTab: tab })} 
              counts={counts} 
            />
          </div>

          {viewMode === 'flashcard' ? (
            <div className="flashcard-view">
              {currentCard ? (
                <>
                  <div className="card-header">
                    <div className="card-counter">
                      <span>Kartu {currentIndex + 1} dari {currentCards.length}</span>
                      <div className="mini-progress-bar">
                        <div className="progress-fill" style={{ width: `${((currentIndex + 1) / currentCards.length) * 100}%` }}></div>
                      </div>
                    </div>
                    <div className="hotkey-hint"><Keyboard size={14} /> 1,2,3, Spasi</div>
                  </div>
                  <Flashcard key={currentCard.id} word={currentCard} autoPlay={isAutoAudio} />
                  <div className="actions">
                    <button className="action-btn btn-lupa" onClick={() => markVocab('lupa')}><Frown size={24} /><span>Lupa</span></button>
                    <button className="action-btn btn-ragu" onClick={() => markVocab('ragu')}><BrainCircuit size={24} /><span>Ragu</span></button>
                    <button className="action-btn btn-hafal" onClick={() => markVocab('hafal')}><CheckCircle2 size={24} /><span>Hafal</span></button>
                  </div>
                </>
              ) : (
                <div className="empty-state">
                  <CheckCircle2 size={48} color={activeTab === 'all' ? "var(--hafal)" : "var(--text-muted)"} />
                  <h3>{emptyStateMsg.title}</h3>
                  <p>{emptyStateMsg.message}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="table-view">
              <div className="table-container">
                <table>
                  <thead><tr><th>Hanzi</th><th>Pinyin</th><th>Arti</th><th>Status</th></tr></thead>
                  <tbody>
                    {currentCards.map(word => (
                      <tr key={word.id}>
                        <td className="tchinese">{word.traditional}</td>
                        <td>{word.pinyin}</td>
                        <td className="meaning-td">{word.meaning}</td>
                        <td><span className={`status-badge ${vocabStatus[word.id]}`}>{vocabStatus[word.id]}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;




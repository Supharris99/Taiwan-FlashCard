import { BrainCircuit, Frown, CheckCircle2, LayoutGrid } from 'lucide-react';

export default function CategoryTabs({ activeTab, setActiveTab, counts }) {
  const tabs = [
    { id: 'all', label: 'Semua', icon: LayoutGrid, count: counts.all },
    { id: 'hafal', label: 'Hafal Banget', icon: CheckCircle2, count: counts.hafal },
    { id: 'ragu', label: 'Ragu-ragu', icon: BrainCircuit, count: counts.ragu },
    { id: 'lupa', label: 'Lupa', icon: Frown, count: counts.lupa }
  ];

  return (
    <div className="tabs">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        return (
          <button
            key={tab.id}
            className={`tab-btn ${activeTab === tab.id ? `active tab-${tab.id}` : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Icon size={16} />
              <span>{tab.label}</span>
              <span style={{ 
                background: 'rgba(255,255,255,0.1)', 
                padding: '2px 8px', 
                borderRadius: '12px',
                fontSize: '0.8rem'
              }}>
                {tab.count}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}

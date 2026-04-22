import { BrainCircuit, Frown, CheckCircle2, LayoutGrid } from 'lucide-react';

export default function CategoryTabs({ activeTab, setActiveTab, counts }) {
  const tabs = [
    { id: 'all', label: 'Belum Hafal', icon: LayoutGrid, count: counts.all - counts.hafal },
    { id: 'hafal', label: 'Hafal Banget', icon: CheckCircle2, count: counts.hafal },
    { id: 'ragu', label: 'Ragu-ragu', icon: BrainCircuit, count: counts.ragu },
    { id: 'lupa', label: 'Lupa', icon: Frown, count: counts.lupa }
  ];

  return (
    <div className="tabs animate-fade-in">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        return (
          <button
            key={tab.id}
            className={`tab-btn ${activeTab === tab.id ? `active tab-${tab.id}` : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <div className="tab-content">
              <Icon size={16} />
              <span>{tab.label}</span>
              <span className="tab-count">
                {tab.count}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}


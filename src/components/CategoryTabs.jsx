import { BrainCircuit, Frown, CheckCircle2, LayoutGrid } from 'lucide-react';

export default function CategoryTabs({ activeTab, setActiveTab, counts }) {
  const tabs = [
    { id: 'all', label: 'Belajar', icon: LayoutGrid, count: counts.all - counts.hafal },
    { id: 'hafal', label: 'Hafal', icon: CheckCircle2, count: counts.hafal },
    { id: 'ragu', label: 'Ragu', icon: BrainCircuit, count: counts.ragu },
    { id: 'lupa', label: 'Lupa', icon: Frown, count: counts.lupa }
  ];

  return (
    <div className="tabs animate-fade-in">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        return (
          <button
            key={tab.id}
            className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <Icon size={16} />
            <span className="tab-label-text">{tab.label}</span>
            <span className="tab-count">{tab.count}</span>
          </button>
        );
      })}
    </div>
  );
}


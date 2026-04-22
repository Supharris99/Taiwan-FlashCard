import { useMemo } from 'react';
import { 
  Home, Users, Clock, MapPin, Hash, Coffee, 
  Bus, ShoppingCart, GraduationCap, Briefcase, 
  HeartPulse, Smartphone, Smile, Zap, Sparkles, Link 
} from 'lucide-react';

const topics = [
  { id: 'Kehidupan Sehari-hari', label: 'Sehari-hari', icon: Home },
  { id: 'Orang & Relasi', label: 'Orang & Relasi', icon: Users },
  { id: 'Waktu & Jadwal', label: 'Waktu & Jadwal', icon: Clock },
  { id: 'Tempat & Arah', label: 'Tempat & Arah', icon: MapPin },
  { id: 'Angka & Kuantitas', label: 'Angka & Kuantitas', icon: Hash },
  { id: 'Makanan & Minuman', label: 'Makanan & Minuman', icon: Coffee },
  { id: 'Transportasi', label: 'Transportasi', icon: Bus },
  { id: 'Belanja & Uang', label: 'Belanja & Uang', icon: ShoppingCart },
  { id: 'Sekolah & Belajar', label: 'Sekolah & Belajar', icon: GraduationCap },
  { id: 'Pekerjaan Dasar', label: 'Pekerjaan Dasar', icon: Briefcase },
  { id: 'Kesehatan', label: 'Kesehatan', icon: HeartPulse },
  { id: 'Teknologi & Komunikasi', label: 'Teknologi', icon: Smartphone },
  { id: 'Perasaan & Sifat', label: 'Perasaan & Sifat', icon: Smile },
  { id: 'Kata Kerja Inti', label: 'Kata Kerja', icon: Zap },
  { id: 'Kata Sifat Inti', label: 'Kata Sifat', icon: Sparkles },
  { id: 'Partikel & Struktur Dasar', label: 'Gramatika', icon: Link },
];

export default function TopicSelector({ onSelect, vocabStatus, vocabularyData }) {
  const topicProgress = useMemo(() => {
    const progress = {};
    topics.forEach(topic => {
      const topicVocab = vocabularyData.filter(v => v.category === topic.id);
      const total = topicVocab.length;
      const hafal = topicVocab.filter(v => vocabStatus[v.id] === 'hafal').length;
      progress[topic.id] = total > 0 ? Math.round((hafal / total) * 100) : 0;
    });
    return progress;
  }, [vocabStatus, vocabularyData]);

  return (
    <div className="topic-selector-container">
      <h2 className="selector-label">Pilih Topik Belajar</h2>
      <div className="topic-grid">
        {topics.map((topic) => {
          const Icon = topic.icon;
          const progress = topicProgress[topic.id];
          return (
            <button
              key={topic.id}
              className="topic-card animate-scale-in"
              onClick={() => onSelect(topic.id)}
            >
              <div className="topic-icon-wrapper">
                <Icon size={28} />
              </div>
              <div className="topic-info">
                <span className="topic-label">{topic.label}</span>
                <div className="topic-progress-mini">
                  <div className="topic-progress-fill" style={{ width: `${progress}%` }}></div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

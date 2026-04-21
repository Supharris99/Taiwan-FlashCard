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

export default function TopicSelector({ onSelect }) {
  return (
    <div className="topic-selector-container">
      <h2 className="selector-label">Pilih Topik Belajar</h2>
      <div className="topic-grid">
        {topics.map((topic) => {
          const Icon = topic.icon;
          return (
            <button
              key={topic.id}
              className="topic-card"
              onClick={() => onSelect(topic.id)}
            >
              <div className="topic-icon">
                <Icon size={24} />
              </div>
              <span className="topic-label">{topic.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

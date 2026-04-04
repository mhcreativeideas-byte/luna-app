import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

export default function BackButton() {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(-1)}
      className="w-10 h-10 rounded-full bg-white border border-gray-100 flex items-center justify-center text-luna-text-muted hover:text-luna-text hover:border-gray-200 transition-all mb-4"
      style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
    >
      <ChevronLeft size={20} />
    </button>
  );
}

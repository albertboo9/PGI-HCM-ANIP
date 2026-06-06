import { useState } from 'react';
import { Bell, Sparkles, BookOpen, Target, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';

export default function CoachNotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  
  // Dans un vrai système, ces notifications proviendraient du store.
  // Ici on les mock pour illustrer le concept de "Coach Proactif".
  const notifications = [
    {
      id: 'n1',
      type: 'alert',
      title: 'Attention Requise',
      desc: '3 dossiers rejetés cette semaine (FR-01).',
      time: 'Il y a 2h',
      icon: Target,
      color: 'text-aqip-warning',
      bg: 'bg-aqip-warning/10'
    },
    {
      id: 'n2',
      type: 'recommendation',
      title: 'Nouvelle Recommandation',
      desc: 'Module "Transcription" ajouté à votre PDI.',
      time: 'Hier',
      icon: BookOpen,
      color: 'text-aqip-primary',
      bg: 'bg-aqip-primary/10'
    },
    {
      id: 'n3',
      type: 'success',
      title: 'Progression Qualité',
      desc: 'Votre score est passé de 62 à 88 !',
      time: 'Il y a 3j',
      icon: Sparkles,
      color: 'text-aqip-success',
      bg: 'bg-aqip-success/10'
    }
  ];

  return (
    <div className="relative">
      <div className="flex items-center gap-2">
        <Link 
          to="/coach" 
          className="hidden sm:flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-white bg-white/10 hover:bg-white/20 border border-white/20 rounded-full transition-all shadow-sm"
        >
          <Sparkles className="h-3.5 w-3.5 text-yellow-300" />
          <span>Mon Coach IA</span>
        </Link>
        
        <button 
          type="button" 
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 text-white/80 hover:text-white rounded-full transition-colors relative focus:outline-none focus:ring-2 focus:ring-white/50"
        >
          <span className="sr-only">Voir les notifications du Coach</span>
          <Bell className="h-6 w-6" aria-hidden="true" />
          <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-sm border-2 border-[#2B5E8D]">
            {notifications.length}
          </span>
        </button>
      </div>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div>
          <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 overflow-hidden origin-top-right animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-[#2B5E8D] p-4 text-white flex justify-between items-center">
              <div>
                <h3 className="font-bold text-sm flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-yellow-300" />
                  Coach AQIP
                </h3>
                <p className="text-xs text-white/80 mt-0.5">Vos alertes et recommandations</p>
              </div>
            </div>
            <div className="max-h-[400px] overflow-y-auto">
              {notifications.map((notif) => {
                const Icon = notif.icon;
                return (
                  <Link 
                    to="/coach" 
                    key={notif.id}
                    onClick={() => setIsOpen(false)}
                    className="block p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex gap-3">
                      <div className={clsx("h-8 w-8 rounded-full flex items-center justify-center shrink-0", notif.bg, notif.color)}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="flex justify-between items-start mb-1">
                          <h4 className="text-sm font-bold text-gray-900">{notif.title}</h4>
                          <span className="text-[10px] text-gray-500">{notif.time}</span>
                        </div>
                        <p className="text-xs text-gray-600 line-clamp-2">{notif.desc}</p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
            <div className="p-3 border-t border-gray-100 text-center bg-gray-50">
              <Link 
                to="/coach" 
                onClick={() => setIsOpen(false)}
                className="text-xs font-bold text-[#2B5E8D] hover:underline flex items-center justify-center gap-1"
              >
                Ouvrir la messagerie du Coach <ChevronRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

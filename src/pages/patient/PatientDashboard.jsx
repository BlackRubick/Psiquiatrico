import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Activity, Pill, User, Heart, AlertCircle, BookOpen, LogOut } from 'lucide-react';
import Logo from '../../components/common/Logo';

const PatientDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const menuItems = [
    { 
      id: 'activities', 
      title: 'ACTIVIDADES', 
      icon: Activity, 
      color: 'bg-accent-yellow',
      path: '/patient/activities'
    },
    { 
      id: 'emotions', 
      title: 'EMOCIONES DEL DÍA', 
      icon: Heart, 
      color: 'bg-accent-orange',
      path: '/patient/emotions'
    },
    { 
      id: 'profile', 
      title: 'PERFIL', 
      icon: User, 
      color: 'bg-accent-gray',
      path: '/patient/profile'
    },
    { 
      id: 'medication', 
      title: 'MEDICACIÓN', 
      icon: Pill, 
      color: 'bg-accent-green',
      path: '/patient/medication'
    },
    { 
      id: 'tlp-info', 
      title: 'DATOS INTERESANTES\nSOBRE EL TLP', 
      icon: BookOpen, 
      color: 'bg-accent-cyan',
      path: '/patient/tlp-info'
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-600 via-gray-700 to-gray-800 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Logo className="w-16 h-16" />
            <h1 className="text-white text-2xl font-bold">
              BIO<span className="text-primary">PSYCHE</span>
            </h1>
          </div>
          <button
            onClick={logout}
            className="text-white hover:text-red-400 transition-colors p-2"
            title="Cerrar sesión"
          >
            <LogOut size={24} />
          </button>
        </div>

        <div className="bg-primary text-white rounded-lg p-6 mb-8 text-center shadow-lg">
          <h2 className="text-3xl font-bold">
            BIENVENIDO {user?.nombreCompleto?.split(' ')[0]?.toUpperCase() || 'USUARIO'}!!
          </h2>
          <div className="mt-2">
            <svg className="w-full h-6" viewBox="0 0 400 20" fill="none">
              <path d="M0,10 Q100,0 200,10 T400,10" stroke="white" strokeWidth="2" fill="none"/>
            </svg>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-8">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className={`${item.color} rounded-3xl p-6 shadow-lg hover:scale-105 transition-transform duration-200 flex flex-col items-center justify-center min-h-[160px] text-gray-800`}
            >
              <item.icon size={48} className="mb-3" />
              <span className="text-sm font-bold text-center whitespace-pre-line">
                {item.title}
              </span>
            </button>
          ))}
        </div>

        <button
          onClick={() => navigate('/patient/emergency')}
          className="w-full bg-accent-red text-white rounded-3xl p-8 shadow-lg hover:scale-105 transition-transform duration-200 flex items-center justify-center gap-4"
        >
          <AlertCircle size={48} />
          <span className="text-2xl font-bold">
            ¡¡BOTÓN DE EMERGENCIA!!
          </span>
        </button>
      </div>
    </div>
  );
};

export default PatientDashboard;

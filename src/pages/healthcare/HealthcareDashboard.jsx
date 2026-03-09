import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { ClipboardList, Users, User, BarChart3, MessageSquare, LogOut, Calendar, Edit } from 'lucide-react';
import Logo from '../../components/common/Logo';

const HealthcareDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const menuItems = [
    { 
      id: 'assign-activities', 
      title: 'ASIGNAR ACTIVIDADES', 
      icon: ClipboardList, 
      color: 'bg-accent-yellow',
      path: '/healthcare/assign-activities'
    },
    { 
      id: 'manage-activities', 
      title: 'GESTIONAR\nACTIVIDADES', 
      icon: Edit, 
      color: 'bg-accent-purple',
      path: '/healthcare/manage-activities'
    },
    { 
      id: 'patient-list', 
      title: 'LISTA DE PACIENTES', 
      icon: Users, 
      color: 'bg-accent-orange',
      path: '/healthcare/patients'
    },
    { 
      id: 'appointments', 
      title: 'CALENDARIO\nDE CITAS', 
      icon: Calendar, 
      color: 'bg-accent-pink',
      path: '/healthcare/appointments'
    },
    { 
      id: 'profile', 
      title: 'PERFIL', 
      icon: User, 
      color: 'bg-accent-gray',
      path: '/healthcare/profile'
    },
    { 
      id: 'dashboards', 
      title: 'DASHBOARDS\nMENSUALES', 
      icon: BarChart3, 
      color: 'bg-accent-green',
      path: '/healthcare/dashboards'
    },
    { 
      id: 'ratings', 
      title: 'CALIFICACIONES\nY COMENTARIOS', 
      icon: MessageSquare, 
      color: 'bg-accent-cyan',
      path: '/healthcare/ratings'
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
            BIENVENIDO DR {user?.nombreCompleto?.split(' ')[0]?.toUpperCase() || 'USUARIO'}
          </h2>
          <div className="mt-2">
            <svg className="w-full h-6" viewBox="0 0 400 20" fill="none">
              <path d="M0,10 Q100,0 200,10 T400,10" stroke="white" strokeWidth="2" fill="none"/>
            </svg>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
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
      </div>
    </div>
  );
};

export default HealthcareDashboard;

import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Logo from '../../components/common/Logo';

const testUsers = [
  { usernameOrEmail: 'admin', password: 'admin123', userType: 'admin' },
  { usernameOrEmail: 'doctor', password: 'doctor123', userType: 'healthcare' },
  { usernameOrEmail: 'paciente', password: 'paciente123', userType: 'patient' },
];

const Landing = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, userType, user } = useAuth();
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    const result = await login({ usernameOrEmail, password });
    if (!result.success) {
      setError(result.error || "Usuario o contraseña incorrectos");
      return;
    }
    // La redirección se maneja en useEffect fuera de esta función
  };

  // Redirigir automáticamente cuando userType cambie tras login exitoso
  const [hasNavigated, setHasNavigated] = useState(false);
  useEffect(() => {
    setHasNavigated(false);
  }, [userType, user]);
  useEffect(() => {
    if (hasNavigated) return;
    if (!userType || !user) return;
    if (location.pathname !== "/") return;
    let target = null;
    const normalizedType = String(userType).toLowerCase();
    if (normalizedType === "admin") target = "/admin/users";
    else if (normalizedType === "healthcare") target = "/healthcare/dashboard";
    else if (normalizedType === "patient" || normalizedType === "paciente") target = "/patient/dashboard";
    if (target) {
      setHasNavigated(true);
      navigate(target);
    }
  }, [userType, user, location.pathname, hasNavigated, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-600 via-gray-700 to-gray-800 p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <Logo className="w-24 h-24 mx-auto mb-4" />
          <h1 className="text-5xl font-bold text-white mb-2">
            BIO<span className="text-primary">PSYCHE</span>
          </h1>
          <div className="relative">
            <svg className="w-full h-8" viewBox="0 0 300 30" fill="none">
              <path d="M0,15 Q75,5 150,15 T300,15" stroke="currentColor" strokeWidth="2" className="text-primary" fill="none"/>
            </svg>
          </div>
        </div>

        <form onSubmit={handleLogin} className="bg-white rounded-lg shadow-xl p-8 space-y-4">
          <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">
            Iniciar sesión
          </h2>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Usuario o correo electrónico"
              value={usernameOrEmail}
              onChange={e => setUsernameOrEmail(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary transition-colors"
              required
            />
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary transition-colors"
              required
            />
            <button type="submit" className="w-full bg-primary text-white py-3 rounded-lg hover:bg-primary-dark transition-colors font-semibold">
              Iniciar sesión
            </button>
            {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
          </div>
          {/* <div className="mt-6 text-xs text-gray-500">
            <div>Datos de prueba:</div>
            <div>Admin: admin@hotmail.com / Admin123123</div>
          </div> */}
        </form>
      </div>
    </div>
  );
};

export default Landing;

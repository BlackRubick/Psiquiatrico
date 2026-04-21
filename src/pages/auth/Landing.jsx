import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import Logo from '../../components/common/Logo';
import { Moon, Sun } from 'lucide-react';

const Landing = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, userType, user } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showReset, setShowReset] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    const result = await login({ usernameOrEmail, password });
    if (!result.success) {
      setError(result.error || "Usuario o contraseña incorrectos");
      return;
    }
  };

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
    else if (normalizedType === "familiar") target = "/familiar/dashboard";
    else if (normalizedType === "patient" || normalizedType === "paciente") target = "/patient/dashboard";
    if (target) {
      setHasNavigated(true);
      navigate(target);
    }
  }, [userType, user, location.pathname, hasNavigated, navigate]);

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-300 ${
      isDark 
        ? 'bg-gradient-to-br from-gray-600 via-gray-700 to-gray-800' 
        : 'bg-gradient-to-br from-blue-50 via-white to-blue-50'
    }`}>
      <button
        onClick={toggleTheme}
        className={`absolute top-4 right-4 p-2 rounded-lg transition-all duration-300 ${
          isDark 
            ? 'bg-gray-700 hover:bg-gray-600 text-yellow-400' 
            : 'bg-gray-200 hover:bg-gray-300 text-gray-600'
        }`}
        title={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
      >
        {isDark ? <Sun size={24} /> : <Moon size={24} />}
      </button>
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <Logo className="w-24 h-24 mx-auto mb-4" />
          <h1 className={`text-5xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-800'}`}>
            BIO<span className="text-primary">PSYCHE</span>
          </h1>
          <div className="relative">
            <svg className="w-full h-8" viewBox="0 0 300 30" fill="none">
              <path d="M0,15 Q75,5 150,15 T300,15" stroke="currentColor" strokeWidth="2" className="text-primary" fill="none"/>
            </svg>
          </div>
        </div>
        {!showReset ? (
          <form onSubmit={handleLogin} className={`rounded-lg shadow-xl p-8 space-y-4 transition-colors duration-300 ${
            isDark 
              ? 'bg-white' 
              : 'bg-white border-2 border-gray-200'
          }`}>
            <h2 className={`text-2xl font-semibold text-center mb-6 ${isDark ? 'text-gray-800' : 'text-gray-700'}`}>
              Iniciar sesión
            </h2>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Usuario o correo electrónico"
                value={usernameOrEmail}
                onChange={e => setUsernameOrEmail(e.target.value)}
                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors ${
                  isDark
                    ? 'border-gray-300 focus:border-primary bg-gray-50'
                    : 'border-gray-300 focus:border-primary bg-white'
                }`}
                required
              />
              <input
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors ${
                  isDark
                    ? 'border-gray-300 focus:border-primary bg-gray-50'
                    : 'border-gray-300 focus:border-primary bg-white'
                }`}
                required
              />
              <button type="submit" className="w-full bg-primary text-white py-3 rounded-lg hover:bg-primary-dark transition-colors font-semibold">
                Iniciar sesión
              </button>
              <button
                type="button"
                className="w-full text-primary underline text-sm mt-2"
                onClick={() => setShowReset(true)}
              >
                ¿Olvidaste tu contraseña?
              </button>
              {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
            </div>
          </form>
        ) : (
          <PasswordResetRequest onBack={() => setShowReset(false)} />
        )}
      </div>
    </div>
  );
};


// Componente para solicitar recuperación de contraseña
import { useState } from 'react';
function PasswordResetRequest({ onBack }) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [token, setToken] = useState("");
  const [showResetForm, setShowResetForm] = useState(false);

  const handleRequest = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setToken("");
    try {
      const res = await fetch("/api/auth/reset-password-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error en la solicitud");
      setMessage(data.message || "Revisa tu correo para continuar.");
      setToken(data.token || "");
      setShowResetForm(true);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="rounded-lg shadow-xl p-8 space-y-4 bg-white border-2 border-gray-200">
      <h2 className="text-2xl font-semibold text-center mb-6 text-gray-700">Recuperar contraseña</h2>
      {!showResetForm ? (
        <form onSubmit={handleRequest} className="space-y-3">
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none border-gray-300 focus:border-primary bg-white"
            required
          />
          <button type="submit" className="w-full bg-primary text-white py-3 rounded-lg hover:bg-primary-dark transition-colors font-semibold">
            Solicitar recuperación
          </button>
          <button type="button" className="w-full text-gray-600 py-2 mt-2 hover:text-gray-800" onClick={onBack}>
            Volver
          </button>
          {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
          {message && <div className="text-green-600 text-sm mt-2">{message}</div>}
          {token && (
            <div className="text-xs mt-2 bg-gray-100 p-2 rounded">
              <strong>Token de recuperación (pruebas):</strong><br />
              <span className="break-all">{token}</span>
            </div>
          )}
        </form>
      ) : (
        <PasswordResetForm token={token} onBack={onBack} />
      )}
    </div>
  );
}

// Componente para ingresar nueva contraseña
function PasswordResetForm({ token, onBack }) {
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al restablecer contraseña");
      setMessage(data.message || "Contraseña restablecida correctamente");
      setDone(true);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      {!done ? (
        <form onSubmit={handleReset} className="space-y-3">
          <input
            type="password"
            placeholder="Nueva contraseña"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none border-gray-300 focus:border-primary bg-white"
            required
          />
          <button type="submit" className="w-full bg-primary text-white py-3 rounded-lg hover:bg-primary-dark transition-colors font-semibold">
            Restablecer contraseña
          </button>
          <button type="button" className="w-full text-gray-600 py-2 mt-2 hover:text-gray-800" onClick={onBack}>
            Volver
          </button>
          {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
          {message && <div className="text-green-600 text-sm mt-2">{message}</div>}
        </form>
      ) : (
        <div className="text-center">
          <div className="text-green-600 text-lg mb-4">{message}</div>
          <button type="button" className="w-full bg-primary text-white py-3 rounded-lg hover:bg-primary-dark transition-colors font-semibold" onClick={onBack}>
            Volver al inicio
          </button>
        </div>
      )}
    </div>
  );
}

export default Landing;

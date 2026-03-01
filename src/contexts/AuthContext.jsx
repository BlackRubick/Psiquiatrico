import { createContext, useContext, useState, useEffect } from 'react';

const API_URL = '/api/auth/login';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userType, setUserType] = useState(null);
  const [profesionalId, setProfesionalId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('biopsyche_user');
    const savedType = localStorage.getItem('biopsyche_userType');
    if (savedUser && savedType) {
      setUser(JSON.parse(savedUser));
      setUserType(savedType);
    }
    setLoading(false);
  }, []);

  // Guardar pacienteId en localStorage si el usuario es paciente
  useEffect(() => {
    const savePacienteId = async () => {
      if (!user || String(userType).toLowerCase() !== 'paciente') return;
      const token = localStorage.getItem('biopsyche_token');
      try {
        const res = await fetch(`/api/pacientes/usuario/${user.id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          localStorage.setItem('biopsyche_paciente_id', data.id);
        }
      } catch (err) {
        // No guardar nada si falla
      }
    };
    savePacienteId();
  }, [user, userType]);

  // Cargar profesional si es healthcare (sin crear automáticamente)
  useEffect(() => {
    const loadProfesionalIfExists = async () => {
      if (!user || String(userType).toLowerCase() !== 'healthcare') return;
      const token = localStorage.getItem('biopsyche_token');
      try {
        const res = await fetch(`/api/profesionales/usuario/${user.id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setProfesionalId(data.id);
        } else {
          setProfesionalId(null);
        }
      } catch (err) {
        setProfesionalId(null);
      }
    };
    loadProfesionalIfExists();
  }, [user, userType]);


  const login = async (credentials, _type) => {
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: credentials.usernameOrEmail,
          password: credentials.password
        })
      });
      let data = null;
      try {
        data = await res.json();
      } catch (jsonErr) {
        return { success: false, error: 'Respuesta inválida del servidor (no es JSON)' };
      }
      if (!res.ok) {
        // Intentar login por username si el email falla
        const res2 = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: '',
            username: credentials.usernameOrEmail,
            password: credentials.password
          })
        });
        let data2 = null;
        try {
          data2 = await res2.json();
        } catch (jsonErr2) {
          return { success: false, error: 'Respuesta inválida del servidor (no es JSON)' };
        }
        if (!res2.ok) throw new Error(data2.error || 'Error de autenticación');
        setUser(data2.user);
        let tipo2 = data2.user.tipo_usuario;
        if (String(tipo2).toLowerCase() === 'paciente') tipo2 = 'patient';
        setUserType(tipo2);
        localStorage.setItem('biopsyche_user', JSON.stringify(data2.user));
        localStorage.setItem('biopsyche_userType', tipo2);
        localStorage.setItem('biopsyche_token', data2.token);
        return { success: true };
      }
      setUser(data.user);
      let tipo = data.user.tipo_usuario;
      if (String(tipo).toLowerCase() === 'paciente') tipo = 'patient';
      setUserType(tipo);
      localStorage.setItem('biopsyche_user', JSON.stringify(data.user));
      localStorage.setItem('biopsyche_userType', tipo);
      localStorage.setItem('biopsyche_token', data.token);
      // Intentar guardar paciente_id si es paciente
      if (String(tipo).toLowerCase() === 'patient' || String(tipo).toLowerCase() === 'paciente') {
        try {
          const token = data.token;
          const user = data.user;
          if (user && user.id && token) {
            const res = await fetch(`/api/pacientes/usuario/${user.id}`, {
              headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
              const paciente = await res.json();
              localStorage.setItem('biopsyche_paciente_id', paciente.id);
            }
          }
        } catch (err) {
          // No hacer nada si falla
        }
      }
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const logout = () => {
    setUser(null);
    setUserType(null);
    setProfesionalId(null);
    localStorage.removeItem('biopsyche_user');
    localStorage.removeItem('biopsyche_userType');
    localStorage.removeItem('biopsyche_token');
    localStorage.removeItem('biopsyche_paciente_id');
  };

  const register = (userData, type) => {
    setUser(userData);
    setUserType(type);
    localStorage.setItem('biopsyche_user', JSON.stringify(userData));
    localStorage.setItem('biopsyche_userType', type);
    // Crear registro de paciente si es tipo paciente
    if (String(type).toLowerCase() === 'patient' || String(type).toLowerCase() === 'paciente') {
      const token = localStorage.getItem('biopsyche_token');
      const user = userData;
      if (user && user.id && token) {
        fetch('/api/pacientes', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ usuario_id: user.id })
        })
        .then(res => res.ok ? res.json() : null)
        .then(data => {
          if (data && data.id) {
            localStorage.setItem('biopsyche_paciente_id', data.id);
          }
        });
      }
    }
  };

  return (
    <AuthContext.Provider value={{ user, userType, profesionalId, login, logout, register, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

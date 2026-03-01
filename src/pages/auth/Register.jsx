import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Logo from '../../components/common/Logo';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [userType, setUserType] = useState('patient');
  const [formData, setFormData] = useState({
    nombreCompleto: '',
    edad: '',
    email: '',
    telefono: '',
    username: '',
    password: '',
    cedulaProfesional: '',
    cargoTrabajo: '',
    nombreTutor: '',
    celTutor: '',
    psicologoTratante: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    register(formData, userType);
    if (userType === 'patient') {
      navigate('/patient/dashboard');
    } else {
      navigate('/healthcare/dashboard');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-600 via-gray-700 to-gray-800 p-4">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-6">
          <Logo className="w-20 h-20 mx-auto mb-3" />
          <h1 className="text-4xl font-bold text-white mb-2">
            BIO<span className="text-primary">PSYCHE</span>
          </h1>
        </div>

        <div className="bg-white rounded-lg shadow-xl p-8">
          <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">
            Registro
          </h2>

          <div className="flex gap-4 mb-6">
            <button
              type="button"
              onClick={() => setUserType('healthcare')}
              className={`flex-1 py-3 rounded-lg font-semibold transition-colors ${
                userType === 'healthcare'
                  ? 'bg-primary text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Personal de salud
            </button>
            <button
              type="button"
              onClick={() => setUserType('patient')}
              className={`flex-1 py-3 rounded-lg font-semibold transition-colors ${
                userType === 'patient'
                  ? 'bg-primary text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Paciente
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                name="nombreCompleto"
                placeholder="Nombre completo"
                value={formData.nombreCompleto}
                onChange={handleChange}
                className="col-span-2 px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                required
              />
              
              <input
                type="number"
                name="edad"
                placeholder="Edad"
                value={formData.edad}
                onChange={handleChange}
                className="px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                required
              />

              {userType === 'healthcare' && (
                <input
                  type="text"
                  name="cedulaProfesional"
                  placeholder="Cédula profesional"
                  value={formData.cedulaProfesional}
                  onChange={handleChange}
                  className="px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                  required
                />
              )}

              {userType === 'patient' && (
                <input
                  type="text"
                  name="direccion"
                  placeholder="Dirección"
                  value={formData.direccion}
                  onChange={handleChange}
                  className="px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                />
              )}

              <input
                type="tel"
                name="telefono"
                placeholder="Número telefónico"
                value={formData.telefono}
                onChange={handleChange}
                className="px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                required
              />

              {userType === 'healthcare' && (
                <input
                  type="text"
                  name="cargoTrabajo"
                  placeholder="Cargo de trabajo"
                  value={formData.cargoTrabajo}
                  onChange={handleChange}
                  className="px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                  required
                />
              )}

              {userType === 'patient' && (
                <>
                  <input
                    type="text"
                    name="nombreTutor"
                    placeholder="Nombre de tutor"
                    value={formData.nombreTutor}
                    onChange={handleChange}
                    className="px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                  />
                  <input
                    type="tel"
                    name="celTutor"
                    placeholder="Cel. tutor"
                    value={formData.celTutor}
                    onChange={handleChange}
                    className="px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                  />
                  <input
                    type="text"
                    name="psicologoTratante"
                    placeholder="Psicólogo tratante"
                    value={formData.psicologoTratante}
                    onChange={handleChange}
                    className="px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                  />
                </>
              )}

              <input
                type="email"
                name="email"
                placeholder="Correo electrónico"
                value={formData.email}
                onChange={handleChange}
                className="col-span-2 px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                required
              />

              <input
                type="text"
                name="username"
                placeholder="Nombre de usuario"
                value={formData.username}
                onChange={handleChange}
                className="px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                required
              />

              <input
                type="password"
                name="password"
                placeholder="Contraseña"
                value={formData.password}
                onChange={handleChange}
                className="px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-primary text-white py-3 rounded-lg hover:bg-primary-dark transition-colors font-semibold mt-6"
            >
              Registrarse
            </button>
          </form>

          <button
            onClick={() => navigate('/')}
            className="w-full text-gray-600 py-2 mt-4 hover:text-gray-800"
          >
            Volver a inicio
          </button>
        </div>
      </div>
    </div>
  );
};

export default Register;

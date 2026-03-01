import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Pencil, Trash, UserPlus, X } from 'lucide-react';
import Logo from '../../components/common/Logo';
import Swal from 'sweetalert2';
import React from 'react';
const PatientList = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [createData, setCreateData] = useState({ name: '', email: '', password: '', birthdate: '', phone: '' });
  const [editData, setEditData] = useState({});
  const [patients, setPatients] = useState([]);
  const token = localStorage.getItem('biopsyche_token');

  // Obtener pacientes al montar
  React.useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await fetch('/api/pacientes', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!res.ok) throw new Error('Error al obtener pacientes');
        const data = await res.json();
        // Mapear datos para la tabla
        setPatients(data.map(p => ({
          id: p.id,
          usuarioId: p.usuario_id,
          name: p.Usuario?.nombreCompleto || '',
          age: p.Usuario?.edad || 0,
          email: p.Usuario?.email || '',
          phone: p.Usuario?.telefono || '',
          status: p.Usuario?.estado || 'activo',
          lastSession: p.Usuario?.fecha_ultima_sesion || '',
          birthdate: p.Usuario?.fecha_nacimiento || '',
          activitiesCompleted: p.actividadesCompletadas || 0,
          activitiesTotal: p.actividadesTotales || 0,
        })));
      } catch (err) {
        Swal.fire('Error', err.message, 'error');
      }
    };
    fetchPatients();
  }, [token]);

  const filteredPatients = patients.filter((patient) =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateChange = (e) => {
    const { name, value } = e.target;
    setCreateData(prev => ({ ...prev, [name]: value }));
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({ ...prev, [name]: value }));
  };

  const calculateAge = (birthdate) => {
    if (!birthdate) return 0;
    const today = new Date();
    const birth = new Date(birthdate);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const handleCreateSave = async (e) => {
    e.preventDefault();
    try {
      // Crear usuario primero
      const usuarioRes = await fetch('/api/usuarios', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          username: createData.email.split('@')[0],
          email: createData.email,
          password: createData.password,
          nombreCompleto: createData.name,
          edad: calculateAge(createData.birthdate),
          telefono: createData.phone,
          tipo_usuario: 'paciente',
          estado: 'activo',
          fecha_nacimiento: createData.birthdate
        })
      });
      if (!usuarioRes.ok) throw new Error('Error al crear usuario');
      const usuario = await usuarioRes.json();
      // Crear paciente con usuario_id
      const pacienteRes = await fetch('/api/pacientes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ usuario_id: usuario.id })
      });
      if (!pacienteRes.ok) throw new Error('Error al crear paciente');
      // Refrescar lista
      const res = await fetch('/api/pacientes', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setPatients(data.map(p => ({
        id: p.id,
        usuarioId: p.usuario_id,
        name: p.Usuario?.nombreCompleto || '',
        age: p.Usuario?.edad || 0,
        email: p.Usuario?.email || '',
        phone: p.Usuario?.telefono || '',
        status: p.Usuario?.estado || '',
        lastSession: p.Usuario?.fecha_ultima_sesion || '',
        birthdate: p.Usuario?.fecha_nacimiento || '',
        activitiesCompleted: p.actividadesCompletadas || 0,
        activitiesTotal: p.actividadesTotales || 0,
      })));
      setShowCreate(false);
      setCreateData({ name: '', email: '', password: '', birthdate: '', phone: '' });
      Swal.fire('Creado', 'El paciente ha sido creado.', 'success');
    } catch (err) {
      Swal.fire('Error', err.message, 'error');
    }
  };

  const handleEditPatient = (patient) => {
    setEditData({ ...patient });
    setShowEdit(true);
  };

  const handleEditSave = async (e) => {
    e.preventDefault();
    try {
      // Editar usuario
      const res = await fetch(`/api/usuarios/${editData.usuarioId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          nombreCompleto: editData.name,
          edad: calculateAge(editData.birthdate),
          telefono: editData.phone,
          estado: String(editData.status || 'activo').toLowerCase() === 'inactivo' ? 'inactivo' : 'activo',
          email: editData.email,
          fecha_nacimiento: editData.birthdate,
          password: editData.password
        })
      });
      if (!res.ok) throw new Error('Error al actualizar usuario');
      // Refrescar lista
      const updated = await fetch('/api/pacientes', { headers: { 'Authorization': `Bearer ${token}` } });
      const data = await updated.json();
      setPatients(data.map(p => ({
        id: p.id,
        usuarioId: p.usuario_id,
        name: p.Usuario?.nombreCompleto || '',
        age: p.Usuario?.edad || 0,
        email: p.Usuario?.email || '',
        phone: p.Usuario?.telefono || '',
        status: p.Usuario?.estado || '',
        lastSession: p.Usuario?.fecha_ultima_sesion || '',
        birthdate: p.Usuario?.fecha_nacimiento || '',
        activitiesCompleted: p.actividadesCompletadas || 0,
        activitiesTotal: p.actividadesTotales || 0,
      })));
      setShowEdit(false);
      Swal.fire('Guardado', 'Los datos del paciente han sido actualizados.', 'success');
    } catch (err) {
      Swal.fire('Error', err.message, 'error');
    }
  };

  const handleDeletePatient = async (id) => {
    const result = await Swal.fire({
      title: '¿Eliminar paciente?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
    });
    if (result.isConfirmed) {
      try {
        // Eliminar usuario y paciente
        await fetch(`/api/pacientes/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        // Refrescar lista
        const updated = await fetch('/api/pacientes', { headers: { 'Authorization': `Bearer ${token}` } });
        const data = await updated.json();
        setPatients(data.map(p => ({
          id: p.id,
          usuarioId: p.usuario_id,
          name: p.Usuario?.nombreCompleto || '',
          age: p.Usuario?.edad || 0,
          email: p.Usuario?.email || '',
          phone: p.Usuario?.telefono || '',
          status: p.Usuario?.estado || '',
          lastSession: p.Usuario?.fecha_ultima_sesion || '',
          birthdate: p.Usuario?.fecha_nacimiento || '',
          activitiesCompleted: p.actividadesCompletadas || 0,
          activitiesTotal: p.actividadesTotales || 0,
        })));
        Swal.fire('Eliminado', 'El paciente ha sido eliminado.', 'success');
      } catch (err) {
        Swal.fire('Error', err.message, 'error');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-600 via-gray-700 to-gray-800 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate('/healthcare/dashboard')}
            className="text-white hover:text-primary transition-colors"
          >
            <ArrowLeft size={32} />
          </button>
          <Logo className="w-12 h-12" />
          <h1 className="text-white text-3xl font-bold">LISTA DE PACIENTES</h1>
          <button onClick={() => setShowCreate(true)} className="ml-auto bg-primary hover:bg-blue-700 text-white px-4 py-2 rounded font-semibold shadow flex items-center gap-2">
            <UserPlus size={20} /> Crear paciente
          </button>
        </div>
        <div className="bg-white rounded-lg shadow-xl p-6">
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar paciente por nombre o email..."
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-100 border-b-2 border-gray-300">
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Nombre</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Edad</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Fecha de nacimiento</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Contacto</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Estado</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Progreso</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Última Sesión</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredPatients.map((patient) => (
                  <tr key={patient.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <div className="font-semibold text-gray-800">{patient.name}</div>
                    </td>
                    <td className="px-4 py-4 text-gray-700">{patient.age}</td>
                    <td className="px-4 py-4 text-gray-700">{patient.birthdate ? new Date(patient.birthdate).toLocaleDateString() : ''}</td>
                    <td className="px-4 py-4">
                      <div className="flex flex-col gap-1">
                        <span className="text-gray-700">{patient.email}</span>
                        <span className="text-gray-700">{patient.phone}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-gray-700">{patient.status === 'inactivo' ? 'Inactivo' : 'Activo'}</td>
                    
                    <td className="px-4 py-4 text-gray-700">{patient.activitiesCompleted} / {patient.activitiesTotal}</td>
                    <td className="px-4 py-4 text-gray-700">
                      {patient.lastSession
                        ? new Date(patient.lastSession).toLocaleString('es-ES', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })
                        : ''}
                    </td>
                    <td className="px-4 py-4 text-center">
                      <button onClick={() => handleEditPatient(patient)} className="text-primary hover:text-blue-600 mr-2">
                        <Pencil size={20} />
                      </button>
                      <button onClick={() => handleDeletePatient(patient.id)} className="text-red-500 hover:text-red-700">
                        <Trash size={20} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {showCreate && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md relative animate-fade-in">
              <button onClick={() => setShowCreate(false)} className="absolute top-4 right-4 text-gray-500 hover:text-red-500">
                <X size={28} />
              </button>
              <div className="flex flex-col items-center mb-6">
                <UserPlus size={40} className="text-primary mb-2" />
                <h2 className="text-3xl font-bold text-primary mb-2">Nuevo Paciente</h2>
                <p className="text-gray-600 text-center">Completa los datos para registrar un paciente en el sistema.</p>
              </div>
              <form onSubmit={handleCreateSave} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Nombre completo</label>
                  <input name="name" type="text" value={createData.name} onChange={handleCreateChange} placeholder="Ej. Juan Pérez García" className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary" required />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Correo electrónico</label>
                  <input name="email" type="email" value={createData.email} onChange={handleCreateChange} placeholder="Ej. juan@email.com" className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary" required />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Teléfono</label>
                  <input name="phone" type="text" value={createData.phone} onChange={handleCreateChange} placeholder="Ej. +52 123 456 7890" className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary" required />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Contraseña</label>
                  <input name="password" type="password" value={createData.password} onChange={handleCreateChange} placeholder="Contraseña segura" className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary" required />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Fecha de nacimiento</label>
                  <input name="birthdate" type="date" value={createData.birthdate} onChange={handleCreateChange} className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary" required />
                </div>
                <button type="submit" className="w-full bg-primary text-white py-3 rounded-lg hover:bg-primary-dark transition-colors font-semibold text-lg shadow">
                  Crear Paciente
                </button>
              </form>
            </div>
          </div>
        )}
        {showEdit && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md relative animate-fade-in">
              <button onClick={() => setShowEdit(false)} className="absolute top-4 right-4 text-gray-500 hover:text-red-500">
                <X size={28} />
              </button>
              <div className="flex flex-col items-center mb-6">
                <Pencil size={40} className="text-primary mb-2" />
                <h2 className="text-3xl font-bold text-primary mb-2">Editar Paciente</h2>
                <p className="text-gray-600 text-center">Modifica los datos del paciente y la contraseña.</p>
              </div>
              <form onSubmit={handleEditSave} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Nombre completo</label>
                  <input name="name" type="text" value={editData.name || ''} onChange={handleEditChange} className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary" required />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Correo electrónico</label>
                  <input name="email" type="email" value={editData.email || ''} onChange={handleEditChange} className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary" required />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Teléfono</label>
                  <input name="phone" type="text" value={editData.phone || ''} onChange={handleEditChange} className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary" required />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Contraseña</label>
                  <input name="password" type="password" value={editData.password || ''} onChange={handleEditChange} className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary" required />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Fecha de nacimiento</label>
                  <input name="birthdate" type="date" value={editData.birthdate || ''} onChange={handleEditChange} className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary" required />
                </div>
                <button type="submit" className="w-full bg-primary text-white py-3 rounded-lg hover:bg-primary-dark transition-colors font-semibold text-lg shadow">
                  Guardar Cambios
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientList;

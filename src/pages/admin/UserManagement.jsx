import React, { useState } from "react";
import Logo from '../../components/common/Logo';
import { Pencil, Trash, X, UserPlus } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import Swal from 'sweetalert2';
import { useEffect } from "react";

const users = [
  { id: 1, name: 'Juan Pérez García', role: 'patient', email: 'juan.perez@email.com', phone: '+52 123 456 7890', status: 'active', password: '123456' },
  { id: 2, name: 'María González López', role: 'patient', email: 'maria.gonzalez@email.com', phone: '+52 123 456 7891', status: 'active', password: '123456' },
  { id: 3, name: 'Dr. Carlos Rodríguez', role: 'healthcare', email: 'carlos.dr@email.com', phone: '+52 123 456 7892', status: 'active', password: '123456' },
  { id: 4, name: 'Dr. Ana Martínez', role: 'healthcare', email: 'ana.dr@email.com', phone: '+52 123 456 7893', status: 'inactive', password: '123456' },
];

export default function UserManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [userList, setUserList] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [editData, setEditData] = useState({});
  const [showCreate, setShowCreate] = useState(false);
  const [createData, setCreateData] = useState({ name: '', role: 'patient', email: '', phone: '', status: 'active', password: '' });
  const { logout } = useAuth();

  // Obtener token de localStorage
  const token = localStorage.getItem('biopsyche_token');

  // Cargar usuarios reales al montar el componente
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch('/api/usuarios', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!res.ok) throw new Error('Error al obtener usuarios');
        const data = await res.json();
        console.log('USUARIOS API:', data);
        // Mapear los datos a la estructura esperada por la tabla
        setUserList(data.map(u => ({
          id: u.id,
          name: u.nombreCompleto,
          role: u.tipo_usuario,
          email: u.email,
          phone: u.telefono,
          status: u.estado,
          password: '••••••••' // Nunca mostrar la real
        })));
      } catch (err) {
        Swal.fire('Error', err.message, 'error');
      }
    };
    fetchUsers();
  }, [token]);

  const filteredUsers = userList.filter(
    user => user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: '¿Eliminar usuario?',
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
        const res = await fetch(`/api/usuarios/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Error al eliminar usuario');
        // Refrescar lista
        const updated = await fetch('/api/usuarios', { headers: { 'Authorization': `Bearer ${token}` } });
        const data = await updated.json();
        setUserList(data.map(u => ({
          id: u.id,
          name: u.nombreCompleto,
          role: u.tipo_usuario,
          email: u.email,
          phone: u.telefono,
          status: u.estado,
          password: '••••••••'
        })));
        Swal.fire('Eliminado', 'El usuario ha sido eliminado.', 'success');
      } catch (err) {
        Swal.fire('Error', err.message, 'error');
      }
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setEditData({ ...user });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({ ...prev, [name]: value }));
  };

  const handleEditSave = async (e) => {
    e.preventDefault();
    const result = await Swal.fire({
      title: '¿Guardar cambios?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Guardar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
    });
    if (result.isConfirmed) {
      try {
        const res = await fetch(`/api/usuarios/${editData.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            nombreCompleto: editData.name,
            telefono: editData.phone,
            tipo_usuario: editData.role,
            estado: editData.status
          })
        });
        if (!res.ok) throw new Error('Error al actualizar usuario');
        // Refrescar lista
        const updated = await fetch('/api/usuarios', { headers: { 'Authorization': `Bearer ${token}` } });
        const data = await updated.json();
        setUserList(data.map(u => ({
          id: u.id,
          name: u.nombreCompleto,
          role: u.tipo_usuario,
          email: u.email,
          phone: u.telefono,
          status: u.estado,
          password: '••••••••'
        })));
        setEditingUser(null);
        Swal.fire('Guardado', 'Los datos del usuario han sido actualizados.', 'success');
      } catch (err) {
        Swal.fire('Error', err.message, 'error');
      }
    }
  };

  const handleCreateChange = (e) => {
    const { name, value } = e.target;
    setCreateData(prev => ({ ...prev, [name]: value }));
  };

  const handleCreateSave = async (e) => {
    e.preventDefault();
    try {
      // Backend espera: username, email, password, nombreCompleto, edad, telefono, tipo_usuario
      const res = await fetch('/api/usuarios', {
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
          edad: 0,
          telefono: createData.phone,
          tipo_usuario: createData.role
        })
      });
      if (!res.ok) throw new Error('Error al crear usuario');
      // Refrescar lista
      const updated = await fetch('/api/usuarios', { headers: { 'Authorization': `Bearer ${token}` } });
      const data = await updated.json();
      setUserList(data.map(u => ({
        id: u.id,
        name: u.nombreCompleto,
        role: u.tipo_usuario,
        email: u.email,
        phone: u.telefono,
        status: u.estado,
        password: '••••••••'
      })));
      setShowCreate(false);
      setCreateData({ name: '', role: 'patient', email: '', phone: '', status: 'active', password: '' });
      Swal.fire('Creado', 'El usuario ha sido creado.', 'success');
    } catch (err) {
      Swal.fire('Error', err.message, 'error');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-600 via-gray-700 to-gray-800 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Logo className="w-12 h-12" />
          <h1 className="text-white text-3xl font-bold">GESTIÓN DE USUARIOS</h1>
          <button onClick={logout} className="ml-auto bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded font-semibold shadow">
            Cerrar sesión
          </button>
          <button onClick={() => setShowCreate(true)} className="bg-primary hover:bg-blue-700 text-white px-4 py-2 rounded font-semibold shadow flex items-center gap-2 ml-4">
            <UserPlus size={20} /> Crear usuario
          </button>
        </div>
        <div className="bg-white rounded-lg shadow-xl p-6">
          <div className="mb-6">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Buscar usuario por nombre o email..."
                className="w-full pl-4 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary"
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            {filteredUsers.length === 0 ? (
              <div className="text-center text-gray-500 py-8">No hay usuarios para mostrar.</div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-100 border-b-2 border-gray-300">
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Nombre</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Rol</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Correo</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Teléfono</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Estado</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Contraseña</th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map(user => (
                    <tr key={user.id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="px-4 py-4">
                        <div className="font-semibold text-gray-800">{user.name}</div>
                      </td>
                      <td className="px-4 py-4 text-gray-700">
                        {user.role === 'admin' ? 'Administrador' : user.role === 'healthcare' ? 'Doctor' : 'Paciente'}
                      </td>
                      <td className="px-4 py-4 text-gray-700">{user.email}</td>
                      <td className="px-4 py-4 text-gray-700">{user.phone}</td>
                      <td className="px-4 py-4 text-gray-700">{user.status === 'activo' ? 'Activo' : 'Inactivo'}</td>
                      <td className="px-4 py-4 text-gray-700">{user.password}</td>
                      <td className="px-4 py-4 text-center">
                        <button onClick={() => handleEdit(user)} className="text-primary hover:text-blue-600 mr-2">
                          <Pencil size={20} />
                        </button>
                        <button onClick={() => handleDelete(user.id)} className="text-red-500 hover:text-red-700">
                          <Trash size={20} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
        {editingUser && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md relative">
              <button onClick={() => setEditingUser(null)} className="absolute top-4 right-4 text-gray-500 hover:text-red-500">
                <X size={24} />
              </button>
              <h2 className="text-2xl font-bold mb-4">Editar Usuario</h2>
              <form onSubmit={handleEditSave} className="space-y-4">
                <input name="name" type="text" value={editData.name} onChange={handleEditChange} placeholder="Nombre completo" className="w-full px-4 py-2 border rounded" />
                <select name="role" value={editData.role} onChange={handleEditChange} className="w-full px-4 py-2 border rounded">
                  <option value="patient">Paciente</option>
                  <option value="healthcare">Doctor</option>
                </select>
                <input name="email" type="email" value={editData.email} onChange={handleEditChange} placeholder="Correo electrónico" className="w-full px-4 py-2 border rounded" />
                <input name="phone" type="text" value={editData.phone} onChange={handleEditChange} placeholder="Teléfono" className="w-full px-4 py-2 border rounded" />
                <select name="status" value={editData.status} onChange={handleEditChange} className="w-full px-4 py-2 border rounded">
                  <option value="active">Activo</option>
                  <option value="inactive">Inactivo</option>
                </select>
                <input name="password" type="text" value={editData.password} onChange={handleEditChange} placeholder="Contraseña" className="w-full px-4 py-2 border rounded" />
                <button type="submit" className="bg-primary text-white px-6 py-2 rounded">Guardar Cambios</button>
              </form>
            </div>
          </div>
        )}
        {showCreate && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md relative">
              <button onClick={() => setShowCreate(false)} className="absolute top-4 right-4 text-gray-500 hover:text-red-500">
                <X size={24} />
              </button>
              <h2 className="text-2xl font-bold mb-4">Crear Usuario</h2>
              <form onSubmit={handleCreateSave} className="space-y-4">
                <input name="name" type="text" value={createData.name} onChange={handleCreateChange} placeholder="Nombre completo" className="w-full px-4 py-2 border rounded" />
                <select name="role" value={createData.role} onChange={handleCreateChange} className="w-full px-4 py-2 border rounded">
                  <option value="patient">Paciente</option>
                  <option value="healthcare">Doctor</option>
                </select>
                <input name="email" type="email" value={createData.email} onChange={handleCreateChange} placeholder="Correo electrónico" className="w-full px-4 py-2 border rounded" />
                <input name="phone" type="text" value={createData.phone} onChange={handleCreateChange} placeholder="Teléfono" className="w-full px-4 py-2 border rounded" />
                <select name="status" value={createData.status} onChange={handleCreateChange} className="w-full px-4 py-2 border rounded">
                  <option value="active">Activo</option>
                  <option value="inactive">Inactivo</option>
                </select>
                <input name="password" type="text" value={createData.password} onChange={handleCreateChange} placeholder="Contraseña" className="w-full px-4 py-2 border rounded" />
                <button type="submit" className="bg-primary text-white px-6 py-2 rounded">Crear Usuario</button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

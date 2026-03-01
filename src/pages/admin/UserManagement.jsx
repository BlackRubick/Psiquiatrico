import React, { useState } from "react";
import Logo from '../../components/common/Logo';
import { Pencil, Trash, X, UserPlus } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import Swal from 'sweetalert2';

const users = [
  { id: 1, name: 'Juan Pérez García', role: 'patient', email: 'juan.perez@email.com', phone: '+52 123 456 7890', status: 'active', password: '123456' },
  { id: 2, name: 'María González López', role: 'patient', email: 'maria.gonzalez@email.com', phone: '+52 123 456 7891', status: 'active', password: '123456' },
  { id: 3, name: 'Dr. Carlos Rodríguez', role: 'healthcare', email: 'carlos.dr@email.com', phone: '+52 123 456 7892', status: 'active', password: '123456' },
  { id: 4, name: 'Dr. Ana Martínez', role: 'healthcare', email: 'ana.dr@email.com', phone: '+52 123 456 7893', status: 'inactive', password: '123456' },
];

export default function UserManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [userList, setUserList] = useState(users);
  const [editingUser, setEditingUser] = useState(null);
  const [editData, setEditData] = useState({});
  const [showCreate, setShowCreate] = useState(false);
  const [createData, setCreateData] = useState({ name: '', role: 'patient', email: '', phone: '', status: 'active', password: '' });
  const { logout } = useAuth();

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
      setUserList(userList.filter(u => u.id !== id));
      Swal.fire('Eliminado', 'El usuario ha sido eliminado.', 'success');
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
      setUserList(userList.map(u => u.id === editData.id ? { ...editData } : u));
      setEditingUser(null);
      Swal.fire('Guardado', 'Los datos del usuario han sido actualizados.', 'success');
    }
  };

  const handleCreateChange = (e) => {
    const { name, value } = e.target;
    setCreateData(prev => ({ ...prev, [name]: value }));
  };

  const handleCreateSave = (e) => {
    e.preventDefault();
    setUserList([
      ...userList,
      { ...createData, id: userList.length + 1 }
    ]);
    setShowCreate(false);
    setCreateData({ name: '', role: 'patient', email: '', phone: '', status: 'active', password: '' });
    Swal.fire('Creado', 'El usuario ha sido creado.', 'success');
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
                    <td className="px-4 py-4 text-gray-700">{user.role === 'patient' ? 'Paciente' : 'Doctor'}</td>
                    <td className="px-4 py-4 text-gray-700">{user.email}</td>
                    <td className="px-4 py-4 text-gray-700">{user.phone}</td>
                    <td className="px-4 py-4 text-gray-700">{user.status === 'active' ? 'Activo' : 'Inactivo'}</td>
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

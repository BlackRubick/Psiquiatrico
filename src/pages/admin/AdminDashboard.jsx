import React from "react";
import { Link } from "react-router-dom";

export default function AdminDashboard() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <h1 className="text-3xl font-bold mb-6">Panel de Administración</h1>
      <div className="flex flex-col gap-4 w-full max-w-md">
        <Link to="/admin/users" className="btn-primary">Gestión de Usuarios</Link>
        <Link to="/admin/maintenance" className="btn-primary">Mantenimiento del Sistema</Link>
        <Link to="/admin/updates" className="btn-primary">Actualizaciones</Link>
      </div>
    </div>
  );
}

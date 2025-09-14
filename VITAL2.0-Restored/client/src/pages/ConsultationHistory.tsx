import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Plus } from "lucide-react";

interface ConsultationRecord {
  id: string;
  code: string;
  ageGender: string;
  specialty: string;
  date: string;
  status: 'urgent' | 'completed' | 'in-progress';
}

export default function ConsultationHistory() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [consultations, setConsultations] = useState<ConsultationRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSpecialty, setFilterSpecialty] = useState('');
  const [filterDate, setFilterDate] = useState('');

  useEffect(() => {
    // Load real consultations from database
    const loadConsultations = async () => {
      try {
        const response = await fetch('/api/consultations');
        if (response.ok) {
          const data = await response.json();
          setConsultations(data.map((c: any) => ({
            id: c.id,
            code: c.code,
            ageGender: `${c.age} / ${c.gender}`,
            specialty: c.specialty,
            date: new Date(c.createdAt).toLocaleDateString('es-ES'),
            status: c.status
          })));
        }
      } catch (error) {
        console.error('Error loading consultations:', error);
        setConsultations([]);
      }
    };
    
    loadConsultations();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'urgent':
        return 'px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400';
      case 'completed':
        return 'px-2 py-1 text-xs font-medium rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400';
      case 'in-progress':
        return 'px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400';
      default:
        return 'px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-600 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'urgent':
        return 'Urgente';
      case 'completed':
        return 'Completada';
      case 'in-progress':
        return 'En Progreso';
      default:
        return status;
    }
  };

  const getActionText = (status: string) => {
    return status === 'in-progress' ? 'Continuar' : 'Ver';
  };

  const filteredConsultations = consultations.filter(consultation => {
    const matchesSearch = consultation.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         consultation.specialty.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialty = !filterSpecialty || consultation.specialty === filterSpecialty;
    const matchesDate = !filterDate || consultation.date.includes(filterDate);
    return matchesSearch && matchesSpecialty && matchesDate;
  });

  const specialties = ['Cardiología', 'Neurología', 'Pediatría', 'Endocrinología'];

  return (
    <div className="flex-1 p-8 overflow-y-auto bg-gray-50 dark:bg-gray-900">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Historial de Consultas
        </h1>
        <button
          onClick={() => setLocation('/nuevo-paciente')}
          className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2 px-4 rounded-lg transition-colors flex items-center gap-2"
        >
          <Plus size={20} />
          Nuevo Examen
        </button>
      </div>

      {/* Filters */}
      <div className="mb-6 bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 flex flex-wrap items-center gap-4">
        <input
          type="text"
          placeholder="Buscar por código o motivo..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-grow px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900 dark:text-gray-100"
        />
        <select
          value={filterSpecialty}
          onChange={(e) => setFilterSpecialty(e.target.value)}
          className="px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900 dark:text-gray-100"
        >
          <option value="">Todas las especialidades</option>
          {specialties.map(specialty => (
            <option key={specialty} value={specialty}>{specialty}</option>
          ))}
        </select>
        <input
          type="date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
          className="px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900 dark:text-gray-100"
        />
        <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
          Filtrar
        </button>
      </div>

      {/* Consultations Table */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b-2 border-gray-200 dark:border-gray-700">
                <th className="p-4 text-sm font-semibold text-gray-600 dark:text-gray-400">
                  Cód. Consulta
                </th>
                <th className="p-4 text-sm font-semibold text-gray-600 dark:text-gray-400">
                  Edad/Sexo
                </th>
                <th className="p-4 text-sm font-semibold text-gray-600 dark:text-gray-400">
                  Especialidad
                </th>
                <th className="p-4 text-sm font-semibold text-gray-600 dark:text-gray-400">
                  Fecha
                </th>
                <th className="p-4 text-sm font-semibold text-gray-600 dark:text-gray-400">
                  Estado
                </th>
                <th className="p-4 text-sm font-semibold text-gray-600 dark:text-gray-400 text-right">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredConsultations.map((consultation) => (
                <tr
                  key={consultation.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                >
                  <td className="p-4 font-mono text-gray-900 dark:text-gray-100">
                    {consultation.code}
                  </td>
                  <td className="p-4 text-gray-900 dark:text-gray-100">
                    {consultation.ageGender}
                  </td>
                  <td className="p-4 text-gray-900 dark:text-gray-100">
                    {consultation.specialty}
                  </td>
                  <td className="p-4 text-gray-900 dark:text-gray-100">
                    {consultation.date}
                  </td>
                  <td className="p-4">
                    <span className={getStatusBadge(consultation.status)}>
                      {getStatusText(consultation.status)}
                    </span>
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <button
                      onClick={() => setLocation(`/consultation-form?code=${consultation.code}`)}
                      className="font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
                    >
                      {getActionText(consultation.status)}
                    </button>
                    <button className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">
                      Exportar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="flex justify-between items-center mt-6">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Mostrando 1-{filteredConsultations.length} de {consultations.length} consultas
          </p>
          <div className="flex gap-2">
            <button className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
              Anterior
            </button>
            <button className="px-3 py-1 bg-emerald-500 text-white rounded">
              1
            </button>
            <button className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
              Siguiente
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
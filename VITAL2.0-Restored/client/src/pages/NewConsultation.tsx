import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";

export default function NewConsultation() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [selectedGender, setSelectedGender] = useState<'M' | 'F' | null>(null);
  const [age, setAge] = useState('');
  const [specialty, setSpecialty] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGender || !age || !specialty) {
      alert('Por favor complete los campos obligatorios');
      return;
    }
    
    // Navigate to consultation form with data
    const params = new URLSearchParams({
      gender: selectedGender,
      age,
      specialty
    });
    setLocation(`/consultation-form?${params.toString()}`);
  };

  const specialties = [
    'Cardiología',
    'Neurología', 
    'Pediatría',
    'Endocrinología',
    'Medicina General',
    'Dermatología',
    'Ginecología',
    'Traumatología'
  ];

  return (
    <div className="flex-1 p-8 overflow-y-auto flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-2xl">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Nueva Consulta Médica Anonimizada
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Vital protege la privacidad - Solo datos clínicos esenciales.
          </p>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Se generará automáticamente un código único (ej. P009) para esta consulta.
          </p>
        </div>
        
        <div className="mt-8 bg-white dark:bg-gray-800 p-8 rounded-xl border border-gray-200 dark:border-gray-700">
          <form onSubmit={handleSubmit}>
            <div className="space-y-8">
              <div>
                <label className="block text-lg font-semibold mb-4 text-center text-gray-900 dark:text-gray-100">
                  Datos del Paciente
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                      Sexo *
                    </label>
                    <div className="flex gap-4">
                      <button
                        type="button"
                        onClick={() => setSelectedGender('M')}
                        className={`flex-1 text-center p-4 border-2 rounded-lg transition-colors ${
                          selectedGender === 'M'
                            ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                            : 'border-gray-200 dark:border-gray-600 hover:border-emerald-500'
                        }`}
                      >
                        <span className="text-4xl">♂</span>
                        <span className="block mt-2 font-semibold text-gray-900 dark:text-gray-100">
                          Masculino
                        </span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedGender('F')}
                        className={`flex-1 text-center p-4 border-2 rounded-lg transition-colors ${
                          selectedGender === 'F'
                            ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                            : 'border-gray-200 dark:border-gray-600 hover:border-emerald-500'
                        }`}
                      >
                        <span className="text-4xl">♀</span>
                        <span className="block mt-2 font-semibold text-gray-900 dark:text-gray-100">
                          Femenino
                        </span>
                      </button>
                    </div>
                  </div>
                  <div>
                    <label htmlFor="age" className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                      Edad (años) *
                    </label>
                    <input
                      type="number"
                      id="age"
                      required
                      min="0"
                      max="120"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      className="w-full text-lg px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900 dark:text-gray-100"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="specialty" className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                  Seleccionar Especialidad *
                </label>
                <select
                  id="specialty"
                  required
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value)}
                  className="w-full text-lg px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900 dark:text-gray-100"
                >
                  <option value="">Seleccionar especialidad...</option>
                  {specialties.map((spec) => (
                    <option key={spec} value={spec}>
                      {spec}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mt-10 text-right">
              <button
                type="submit"
                className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-8 rounded-lg transition-colors text-lg"
              >
                Iniciar Formulario
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
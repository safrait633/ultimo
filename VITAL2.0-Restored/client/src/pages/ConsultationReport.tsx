import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Download, ArrowLeft, Printer } from "lucide-react";

export default function ConsultationReport() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  // Mock consultation data for report
  const consultationData = {
    code: 'P009',
    date: '11/08/2025',
    time: '14:30',
    doctor: user?.firstName + ' ' + user?.lastName,
    licenseNumber: user?.licenseNumber,
    specialty: 'Cardiología',
    patient: {
      age: 67,
      gender: 'M'
    },
    vitalSigns: {
      bloodPressure: '150/95 mmHg',
      heartRate: '88 bpm',
      temperature: '36.5°C',
      weight: '78 kg',
      height: '175 cm'
    },
    physicalExam: {
      cardiacAuscultation: 'Ruidos cardíacos rítmicos, soplo sistólico grado II/VI en foco aórtico',
      peripheralPulses: 'Simétricos, presentes',
      respiratorySystem: 'Murmullo vesicular conservado bilateralmente'
    },
    diagnosis: 'Hipertensión Arterial Grado 1',
    treatment: `1. Enalapril 10mg vía oral cada 12 horas
2. Dieta hiposódica (< 2g sal/día)
3. Ejercicio aeróbico 30 min 3 veces por semana
4. Control de peso
5. Control en 4 semanas`,
    notes: 'Paciente refiere cefalea ocasional matutina. Se solicita monitoreo ambulatorio de presión arterial.'
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    // In a real application, this would generate and download a PDF
    alert('Función de descarga PDF en desarrollo');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 print:bg-white">
      {/* Header Controls - Hidden when printing */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 print:hidden">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <button
            onClick={() => setLocation('/consultation-form')}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
          >
            <ArrowLeft size={20} />
            Volver al Formulario
          </button>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              <Printer size={18} />
              Imprimir
            </button>
            <button
              onClick={handleDownloadPDF}
              className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              <Download size={18} />
              Descargar PDF
            </button>
          </div>
        </div>
      </div>

      {/* Report Content */}
      <div className="max-w-6xl mx-auto p-8 print:p-0">
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 print:border-0 print:rounded-none print:shadow-none">
          {/* Header */}
          <div className="p-8 border-b border-gray-200 dark:border-gray-700 print:border-gray-300">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 print:text-black">
                  VITAL
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400 print:text-gray-600">
                  Sistema Médico Profesional
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600 dark:text-gray-400 print:text-gray-600">
                  Consulta: {consultationData.code}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 print:text-gray-600">
                  Fecha: {consultationData.date} - {consultationData.time}
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 print:text-black mb-2">
                  Médico Tratante
                </h3>
                <p className="text-gray-700 dark:text-gray-300 print:text-gray-700">
                  Dr. {consultationData.doctor}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 print:text-gray-600">
                  {consultationData.specialty}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 print:text-gray-600">
                  Colegiado: {consultationData.licenseNumber}
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 print:text-black mb-2">
                  Datos del Paciente (Anonimizado)
                </h3>
                <p className="text-gray-700 dark:text-gray-300 print:text-gray-700">
                  Edad: {consultationData.patient.age} años
                </p>
                <p className="text-gray-700 dark:text-gray-300 print:text-gray-700">
                  Sexo: {consultationData.patient.gender === 'M' ? 'Masculino' : 'Femenino'}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 print:text-gray-600">
                  Código: {consultationData.code}
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-8 space-y-8">
            {/* Vital Signs */}
            <section>
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 print:text-black mb-4 border-b border-gray-200 dark:border-gray-700 print:border-gray-300 pb-2">
                Signos Vitales
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400 print:text-gray-600">
                    Presión Arterial:
                  </span>
                  <p className="text-gray-900 dark:text-gray-100 print:text-black font-medium">
                    {consultationData.vitalSigns.bloodPressure}
                  </p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400 print:text-gray-600">
                    Frecuencia Cardíaca:
                  </span>
                  <p className="text-gray-900 dark:text-gray-100 print:text-black font-medium">
                    {consultationData.vitalSigns.heartRate}
                  </p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400 print:text-gray-600">
                    Temperatura:
                  </span>
                  <p className="text-gray-900 dark:text-gray-100 print:text-black font-medium">
                    {consultationData.vitalSigns.temperature}
                  </p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400 print:text-gray-600">
                    Peso:
                  </span>
                  <p className="text-gray-900 dark:text-gray-100 print:text-black font-medium">
                    {consultationData.vitalSigns.weight}
                  </p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400 print:text-gray-600">
                    Altura:
                  </span>
                  <p className="text-gray-900 dark:text-gray-100 print:text-black font-medium">
                    {consultationData.vitalSigns.height}
                  </p>
                </div>
              </div>
            </section>

            {/* Physical Exam */}
            <section>
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 print:text-black mb-4 border-b border-gray-200 dark:border-gray-700 print:border-gray-300 pb-2">
                Examen Físico
              </h2>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 print:text-black">
                    Auscultación Cardíaca:
                  </h4>
                  <p className="text-gray-700 dark:text-gray-300 print:text-gray-700 ml-4">
                    {consultationData.physicalExam.cardiacAuscultation}
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 print:text-black">
                    Pulsos Periféricos:
                  </h4>
                  <p className="text-gray-700 dark:text-gray-300 print:text-gray-700 ml-4">
                    {consultationData.physicalExam.peripheralPulses}
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 print:text-black">
                    Sistema Respiratorio:
                  </h4>
                  <p className="text-gray-700 dark:text-gray-300 print:text-gray-700 ml-4">
                    {consultationData.physicalExam.respiratorySystem}
                  </p>
                </div>
              </div>
            </section>

            {/* Diagnosis */}
            <section>
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 print:text-black mb-4 border-b border-gray-200 dark:border-gray-700 print:border-gray-300 pb-2">
                Diagnóstico
              </h2>
              <div className="bg-yellow-50 dark:bg-yellow-900/20 print:bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-500">
                <p className="text-gray-900 dark:text-gray-100 print:text-black font-medium">
                  {consultationData.diagnosis}
                </p>
              </div>
            </section>

            {/* Treatment */}
            <section>
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 print:text-black mb-4 border-b border-gray-200 dark:border-gray-700 print:border-gray-300 pb-2">
                Plan de Tratamiento
              </h2>
              <div className="bg-emerald-50 dark:bg-emerald-900/20 print:bg-emerald-50 p-4 rounded-lg border-l-4 border-emerald-500">
                <pre className="text-gray-900 dark:text-gray-100 print:text-black whitespace-pre-wrap font-sans">
                  {consultationData.treatment}
                </pre>
              </div>
            </section>

            {/* Notes */}
            <section>
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 print:text-black mb-4 border-b border-gray-200 dark:border-gray-700 print:border-gray-300 pb-2">
                Notas Adicionales
              </h2>
              <p className="text-gray-700 dark:text-gray-300 print:text-gray-700">
                {consultationData.notes}
              </p>
            </section>
          </div>

          {/* Footer */}
          <div className="p-8 border-t border-gray-200 dark:border-gray-700 print:border-gray-300 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400 print:text-gray-600">
              Este reporte fue generado por VITAL - Sistema de Gestión Médica
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500 print:text-gray-500 mt-1">
              Documento confidencial - Uso exclusivo del personal médico autorizado
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
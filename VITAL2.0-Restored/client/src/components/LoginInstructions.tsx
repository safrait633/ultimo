import { motion } from 'framer-motion';
import { Info, UserCheck, Stethoscope } from 'lucide-react';

export default function LoginInstructions() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-blue-500/20 backdrop-blur-sm border border-blue-400/30 rounded-xl p-6 mb-6"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-blue-500/30 backdrop-blur-sm p-2 rounded-lg">
          <Info className="w-5 h-5 text-blue-300" />
        </div>
        <h3 className="text-blue-300 font-semibold">Credenciales de Prueba</h3>
      </div>
      
      <div className="space-y-3">
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4">
          <div className="flex items-center gap-3 mb-2">
            <UserCheck className="w-4 h-4 text-green-400" />
            <span className="text-white font-medium">Doctor de Prueba</span>
          </div>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-blue-200">Email:</span>
              <span className="text-white font-mono">dr.johnson@hospital.com</span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-200">Contraseña:</span>
              <span className="text-white font-mono">Password123!</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-blue-200">
          <Stethoscope className="w-4 h-4" />
          <span>Acceso completo al sistema médico VITAL</span>
        </div>
      </div>
    </motion.div>
  );
}
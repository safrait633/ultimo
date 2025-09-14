import React from 'react';

interface IconProps {
  className?: string;
  size?: number;
}

// Cardiología - Corazón con línea de ECG
export const CardiologyIcon: React.FC<IconProps> = ({ className = "", size = 24 }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    className={className}
  >
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    <path d="M3 12h3l2-4 2 8 2-4h3"/>
  </svg>
);

// Neurología - Cerebro con conexiones neuronales
export const NeurologyIcon: React.FC<IconProps> = ({ className = "", size = 24 }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    className={className}
  >
    <path d="M9 12c0 1.657-1.343 3-3 3s-3-1.343-3-3 1.343-3 3-3 3 1.343 3 3z"/>
    <path d="M21 12c0 1.657-1.343 3-3 3s-3-1.343-3-3 1.343-3 3-3 3 1.343 3 3z"/>
    <path d="M7.5 7.5c.83-.83 2.17-.83 3 0s.83 2.17 0 3-.83 2.17 0 3 2.17.83 3 0"/>
    <path d="M13.5 16.5c.83-.83 2.17-.83 3 0s.83 2.17 0 3-.83 2.17 0 3"/>
    <circle cx="12" cy="8" r="2"/>
    <circle cx="12" cy="16" r="2"/>
  </svg>
);

// Dermatología - Capas de piel
export const DermatologyIcon: React.FC<IconProps> = ({ className = "", size = 24 }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    className={className}
  >
    <path d="M12 2c-4.97 0-9 4.03-9 9 0 4.97 4.03 9 9 9s9-4.03 9-9c0-4.97-4.03-9-9-9z"/>
    <path d="M12 6c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5z"/>
    <path d="M12 9c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
  </svg>
);

// Oftalmología - Ojo con rayos de visión
export const OphthalmologyIcon: React.FC<IconProps> = ({ className = "", size = 24 }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    className={className}
  >
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z"/>
    <circle cx="12" cy="12" r="3"/>
    <path d="M12 1v6m0 10v6M4.22 4.22l4.24 4.24m7.08 7.08l4.24 4.24M1 12h6m10 0h6M4.22 19.78l4.24-4.24m7.08-7.08l4.24-4.24"/>
  </svg>
);

// Pediatría - Figura de bebé
export const PediatricsIcon: React.FC<IconProps> = ({ className = "", size = 24 }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="12" cy="8" r="3"/>
    <path d="M8 14v7"/>
    <path d="M16 14v7"/>
    <path d="M8 14h8l-1-4H9z"/>
    <path d="M9 18h6"/>
    <circle cx="9" cy="5" r="1"/>
    <circle cx="15" cy="5" r="1"/>
  </svg>
);

// Cirugía General - Bisturí cruzado con suturas
export const SurgeryIcon: React.FC<IconProps> = ({ className = "", size = 24 }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    className={className}
  >
    <path d="M3 12h18m-9-9v18"/>
    <path d="M8 8l8 8m0-8l-8 8"/>
    <circle cx="12" cy="12" r="3"/>
    <path d="M12 3l-2 2h4z"/>
    <path d="M12 21l-2-2h4z"/>
  </svg>
);

// Gastroenterología - Estómago con intestinos
export const GastroenterologyIcon: React.FC<IconProps> = ({ className = "", size = 24 }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    className={className}
  >
    <path d="M8 3c-2.2 0-4 1.8-4 4v2c0 1.1.9 2 2 2h1c1.1 0 2-.9 2-2V7c0-1.1.9-2 2-2h2c1.1 0 2 .9 2 2v2c0 1.1.9 2 2 2h1c1.1 0 2-.9 2-2V7c0-2.2-1.8-4-4-4H8z"/>
    <path d="M6 11v6c0 2.2 1.8 4 4 4h4c2.2 0 4-1.8 4-4v-6"/>
    <path d="M8 15h8"/>
    <path d="M10 17h4"/>
  </svg>
);

// Traumatología/Ortopedia - Estructura ósea
export const OrthopedicsIcon: React.FC<IconProps> = ({ className = "", size = 24 }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    className={className}
  >
    <path d="M12 2v20"/>
    <circle cx="12" cy="5" r="2"/>
    <circle cx="12" cy="19" r="2"/>
    <path d="M8 12h8"/>
    <path d="M10 8h4v8h-4z"/>
    <path d="M7 10v4"/>
    <path d="M17 10v4"/>
  </svg>
);

// Neumología - Pulmones con vías respiratorias
export const PulmonologyIcon: React.FC<IconProps> = ({ className = "", size = 24 }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    className={className}
  >
    <path d="M12 3v8"/>
    <path d="M8 11c0-2.2 1.8-4 4-4s4 1.8 4 4"/>
    <path d="M6 11c-1.66 0-3 1.34-3 3v5c0 1.66 1.34 3 3 3s3-1.34 3-3v-5"/>
    <path d="M18 11c1.66 0 3 1.34 3 3v5c0 1.66-1.34 3-3 3s-3-1.34-3-3v-5"/>
    <path d="M9 15h6"/>
    <path d="M10 17h4"/>
  </svg>
);

// Urología - Riñón y vejiga
export const UrologyIcon: React.FC<IconProps> = ({ className = "", size = 24 }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    className={className}
  >
    <path d="M8 3c-2.2 0-4 1.8-4 4v4c0 2.2 1.8 4 4 4"/>
    <path d="M16 3c2.2 0 4 1.8 4 4v4c0 2.2-1.8 4-4 4"/>
    <path d="M8 15v4c0 1.1.9 2 2 2h4c1.1 0 2-.9 2-2v-4"/>
    <path d="M10 17h4"/>
    <circle cx="6" cy="7" r="1"/>
    <circle cx="18" cy="7" r="1"/>
  </svg>
);

// Ginecología - Símbolo del útero
export const GynecologyIcon: React.FC<IconProps> = ({ className = "", size = 24 }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    className={className}
  >
    <path d="M12 18v3"/>
    <path d="M8 21h8"/>
    <circle cx="12" cy="12" r="6"/>
    <path d="M8 12h8"/>
    <path d="M10 10v4"/>
    <path d="M14 10v4"/>
    <circle cx="12" cy="8" r="2"/>
  </svg>
);

// Psiquiatría - Cerebro con burbuja de pensamiento
export const PsychiatryIcon: React.FC<IconProps> = ({ className = "", size = 24 }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    className={className}
  >
    <path d="M12 2C8.13 2 5 5.13 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.87-3.13-7-7-7z"/>
    <circle cx="16" cy="6" r="2"/>
    <circle cx="19" cy="4" r="1"/>
    <circle cx="18" cy="8" r="1"/>
    <path d="M9 11h6"/>
    <path d="M10 13h4"/>
  </svg>
);

// Endocrinología - Glándula tiroides
export const EndocrinologyIcon: React.FC<IconProps> = ({ className = "", size = 24 }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    className={className}
  >
    <path d="M12 3v18"/>
    <path d="M8 7c0-2.2 1.8-4 4-4s4 1.8 4 4"/>
    <circle cx="8" cy="12" r="3"/>
    <circle cx="16" cy="12" r="3"/>
    <path d="M8 15v4"/>
    <path d="M16 15v4"/>
    <circle cx="12" cy="6" r="1"/>
  </svg>
);

// Hematología - Células sanguíneas y vasos
export const HematologyIcon: React.FC<IconProps> = ({ className = "", size = 24 }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="8" cy="8" r="2"/>
    <circle cx="16" cy="8" r="2"/>
    <circle cx="12" cy="16" r="2"/>
    <path d="M8 10v6"/>
    <path d="M16 10v6"/>
    <path d="M10 16h4"/>
    <circle cx="6" cy="12" r="1"/>
    <circle cx="18" cy="12" r="1"/>
    <circle cx="12" cy="4" r="1"/>
    <circle cx="12" cy="20" r="1"/>
  </svg>
);

// Anestesiología - Jeringa con máscara de gas
export const AnesthesiologyIcon: React.FC<IconProps> = ({ className = "", size = 24 }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    className={className}
  >
    <path d="M8 3l8 8"/>
    <path d="M12 7l4 4"/>
    <circle cx="19" cy="19" r="3"/>
    <path d="M3 21l6-6"/>
    <circle cx="8" cy="16" r="2"/>
    <path d="M6 14h4v4H6z"/>
    <circle cx="5" cy="5" r="2"/>
  </svg>
);

// Medicina de Urgencias - Cruz de ambulancia
export const EmergencyIcon: React.FC<IconProps> = ({ className = "", size = 24 }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    className={className}
  >
    <path d="M12 6v12"/>
    <path d="M6 12h12"/>
    <rect x="4" y="4" width="16" height="16" rx="2"/>
    <circle cx="12" cy="12" r="1"/>
    <path d="M8 8l8 8"/>
    <path d="M16 8l-8 8"/>
  </svg>
);

// Reumatología - Conexión articular
export const RheumatologyIcon: React.FC<IconProps> = ({ className = "", size = 24 }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="6" cy="6" r="3"/>
    <circle cx="18" cy="18" r="3"/>
    <path d="M9 9l6 6"/>
    <circle cx="12" cy="12" r="2"/>
    <path d="M3 18l3-3"/>
    <path d="M21 6l-3 3"/>
    <path d="M6 21v-3"/>
    <path d="M18 3v3"/>
  </svg>
);

// Otorrinolaringología - Oído, nariz, garganta
export const OtolaryngologyIcon: React.FC<IconProps> = ({ className = "", size = 24 }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="8" cy="8" r="3"/>
    <path d="M12 3v6"/>
    <path d="M12 9c2.2 0 4 1.8 4 4v4"/>
    <path d="M16 21h-4"/>
    <circle cx="18" cy="17" r="2"/>
    <path d="M3 12h6"/>
    <path d="M6 15v6"/>
  </svg>
);

// Geriatría - Figura de persona mayor
export const GeriatricsIcon: React.FC<IconProps> = ({ className = "", size = 24 }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="12" cy="8" r="3"/>
    <path d="M8 14v7"/>
    <path d="M16 14v7"/>
    <path d="M8 14h8l-1-4H9z"/>
    <path d="M18 16h3"/>
    <path d="M3 16h3"/>
    <circle cx="21" cy="16" r="1"/>
    <circle cx="3" cy="16" r="1"/>
  </svg>
);

// Oncología - División celular
export const OncologyIcon: React.FC<IconProps> = ({ className = "", size = 24 }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="8" cy="8" r="4"/>
    <circle cx="16" cy="16" r="4"/>
    <path d="M12 12l4-4"/>
    <path d="M12 12l-4-4"/>
    <path d="M12 12l4 4"/>
    <path d="M12 12l-4 4"/>
    <circle cx="12" cy="12" r="1"/>
  </svg>
);

// Medicina Familiar - Grupo familiar
export const FamilyMedicineIcon: React.FC<IconProps> = ({ className = "", size = 24 }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="9" cy="7" r="2"/>
    <circle cx="15" cy="7" r="2"/>
    <circle cx="12" cy="15" r="2"/>
    <path d="M7 14v7"/>
    <path d="M17 14v7"/>
    <path d="M10 21h4"/>
    <path d="M7 14h10l-1-4H8z"/>
    <path d="M12 13v8"/>
  </svg>
);

// Medicina Interna - Estetoscopio con órganos
export const InternalMedicineIcon: React.FC<IconProps> = ({ className = "", size = 24 }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    className={className}
  >
    <path d="M3 12h18"/>
    <circle cx="6" cy="8" r="2"/>
    <circle cx="18" cy="8" r="2"/>
    <path d="M6 10v6"/>
    <path d="M18 10v6"/>
    <circle cx="6" cy="16" r="2"/>
    <circle cx="18" cy="16" r="2"/>
    <path d="M9 12h6"/>
    <circle cx="12" cy="12" r="1"/>
  </svg>
);

export const medicalIcons = {
  'Heart': CardiologyIcon,
  'Brain': NeurologyIcon,
  'Scan': DermatologyIcon,
  'Eye': OphthalmologyIcon,
  'Baby': PediatricsIcon,
  'Scissors': SurgeryIcon,
  'Soup': GastroenterologyIcon,
  'Bone': OrthopedicsIcon,
  'Activity': PulmonologyIcon,
  'Beaker': UrologyIcon,
  'Users': GynecologyIcon,
  'HeartHandshake': PsychiatryIcon,
  'Dna': EndocrinologyIcon,
  'Droplet': HematologyIcon,
  'Syringe': AnesthesiologyIcon,
  'Ambulance': EmergencyIcon,
  'Target': RheumatologyIcon,
  'Ear': OtolaryngologyIcon,
  'ShieldAlert': GeriatricsIcon,
  'Fingerprint': OncologyIcon,
  'Stethoscope': FamilyMedicineIcon,
  'Zap': InternalMedicineIcon,
};
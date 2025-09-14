import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, Heart, Shield, Users, Calendar, BarChart3, Lock, CheckCircle } from 'lucide-react';

export const generateBrochurePDF = () => {
  // Create a new window for the brochure
  const brochureWindow = window.open('', '_blank');
  
  if (!brochureWindow) {
    alert('Por favor, permite ventanas emergentes para descargar el brochure');
    return;
  }

  const brochureHTML = `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>VITAL - Brochure Médico</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        body {
            font-family: 'Arial', sans-serif;
            line-height: 1.6;
            color: #1f2937;
            background: white;
        }
        
        .brochure {
            max-width: 210mm;
            margin: 0 auto;
            padding: 20mm;
            background: white;
        }
        
        .header {
            text-align: center;
            margin-bottom: 40px;
            border-bottom: 3px solid #dc2626;
            padding-bottom: 20px;
        }
        
        .logo {
            display: inline-flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 15px;
        }
        
        .logo-icon {
            width: 40px;
            height: 40px;
            background: #dc2626;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
        }
        
        .logo-text {
            font-size: 32px;
            font-weight: bold;
            color: #dc2626;
        }
        
        .subtitle {
            font-size: 18px;
            color: #6b7280;
            margin-bottom: 10px;
        }
        
        .tagline {
            font-size: 14px;
            color: #9ca3af;
        }
        
        .section {
            margin-bottom: 30px;
        }
        
        .section h2 {
            font-size: 20px;
            color: #1f2937;
            margin-bottom: 15px;
            border-left: 4px solid #10b981;
            padding-left: 15px;
        }
        
        .features-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
            margin-bottom: 20px;
        }
        
        .feature {
            display: flex;
            align-items: flex-start;
            gap: 10px;
            padding: 15px;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
        }
        
        .feature-icon {
            width: 24px;
            height: 24px;
            background: #10b981;
            border-radius: 4px;
            flex-shrink: 0;
            margin-top: 2px;
        }
        
        .feature-content h3 {
            font-size: 14px;
            font-weight: bold;
            margin-bottom: 5px;
            color: #1f2937;
        }
        
        .feature-content p {
            font-size: 12px;
            color: #6b7280;
        }
        
        .pricing-table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
        }
        
        .pricing-table th,
        .pricing-table td {
            padding: 12px;
            text-align: left;
            border-bottom: 1px solid #e5e7eb;
        }
        
        .pricing-table th {
            background: #f9fafb;
            font-weight: bold;
            color: #1f2937;
        }
        
        .price {
            font-weight: bold;
            color: #10b981;
            font-size: 16px;
        }
        
        .contact-info {
            background: #f8fafc;
            padding: 20px;
            border-radius: 8px;
            border-left: 4px solid #dc2626;
        }
        
        .contact-info h3 {
            color: #1f2937;
            margin-bottom: 10px;
        }
        
        .contact-item {
            margin-bottom: 8px;
            font-size: 14px;
        }
        
        .contact-item strong {
            color: #1f2937;
            display: inline-block;
            width: 80px;
        }
        
        .benefits {
            background: #f0fdf4;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
        }
        
        .benefits ul {
            list-style: none;
            padding: 0;
        }
        
        .benefits li {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 8px;
            font-size: 14px;
        }
        
        .benefits li::before {
            content: "✓";
            color: #10b981;
            font-weight: bold;
        }
        
        .footer {
            text-align: center;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            color: #6b7280;
            font-size: 12px;
        }
        
        @media print {
            body { background: white; }
            .brochure { margin: 0; padding: 15mm; }
        }
    </style>
</head>
<body>
    <div class="brochure">
        <div class="header">
            <div class="logo">
                <div class="logo-icon">♥</div>
                <div class="logo-text">VITAL</div>
            </div>
            <div class="subtitle">Sistema Médico Inteligente</div>
            <div class="tagline">Revoluciona tu práctica médica con tecnología especializada</div>
        </div>

        <div class="section">
            <h2>¿Por qué elegir VITAL?</h2>
            <div class="benefits">
                <ul>
                    <li>Gestión completa de pacientes e historiales médicos</li>
                    <li>Consultas inteligentes con plantillas por especialidad</li>
                    <li>Dashboard analítico con métricas en tiempo real</li>
                    <li>Seguridad médica con cumplimiento HIPAA</li>
                    <li>Acceso multiplataforma (web, móvil, tablet)</li>
                    <li>Soporte técnico especializado 24/7</li>
                </ul>
            </div>
        </div>

        <div class="section">
            <h2>Características Principales</h2>
            <div class="features-grid">
                <div class="feature">
                    <div class="feature-icon"></div>
                    <div class="feature-content">
                        <h3>Gestión de Pacientes</h3>
                        <p>Base de datos centralizada con historial completo y búsqueda avanzada</p>
                    </div>
                </div>
                <div class="feature">
                    <div class="feature-icon"></div>
                    <div class="feature-content">
                        <h3>Consultas Inteligentes</h3>
                        <p>Formularios dinámicos por especialidad con cálculos automáticos</p>
                    </div>
                </div>
                <div class="feature">
                    <div class="feature-icon"></div>
                    <div class="feature-content">
                        <h3>Dashboard Analítico</h3>
                        <p>Métricas en tiempo real con gráficos interactivos</p>
                    </div>
                </div>
                <div class="feature">
                    <div class="feature-icon"></div>
                    <div class="feature-content">
                        <h3>Seguridad Médica</h3>
                        <p>Encriptación end-to-end con cumplimiento HIPAA</p>
                    </div>
                </div>
            </div>
        </div>

        <div class="section">
            <h2>Planes y Precios</h2>
            <table class="pricing-table">
                <thead>
                    <tr>
                        <th>Plan</th>
                        <th>Precio</th>
                        <th>Características</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><strong>Médico Individual</strong></td>
                        <td class="price">$29/mes</td>
                        <td>Hasta 500 pacientes, consultas ilimitadas, 1 especialidad</td>
                    </tr>
                    <tr>
                        <td><strong>Clínica Pequeña</strong></td>
                        <td class="price">$99/mes</td>
                        <td>Hasta 5,000 pacientes, múltiples médicos, todas las especialidades</td>
                    </tr>
                    <tr>
                        <td><strong>Hospital Enterprise</strong></td>
                        <td class="price">Contactar</td>
                        <td>Pacientes ilimitados, personalización completa, soporte dedicado</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div class="section">
            <h2>Especialidades Médicas Soportadas</h2>
            <div class="features-grid">
                <div class="feature">
                    <div class="feature-icon"></div>
                    <div class="feature-content">
                        <h3>Cardiología</h3>
                        <p>Especialista en salud cardiovascular</p>
                    </div>
                </div>
                <div class="feature">
                    <div class="feature-icon"></div>
                    <div class="feature-content">
                        <h3>Neurología</h3>
                        <p>Trastornos del sistema nervioso</p>
                    </div>
                </div>
                <div class="feature">
                    <div class="feature-icon"></div>
                    <div class="feature-content">
                        <h3>Dermatología</h3>
                        <p>Salud y cuidado de la piel</p>
                    </div>
                </div>
                <div class="feature">
                    <div class="feature-icon"></div>
                    <div class="feature-content">
                        <h3>Y muchas más...</h3>
                        <p>Oftalmología, Traumatología, Endocrinología</p>
                    </div>
                </div>
            </div>
        </div>

        <div class="contact-info">
            <h3>Contacto y Soporte</h3>
            <div class="contact-item"><strong>Email:</strong> contacto@vital.com</div>
            <div class="contact-item"><strong>Teléfono:</strong> +1 (555) 123-4567</div>
            <div class="contact-item"><strong>Horarios:</strong> Lun-Vie: 8:00 AM - 8:00 PM</div>
            <div class="contact-item"><strong>Web:</strong> www.vital.com</div>
        </div>

        <div class="footer">
            <p>© 2025 VITAL. Todos los derechos reservados.</p>
            <p>Powered by VITAL - Tecnología médica especializada</p>
        </div>
    </div>

    <script>
        // Auto-print when page loads
        window.onload = function() {
            setTimeout(function() {
                window.print();
            }, 500);
        }
    </script>
</body>
</html>
  `;

  brochureWindow.document.write(brochureHTML);
  brochureWindow.document.close();
};

export default function BrochureGenerator() {
  return (
    <Button 
      variant="ghost" 
      size="sm"
      onClick={generateBrochurePDF}
      className="text-[#9CA3AF] hover:text-[#10B981] hover:bg-[#111827]"
    >
      <Download className="w-4 h-4 mr-2" />
      Descargar Brochure
    </Button>
  );
}
import { Switch, Route, Redirect } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/use-auth";
import GlassMedicalLanding from "@/pages/GlassMedicalLanding";
import GlassLoginPage from "@/pages/GlassLoginPage";
import GlassRegisterPage from "@/pages/GlassRegisterPage";
import GlassMedicalDashboard from "@/pages/GlassMedicalDashboard";
import MedicalExamDashboard from "@/pages/MedicalExamDashboard";
import NewMedicalExam from "@/pages/NewMedicalExam";
import PatientsPage from "@/pages/PatientsPage";
import PatientManagement from "@/pages/PatientManagement";
import ConsultationPage from "@/pages/ConsultationPage";
import SearchPage from "@/pages/SearchPage";
import NewConsultation from "@/pages/NewConsultation";
import ConsultationHistory from "@/pages/ConsultationHistory";
import ConsultationForm from "@/pages/ConsultationForm";
import { DynamicConsultationForm } from "@/pages/DynamicConsultationForm";
import ConsultationReport from "@/pages/ConsultationReport";
import ImprovedPatientFormClean from "@/pages/ImprovedPatientFormClean";
import ExpandedPatientRegistration from "@/pages/ExpandedPatientRegistration";
import ConsentForm from "@/pages/ConsentForm";
import PhysicalExam from "@/pages/PhysicalExam";
// Advanced exam pages removed - using MedicalExamsV2 instead
import MedicalExamsV2 from "@/pages/MedicalExamsV2";
import AdvancedEndocrinologyForm from "@/pages/AdvancedEndocrinologyForm";
import ProfessionalCalendar from "@/components/ProfessionalCalendar";
import MedicalReportGenerator from "@/components/MedicalReportGenerator";
import { MedicalLayout } from "@/components/layout/MedicalLayout";
import NotFound from "@/pages/not-found";
import { useState } from "react";
import { useLocation } from "wouter";

// Simple protected route wrapper 
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isLoggedIn } = useAuth();
  
  if (!isLoggedIn) {
    return <Redirect to="/login" />;
  }
  
  return <>{children}</>;
}

// Wrapper component for consent form
function ConsentFormWrapper() {
  const [, setLocation] = useLocation();
  
  // Obtener datos del paciente desde localStorage
  const patientDataStr = localStorage.getItem('currentPatientData');
  if (!patientDataStr) {
    setLocation('/nuevo-paciente');
    return null;
  }
  
  const patientData = JSON.parse(patientDataStr);
  
  const handleConsentComplete = () => {
    setLocation('/medical-exams-v2');
  };
  
  return <ConsentForm patientData={patientData} onConsentComplete={handleConsentComplete} />;
}

// Wrapper component for physical exam
function PhysicalExamWrapper() {
  const [, setLocation] = useLocation();
  
  // Obtener datos del paciente desde localStorage
  const patientDataStr = localStorage.getItem('currentPatientData');
  if (!patientDataStr) {
    setLocation('/nuevo-paciente');
    return null;
  }
  
  const patientData = JSON.parse(patientDataStr);
  
  return <PhysicalExam patientData={patientData} />;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={GlassMedicalLanding} />
      <Route path="/login" component={GlassLoginPage} />
      <Route path="/register" component={GlassRegisterPage} />
      <Route path="/dashboard">
        <ProtectedRoute>
          <GlassMedicalDashboard />
        </ProtectedRoute>
      </Route>
      <Route path="/exam-dashboard">
        <ProtectedRoute>
          <MedicalExamDashboard />
        </ProtectedRoute>
      </Route>
      <Route path="/nuevo-examen">
        <ProtectedRoute>
          <NewMedicalExam />
        </ProtectedRoute>
      </Route>
      <Route path="/nuevo-paciente">
        <ProtectedRoute>
          <ExpandedPatientRegistration />
        </ProtectedRoute>
      </Route>
      <Route path="/patients">
        <ProtectedRoute>
          <PatientManagement />
        </ProtectedRoute>
      </Route>
      <Route path="/patients-old">
        <ProtectedRoute>
          <MedicalLayout>
            <PatientsPage />
          </MedicalLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/consultations">
        <ProtectedRoute>
          <MedicalLayout>
            <ConsultationPage />
          </MedicalLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/search">
        <ProtectedRoute>
          <MedicalLayout>
            <SearchPage />
          </MedicalLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/nueva-consulta">
        <ProtectedRoute>
          <DynamicConsultationForm />
        </ProtectedRoute>
      </Route>
      <Route path="/new-consultation">
        <ProtectedRoute>
          <DynamicConsultationForm />
        </ProtectedRoute>
      </Route>
      <Route path="/historial-consultas">
        <ProtectedRoute>
          <MedicalLayout>
            <ConsultationHistory />
          </MedicalLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/consultation-form">
        <ProtectedRoute>
          <ConsultationForm />
        </ProtectedRoute>
      </Route>
      <Route path="/consultation-report">
        <ProtectedRoute>
          <ConsultationReport />
        </ProtectedRoute>
      </Route>
      <Route path="/calendar">
        <ProtectedRoute>
          <ProfessionalCalendar />
        </ProtectedRoute>
      </Route>
      <Route path="/report-generator">
        <ProtectedRoute>
          <MedicalReportGenerator />
        </ProtectedRoute>
      </Route>
      <Route path="/consent-form">
        <ProtectedRoute>
          <ConsentFormWrapper />
        </ProtectedRoute>
      </Route>
      <Route path="/physical-exam">
        <ProtectedRoute>
          <PhysicalExamWrapper />
        </ProtectedRoute>
      </Route>
      <Route path="/examen-cardiologia-avanzado">
        <ProtectedRoute>
          <MedicalExamsV2 />
        </ProtectedRoute>
      </Route>
      <Route path="/examen-gastro-avanzado">
        <ProtectedRoute>
          <MedicalExamsV2 />
        </ProtectedRoute>
      </Route>
      <Route path="/examen-urologia-avanzado">
        <ProtectedRoute>
          <MedicalExamsV2 />
        </ProtectedRoute>
      </Route>
      <Route path="/examen-hematologia-avanzado">
        <ProtectedRoute>
          <MedicalExamsV2 />
        </ProtectedRoute>
      </Route>
      <Route path="/examen-neurologia-avanzado">
        <ProtectedRoute>
          <MedicalExamsV2 />
        </ProtectedRoute>
      </Route>
      <Route path="/medical-exams-v2">
        <ProtectedRoute>
          <MedicalExamsV2 />
        </ProtectedRoute>
      </Route>
      <Route path="/examen-endocrinologia-avanzado">
        <ProtectedRoute>
          <AdvancedEndocrinologyForm />
        </ProtectedRoute>
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <TooltipProvider>
      <Toaster />
      <Router />
    </TooltipProvider>
  );
}

export default App;

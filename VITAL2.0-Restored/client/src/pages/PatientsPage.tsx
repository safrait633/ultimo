import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { 
  Users,
  Plus,
  Search,
  Filter,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Edit,
  Eye,
  Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Patient {
  id: string;
  avatar?: string;
  name: string;
  age: number;
  gender: 'M' | 'F';
  phone: string;
  email: string;
  address: string;
  lastVisit: string;
  nextAppointment?: string;
  status: 'active' | 'inactive' | 'critical';
  medicalRecord: string;
}

export default function PatientsPage() {
  const { user } = useAuth();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {
    setIsLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No authentication token found');
        return;
      }

      const response = await fetch('/api/patients', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Patients data received:', data);
      
      // Transform the data to match our Patient interface
      const transformedPatients: Patient[] = data.map((patient: any) => ({
        id: patient.id,
        name: patient.name || `${patient.firstName || ''} ${patient.lastName || ''}`.trim(),
        age: patient.age || 0,
        gender: patient.gender || 'M',
        phone: patient.phone || '',
        email: patient.email || '',
        address: patient.address || '',
        lastVisit: patient.lastVisit || patient.createdAt || new Date().toISOString().split('T')[0],
        nextAppointment: patient.nextAppointment,
        status: patient.status || 'active',
        medicalRecord: patient.documentNumber || patient.id
      }));

      setPatients(transformedPatients);
    } catch (error) {
      console.error('Error loading patients:', error);
      // Fallback to empty array on error
      setPatients([]);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-[#238636] text-white';
      case 'inactive': return 'bg-yellow-500 text-black';
      case 'critical': return 'bg-[#da3633] text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'Activo';
      case 'inactive': return 'Inactivo';
      case 'critical': return 'Crítico';
      default: return status;
    }
  };

  const filteredPatients = patients.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         patient.medicalRecord.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         patient.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || patient.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[#E6EDF3]">
            Gestión de Pacientes
          </h1>
          <p className="text-[#7D8590] mt-1">
            Administra y consulta la información de tus pacientes
          </p>
        </div>
        
        <Button size="sm" className="bg-[#238636] hover:bg-[#2ea043]">
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Paciente
        </Button>
      </div>

      {/* Filters */}
      <Card className="bg-[#1C2128] border-[#374151]">
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-[#7D8590]" />
              <Input
                placeholder="Buscar por nombre, historial médico o email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-[#0F1419] border-[#374151]"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40 bg-[#0F1419] border-[#374151]">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="active">Activos</SelectItem>
                <SelectItem value="inactive">Inactivos</SelectItem>
                <SelectItem value="critical">Críticos</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Patients List */}
      <div className="grid gap-4">
        {filteredPatients.map((patient) => (
          <Card key={patient.id} className="bg-[#1C2128] border-[#374151] hover:border-[#238636] transition-colors">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={patient.avatar} alt={patient.name} />
                    <AvatarFallback className="bg-[#238636] text-white text-lg">
                      {patient.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-[#E6EDF3]">{patient.name}</h3>
                      <Badge className={getStatusColor(patient.status)}>
                        {getStatusLabel(patient.status)}
                      </Badge>
                      <span className="text-sm text-[#7D8590]">
                        #{patient.medicalRecord}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center text-[#7D8590]">
                        <Users className="w-4 h-4 mr-2" />
                        {patient.age} años • {patient.gender === 'M' ? 'Masculino' : 'Femenino'}
                      </div>
                      <div className="flex items-center text-[#7D8590]">
                        <Phone className="w-4 h-4 mr-2" />
                        {patient.phone}
                      </div>
                      <div className="flex items-center text-[#7D8590]">
                        <Mail className="w-4 h-4 mr-2" />
                        {patient.email}
                      </div>
                      <div className="flex items-center text-[#7D8590]">
                        <MapPin className="w-4 h-4 mr-2" />
                        {patient.address}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-6 mt-3 text-sm">
                      <div className="flex items-center text-[#7D8590]">
                        <Clock className="w-4 h-4 mr-2" />
                        Última visita: {formatDate(patient.lastVisit)}
                      </div>
                      {patient.nextAppointment && (
                        <div className="flex items-center text-[#238636]">
                          <Calendar className="w-4 h-4 mr-2" />
                          Próxima cita: {formatDate(patient.nextAppointment)}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm" className="text-[#238636] hover:bg-[#238636]/10">
                    <Eye className="w-4 h-4 mr-2" />
                    Ver Historial
                  </Button>
                  <Button variant="ghost" size="sm" className="text-[#7D8590] hover:bg-[#21262D]">
                    <Edit className="w-4 h-4 mr-2" />
                    Editar
                  </Button>
                  <Button size="sm" className="bg-[#238636] hover:bg-[#2ea043]">
                    <Calendar className="w-4 h-4 mr-2" />
                    Nueva Cita
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPatients.length === 0 && !isLoading && (
        <Card className="bg-[#1C2128] border-[#374151]">
          <CardContent className="p-12 text-center">
            <Users className="w-12 h-12 text-[#7D8590] mx-auto mb-4" />
            <h3 className="text-lg font-medium text-[#E6EDF3] mb-2">
              No se encontraron pacientes
            </h3>
            <p className="text-[#7D8590] mb-4">
              No hay pacientes que coincidan con los criterios de búsqueda.
            </p>
            <Button className="bg-[#238636] hover:bg-[#2ea043]">
              <Plus className="w-4 h-4 mr-2" />
              Agregar Primer Paciente
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Loading state */}
      {isLoading && (
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="bg-[#1C2128] border-[#374151]">
              <CardContent className="p-6">
                <div className="animate-pulse flex items-center space-x-4">
                  <div className="w-16 h-16 bg-[#374151] rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-[#374151] rounded mb-2"></div>
                    <div className="h-3 bg-[#374151] rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-[#374151] rounded w-1/2"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
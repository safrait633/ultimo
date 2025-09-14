import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  User, 
  Settings, 
  LogOut, 
  Key, 
  Edit3, 
  Shield, 
  Calendar,
  Phone,
  Mail,
  MapPin,
  Stethoscope,
  X,
  Save
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface UserPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ProfessionalUserPanel({ isOpen, onClose }: UserPanelProps) {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'profile' | 'settings' | 'password'>('profile');
  const [isEditing, setIsEditing] = useState(false);
  
  // Estados para formularios
  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    specialty: user?.specialty || '',
    licenseNumber: user?.licenseNumber || '',
  });
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Mutación para actualizar perfil
  const updateProfileMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch('/api/simple/profile', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Error al actualizar perfil');
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: 'Perfil actualizado',
        description: 'Los cambios se han guardado correctamente',
      });
      setIsEditing(false);
      queryClient.invalidateQueries({ queryKey: ['/api/simple/me'] });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error al actualizar',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Mutación para cambiar contraseña
  const changePasswordMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch('/api/simple/change-password', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Error al cambiar contraseña');
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: 'Contraseña actualizada',
        description: 'La contraseña se ha cambiado correctamente',
      });
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error al cambiar contraseña',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const handleSaveProfile = () => {
    updateProfileMutation.mutate(profileData);
  };

  const handleChangePassword = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: 'Error',
        description: 'Las contraseñas no coinciden',
        variant: 'destructive',
      });
      return;
    }
    changePasswordMutation.mutate(passwordData);
  };

  const handleLogout = () => {
    logout();
    onClose();
  };

  if (!user) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 border border-white/20 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-white/10 backdrop-blur-xl border-b border-white/20 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-500 text-white font-bold text-lg">
                      {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      Dr. {user.firstName} {user.lastName}
                    </h2>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" className="bg-green-500/20 text-green-300">
                        <Stethoscope className="w-3 h-3 mr-1" />
                        {user.specialty}
                      </Badge>
                      <Badge variant="outline" className="border-white/20 text-white">
                        Lic: {user.licenseNumber}
                      </Badge>
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="text-white hover:bg-white/10"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-white/20">
              {[
                { id: 'profile', label: 'Mi Perfil', icon: User },
                { id: 'settings', label: 'Configuración', icon: Settings },
                { id: 'password', label: 'Contraseña', icon: Key }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex-1 flex items-center justify-center gap-2 p-4 transition-all ${
                    activeTab === tab.id
                      ? 'bg-white/10 border-b-2 border-blue-400 text-white'
                      : 'text-slate-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="p-6 max-h-[60vh] overflow-y-auto">
              {activeTab === 'profile' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-white">Información Personal</h3>
                    {!isEditing ? (
                      <Button
                        onClick={() => setIsEditing(true)}
                        variant="outline"
                        size="sm"
                        className="border-white/20 text-white hover:bg-white/10"
                      >
                        <Edit3 className="w-4 h-4 mr-2" />
                        Editar
                      </Button>
                    ) : (
                      <div className="flex gap-2">
                        <Button
                          onClick={() => setIsEditing(false)}
                          variant="ghost"
                          size="sm"
                          className="text-white hover:bg-white/10"
                        >
                          Cancelar
                        </Button>
                        <Button
                          onClick={handleSaveProfile}
                          disabled={updateProfileMutation.isPending}
                          size="sm"
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          <Save className="w-4 h-4 mr-2" />
                          Guardar
                        </Button>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-white">Nombre</Label>
                      <Input
                        value={profileData.firstName}
                        onChange={(e) => setProfileData({...profileData, firstName: e.target.value})}
                        disabled={!isEditing}
                        className="bg-white/5 border-white/20 text-white disabled:opacity-70"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-white">Apellidos</Label>
                      <Input
                        value={profileData.lastName}
                        onChange={(e) => setProfileData({...profileData, lastName: e.target.value})}
                        disabled={!isEditing}
                        className="bg-white/5 border-white/20 text-white disabled:opacity-70"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-white flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        Email
                      </Label>
                      <Input
                        value={profileData.email}
                        onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                        disabled={!isEditing}
                        className="bg-white/5 border-white/20 text-white disabled:opacity-70"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-white flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        Teléfono
                      </Label>
                      <Input
                        value={profileData.phone}
                        onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                        disabled={!isEditing}
                        className="bg-white/5 border-white/20 text-white disabled:opacity-70"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-white flex items-center gap-2">
                        <Stethoscope className="w-4 h-4" />
                        Especialidad
                      </Label>
                      <Input
                        value={profileData.specialty}
                        onChange={(e) => setProfileData({...profileData, specialty: e.target.value})}
                        disabled={!isEditing}
                        className="bg-white/5 border-white/20 text-white disabled:opacity-70"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-white flex items-center gap-2">
                        <Shield className="w-4 h-4" />
                        Número de Licencia
                      </Label>
                      <Input
                        value={profileData.licenseNumber}
                        onChange={(e) => setProfileData({...profileData, licenseNumber: e.target.value})}
                        disabled={!isEditing}
                        className="bg-white/5 border-white/20 text-white disabled:opacity-70"
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'settings' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-white">Configuración de la Cuenta</h3>
                  
                  <Card className="bg-white/5 border-white/20">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <Calendar className="w-5 h-5" />
                        Calendario Profesional
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-slate-300 mb-4">
                        Gestiona tu horario de consultas y citas médicas
                      </p>
                      <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                        Abrir Calendario
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/5 border-white/20">
                    <CardHeader>
                      <CardTitle className="text-white">Preferencias</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-white">Notificaciones por email</span>
                        <input type="checkbox" className="scale-125" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-white">Recordatorios de citas</span>
                        <input type="checkbox" className="scale-125" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-white">Modo oscuro</span>
                        <input type="checkbox" className="scale-125" defaultChecked />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {activeTab === 'password' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-white">Cambiar Contraseña</h3>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-white">Contraseña Actual</Label>
                      <Input
                        type="password"
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                        className="bg-white/5 border-white/20 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-white">Nueva Contraseña</Label>
                      <Input
                        type="password"
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                        className="bg-white/5 border-white/20 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-white">Confirmar Nueva Contraseña</Label>
                      <Input
                        type="password"
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                        className="bg-white/5 border-white/20 text-white"
                      />
                    </div>
                    
                    <Button
                      onClick={handleChangePassword}
                      disabled={changePasswordMutation.isPending}
                      className="bg-green-600 hover:bg-green-700 text-white w-full"
                    >
                      <Key className="w-4 h-4 mr-2" />
                      Cambiar Contraseña
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Footer Actions */}
            <div className="bg-white/5 border-t border-white/20 p-6">
              <div className="flex items-center justify-between">
                <div className="text-slate-300 text-sm">
                  Último acceso: {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Nunca'}
                </div>
                <Button
                  onClick={handleLogout}
                  variant="destructive"
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Cerrar Sesión
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
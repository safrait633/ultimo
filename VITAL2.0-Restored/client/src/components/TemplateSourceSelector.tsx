import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Sparkles, 
  ArrowRight, 
  Clock, 
  CheckCircle2,
  Zap,
  Star,
  Users,
  Folder,
  FolderOpen
} from 'lucide-react';


interface TemplateSourceSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSource: (sourceType: 'v1' | 'v2', specialtyId: string) => void;
  specialtyName: string;
  specialtyId: string;
}

const TemplateSourceSelector: React.FC<TemplateSourceSelectorProps> = ({
  isOpen,
  onClose,
  onSelectSource,
  specialtyName,
  specialtyId
}) => {
  const [selectedSource, setSelectedSource] = useState<'v1' | 'v2' | null>(null);

  const handleSourceSelect = (sourceType: 'v1' | 'v2') => {
    setSelectedSource(sourceType);
    setTimeout(() => {
      onSelectSource(sourceType, specialtyId);
      onClose();
      setSelectedSource(null);
    }, 300);
  };

  const templateSources = [
    {
      id: 'v1' as const,
      title: 'Классические шаблоны',
      description: 'Стандартные формы из папки client/src/components/medical-exam',
      path: 'client/src/components/medical-exam',
      features: [
        'Проверенная стабильность',
        'Стандартные поля ввода',
        'Базовая валидация',
        'Простой интерфейс'
      ],
      icon: Folder,
      color: 'from-blue-500 to-indigo-600',
      badge: 'Стабильный',
      badgeColor: 'bg-blue-100 text-blue-800',
      stats: {
        templates: '15+',
        status: 'Активные'
      }
    },
    {
      id: 'v2' as const,
      title: 'Расширенные шаблоны',
      description: 'Новые мигрированные формы из папки medical-exams-v2',
      path: 'medical-exams-v2',
      features: [
        'Современный дизайн',
        'Расширенная функциональность',
        'Интерактивные элементы',
        'Улучшенная валидация'
      ],
      icon: FolderOpen,
      color: 'from-purple-500 to-pink-600',
      badge: 'Новый',
      badgeColor: 'bg-purple-100 text-purple-800',
      stats: {
        templates: '20+',
        status: 'В разработке'
      }
    }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl bg-slate-900/95 backdrop-blur-xl border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            Выбор источника шаблона для {specialtyName}
          </DialogTitle>
          <p className="text-slate-300 mt-2">
            Выберите папку с шаблонами для проведения медицинского осмотра
          </p>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {templateSources.map((source, index) => {
            const IconComponent = source.icon;
            const isSelected = selectedSource === source.id;
            
            return (
              <div key={source.id}>
                <Card 
                  className={`cursor-pointer transition-all duration-300 border-2 h-full ${
                    isSelected 
                      ? 'border-blue-500 bg-blue-500/10 shadow-lg shadow-blue-500/25' 
                      : 'border-slate-700 bg-slate-800/50 hover:border-slate-600 hover:bg-slate-800/70'
                  }`}
                  onClick={() => handleSourceSelect(source.id)}
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${source.color} flex items-center justify-center mb-3`}>
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <Badge className={source.badgeColor}>
                        {source.badge}
                      </Badge>
                    </div>
                    <CardTitle className="text-white text-xl">
                      {source.title}
                    </CardTitle>
                    <CardDescription className="text-slate-300">
                      {source.description}
                    </CardDescription>
                    
                    {/* Путь к папке */}
                    <div className="mt-2 p-2 bg-slate-700/50 rounded-lg">
                      <p className="text-xs text-slate-400 font-mono">
                        📁 {source.path}
                      </p>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    {/* Статистика */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="text-center p-3 bg-slate-700/30 rounded-lg">
                        <div className="text-lg font-bold text-white">{source.stats.templates}</div>
                        <div className="text-xs text-slate-400">Шаблонов</div>
                      </div>
                      <div className="text-center p-3 bg-slate-700/30 rounded-lg">
                        <div className="text-sm font-medium text-white">{source.stats.status}</div>
                        <div className="text-xs text-slate-400">Статус</div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <h4 className="text-white font-medium flex items-center gap-2">
                        <Star className="w-4 h-4 text-yellow-400" />
                        Особенности:
                      </h4>
                      <ul className="space-y-2">
                        {source.features.map((feature, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-slate-300 text-sm">
                            <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <Button 
                      className={`w-full mt-6 transition-all duration-300 ${
                        isSelected
                          ? 'bg-blue-600 hover:bg-blue-700 text-white'
                          : 'bg-slate-700 hover:bg-slate-600 text-white'
                      }`}
                      onClick={() => handleSourceSelect(source.id)}
                    >
                      {isSelected ? (
                        <>
                          <Zap className="w-4 h-4 mr-2" />
                          Загрузка...
                        </>
                      ) : (
                        <>
                          Выбрать источник
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>

        <div className="mt-6 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
              <Users className="w-4 h-4 text-blue-400" />
            </div>
            <div>
              <h4 className="text-white font-medium mb-1">Рекомендация</h4>
              <p className="text-slate-300 text-sm">
                <strong>Классические шаблоны</strong> - для стабильной работы с проверенным функционалом. 
                <strong>Расширенные шаблоны</strong> - для доступа к новым возможностям и современному интерфейсу.
              </p>
            </div>
          </div>
        </div>
        
        {/* Дополнительная информация */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-blue-400" />
              <span className="text-sm font-medium text-blue-300">Классические</span>
            </div>
            <p className="text-xs text-slate-300">
              Используют компоненты из client/src/components/medical-exam
            </p>
          </div>
          <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span className="text-sm font-medium text-purple-300">Расширенные</span>
            </div>
            <p className="text-xs text-slate-300">
              Используют компоненты из medical-exams-v2
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TemplateSourceSelector;
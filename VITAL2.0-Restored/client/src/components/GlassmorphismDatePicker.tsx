import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay, isToday, setMonth, setYear, getYear, getMonth } from 'date-fns';
import { es } from 'date-fns/locale';

interface GlassmorphismDatePickerProps {
  value?: string;
  onChange: (date: string) => void;
  placeholder?: string;
  className?: string;
}

export default function GlassmorphismDatePicker({ 
  value, 
  onChange, 
  placeholder = "Seleccionar fecha",
  className = ""
}: GlassmorphismDatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(value ? new Date(value) : new Date());
  const [inputValue, setInputValue] = useState(value ? format(new Date(value), 'dd/MM/yyyy') : '');
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedDate = value ? new Date(value) : null;

  // Cerrar al hacer click fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Generar días del calendario
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart, { locale: es });
  const calendarEnd = endOfWeek(monthEnd, { locale: es });
  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const handleDateClick = (date: Date) => {
    onChange(format(date, 'yyyy-MM-dd'));
    setIsOpen(false);
  };

  const goToPreviousMonth = () => {
    setCurrentMonth(prev => subMonths(prev, 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(prev => addMonths(prev, 1));
  };

  const handleMonthChange = (monthIndex: number) => {
    setCurrentMonth(prev => setMonth(prev, monthIndex));
  };

  const handleYearChange = (year: number) => {
    setCurrentMonth(prev => setYear(prev, year));
  };

  const displayValue = selectedDate ? format(selectedDate, 'dd/MM/yyyy') : '';

  // Sincronizar input con el valor seleccionado
  useEffect(() => {
    if (value) {
      setInputValue(format(new Date(value), 'dd/MM/yyyy'));
    }
  }, [value]);

  // Manejar entrada manual de fecha
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setInputValue(newValue);
    
    // Intentar parsear la fecha cuando tenga formato completo
    if (newValue.length === 10) { // dd/mm/yyyy
      const parts = newValue.split('/');
      if (parts.length === 3) {
        const [day, month, year] = parts;
        const parsedDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
        
        // Verificar si la fecha es válida
        if (!isNaN(parsedDate.getTime()) && 
            parsedDate.getDate() === parseInt(day) &&
            parsedDate.getMonth() === parseInt(month) - 1 &&
            parsedDate.getFullYear() === parseInt(year)) {
          onChange(format(parsedDate, 'yyyy-MM-dd'));
          setCurrentMonth(parsedDate);
        }
      }
    }
  };

  // Formatear entrada mientras escribe
  const formatInputValue = (value: string) => {
    // Remover todo excepto números
    const numbers = value.replace(/\D/g, '');
    
    // Aplicar formato dd/mm/yyyy
    if (numbers.length <= 2) {
      return numbers;
    } else if (numbers.length <= 4) {
      return `${numbers.slice(0, 2)}/${numbers.slice(2)}`;
    } else if (numbers.length <= 8) {
      return `${numbers.slice(0, 2)}/${numbers.slice(2, 4)}/${numbers.slice(4)}`;
    }
    return `${numbers.slice(0, 2)}/${numbers.slice(2, 4)}/${numbers.slice(4, 8)}`;
  };

  const handleInputKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    // Solo permitir números y teclas de control
    if (!/[\d\/]/.test(event.key) && !['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(event.key)) {
      event.preventDefault();
    }
  };

  // Generar arrays para los selectores
  const currentYear = getYear(currentMonth);
  const currentMonthIndex = getMonth(currentMonth);
  const years = Array.from({ length: 100 }, (_, i) => currentYear - 50 + i);
  const months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  return (
    <div ref={containerRef} className="relative">
      {/* Input Field Editable */}
      <div className="relative">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => {
            const formatted = formatInputValue(e.target.value);
            setInputValue(formatted);
            handleInputChange({ ...e, target: { ...e.target, value: formatted } } as React.ChangeEvent<HTMLInputElement>);
          }}
          onKeyDown={handleInputKeyPress}
          placeholder={placeholder}
          className={`bg-white/5 backdrop-blur-xl border border-white/20 rounded-xl text-white placeholder:text-white/60 focus:ring-2 focus:ring-emerald-400/50 hover:bg-white/10 transition-all duration-300 h-10 w-full px-3 py-2 pr-10 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm ${className}`}
        />
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 hover:bg-white/10 rounded transition-colors"
        >
          <Calendar className="w-4 h-4 text-white/70" />
        </button>
      </div>

      {/* Calendar Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full mt-2 left-0 z-50 bg-slate-900/95 backdrop-blur-xl border border-white/20 rounded-xl p-4 shadow-2xl min-w-[320px]"
          >
            {/* Header del calendario */}
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={goToPreviousMonth}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-4 h-4 text-white" />
              </button>
              
              <div className="flex items-center space-x-2">
                <select
                  value={currentMonthIndex}
                  onChange={(e) => handleMonthChange(parseInt(e.target.value))}
                  className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-3 py-1 text-white text-sm focus:outline-none focus:ring-1 focus:ring-emerald-400/50 [&>option]:bg-slate-800 [&>option]:text-white"
                >
                  {months.map((month, index) => (
                    <option key={index} value={index}>
                      {month}
                    </option>
                  ))}
                </select>
                
                <select
                  value={currentYear}
                  onChange={(e) => handleYearChange(parseInt(e.target.value))}
                  className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-3 py-1 text-white text-sm focus:outline-none focus:ring-1 focus:ring-emerald-400/50 [&>option]:bg-slate-800 [&>option]:text-white"
                >
                  {years.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
              
              <button
                onClick={goToNextMonth}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <ChevronRight className="w-4 h-4 text-white" />
              </button>
            </div>

            {/* Días de la semana */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá', 'Do'].map(day => (
                <div key={day} className="text-white/60 text-sm font-medium text-center p-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Días del calendario */}
            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map(date => {
                const isCurrentMonth = isSameMonth(date, currentMonth);
                const isSelected = selectedDate && isSameDay(date, selectedDate);
                const isTodayDate = isToday(date);

                return (
                  <button
                    key={date.toISOString()}
                    onClick={() => handleDateClick(date)}
                    className={`
                      p-2 text-sm rounded-lg transition-all duration-200 hover:bg-white/10
                      ${!isCurrentMonth ? 'text-white/30' : 'text-white'}
                      ${isSelected ? 'bg-emerald-500/30 text-emerald-100 ring-1 ring-emerald-400/50' : ''}
                      ${isTodayDate && !isSelected ? 'bg-blue-500/20 text-blue-100' : ''}
                    `}
                  >
                    {format(date, 'd')}
                  </button>
                );
              })}
            </div>

            {/* Botón de hoy */}
            <div className="mt-4 pt-3 border-t border-white/20">
              <button
                onClick={() => handleDateClick(new Date())}
                className="w-full p-2 text-sm text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                Hoy - {format(new Date(), 'dd/MM/yyyy')}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
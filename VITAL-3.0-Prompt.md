# 🏥 VITAL 3.0 - Пошаговый промпт для создания улучшенной медицинской платформы

## 📋 Базовый промпт для VITAL 3.0

```
Создай современную медицинскую веб-платформу VITAL 3.0 с максимально упрощенным UX для врачей.

ОСНОВНЫЕ ТРЕБОВАНИЯ:
- Все в одной странице (SPA) - никаких лишних переходов
- Автосохранение каждые 3 секунды
- Переключение между специальностями без потери данных
- База данных MySQL (не PostgreSQL)
- Быстрые шаблоны осмотров с ИИ-подсказками
- Мобильная оптимизация для планшетов
- Время создания осмотра: максимум 5-10 минут

АРХИТЕКТУРА:
Frontend: React 18 + TypeScript + Tailwind CSS + Vite
Backend: Node.js + Express + MySQL + TypeScript
State: Zustand (вместо Context API для лучшей производительности)
UI: Radix UI + shadcn/ui
Icons: Lucide React
Forms: React Hook Form + Zod validation
```

## 🎯 Пошаговые промпты

### 🗄️ Шаг 1: Настройка MySQL базы данных

```
Создай MySQL схему для медицинской платформы VITAL 3.0:

ТАБЛИЦЫ:
1. users (врачи)
   - id, email, password (bcrypt), first_name, last_name
   - specialty, license_number, hospital_id
   - role ('doctor', 'admin'), is_active, last_login
   
2. patients (пациенты)
   - id, first_name, last_name, age, birth_date, gender
   - document_number (unique), email, phone
   - medical_history (JSON: diabetes, hypertension, allergies, etc.)
   
3. anonymous_patients (анонимные пациенты)
   - id, age, gender, birth_date
   
4. examinations (осмотры)
   - id, code (auto P001, P002...), doctor_id
   - patient_id OR anonymous_patient_id
   - specialty, status ('in_progress', 'completed')
   - vital_signs (JSON), physical_exam (JSON)
   - diagnosis, treatment, notes
   - examination_data (JSON для хранения ответов по специальностям)
   - auto_saved_at, completed_at, created_at
   
5. examination_templates (шаблоны осмотров)
   - id, name, specialty, template_data (JSON)
   - is_quick_template, usage_count
   
6. medical_specialties (специальности)
   - id, name, slug, icon, is_active, template_fields (JSON)
   
7. pathologies (патологии МКБ-10)
   - id, code, name_ru, name_en, specialty_id
   - typical_symptoms (JSON), recommendations (JSON)

ИНДЕКСЫ:
- idx_examinations_doctor_date (doctor_id, created_at)
- idx_patients_document (document_number)
- idx_examinations_status (status, created_at)

АВТОСОХРАНЕНИЕ:
- Таблица auto_saves для промежуточного сохранения данных
```

### 🎨 Шаг 2: Создание дизайн-системы

```
Создай дизайн-систему для VITAL 3.0 на базе Tailwind CSS:

ЦВЕТОВАЯ ПАЛИТРА:
primary: '#0066CC' (медицинский синий)
success: '#10B981' (зеленый успех)
warning: '#F59E0B' (желтое предупреждение)
danger: '#EF4444' (красная опасность)
neutral: '#6B7280' (серый нейтральный)

СПЕЦИАЛЬНОСТИ:
cardiology: '#DC2626', neurology: '#7C3AED'
gastroenterology: '#059669', endocrinology: '#D97706'
dermatology: '#EC4899', orthopedics: '#1D4ED8'

КОМПОНЕНТЫ:
1. MedicalWorkspace - основное рабочее место
2. PatientQuickSearch - быстрый поиск пациента
3. SpecialtyTabs - переключатель специальностей
4. VitalSignsPanel - панель жизненных показателей
5. AutoSaveIndicator - индикатор автосохранения
6. QuickTemplateSelector - выбор быстрых шаблонов
7. ExaminationProgress - прогресс осмотра

ТИПОГРАФИКА:
font-primary: 'Inter' (основной)
font-mono: 'JetBrains Mono' (медицинские данные)
text-xs: 12px, text-sm: 14px, text-base: 16px, text-lg: 18px
```

### 🏗️ Шаг 3: Основная архитектура Frontend

```
Создай React приложение VITAL 3.0 со следующей структурой:

src/
├── app/                     # Основное приложение
│   ├── layout.tsx          # Основной layout
│   ├── globals.css         # Глобальные стили
│   └── medical-workspace/  # Главное рабочее место
├── components/
│   ├── ui/                 # Базовые UI компоненты (shadcn/ui)
│   ├── medical/            # Медицинские компоненты
│   │   ├── PatientPanel.tsx
│   │   ├── SpecialtyForms/
│   │   │   ├── CardiologyForm.tsx
│   │   │   ├── NeurologyForm.tsx
│   │   │   └── GastroenterologyForm.tsx
│   │   ├── VitalSigns.tsx
│   │   └── QuickTemplates.tsx
│   └── layout/
│       ├── Sidebar.tsx
│       ├── TopBar.tsx
│       └── AutoSaveStatus.tsx
├── lib/
│   ├── api.ts              # API клиент
│   ├── store.ts            # Zustand store
│   ├── auto-save.ts        # Автосохранение
│   └── medical-utils.ts    # Медицинские утилиты
├── hooks/
│   ├── useAutoSave.ts      # Хук автосохранения
│   ├── usePatientSearch.ts # Поиск пациентов
│   └── useSpecialtyForm.ts # Формы специальностей
└── types/
    ├── medical.ts          # Медицинские типы
    ├── patient.ts          # Типы пациентов
    └── api.ts              # API типы

ОСНОВНЫЕ ПРИНЦИПЫ:
- Все данные в едином store (Zustand)
- Автосохранение каждые 3 секунды
- Ленивая загрузка форм специальностей
- Optimistic updates для лучшего UX
```

### 🚀 Шаг 4: Главное рабочее место врача

```
Создай главный компонент MedicalWorkspace с единым интерфейсом:

LAYOUT:
┌─────────────────────────────────────────────────────────┐
│ 🏥 VITAL 3.0    [🔍 Поиск пациента] [Автосохранено ✓] │
├─────────────────────────────────────────────────────────┤
│ [➕ Новый] [📋 Шаблоны] [👤 Пациент] [📊 Отчет]       │
├─────────────────────────────────────────────────────────┤
│ Левая панель          │ Основная область                │
│ • Быстрые действия   │ ┌─ Информация о пациенте ─┐      │
│ • Недавние пациенты  │ │ Иван Петров, 45 лет      │      │
│ • Шаблоны            │ │ Кардиология              │      │
│ • Специальности:     │ └─────────────────────────┘      │
│   ○ Кардиология     │                                  │
│   ○ Неврология      │ ┌─ Специальность ─┐              │
│   ○ Гастро          │ │ [Кардиология] [Неврология]    │
│ • Жизненные показат. │ └─────────────────────────────┘  │
│   ├ АД: 120/80      │                                  │
│   ├ Пульс: 72       │ ┌─ Форма осмотра ─┐              │
│   └ Темп: 36.6°C    │ │ Жалобы:                      │
│                      │ │ [текстовое поле]             │
│                      │ │                              │
│                      │ │ Объективно:                  │
│                      │ │ [специализированная форма]   │
│                      │ └─────────────────────────────┘  │
├─────────────────────────────────────────────────────────┤
│ Статус: Автосохранено 3 сек назад | Прогресс: 65%      │
└─────────────────────────────────────────────────────────┘

ФУНКЦИОНАЛ:
- Поиск пациента с автодополнением
- Создание нового пациента на лету
- Переключение специальностей без потери данных
- Автосохранение всех изменений
- Быстрые шаблоны для типичных случаев
- Живой превью отчета
- Горячие клавиши (Ctrl+S - сохранить, Ctrl+N - новый)
```

### 🔍 Шаг 5: Система быстрого поиска пациентов

```
Создай компонент PatientQuickSearch с умным поиском:

ФУНКЦИОНАЛ:
- Поиск по имени, фамилии, документу, телефону
- Автодополнение после 2 символов
- Показывает последних 5 пациентов
- Создание нового пациента без перехода
- Анонимный пациент в один клик

ИНТЕРФЕЙС:
```typescript
interface PatientSearchProps {
  onPatientSelect: (patient: Patient | AnonymousPatient) => void;
  onNewPatient: (patient: NewPatient) => void;
}

// Быстрое создание пациента
<PatientQuickCreate
  fields={['firstName', 'lastName', 'age', 'gender']}
  onSave={(patient) => createAndSelect(patient)}
/>

// Анонимный пациент
<AnonymousPatientCreate
  fields={['age', 'gender']}
  onSave={(patient) => createAnonymousAndSelect(patient)}
/>
```

API ENDPOINTS:
GET /api/v3/patients/search?q=иван
GET /api/v3/patients/recent
POST /api/v3/patients/quick-create
POST /api/v3/patients/anonymous
```

### 📋 Шаг 6: Система быстрых шаблонов

```
Создай систему QuickTemplates с ИИ-подсказками:

ШАБЛОНЫ ПО СПЕЦИАЛЬНОСТЯМ:

🫀 КАРДИОЛОГИЯ:
- "Боль в груди" - предзаполняет: ЭКГ, тропонины, анамнез
- "Гипертония контроль" - АД, пульс, жалобы на головную боль
- "Аритмия" - ЭКГ, холтер, жалобы на перебои
- "Профосмотр" - базовые показатели, опросники

🧠 НЕВРОЛОГИЯ:
- "Головная боль" - локализация, характер, триггеры
- "Головокружение" - тесты равновесия, нистагм
- "Инсульт подозрение" - NIHSS, КТ, время начала

СТРУКТУРА ШАБЛОНА:
```typescript
interface QuickTemplate {
  id: string;
  name: string;
  specialty: string;
  icon: string;
  estimatedTime: number; // минуты
  fields: {
    [fieldName: string]: {
      value: string;
      prefilled: boolean;
      required: boolean;
    }
  };
  aiSuggestions: string[]; // ИИ подсказки
}
```

ИСПОЛЬЗОВАНИЕ:
- Выбрал шаблон → форма предзаполнилась → врач дополняет → сохранение
- ИИ анализирует симптомы и предлагает дополнительные обследования
```

### 🔄 Шаг 7: Автосохранение и переключение специальностей

```
Создай систему автосохранения useAutoSave:

```typescript
// Хук автосохранения
export const useAutoSave = (examId: string) => {
  const { examinationData, updateField } = useExaminationStore();
  
  useEffect(() => {
    const interval = setInterval(async () => {
      if (hasUnsavedChanges()) {
        await saveToAPI(examId, examinationData);
        updateLastSaved();
      }
    }, 3000); // каждые 3 секунды
    
    return () => clearInterval(interval);
  }, [examId, examinationData]);
};

// Переключение специальностей
export const useSpecialtySwitch = () => {
  const { examinationData, setSpecialty } = useExaminationStore();
  
  const switchSpecialty = async (newSpecialty: string) => {
    // Сохраняем текущие данные
    await autoSave();
    
    // Загружаем поля новой специальности
    const specialtyFields = await getSpecialtyFields(newSpecialty);
    
    // Переключаемся без потери общих данных
    setSpecialty(newSpecialty, {
      ...examinationData,
      specialtyFields
    });
  };
  
  return { switchSpecialty };
};
```

СТРУКТУРА ДАННЫХ:
```json
{
  "examinationId": "exam_123",
  "patientData": { "name": "Иван", "age": 45 },
  "commonFields": {
    "complaints": "Боль в груди",
    "vitalSigns": { "bp": "120/80", "pulse": 72 }
  },
  "specialtyData": {
    "cardiology": {
      "ecg": "Синусовый ритм",
      "troponins": "Отрицательные"
    },
    "neurology": {
      "reflexes": "Живые",
      "coordination": "Сохранена"
    }
  },
  "autoSavedAt": "2025-09-13T15:30:00Z"
}
```
```

### 💊 Шаг 8: База знаний патологий

```
Создай систему медицинской базы знаний:

ТАБЛИЦА ПАТОЛОГИЙ:
```sql
CREATE TABLE pathologies (
  id INT PRIMARY KEY AUTO_INCREMENT,
  icd10_code VARCHAR(10) UNIQUE,
  name_ru VARCHAR(255),
  name_en VARCHAR(255),
  specialty_id INT,
  typical_symptoms JSON,
  differential_diagnosis JSON,
  recommended_tests JSON,
  treatment_guidelines JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Примеры данных
INSERT INTO pathologies VALUES
(1, 'I20.9', 'Стенокардия неуточненная', 'Angina pectoris, unspecified', 1,
 '["боль за грудиной", "одышка при нагрузке", "слабость"]',
 '["инфаркт миокарда", "межреберная невралгия", "ТЭЛА"]',
 '["ЭКГ", "тропонины", "ЭхоКГ", "стресс-тест"]',
 '["нитраты", "бета-блокаторы", "статины", "аспирин"]'
);
```

КОМПОНЕНТ ПОИСКА ПАТОЛОГИЙ:
```typescript
<PathologySearch
  specialty="cardiology"
  symptoms={["боль в груди", "одышка"]}
  onSelect={(pathology) => {
    // Автоматически заполнить рекомендуемые обследования
    fillRecommendedTests(pathology.recommended_tests);
    // Предложить план лечения
    suggestTreatment(pathology.treatment_guidelines);
  }}
/>
```

ИИ ПОМОЩНИК:
- Анализирует введенные симптомы
- Предлагает возможные диагнозы
- Рекомендует дополнительные обследования
- Подсказывает дифференциальную диагностику
```

### 📱 Шаг 9: Мобильная оптимизация

```
Оптимизируй VITAL 3.0 для планшетов и мобильных устройств:

АДАПТИВНЫЙ ДИЗАЙН:
```css
/* Планшет (768px+) - основной формат */
@media (min-width: 768px) {
  .medical-workspace {
    grid-template-columns: 300px 1fr;
    gap: 24px;
  }
}

/* Мобильный (до 767px) */
@media (max-width: 767px) {
  .medical-workspace {
    grid-template-columns: 1fr;
  }
  
  .sidebar {
    position: fixed;
    bottom: 0;
    height: 80px;
    flex-direction: row;
  }
}
```

TOUCH-FRIENDLY UI:
- Минимальный размер touch-target: 44px
- Крупные кнопки для жизненных показателей
- Swipe-навигация между специальностями
- Голосовой ввод для диктовки

ОФФЛАЙН РЕЖИМ:
```typescript
// Service Worker для оффлайн работы
export const useOfflineMode = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  
  useEffect(() => {
    // Сохранение в localStorage при оффлайне
    if (!isOnline) {
      saveToLocalStorage(examinationData);
    }
    
    // Синхронизация при возврате онлайн
    if (isOnline && hasOfflineData()) {
      syncOfflineData();
    }
  }, [isOnline]);
};
```
```

### 🎨 Шаг 10: Новая стартовая страница

```
Создай новую стартовую страницу "Рабочий стол врача":

ДИЗАЙН:
```tsx
export default function DoctorWorkspace() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <Header doctor={currentDoctor} />
      
      <main className="container mx-auto px-6 py-8">
        {/* Быстрые действия */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <QuickActionCard
            title="Новый осмотр"
            icon={<PlusCircle />}
            onClick={() => router.push('/examination/new')}
            description="Начать осмотр пациента"
            shortcut="Ctrl+N"
          />
          
          <QuickActionCard
            title="Найти пациента"
            icon={<Search />}
            onClick={() => openPatientSearch()}
            description="Поиск в базе пациентов"
            shortcut="Ctrl+F"
          />
          
          <QuickActionCard
            title="Мои отчеты"
            icon={<FileText />}
            onClick={() => router.push('/reports')}
            description="Созданные отчеты"
            shortcut="Ctrl+R"
          />
        </section>

        {/* Сегодняшняя статистика */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard title="Осмотры сегодня" value="12" icon={<Stethoscope />} />
          <StatCard title="Пациенты" value="8" icon={<Users />} />
          <StatCard title="Завершено" value="9" icon={<CheckCircle />} />
          <StatCard title="В процессе" value="3" icon={<Clock />} />
        </section>

        {/* Недавние пациенты и шаблоны */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <RecentPatients />
          <QuickTemplates />
        </div>
      </main>
    </div>
  );
}
```

ФУНКЦИОНАЛ:
- Горячие клавиши для быстрых действий
- Статистика рабочего дня в реальном времени
- Последние пациенты с возможностью продолжить осмотр
- Избранные шаблоны для быстрого доступа
- Уведомления о срочных задачах
```

## 🚀 Итоговый промпт для создания VITAL 3.0

```
СОЗДАЙ МЕДИЦИНСКУЮ ПЛАТФОРМУ VITAL 3.0:

🎯 ГЛАВНАЯ ЦЕЛЬ: Сократить время создания осмотра с 15-20 минут до 5-10 минут

ТЕХНИЧЕСКИЙ СТЕК:
Frontend: React 18 + TypeScript + Vite + Tailwind CSS + shadcn/ui
Backend: Node.js + Express + MySQL + TypeScript
State: Zustand для глобального состояния
API: REST API с автосохранением

КЛЮЧЕВЫЕ ОСОБЕННОСТИ:
1. 🚀 Все в одной странице - никаких переходов между дашбордами
2. 💾 Автосохранение каждые 3 секунды
3. 🔄 Переключение специальностей без потери данных
4. 📋 Быстрые шаблоны осмотров с ИИ-подсказками
5. 🔍 Мгновенный поиск пациентов с автодополнением
6. 📱 Оптимизация для планшетов врачей
7. 🏥 База знаний патологий с рекомендациями

УПРОЩЕННЫЙ UX FLOW:
Старт → Поиск/создание пациента → Выбор шаблона → Заполнение → Автосохранение → Отчет

СПЕЦИАЛЬНОСТИ (15+):
Кардиология, Неврология, Гастроэнтерология, Эндокринология, Дерматология, 
Ортопедия, Офтальмология, ЛОР, Урология, Гинекология, Педиатрия, Психиатрия,
Ревматология, Пульмонология, Онкология

НАЧНИ С:
1. MySQL схема с таблицами для врачей, пациентов, осмотров, шаблонов
2. React компонент MedicalWorkspace с единым интерфейсом
3. Система автосохранения и переключения специальностей
4. Компонент быстрого поиска пациентов
5. Библиотека быстрых шаблонов осмотров

РЕЗУЛЬТАТ: Врач должен иметь возможность провести полноценный осмотр пациента, 
включая заполнение всех необходимых полей по специальности, за 5-10 минут 
с минимальным количеством кликов и переходов.
```

---

## 📚 Дополнительные ресурсы

### 🔧 Готовые компоненты для копирования
- shadcn/ui компоненты: https://ui.shadcn.com/
- Lucide иконки: https://lucide.dev/
- Tailwind CSS утилиты: https://tailwindcss.com/

### 📊 Медицинские стандарты
- МКБ-10 коды: для стандартизации диагнозов
- SNOMED CT: для медицинской терминологии
- HL7 FHIR: для интеграции с другими системами

### 🎨 Дизайн-вдохновение
- Epic MyChart: для UX медицинских систем
- Cerner PowerChart: для workflow врачей
- Apple Health Records: для мобильного UX

Этот промпт и документация должны дать вам все необходимое для создания современной, удобной и эффективной медицинской платформы VITAL 3.0! 🚀
'use client';

import { Check, ChevronLeft, ChevronRight, Home, Lock, Pencil, Plus, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState, type ReactElement } from 'react';

import { GlassCellDecor } from '@/components/shared/make-v81/GlassCellDecor';
import { GlassIconButton } from '@/components/shared/make-v81/GlassIconButton';
import { GlassListCell } from '@/components/shared/make-v81/GlassListCell';
import { GradientTitle } from '@/components/shared/make-v81/GradientTitle';
import { ScreenFrame } from '@/components/shared/make-v81/ScreenFrame';
import { trackEvent } from '@/lib/analytics';
import { useTranslation } from '@/i18n/useTranslation';
import { cn } from '@/lib/utils';

interface Task {
  id: string;
  text: string;
  completed: boolean;
}

const DEFAULT_TASKS: Task[] = [
  { id: '1', text: 'Take a short walk', completed: false },
  { id: '2', text: 'Drink water', completed: false },
  { id: '3', text: 'Breathe deeply', completed: false },
  { id: '4', text: 'Stretch', completed: false },
  { id: '5', text: 'Write one good thing', completed: false },
];
const MAX_EXTRA = 3;
const MAX_TOTAL = DEFAULT_TASKS.length + MAX_EXTRA; // 8

type TasksMap = Record<string, Task[]>;
type EditingState = { day: string; taskId: string } | null;
const PLANNER_STORAGE_KEY = 'blunno:planner:tasks:v1';

function getTodayKey(): string {
  const now = new Date();
  return `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
}

function getWeekDays(dateKey: string, weekOffset: number = 0): Date[] {
  const [year, month, day] = dateKey.split('-').map(Number);
  const base = new Date(year, month - 1, day);
  const dayOfWeek = base.getDay(); // 0 sun
  const monday = new Date(base);
  monday.setDate(base.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
  // Apply week offset
  monday.setDate(monday.getDate() + (weekOffset * 7));
  const week: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    week.push(d);
  }
  return week;
}

const TASK_ACCENTS = ['#7BA89A', '#9D84B7', '#D4A373', '#81B896', '#E07A5F'] as const;

function getWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

function formatMonthTitle(week: Date[], locale: string): string {
  const ref = week[3] ?? week[0];
  return ref.toLocaleString(locale, { month: 'long', year: 'numeric' });
}

function cloneDefaultTasks(): Task[] {
  return DEFAULT_TASKS.map((t) => ({ ...t }));
}

function tasksForDay(tasksMap: TasksMap, dayKey: string): Task[] {
  return tasksMap[dayKey] ?? cloneDefaultTasks();
}

function readPersistedTasksMap(): TasksMap | null {
  if (typeof window === 'undefined') return null;

  try {
    const raw = window.localStorage.getItem(PLANNER_STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== 'object') return null;

    const hydrated = Object.entries(parsed as Record<string, unknown>).reduce<TasksMap>((acc, [key, value]) => {
      if (!Array.isArray(value)) return acc;
      const tasks = value
        .map((item) => {
          if (!item || typeof item !== 'object') return null;
          const candidate = item as Partial<Task>;
          if (typeof candidate.id !== 'string' || typeof candidate.text !== 'string' || typeof candidate.completed !== 'boolean') {
            return null;
          }
          return {
            id: candidate.id,
            text: candidate.text,
            completed: candidate.completed,
          } satisfies Task;
        })
        .filter((task): task is Task => Boolean(task));
      if (tasks.length === 0) return acc;
      acc[key] = tasks;
      return acc;
    }, {});

    return Object.keys(hydrated).length > 0 ? hydrated : null;
  } catch {
    return null;
  }
}

export default function PlannerPage(): ReactElement {
  const router = useRouter();
  const { t, locale } = useTranslation();
  const dateLocale = locale === 'ru' ? 'ru-RU' : 'en-US';
  const [selectedKey, setSelectedKey] = useState<string>(getTodayKey());
  const [weekOffset, setWeekOffset] = useState<number>(0);
  const [tasksMap, setTasksMap] = useState<TasksMap>(() => {
    const today = getTodayKey();
    return { [today]: cloneDefaultTasks() };
  });
  const [newTaskText, setNewTaskText] = useState('');
  const [editing, setEditing] = useState<EditingState>(null);
  const [editValue, setEditValue] = useState('');
  const [showLimitHint, setShowLimitHint] = useState(false);
  const editingRef = useRef<EditingState>(editing);
  const editValueRef = useRef(editValue);
  const newTaskInputRef = useRef<HTMLInputElement>(null);

  const currentTasks = tasksForDay(tasksMap, selectedKey);
  const weekDays = getWeekDays(getTodayKey(), weekOffset);
  const todayKey = getTodayKey();

  useEffect(() => {
    editingRef.current = editing;
  }, [editing]);

  useEffect(() => {
    editValueRef.current = editValue;
  }, [editValue]);

  useEffect(() => {
    const persisted = readPersistedTasksMap();
    if (persisted) {
      // Hydrate planner tasks from localStorage after SSR; one-time client sync.
      // eslint-disable-next-line react-hooks/set-state-in-effect -- localStorage is unavailable during SSR
      setTasksMap(persisted);
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(PLANNER_STORAGE_KEY, JSON.stringify(tasksMap));
  }, [tasksMap]);

  const saveEditFor = useCallback((state: EditingState, value: string) => {
    if (!state) return;
    const nextText = value.trim();
    if (!nextText) return;

    setTasksMap((prev) => {
      const tasks = [...tasksForDay(prev, state.day)];
      const index = tasks.findIndex((task) => task.id === state.taskId);
      if (index < 0) return prev;
      tasks[index] = { ...tasks[index], text: nextText };
      return { ...prev, [state.day]: tasks };
    });
  }, []);

  const commitEditingIfNeeded = useCallback(() => {
    const state = editingRef.current;
    if (!state) return;
    saveEditFor(state, editValueRef.current);
    setEditing(null);
  }, [saveEditFor]);

  const selectDay = (dayKey: string) => {
    commitEditingIfNeeded();
    setSelectedKey(dayKey);
  };

  const goPrevWeek = () => {
    commitEditingIfNeeded();
    setWeekOffset((prev) => {
      const nextOffset = prev - 1;
      const newWeekDays = getWeekDays(getTodayKey(), nextOffset);
      const mondayKey = `${newWeekDays[0].getFullYear()}-${newWeekDays[0].getMonth() + 1}-${newWeekDays[0].getDate()}`;
      setSelectedKey(mondayKey);
      return nextOffset;
    });
  };

  const goNextWeek = () => {
    commitEditingIfNeeded();
    setWeekOffset((prev) => {
      const nextOffset = prev + 1;
      const newWeekDays = getWeekDays(getTodayKey(), nextOffset);
      const mondayKey = `${newWeekDays[0].getFullYear()}-${newWeekDays[0].getMonth() + 1}-${newWeekDays[0].getDate()}`;
      setSelectedKey(mondayKey);
      return nextOffset;
    });
  };

  const addTask = () => {
    const text = newTaskText.trim();
    if (!text) return;

    let added = false;
    setTasksMap((prev) => {
      const tasks = tasksForDay(prev, selectedKey);
      if (tasks.length >= MAX_TOTAL) return prev;

      added = true;
      const newTask: Task = {
        id: Date.now().toString(),
        text,
        completed: false,
      };
      return {
        ...prev,
        [selectedKey]: [...tasks, newTask],
      };
    });

    if (!added) {
      setShowLimitHint(true);
      setTimeout(() => setShowLimitHint(false), 3000);
      return;
    }

    trackEvent('planner_task_add');
    setNewTaskText('');
    newTaskInputRef.current?.blur();
  };

  const toggleCompleted = (index: number) => {
    const tasks = tasksForDay(tasksMap, selectedKey);
    const task = tasks[index];
    if (!task) return;
    const completed = !task.completed;
    trackEvent('planner_task_toggle', { completed });

    setTasksMap((prev) => {
      const dayTasks = [...tasksForDay(prev, selectedKey)];
      const current = dayTasks[index];
      if (!current) return prev;
      dayTasks[index] = { ...current, completed };
      return { ...prev, [selectedKey]: dayTasks };
    });
  };

  const startEdit = (taskId: string, text: string) => {
    setEditing({ day: selectedKey, taskId });
    setEditValue(text);
  };

  const saveEdit = () => {
    saveEditFor(editing, editValue);
    setEditing(null);
  };

  const onKeyDownEdit = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') saveEdit();
    if (e.key === 'Escape') setEditing(null);
  };

  const composerAccent = TASK_ACCENTS[currentTasks.length % TASK_ACCENTS.length];
  const isAtLimit = currentTasks.length >= MAX_TOTAL;

  return (
    <ScreenFrame className="v81-screen--planner">
      <div className="v81-top-bar">
        <GlassIconButton onClick={() => router.back()} icon={ChevronLeft} label={t('nav.back')} />
        <GradientTitle size="lg">{formatMonthTitle(weekDays, dateLocale)}</GradientTitle>
        <GlassIconButton href="/choose" icon={Home} label={t('nav.exit')} />
      </div>

      <div className="mb-3 flex items-center justify-between px-1">
        <button type="button" onClick={goPrevWeek} className="blunno-focus-visible text-white/30 hover:text-white/60" aria-label={t('nav.prevWeek')}>
          <ChevronLeft className="h-4 w-4" strokeWidth={2} />
        </button>
        <span className="text-xs uppercase tracking-widest text-white/40">{t('nav.week')} {getWeekNumber(weekDays[0])}</span>
        <button type="button" onClick={goNextWeek} className="blunno-focus-visible text-white/30 hover:text-white/60" aria-label={t('nav.nextWeek')}>
          <ChevronRight className="h-4 w-4" strokeWidth={2} />
        </button>
      </div>

      <div className="mb-3 flex shrink-0 justify-between gap-1.5">
        {weekDays.map((date, idx) => {
          const dayKey = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
          const isSelected = dayKey === selectedKey;
          const isToday = dayKey === todayKey;
          const isWeekend = idx >= 5;
          const hasActivity = (tasksMap[dayKey] || []).some((t) => t.completed);

          return (
            <button
              key={dayKey}
              type="button"
              onClick={() => selectDay(dayKey)}
              className="v81-planner-day blunno-focus-visible"
              style={{
                background: isSelected
                  ? isWeekend
                    ? 'linear-gradient(135deg, rgba(255,200,80,0.25) 0%, rgba(255,200,80,0.15) 100%)'
                    : 'linear-gradient(135deg, rgba(123,97,255,0.3) 0%, rgba(123,97,255,0.2) 100%)'
                  : isWeekend
                    ? 'linear-gradient(135deg, rgba(255,200,80,0.12) 0%, rgba(255,200,80,0.06) 100%)'
                    : 'rgba(18, 12, 48, 0.6)',
                boxShadow: isSelected
                  ? isWeekend
                    ? '0 0 20px -4px rgba(255,200,80,0.4), inset 0 0 12px rgba(255,200,80,0.2)'
                    : '0 0 20px -4px rgba(123,97,255,0.4), inset 0 0 12px rgba(123,97,255,0.2)'
                  : '0 10px 32px -10px rgba(124, 90, 255, 0.35), inset 0 0 14px rgba(124, 90, 255, 0.1)',
              }}
            >
              <GlassCellDecor
                borderColor={
                  isSelected ? (isWeekend ? '#FFD080' : '#8b6bff') : isWeekend ? 'rgba(255,200,80,0.45)' : '#8b6bff'
                }
              />
              <span className="relative z-10 text-[10px] uppercase tracking-wide" style={{ color: isSelected ? (isWeekend ? 'rgba(255,220,120,0.95)' : 'rgba(196,181,253,0.9)') : isWeekend ? 'rgba(255,200,80,0.55)' : 'rgba(255,255,255,0.55)' }}>
                {date.toLocaleString(dateLocale, { weekday: 'short' })}
              </span>
              <span className="relative z-10 text-lg" style={{ fontWeight: isSelected ? 700 : 400, color: isSelected ? (isWeekend ? '#FFE5A0' : '#FFFFFF') : isWeekend ? 'rgba(255,200,80,0.65)' : 'rgba(255,255,255,0.55)' }}>
                {date.getDate()}
              </span>
              <div className="relative z-10 flex h-[5px] items-center justify-center">
                {(hasActivity || isToday) && (
                  <span className="h-[5px] w-[5px] rounded-full" style={{ background: isSelected ? '#C4B5FD' : 'rgba(123,97,255,0.6)' }} />
                )}
              </div>
            </button>
          );
        })}
      </div>

      <div className="mb-2 flex shrink-0 items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="h-[14px] w-[14px] text-[rgba(196,181,253,0.6)]" strokeWidth={1.5} />
          <span className="text-[13px] uppercase tracking-wide text-[rgba(196,181,253,0.55)]">{t('planner.today')}</span>
        </div>
        <span className="text-xs text-white/40">{currentTasks.length} {t('planner.tasks')}</span>
      </div>

      <div className="v81-scroll-area mb-3 v81-glass-cell-list">
        {currentTasks.map((task, idx) => {
          const accent = TASK_ACCENTS[idx % TASK_ACCENTS.length];
          return (
            <GlassListCell
              key={task.id}
              as="div"
              accentColor={accent}
              opacity={task.completed ? 0.5 : 1}
            >
              <div className="relative z-10 flex min-w-0 flex-1 items-center">
                {editing && editing.day === selectedKey && editing.taskId === task.id ? (
                  <input
                    type="text"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onBlur={saveEdit}
                    onKeyDown={onKeyDownEdit}
                    autoFocus
                    maxLength={60}
                    className="min-w-0 flex-1 rounded-lg border border-white/15 bg-black/30 px-2 py-1.5 text-base text-white outline-none"
                    style={{ minHeight: '44px', fontSize: '16px' }}
                  />
                ) : (
                  <button
                    type="button"
                    onClick={() => startEdit(task.id, task.text)}
                    className={cn('min-w-0 flex-1 text-left text-[15px] font-semibold text-white/90', task.completed && 'line-through')}
                  >
                    {task.text}
                  </button>
                )}
              </div>
              <div className="relative z-10 ml-3 flex shrink-0 items-center gap-2">
                <button type="button" onClick={() => startEdit(task.id, task.text)} className="blunno-focus-visible flex h-8 w-8 items-center justify-center rounded-full bg-black/30" aria-label={t('planner.edit')}>
                  <Pencil className="h-[13px] w-[13px]" style={{ color: accent }} strokeWidth={2} />
                </button>
                <button
                  type="button"
                  onClick={() => toggleCompleted(idx)}
                  className="blunno-focus-visible flex h-8 w-8 items-center justify-center rounded-full border"
                  style={{
                    background: task.completed ? accent : 'rgba(18,12,48,0.5)',
                    borderColor: accent,
                    boxShadow: task.completed ? `0 0 12px ${accent}` : 'none',
                  }}
                  aria-label={task.completed ? t('planner.uncomplete') : t('planner.complete')}
                >
                  {task.completed && <Check className="h-4 w-4 text-[#120F25]" strokeWidth={3} />}
                </button>
              </div>
            </GlassListCell>
          );
        })}

        {showLimitHint && (
          <p className="text-center text-xs text-[var(--v81-theme-gold)] max-w-[280px] mx-auto leading-relaxed">
            {t('planner.limitHint', { max: MAX_TOTAL })}
          </p>
        )}

        <GlassListCell
          as="div"
          accentColor={composerAccent}
          showAccentBar={!isAtLimit}
          opacity={isAtLimit ? 0.55 : 0.85}
          className={cn(!isAtLimit && 'v81-planner-composer-dashed')}
        >
          <div className="relative z-10 flex min-w-0 flex-1 items-center gap-3">
            <div
              className="v81-planner-composer-icon"
              style={{
                borderColor: composerAccent,
                borderStyle: isAtLimit ? 'solid' : 'dashed',
                opacity: isAtLimit ? 0.5 : 0.7,
              }}
              aria-hidden
            >
              {isAtLimit ? (
                <Lock className="h-3.5 w-3.5" style={{ color: composerAccent }} strokeWidth={2} />
              ) : (
                <Plus className="h-3.5 w-3.5" style={{ color: composerAccent }} strokeWidth={2.5} />
              )}
            </div>
            <input
              ref={newTaskInputRef}
              type="text"
              value={newTaskText}
              onChange={(e) => setNewTaskText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addTask();
                }
              }}
              placeholder={isAtLimit ? t('planner.maxTasks', { max: MAX_TOTAL }) : t('planner.addTask')}
              className="v81-planner-composer-inline-input blunno-focus-visible"
              maxLength={60}
              disabled={isAtLimit}
              aria-label="Add a new task"
            />
          </div>
          <div className="relative z-10 ml-3 flex shrink-0 items-center">
            <button
              type="button"
              onClick={addTask}
              disabled={isAtLimit || !newTaskText.trim()}
              className="v81-planner-composer-submit-inline blunno-focus-visible"
              style={{
                borderColor: composerAccent,
                background: newTaskText.trim() && !isAtLimit ? `${composerAccent}40` : 'rgba(18,12,48,0.5)',
                boxShadow: newTaskText.trim() && !isAtLimit ? `0 0 12px ${composerAccent}55` : 'none',
              }}
              aria-label="Add Task"
            >
              <Plus className="h-4 w-4 text-white/90" strokeWidth={2.5} />
            </button>
          </div>
        </GlassListCell>
      </div>
    </ScreenFrame>
  );
}

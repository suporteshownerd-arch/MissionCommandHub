import { useState, useEffect } from 'react'
import { Plus, MoreHorizontal, User, GripVertical, Clock, AlertCircle } from 'lucide-react'

interface Task {
  id: string
  title: string
  description?: string
  assignee?: string
  priority: 'low' | 'medium' | 'high'
  dueDate?: string
  tags: string[]
  column: string
}

const columns = [
  { id: 'backlog', name: 'Backlog', color: 'bg-openclaw-textMuted' },
  { id: 'todo', name: 'To Do', color: 'bg-openclaw-primary' },
  { id: 'in_progress', name: 'In Progress', color: 'bg-openclaw-warning' },
  { id: 'review', name: 'Review', color: 'bg-openclaw-accent' },
  { id: 'done', name: 'Done', color: 'bg-openclaw-success' }
]

const STORAGE_KEY = 'openclaw-kanban-tasks'

function loadTasks(): Task[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) return JSON.parse(stored)
  } catch (e) {
    console.warn('Failed to load tasks:', e)
  }
  return [
    { id: '1', title: 'Implementar autenticação OAuth2', description: 'Adicionar login social', priority: 'high', tags: ['auth', 'backend'], column: 'todo', assignee: 'Dev' },
    { id: '2', title: 'Revisar PR #42', description: 'Code review do novo componente', priority: 'medium', tags: ['review'], column: 'review', assignee: 'QA' },
    { id: '3', title: 'Deploy staging', description: 'Deploy para ambiente de staging', priority: 'high', tags: ['devops', 'deploy'], column: 'in_progress', assignee: 'DevOps' },
    { id: '4', title: 'Atualizar documentação', description: 'Docs da API v2', priority: 'low', tags: ['docs'], column: 'backlog', assignee: 'Tech Writer' },
    { id: '5', title: 'Criar testes unitários', description: 'Cobertura para auth module', priority: 'medium', tags: ['tests', 'coverage'], column: 'todo', assignee: 'QA' },
    { id: '6', title: 'Configurar CI/CD', description: 'Pipeline completo', priority: 'high', tags: ['devops', 'ci'], column: 'done', assignee: 'DevOps' },
  ]
}

export default function KanbanView() {
  const [tasks, setTasks] = useState<Task[]>(loadTasks)
  const [newTaskColumn, setNewTaskColumn] = useState<string | null>(null)
  const [newTaskTitle, setNewTaskTitle] = useState('')

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
  }, [tasks])

  const getTasksByColumn = (column: string) => tasks.filter(t => t.column === column)

  const addTask = (column: string) => {
    if (!newTaskTitle.trim()) return
    const newTask: Task = { id: Date.now().toString(), title: newTaskTitle, priority: 'medium', tags: [], column }
    setTasks([...tasks, newTask])
    setNewTaskTitle('')
    setNewTaskColumn(null)
  }

  const deleteTask = (taskId: string) => {
    setTasks(tasks.filter(t => t.id !== taskId))
  }

  const priorityColor = (p: string) => {
    switch (p) {
      case 'high': return 'text-openclaw-error bg-openclaw-error/10'
      case 'medium': return 'text-openclaw-warning bg-openclaw-warning/10'
      case 'low': return 'text-openclaw-textMuted bg-openclaw-textMuted/10'
      default: return ''
    }
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-semibold text-openclaw-text">Task Board</h2>
          <p className="text-sm text-openclaw-textMuted">{tasks.length} tarefas</p>
        </div>
      </div>

      <div className="flex-1 overflow-x-auto">
        <div className="flex gap-4 min-w-max pb-4">
          {columns.map(column => (
            <div key={column.id} className="w-72 flex flex-col">
              <div className="flex items-center justify-between mb-3 px-1">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${column.color}`} />
                  <span className="font-medium text-openclaw-text">{column.name}</span>
                  <span className="text-xs text-openclaw-textMuted bg-openclaw-bg px-2 py-0.5 rounded-full">{getTasksByColumn(column.id).length}</span>
                </div>
                <button className="p-1 rounded hover:bg-openclaw-cardHover text-openclaw-textMuted"><MoreHorizontal className="w-4 h-4" /></button>
              </div>

              <div className="flex-1 space-y-2 min-h-[200px]">
                {getTasksByColumn(column.id).map(task => (
                  <div key={task.id} className="glass rounded-lg p-3 border border-openclaw-border hover:border-openclaw-primary/30 transition-all cursor-grab active:cursor-grabbing group">
                    <div className="flex items-start gap-2">
                      <GripVertical className="w-4 h-4 text-openclaw-textMuted mt-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm text-openclaw-text font-medium">{task.title}</p>
                          <button onClick={() => deleteTask(task.id)} className="p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-openclaw-error/20 text-openclaw-textMuted hover:text-openclaw-error transition-all"><AlertCircle className="w-3 h-3" /></button>
                        </div>
                        {task.description && <p className="text-xs text-openclaw-textMuted mt-1 line-clamp-2">{task.description}</p>}
                        <div className="flex items-center gap-2 mt-2 flex-wrap">
                          <span className={`px-2 py-0.5 rounded text-xs ${priorityColor(task.priority)}`}>{task.priority}</span>
                          {task.tags.map(tag => <span key={tag} className="px-2 py-0.5 rounded text-xs bg-openclaw-bg border border-openclaw-border text-openclaw-textMuted">{tag}</span>)}
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-1 text-xs text-openclaw-textMuted"><User className="w-3 h-3" />{task.assignee || 'Unassigned'}</div>
                          {task.dueDate && <div className="flex items-center gap-1 text-xs text-openclaw-textMuted"><Clock className="w-3 h-3" />{task.dueDate}</div>}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {newTaskColumn === column.id ? (
                  <div className="glass rounded-lg p-3 border border-openclaw-primary">
                    <input autoFocus type="text" value={newTaskTitle} onChange={e => setNewTaskTitle(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') addTask(column.id); if (e.key === 'Escape') { setNewTaskColumn(null); setNewTaskTitle('') } }} placeholder="Título da tarefa..." className="w-full bg-openclaw-bg border-none rounded px-2 py-1 text-sm text-openclaw-text placeholder-openclaw-textMuted focus:outline-none" />
                    <div className="flex gap-2 mt-2">
                      <button onClick={() => addTask(column.id)} className="flex-1 px-2 py-1 rounded bg-openclaw-primary text-white text-xs">Adicionar</button>
                      <button onClick={() => { setNewTaskColumn(null); setNewTaskTitle('') }} className="px-2 py-1 rounded bg-openclaw-bg text-openclaw-textMuted text-xs">Cancelar</button>
                    </div>
                  </div>
                ) : (
                  <button onClick={() => setNewTaskColumn(column.id)} className="w-full p-2 rounded-lg border border-dashed border-openclaw-border text-openclaw-textMuted hover:border-openclaw-primary hover:text-openclaw-primary transition-colors text-sm flex items-center justify-center gap-1"><Plus className="w-4 h-4" />Adicionar tarefa</button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
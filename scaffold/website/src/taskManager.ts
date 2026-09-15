import { t } from './i18n'
import { Task, TaskFilter } from './types'

export class TaskManager {
  private tasks: Task[] = []
  private filter: TaskFilter = 'all'
  private nextId = 1

  constructor() {
    this.loadFromStorage()
  }

  /**
   * Adds a new task to the collection and re-renders the UI.
   */
  addTask(text: string, priority: 'low' | 'medium' | 'high') {
    const task: Task = {
      id: this.nextId++,
      text,
      priority,
      completed: false,
      createdAt: new Date()
    }

    this.tasks.push(task)
    this.saveToStorage()
    this.render()
  }

  /**
   * Toggles the completion state for a given task by id.
   */
  toggleTask(id: number) {
    const task = this.tasks.find((t) => t.id === id)
    if (task) {
      task.completed = !task.completed
      this.saveToStorage()
      this.render()
    }
  }

  /**
   * Removes a task from the collection and refreshes the list.
   */
  deleteTask(id: number) {
    this.tasks = this.tasks.filter((t) => t.id !== id)
    this.saveToStorage()
    this.render()
  }

  /**
   * Sets the current task filter and refreshes the render.
   */
  setFilter(filter: TaskFilter) {
    this.filter = filter
    this.render()
  }

  /**
   * Renders the currently visible tasks and updates summary counters.
   */
  render() {
    const taskList = document.getElementById('tasks')
    if (!taskList) return

    let filteredTasks = this.tasks
    if (this.filter === 'active') {
      filteredTasks = this.tasks.filter((task) => !task.completed)
    } else if (this.filter === 'completed') {
      filteredTasks = this.tasks.filter((task) => task.completed)
    }

    taskList.innerHTML = ''

    filteredTasks.forEach((task) => {
      const li = document.createElement('li')
      li.className = `task-item ${task.completed ? 'completed' : ''}`

      const content = document.createElement('div')
      content.className = 'task-content'

      const checkbox = document.createElement('input')
      checkbox.type = 'checkbox'
      checkbox.className = 'task-checkbox'
      checkbox.checked = task.completed
      checkbox.addEventListener('change', () => this.toggleTask(task.id))

      const text = document.createElement('span')
      text.className = 'task-text'
      text.textContent = task.text

      const badge = document.createElement('span')
      badge.className = `priority-badge priority-${task.priority}`
      badge.textContent = task.priority.toUpperCase()

      content.appendChild(checkbox)
      content.appendChild(text)
      content.appendChild(badge)

      const deleteBtn = document.createElement('button')
      deleteBtn.className = 'delete-btn'
      deleteBtn.textContent = t('button.delete')
      deleteBtn.addEventListener('click', () => this.deleteTask(task.id))

      li.appendChild(content)
      li.appendChild(deleteBtn)
      taskList.appendChild(li)
    })

    this.updateStats()
  }

  private updateStats() {
    const totalCount = document.getElementById('total-count')
    const completedCount = document.getElementById('completed-count')

    if (totalCount) totalCount.textContent = String(this.tasks.length)
    if (completedCount) {
      completedCount.textContent = String(this.tasks.filter((task) => task.completed).length)
    }
  }

  private saveToStorage() {
    localStorage.setItem('tasks', JSON.stringify(this.tasks))
  }

  private loadFromStorage() {
    try {
      const stored = localStorage.getItem('tasks')
      if (!stored) {
        return
      }

      const parsed = JSON.parse(stored) as Task[]
      if (!Array.isArray(parsed)) {
        this.tasks = []
        this.nextId = 1
        return
      }

      this.tasks = parsed.filter(
        (task) => task && typeof task.id === 'number' && typeof task.text === 'string'
      )
      this.nextId = this.tasks.reduce((max, task) => Math.max(max, task.id), 0) + 1
    } catch {
      this.tasks = []
      this.nextId = 1
    }
  }

  /**
   * Returns the current collection of tasks.
   */
  getTasks() {
    return this.tasks
  }

  /**
   * Returns the number of completed tasks.
   */
  getCompletedCount() {
    return this.tasks.filter((task) => task.completed).length
  }
}

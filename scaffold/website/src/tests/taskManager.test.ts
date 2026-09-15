import { beforeEach, describe, expect, it, vi } from 'vitest'
import { TaskManager } from '../taskManager'

describe('TaskManager', () => {
  let manager: TaskManager

  beforeEach(() => {
    localStorage.clear()
    document.body.innerHTML = `
      <div class="container">
        <header>
          <h1>My Task Manager</h1>
          <div class="language-selector">
            <button id="lang-en" class="active">English</button>
            <button id="lang-fr">Français</button>
          </div>
        </header>
        <main>
          <section class="add-task">
            <h2>Add New Task</h2>
            <form id="task-form">
              <input type="text" id="task-input" placeholder="Enter task description" required>
              <select id="priority-select">
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </select>
              <button type="submit">Add Task</button>
            </form>
          </section>
          <section class="task-list">
            <div class="filter-buttons">
              <button class="filter-btn active" data-filter="all">All Tasks</button>
              <button class="filter-btn" data-filter="active">Active</button>
              <button class="filter-btn" data-filter="completed">Completed</button>
            </div>
            <ul id="tasks"></ul>
            <div class="stats">
              <p>Total tasks: <span id="total-count">0</span></p>
              <p>Completed: <span id="completed-count">0</span></p>
            </div>
          </section>
        </main>
        <footer>
          <p>Built with TypeScript</p>
        </footer>
      </div>
    `
    manager = new TaskManager()
  })

  it('adds a task and persists it', () => {
    manager.addTask('Write tests', 'high')

    expect(manager.getTasks()).toHaveLength(1)
    expect(manager.getTasks()[0]).toMatchObject({
      text: 'Write tests',
      priority: 'high',
      completed: false
    })
    expect(JSON.parse(localStorage.getItem('tasks') || '[]')).toHaveLength(1)
  })

  it('toggles completion state for an existing task', () => {
    manager.addTask('Review PR', 'medium')

    manager.toggleTask(1)

    expect(manager.getTasks()[0].completed).toBe(true)
    expect(manager.getCompletedCount()).toBe(1)
  })

  it('deletes a task and re-renders stats', () => {
    manager.addTask('First task', 'low')
    manager.addTask('Second task', 'high')

    manager.deleteTask(1)

    expect(manager.getTasks()).toHaveLength(1)
    expect(manager.getTasks()[0].text).toBe('Second task')
  })

  it('updates the current filter and renders only matching tasks', () => {
    manager.addTask('Done task', 'low')
    manager.addTask('Active task', 'medium')
    manager.toggleTask(1)

    manager.setFilter('active')
    manager.render()

    const items = document.querySelectorAll('.task-item')
    expect(items).toHaveLength(1)
    expect(items[0].textContent).toContain('Active task')
  })

  it('renders completed tasks and updates counters', () => {
    manager.addTask('Completed item', 'low')
    manager.addTask('Unfinished item', 'high')
    manager.toggleTask(1)

    manager.setFilter('completed')
    manager.render()

    expect(document.getElementById('completed-count')?.textContent).toBe('1')
    expect(document.getElementById('total-count')?.textContent).toBe('2')
    expect(document.querySelectorAll('.task-item')).toHaveLength(1)
  })

  it('saves and restores tasks from storage', () => {
    manager.addTask('Persisted item', 'low')

    const restored = new TaskManager()

    expect(restored.getTasks()).toHaveLength(1)
    expect(restored.getTasks()[0].text).toBe('Persisted item')
    expect(restored.getCompletedCount()).toBe(0)
  })

  it('persists tasks via saveToStorage and reloads them', () => {
    manager.addTask('Stored item', 'medium')

    const saved = JSON.parse(localStorage.getItem('tasks') || '[]')
    expect(saved).toHaveLength(1)

    const nextManager = new TaskManager()
    expect(nextManager.getTasks()).toHaveLength(1)
    expect(nextManager.getTasks()[0].text).toBe('Stored item')
  })

  it('loads stored tasks safely when the cache is empty', () => {
    ;(manager as any).loadFromStorage()
    expect(manager.getTasks()).toHaveLength(0)
  })

  it('initializes the app, handles form submission, and switches language', async () => {
    vi.resetModules()
    document.body.innerHTML = `
      <div class="container">
        <header>
          <h1>My Task Manager</h1>
          <div class="language-selector">
            <button id="lang-en" class="active">English</button>
            <button id="lang-fr">Français</button>
          </div>
        </header>
        <main>
          <section class="add-task">
            <h2>Add New Task</h2>
            <form id="task-form">
              <input type="text" id="task-input" placeholder="Enter task description" required>
              <select id="priority-select">
                <option value="low">Low Priority</option>
                <option value="medium" selected>Medium Priority</option>
                <option value="high">High Priority</option>
              </select>
              <button type="submit">Add Task</button>
            </form>
          </section>
          <section class="task-list">
            <div class="filter-buttons">
              <button class="filter-btn active" data-filter="all">All Tasks</button>
              <button class="filter-btn" data-filter="active">Active</button>
              <button class="filter-btn" data-filter="completed">Completed</button>
            </div>
            <ul id="tasks"></ul>
            <div class="stats">
              <p>Total tasks: <span id="total-count">0</span></p>
              <p>Completed: <span id="completed-count">0</span></p>
            </div>
          </section>
        </main>
        <footer>
          <p>Built with TypeScript</p>
        </footer>
      </div>
    `

    await import('../main')
    await Promise.resolve()

    const form = document.getElementById('task-form') as HTMLFormElement
    const input = document.getElementById('task-input') as HTMLInputElement
    input.value = 'Ship it'
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))

    expect(document.querySelectorAll('.task-item')).toHaveLength(1)
    expect(document.getElementById('total-count')?.textContent).toBe('1')

    const frButton = document.getElementById('lang-fr') as HTMLButtonElement
    frButton.click()

    expect(document.querySelector('header h1')?.textContent).toBe('Mon Gestionnaire de Tâches')
    expect(document.querySelector('.add-task h2')?.textContent).toBe('Ajouter une Nouvelle Tâche')
  })
})

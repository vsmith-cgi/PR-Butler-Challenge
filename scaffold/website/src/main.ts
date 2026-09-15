import { TaskManager } from './taskManager'
import { loadTranslations, setLanguage, t } from './i18n'
import { TaskFilter } from './types'
import './styles.css'

let taskManager: TaskManager

/**
 * Initializes the app and wires up the required event listeners.
 */
async function init() {
  await loadTranslations()
  taskManager = new TaskManager()
  applyTranslations()
  setupEventListeners()
  taskManager.render()
}

/**
 * Updates visible UI labels to match the selected language.
 */
function applyTranslations() {
  const appTitle = document.querySelector('header h1')
  if (appTitle) appTitle.textContent = t('app.title')

  const addTaskHeading = document.querySelector('.add-task h2')
  if (addTaskHeading) addTaskHeading.textContent = t('task.add')

  const taskInput = document.getElementById('task-input') as HTMLInputElement | null
  if (taskInput) taskInput.placeholder = t('task.placeholder')

  const submitButton = document.querySelector('#task-form button[type="submit"]') as HTMLButtonElement | null
  if (submitButton) submitButton.textContent = t('button.add')

  const filterButtons = document.querySelectorAll('.filter-btn')
  filterButtons.forEach((button) => {
    const filter = button.getAttribute('data-filter') as TaskFilter | null
    if (filter === 'all') button.textContent = t('filter.all')
    if (filter === 'active') button.textContent = t('filter.active')
    if (filter === 'completed') button.textContent = t('filter.completed')
  })

  const totalLabel = document.querySelector('.stats p:first-child')
  if (totalLabel) totalLabel.innerHTML = `${t('stats.total')}: <span id="total-count">0</span>`

  const completedLabel = document.querySelector('.stats p:last-child')
  if (completedLabel) completedLabel.innerHTML = `${t('stats.completed')}: <span id="completed-count">0</span>`

  const footerText = document.querySelector('footer p')
  if (footerText) footerText.textContent = t('footer.text')
}

/**
 * Registers all user interaction handlers for the task UI.
 */
function setupEventListeners() {
  const form = document.getElementById('task-form') as HTMLFormElement | null
  const langEnBtn = document.getElementById('lang-en')
  const langFrBtn = document.getElementById('lang-fr')

  form?.addEventListener('submit', handleSubmit)
  langEnBtn?.addEventListener('click', () => switchLanguage('en'))
  langFrBtn?.addEventListener('click', () => switchLanguage('fr'))

  const filterBtns = document.querySelectorAll('.filter-btn')
  filterBtns.forEach((btn) => {
    btn.addEventListener('click', (event) => {
      const target = event.currentTarget as HTMLElement
      const filter = target.dataset.filter as TaskFilter | undefined
      if (!filter || !taskManager) return

      document.querySelectorAll('.filter-btn').forEach((button) => button.classList.remove('active'))
      target.classList.add('active')
      taskManager.setFilter(filter)
    })
  })
}

/**
 * Handles the task form submission and validates the input before adding a task.
 */
function handleSubmit(e: Event) {
  e.preventDefault()

  const input = document.getElementById('task-input') as HTMLInputElement | null
  const select = document.getElementById('priority-select') as HTMLSelectElement | null

  if (!input || !select || !taskManager) return

  const trimmedValue = input.value.trim()
  if (!trimmedValue) return

  taskManager.addTask(trimmedValue, select.value as 'low' | 'medium' | 'high')
  input.value = ''
}

/**
 * Switches the active language and refreshes the UI labels.
 */
function switchLanguage(lang: string) {
  setLanguage(lang)
  applyTranslations()

  document.querySelectorAll('.language-selector button').forEach((btn) => {
    btn.classList.remove('active')
  })

  const activeBtn = document.getElementById(`lang-${lang}`)
  activeBtn?.classList.add('active')

  taskManager?.render()
}

init().catch((error) => {
  console.error('Task Manager initialization failed', error)
})

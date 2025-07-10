// HTML öğelerini seç
const taskInput = document.getElementById('task-input');
const addTaskBtn = document.getElementById('add-task-btn');
const taskList = document.getElementById('task-list');
const darkModeBtn = document.getElementById('toggle-dark-mode');

// Sayfa açıldığında yapılacaklar
window.addEventListener('DOMContentLoaded', () => {
  loadTasks();
  loadDarkMode();

  // Filtre butonlarına event ata
  document.querySelectorAll('#filter-buttons button').forEach(button => {
    button.addEventListener('click', () => {
      filterTasks(button.getAttribute('data-filter'));
    });
  });
});

// Görev ekle butonu ve enter tuşu
addTaskBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', e => {
  if (e.key === 'Enter') addTask();
});

// Dark mode butonu
darkModeBtn.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  localStorage.setItem('darkMode', document.body.classList.contains('dark'));
});

// Görev ekleme fonksiyonu
function addTask() {
  const taskText = taskInput.value.trim();
  if (taskText === "") {
    alert("Lütfen bir görev girin.");
    return;
  }
  createTaskElement(taskText);
  saveTasksToLocalStorage();
  taskInput.value = "";
}

// Görev elemanı oluşturma
function createTaskElement(taskText, completed = false, date = null) {
  const li = document.createElement('li');

  const taskSpan = document.createElement('span');
  taskSpan.textContent = taskText;

  const dateSpan = document.createElement('small');
  const createdAt = date ? new Date(date) : new Date();
  dateSpan.textContent = ` (${createdAt.toLocaleString()})`;
  dateSpan.style.fontSize = "10px";
  dateSpan.style.color = "#888";

  if (completed) li.classList.add('completed');

  li.appendChild(taskSpan);
  li.appendChild(dateSpan);

  li.addEventListener('click', () => {
    li.classList.toggle('completed');
    saveTasksToLocalStorage();
  });

  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = "Sil";
  deleteBtn.style.marginLeft = "10px";
  deleteBtn.addEventListener('click', e => {
    e.stopPropagation(); // Sil butonuna tıklayınca tamamlandı togglenmesin
    taskList.removeChild(li);
    saveTasksToLocalStorage();
  });

  li.appendChild(deleteBtn);
  taskList.appendChild(li);
}

// Görevleri localStorage’a kaydet
function saveTasksToLocalStorage() {
  const tasks = [];
  document.querySelectorAll('#task-list li').forEach(li => {
    const taskText = li.querySelector('span')?.textContent || '';
    const dateText = li.querySelector('small')?.textContent || '';
    const date = new Date(dateText.replace(/[()]/g, '')).toISOString();
    tasks.push({
      text: taskText,
      completed: li.classList.contains('completed'),
      date: date
    });
  });
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Görevleri localStorage’dan yükle
function loadTasks() {
  const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
  savedTasks.forEach(task => {
    createTaskElement(task.text, task.completed, task.date);
  });
}

// Görev filtreleme
function filterTasks(filter) {
  document.querySelectorAll('#task-list li').forEach(li => {
    const isCompleted = li.classList.contains('completed');
    if (filter === 'all') {
      li.style.display = 'flex';
    } else if (filter === 'completed' && isCompleted) {
      li.style.display = 'flex';
    } else if (filter === 'active' && !isCompleted) {
      li.style.display = 'flex';
    } else {
      li.style.display = 'none';
    }
  });
}

// Dark mode durumunu yükle
function loadDarkMode() {
  const dark = localStorage.getItem('darkMode') === 'true';
  if (dark) document.body.classList.add('dark');
}

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTasks(filter = "all") {
  const list = document.getElementById("taskList");
  list.innerHTML = "";

  let filteredTasks = tasks;
  if (filter === "completed") {
    filteredTasks = tasks.filter(task => task.completed);
  } else if (filter === "pending") {
    filteredTasks = tasks.filter(task => !task.completed);
  }

  // Sort by newest
  filteredTasks = filteredTasks.sort((a, b) => b.id - a.id);

  filteredTasks.forEach(task => {
    const li = document.createElement("li");
    li.className = task.completed ? "completed" : "";
    li.innerHTML = `
      <div>
        <strong>${task.text}</strong><br>
        <small>${task.time}</small>
      </div>
      <div class="task-buttons">
        <button onclick="toggleTask(${task.id})">✓</button>
        <button onclick="deleteTask(${task.id})">🗑</button>
      </div>
    `;
    list.appendChild(li);
  });

  // Task summary
  const summary = document.getElementById("summary");
  summary.innerText = `Total: ${tasks.length} | Completed: ${tasks.filter(t => t.completed).length} | Pending: ${tasks.filter(t => !t.completed).length}`;
}

function addTask() {
  const input = document.getElementById("taskInput");
  const text = input.value.trim();
  if (!text) return;

  const formattedText = text.charAt(0).toUpperCase() + text.slice(1);

  const task = {
    id: Date.now(),
    text: formattedText,
    completed: false,
    time: new Date().toLocaleString()
  };

  tasks.push(task);
  saveTasks();
  renderTasks();
  input.value = "";
}

function handleKeyPress(e) {
  if (e.key === "Enter") {
    addTask();
  }
}

function deleteTask(id) {
  tasks = tasks.filter(task => task.id !== id);
  saveTasks();
  renderTasks();
}

function toggleTask(id) {
  tasks = tasks.map(task => {
    if (task.id === id) {
      task.completed = !task.completed;
    }
    return task;
  });
  saveTasks();
  renderTasks();
}

function filterTasks(filter) {
  renderTasks(filter);
}

function clearAllTasks() {
  if (confirm("Are you sure you want to delete all tasks?")) {
    tasks = [];
    saveTasks();
    renderTasks();
  }
}

renderTasks();

// Smart Study Planner Module (Enhanced Version)
const Planner = {
  tasks: [],
  deleteTargetId: null,
  activeSection: 'ALL', // 'ALL', 'TODAY', 'UPCOMING'
  searchQuery: '',
  filterSubject: 'ALL',
  filterPriority: 'ALL',
  sortBy: 'DUE_ASC',

  // Initial Seed Data if Local Storage is Empty
  defaultTasks: [
    {
      Task_ID: 1,
      Student_ID: "STU1001",
      Task_Name: "Complete DAA Assignment",
      Subject: "DAA",
      Priority: "High",
      Due_Date: "2026-09-22",
      Description: "Solve graph algorithm and dynamic programming problems.",
      Status: "Completed",
      Created_Date: "2026-09-15"
    },
    {
      Task_ID: 2,
      Student_ID: "STU1001",
      Task_Name: "Revise Operating System Module 2",
      Subject: "Operating System",
      Priority: "Medium",
      Due_Date: "2026-09-23",
      Description: "Review process synchronization, semaphores & deadlocks.",
      Status: "Completed",
      Created_Date: "2026-09-16"
    },
    {
      Task_ID: 3,
      Student_ID: "STU1001",
      Task_Name: "Study Mathematics for 2 Hours",
      Subject: "Mathematics",
      Priority: "High",
      Due_Date: "2026-09-23",
      Description: "Practice linear algebra, matrix transformations & calculus.",
      Status: "Completed",
      Created_Date: "2026-09-17"
    },
    {
      Task_ID: 4,
      Student_ID: "STU1001",
      Task_Name: "Submit Cybersecurity Lab Record",
      Subject: "Cybersecurity",
      Priority: "Medium",
      Due_Date: "2026-09-26",
      Description: "Write lab record for RSA encryption and network scanning.",
      Status: "Pending",
      Created_Date: "2026-09-18"
    },
    {
      Task_ID: 5,
      Student_ID: "STU1001",
      Task_Name: "Practice Decision Tree Questions",
      Subject: "CGVR",
      Priority: "Low",
      Due_Date: "2026-09-27",
      Description: "3D projection mathematical transformation formulas.",
      Status: "Pending",
      Created_Date: "2026-09-19"
    }
  ],

  init: function() {
    this.loadTasks();
    this.bindEvents();
    this.render();
  },

  loadTasks: function() {
    try {
      const stored = localStorage.getItem('eduai_study_tasks');
      if (stored) {
        this.tasks = JSON.parse(stored);
      } else {
        this.tasks = [...this.defaultTasks];
        this.saveTasks();
      }
    } catch (e) {
      console.error("Error loading tasks from localStorage:", e);
      this.tasks = [...this.defaultTasks];
    }
  },

  saveTasks: function() {
    try {
      localStorage.setItem('eduai_study_tasks', JSON.stringify(this.tasks));
    } catch (e) {
      console.error("Error saving tasks to localStorage:", e);
    }
  },

  getStudentId: function() {
    if (typeof Auth !== 'undefined' && Auth.currentUser && Auth.currentUser.email) {
      return Auth.currentUser.email;
    }
    return 'STU1001';
  },

  getTodayDateString: function() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  },

  // Modal Methods
  openAddModal: function() {
    const modal = document.getElementById('task-modal');
    if (!modal) return;

    document.getElementById('task-modal-title').innerHTML = `<i class="fa-solid fa-plus-circle" style="color: var(--primary-color);"></i> Add New Study Task`;
    document.getElementById('modal-task-id').value = '';
    document.getElementById('modal-task-title').value = '';
    document.getElementById('modal-task-subject').value = '';
    document.getElementById('modal-task-priority').value = '';
    document.getElementById('modal-task-date').value = this.getTodayDateString();
    document.getElementById('modal-task-desc').value = '';

    this.clearErrors();
    modal.classList.add('active');
  },

  openEditModal: function(id) {
    const task = this.tasks.find(t => t.Task_ID === id);
    if (!task) return;

    const modal = document.getElementById('task-modal');
    if (!modal) return;

    document.getElementById('task-modal-title').innerHTML = `<i class="fa-solid fa-pen-to-square" style="color: var(--primary-color);"></i> Edit Study Task`;
    document.getElementById('modal-task-id').value = task.Task_ID;
    document.getElementById('modal-task-title').value = task.Task_Name || '';
    document.getElementById('modal-task-subject').value = task.Subject || '';
    document.getElementById('modal-task-priority').value = task.Priority || '';
    document.getElementById('modal-task-date').value = task.Due_Date || '';
    document.getElementById('modal-task-desc').value = task.Description || '';

    this.clearErrors();
    modal.classList.add('active');
  },

  closeModal: function() {
    const modal = document.getElementById('task-modal');
    if (modal) modal.classList.remove('active');
    this.clearErrors();
  },

  clearErrors: function() {
    const errFields = ['err-task-title', 'err-task-subject', 'err-task-priority', 'err-task-date'];
    errFields.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.style.display = 'none';
    });

    const inputs = ['modal-task-title', 'modal-task-subject', 'modal-task-priority', 'modal-task-date'];
    inputs.forEach(id => {
      const input = document.getElementById(id);
      if (input) input.style.borderColor = 'var(--border-color)';
    });
  },

  validateForm: function(name, subject, priority, dueDate) {
    this.clearErrors();
    let isValid = true;

    if (!name || name.trim() === '') {
      const err = document.getElementById('err-task-title');
      const input = document.getElementById('modal-task-title');
      if (err) err.style.display = 'block';
      if (input) input.style.borderColor = 'var(--accent-pink)';
      isValid = false;
    }

    if (!subject || subject.trim() === '') {
      const err = document.getElementById('err-task-subject');
      const input = document.getElementById('modal-task-subject');
      if (err) err.style.display = 'block';
      if (input) input.style.borderColor = 'var(--accent-pink)';
      isValid = false;
    }

    if (!priority || priority.trim() === '') {
      const err = document.getElementById('err-task-priority');
      const input = document.getElementById('modal-task-priority');
      if (err) err.style.display = 'block';
      if (input) input.style.borderColor = 'var(--accent-pink)';
      isValid = false;
    }

    if (!dueDate || dueDate.trim() === '') {
      const err = document.getElementById('err-task-date');
      const input = document.getElementById('modal-task-date');
      if (err) err.style.display = 'block';
      if (input) input.style.borderColor = 'var(--accent-pink)';
      isValid = false;
    }

    return isValid;
  },

  saveTaskFromForm: function() {
    const idVal = document.getElementById('modal-task-id').value;
    const name = document.getElementById('modal-task-title').value;
    const subject = document.getElementById('modal-task-subject').value;
    const priority = document.getElementById('modal-task-priority').value;
    const dueDate = document.getElementById('modal-task-date').value;
    const desc = document.getElementById('modal-task-desc').value;

    if (!this.validateForm(name, subject, priority, dueDate)) {
      return false;
    }

    if (idVal) {
      // Edit existing task
      const taskId = parseInt(idVal, 10);
      const index = this.tasks.findIndex(t => t.Task_ID === taskId);
      if (index !== -1) {
        this.tasks[index].Task_Name = name.trim();
        this.tasks[index].Subject = subject;
        this.tasks[index].Priority = priority;
        this.tasks[index].Due_Date = dueDate;
        this.tasks[index].Description = desc.trim();
      }
      if (typeof Toast !== 'undefined') Toast.show('Task updated successfully! ✏️', 'success');
    } else {
      // Create new task
      const newTask = {
        Task_ID: Date.now(),
        Student_ID: this.getStudentId(),
        Task_Name: name.trim(),
        Subject: subject,
        Priority: priority,
        Due_Date: dueDate,
        Description: desc.trim(),
        Status: "Pending",
        Created_Date: this.getTodayDateString()
      };
      this.tasks.unshift(newTask);
      if (typeof Toast !== 'undefined') Toast.show('New study task added! 🚀', 'success');
    }

    this.saveTasks();
    this.closeModal();
    this.render();
    return true;
  },

  toggleTask: function(id) {
    const task = this.tasks.find(t => t.Task_ID === id);
    if (task) {
      task.Status = task.Status === 'Completed' ? 'Pending' : 'Completed';
      if (task.Status === 'Completed' && typeof confetti === 'function') {
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.7 }
        });
      }
      this.saveTasks();
      this.render();
    }
  },

  openDeleteModal: function(id) {
    this.deleteTargetId = id;
    const deleteModal = document.getElementById('task-delete-modal');
    if (deleteModal) deleteModal.classList.add('active');
  },

  confirmDeleteTask: function() {
    if (this.deleteTargetId !== null) {
      this.tasks = this.tasks.filter(t => t.Task_ID !== this.deleteTargetId);
      this.deleteTargetId = null;
      this.saveTasks();
      this.render();
      if (typeof Toast !== 'undefined') Toast.show('Task deleted.', 'info');
    }
    const deleteModal = document.getElementById('task-delete-modal');
    if (deleteModal) deleteModal.classList.remove('active');
  },

  bindEvents: function() {
    const self = this;

    // Add Task Button
    const addTaskBtn = document.getElementById('add-task-btn');
    if (addTaskBtn) {
      addTaskBtn.onclick = () => self.openAddModal();
    }

    // Modal Close Buttons
    const closeBtn = document.getElementById('close-task-modal');
    const closeBtnX = document.getElementById('close-task-modal-x');
    if (closeBtn) closeBtn.onclick = () => self.closeModal();
    if (closeBtnX) closeBtnX.onclick = () => self.closeModal();

    // Task Form Submit
    const taskForm = document.getElementById('task-form');
    if (taskForm) {
      taskForm.onsubmit = function(e) {
        e.preventDefault();
        self.saveTaskFromForm();
      };
    }

    // Search Input
    const searchInput = document.getElementById('planner-search');
    if (searchInput) {
      searchInput.oninput = function(e) {
        self.searchQuery = e.target.value;
        self.render();
      };
    }

    // Subject Filter
    const subjectFilter = document.getElementById('planner-filter-subject');
    if (subjectFilter) {
      subjectFilter.onchange = function(e) {
        self.filterSubject = e.target.value;
        self.render();
      };
    }

    // Priority Filter
    const priorityFilter = document.getElementById('planner-filter-priority');
    if (priorityFilter) {
      priorityFilter.onchange = function(e) {
        self.filterPriority = e.target.value;
        self.render();
      };
    }

    // Sort Dropdown
    const sortSelect = document.getElementById('planner-sort');
    if (sortSelect) {
      sortSelect.onchange = function(e) {
        self.sortBy = e.target.value;
        self.render();
      };
    }

    // Section Tabs
    const tabBtns = document.querySelectorAll('.planner-tab-btn');
    tabBtns.forEach(btn => {
      btn.onclick = function() {
        tabBtns.forEach(b => {
          b.classList.remove('active');
          b.style.background = 'var(--bg-card)';
          b.style.color = 'var(--text-main)';
        });
        this.classList.add('active');
        this.style.background = 'var(--primary-color)';
        this.style.color = 'white';
        self.activeSection = this.dataset.section;
        self.render();
      };
    });
  },

  render: function() {
    const container = document.getElementById('task-list-container');
    if (!container) return;
    container.innerHTML = '';

    const todayStr = this.getTodayDateString();

    // 1. Calculate Progress Overview (on ALL tasks)
    const completedCount = this.tasks.filter(t => t.Status === 'Completed').length;
    const totalCount = this.tasks.length;
    const pct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

    const progressText = document.getElementById('planner-progress-text');
    if (progressText) progressText.textContent = `${completedCount} / ${totalCount} Tasks Completed`;

    const progressFill = document.getElementById('planner-progress-fill');
    if (progressFill) progressFill.style.width = pct + '%';

    // 2. Filter Tasks
    let filtered = this.tasks.filter(t => {
      // Search
      if (this.searchQuery) {
        const q = this.searchQuery.toLowerCase();
        const matchTitle = (t.Task_Name || '').toLowerCase().includes(q);
        const matchSub = (t.Subject || '').toLowerCase().includes(q);
        const matchDesc = (t.Description || '').toLowerCase().includes(q);
        if (!matchTitle && !matchSub && !matchDesc) return false;
      }

      // Subject Filter
      if (this.filterSubject !== 'ALL' && t.Subject !== this.filterSubject) {
        return false;
      }

      // Priority Filter
      if (this.filterPriority !== 'ALL' && t.Priority !== this.filterPriority) {
        return false;
      }

      // Section Filter
      if (this.activeSection === 'TODAY') {
        if (t.Due_Date !== todayStr) return false;
      } else if (this.activeSection === 'UPCOMING') {
        if (t.Due_Date <= todayStr) return false;
      }

      return true;
    });

    // 3. Sort Tasks
    filtered.sort((a, b) => {
      if (this.sortBy === 'DUE_ASC') {
        return (a.Due_Date || '').localeCompare(b.Due_Date || '');
      } else if (this.sortBy === 'DUE_DESC') {
        return (b.Due_Date || '').localeCompare(a.Due_Date || '');
      } else if (this.sortBy === 'PRIORITY') {
        const pMap = { 'High': 1, 'Medium': 2, 'Low': 3 };
        return (pMap[a.Priority] || 99) - (pMap[b.Priority] || 99);
      } else if (this.sortBy === 'NAME') {
        return (a.Task_Name || '').localeCompare(b.Task_Name || '');
      }
      return 0;
    });

    if (filtered.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; padding: 40px 20px; color: var(--text-muted);">
          <div style="font-size: 2.5rem; margin-bottom: 10px; opacity: 0.6;"><i class="fa-solid fa-clipboard-check"></i></div>
          <div style="font-weight: 700; font-size: 1.05rem;">No tasks found</div>
          <div style="font-size: 0.85rem; margin-top: 4px;">Try changing filters or add a new task.</div>
        </div>
      `;
      return;
    }

    filtered.forEach(t => {
      const isCompleted = t.Status === 'Completed';
      const isOverdue = !isCompleted && t.Due_Date < todayStr;
      const isToday = t.Due_Date === todayStr;

      const pClass = t.Priority === 'High' ? 'priority-high' : (t.Priority === 'Medium' ? 'priority-medium' : 'priority-low');

      const item = document.createElement('div');
      item.className = 'task-item';
      if (isOverdue) {
        item.style.borderColor = 'var(--accent-pink)';
        item.style.backgroundColor = 'var(--accent-pink-light)';
      }

      item.innerHTML = `
        <div class="task-left" style="gap: 14px; align-items: flex-start;">
          <div class="task-checkbox ${isCompleted ? 'checked' : ''}" onclick="Planner.toggleTask(${t.Task_ID})" style="margin-top: 2px;">
            ${isCompleted ? '<i class="fa-solid fa-check"></i>' : ''}
          </div>
          <div>
            <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
              <span class="task-title ${isCompleted ? 'completed' : ''}">${this.escapeHtml(t.Task_Name)}</span>
              <span style="font-size: 0.72rem; font-weight: 700; padding: 2px 8px; border-radius: 8px; background: rgba(91, 95, 239, 0.1); color: var(--primary-color); border: 1px solid rgba(91, 95, 239, 0.2);">
                ${this.escapeHtml(t.Subject || 'General')}
              </span>
            </div>
            
            ${t.Description ? `<div style="font-size: 0.82rem; color: var(--text-muted); margin-top: 4px; line-height: 1.3;">${this.escapeHtml(t.Description)}</div>` : ''}

            <div style="font-size: 0.78rem; color: ${isOverdue ? 'var(--accent-pink)' : (isToday ? 'var(--accent-yellow)' : 'var(--text-muted)')}; font-weight: ${isOverdue || isToday ? '700' : '400'}; margin-top: 4px; display: flex; align-items: center; gap: 6px;">
              <i class="fa-regular fa-calendar-days"></i>
              Due: ${t.Due_Date}
              ${isOverdue ? '<span style="background: var(--accent-pink); color: white; padding: 1px 6px; border-radius: 6px; font-size: 0.68rem; font-weight: 800;">OVERDUE</span>' : ''}
              ${isToday && !isCompleted ? '<span style="background: var(--accent-yellow); color: white; padding: 1px 6px; border-radius: 6px; font-size: 0.68rem; font-weight: 800;">TODAY</span>' : ''}
            </div>
          </div>
        </div>

        <div class="task-meta" style="display: flex; align-items: center; gap: 10px;">
          <span class="priority-badge ${pClass}">${t.Priority}</span>
          <button class="task-action-btn" onclick="Planner.openEditModal(${t.Task_ID})" title="Edit Task" style="color: var(--primary-color);">
            <i class="fa-solid fa-pencil"></i>
          </button>
          <button class="task-action-btn" onclick="Planner.openDeleteModal(${t.Task_ID})" title="Delete Task" style="color: var(--accent-pink);">
            <i class="fa-solid fa-trash-can"></i>
          </button>
        </div>
      `;
      container.appendChild(item);
    });
  },

  escapeHtml: function(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
};

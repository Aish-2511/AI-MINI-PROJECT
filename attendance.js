// Smart Attendance Tracker Module (Upgraded Version)
const AttendanceTracker = {
  state: {
    subjects: [
      { id: 'sub-1', name: 'Mathematics', code: 'MATH501', faculty: 'Dr. Sharma', attended: 18, absent: 2, off: 1, color: 'var(--primary-color)' },
      { id: 'sub-2', name: 'Operating System', code: 'CS502', faculty: 'Prof. Verma', attended: 14, absent: 4, off: 2, color: 'var(--secondary-color)' },
      { id: 'sub-3', name: 'DAA', code: 'CS503', faculty: 'Dr. Rao', attended: 16, absent: 3, off: 1, color: 'var(--accent-mint)' },
      { id: 'sub-4', name: 'Cybersecurity', code: 'CS504', faculty: 'Prof. Gupta', attended: 13, absent: 5, off: 1, color: 'var(--accent-pink)' },
      { id: 'sub-5', name: 'CGVR', code: 'CS505', faculty: 'Dr. Patel', attended: 15, absent: 2, off: 1, color: 'var(--accent-yellow)' },
      { id: 'sub-6', name: 'English', code: 'HS506', faculty: 'Prof. Nair', attended: 19, absent: 1, off: 0, color: 'var(--accent-cyan)' }
    ],
    history: [
      { id: 101, date: '2026-09-22', subjectName: 'Mathematics', status: 'Present', faculty: 'Dr. Sharma' },
      { id: 102, date: '2026-09-22', subjectName: 'DAA', status: 'Present', faculty: 'Dr. Rao' },
      { id: 103, date: '2026-09-21', subjectName: 'Cybersecurity', status: 'Absent', faculty: 'Prof. Gupta' },
      { id: 104, date: '2026-09-20', subjectName: 'Operating System', status: 'Off', faculty: 'Prof. Verma' },
      { id: 105, date: '2026-09-19', subjectName: 'CGVR', status: 'Present', faculty: 'Dr. Patel' },
      { id: 106, date: '2026-09-18', subjectName: 'English', status: 'Present', faculty: 'Prof. Nair' }
    ],
    calendarDays: [
      'Present','Present','Present','Absent','Present','Off','Off',
      'Present','Present','Present','Present','Absent','Present','Off',
      'Present','Off','Present','Present','Present','Present','Off',
      'Present','Present','Absent','Present','Present','Off','Off',
      'Present','Present'
    ],
    deleteCandidateId: null
  },

  getTotalAttended: function() {
    return this.state.subjects.reduce((sum, s) => sum + s.attended, 0);
  },

  getTotalAbsent: function() {
    return this.state.subjects.reduce((sum, s) => sum + s.absent, 0);
  },

  getTotalOff: function() {
    return this.state.subjects.reduce((sum, s) => sum + s.off, 0);
  },

  getTotalConducted: function() {
    return this.getTotalAttended() + this.getTotalAbsent();
  },

  getPercentage: function() {
    const conducted = this.getTotalConducted();
    return conducted > 0 ? Math.round((this.getTotalAttended() / conducted) * 100) : 0;
  },

  getSubjectPercentage: function(sub) {
    const conducted = sub.attended + sub.absent;
    return conducted > 0 ? Math.round((sub.attended / conducted) * 100) : 0;
  },

  addSubject: function(name, code, faculty) {
    const newSub = {
      id: 'sub-' + Date.now(),
      name: name,
      code: code || 'CS' + Math.floor(100 + Math.random() * 900),
      faculty: faculty || 'Faculty TBD',
      attended: 0,
      absent: 0,
      off: 0,
      color: 'var(--primary-color)'
    };
    this.state.subjects.push(newSub);
    this.render();
    Toast.show(`New subject "${name}" added!`, 'success');
  },

  markAttendance: function(subjectId, status) {
    const sub = this.state.subjects.find(s => s.id === subjectId);
    if (!sub) return;

    if (status === 'Present') sub.attended++;
    if (status === 'Absent') sub.absent++;
    if (status === 'Off') sub.off++;

    const todayStr = new Date().toISOString().split('T')[0];
    const newRecord = {
      id: Date.now(),
      date: todayStr,
      subjectName: sub.name,
      status: status,
      faculty: sub.faculty
    };
    this.state.history.unshift(newRecord);

    this.render();
    this.syncWithPredictor();
    Toast.show(`Logged ${status} for ${sub.name}!`, 'success');
  },

  editHistory: function(id, newStatus) {
    const record = this.state.history.find(h => h.id === id);
    if (!record) return;

    const oldStatus = record.status;
    const sub = this.state.subjects.find(s => s.name === record.subjectName);

    if (sub && oldStatus !== newStatus) {
      if (oldStatus === 'Present') sub.attended = Math.max(0, sub.attended - 1);
      if (oldStatus === 'Absent') sub.absent = Math.max(0, sub.absent - 1);
      if (oldStatus === 'Off') sub.off = Math.max(0, sub.off - 1);

      if (newStatus === 'Present') sub.attended++;
      if (newStatus === 'Absent') sub.absent++;
      if (newStatus === 'Off') sub.off++;

      record.status = newStatus;
      this.render();
      this.syncWithPredictor();
      Toast.show(`Attendance record updated to ${newStatus}`, 'info');
    }
  },

  promptDeleteHistory: function(id) {
    this.state.deleteCandidateId = id;
    const modal = document.getElementById('att-delete-modal');
    if (modal) modal.classList.add('active');
  },

  confirmDeleteHistory: function() {
    const id = this.state.deleteCandidateId;
    if (!id) return;

    const recordIndex = this.state.history.findIndex(h => h.id === id);
    if (recordIndex !== -1) {
      const record = this.state.history[recordIndex];
      const sub = this.state.subjects.find(s => s.name === record.subjectName);

      if (sub) {
        if (record.status === 'Present') sub.attended = Math.max(0, sub.attended - 1);
        if (record.status === 'Absent') sub.absent = Math.max(0, sub.absent - 1);
        if (record.status === 'Off') sub.off = Math.max(0, sub.off - 1);
      }

      this.state.history.splice(recordIndex, 1);
      this.render();
      this.syncWithPredictor();
      Toast.show('Attendance entry deleted', 'warning');
    }

    this.state.deleteCandidateId = null;
    const modal = document.getElementById('att-delete-modal');
    if (modal) modal.classList.remove('active');
  },

  calculateGoal: function(target) {
    const P = this.getTotalAttended();
    const T = this.getTotalConducted();
    const R = target / 100;

    if (T === 0) return { type: 'needed', needed: 0, maxMiss: 0 };

    if (P / T >= R) {
      const maxMiss = Math.floor((P - R * T) / R);
      return { type: 'safe', maxMiss: maxMiss };
    } else {
      const needed = Math.ceil((R * T - P) / (1 - R));
      return { type: 'needed', needed: needed };
    }
  },

  renderSummaryCards: function() {
    const pct = this.getPercentage();
    const attended = this.getTotalAttended();
    const absent = this.getTotalAbsent();
    const off = this.getTotalOff();
    const conducted = this.getTotalConducted();

    const heroPct = document.getElementById('att-hero-percent');
    if (heroPct) heroPct.textContent = pct + '%';

    const homeAttVal = document.getElementById('home-att-val');
    if (homeAttVal) homeAttVal.textContent = pct + '%';

    const classesEl = document.getElementById('stat-att-classes');
    if (classesEl) classesEl.textContent = attended;

    const missedEl = document.getElementById('stat-missed-classes');
    if (missedEl) missedEl.textContent = absent;

    const totalEl = document.getElementById('stat-total-classes');
    if (totalEl) totalEl.textContent = conducted;

    const offEl = document.getElementById('stat-off-classes');
    if (offEl) offEl.textContent = off;

    const ringBar = document.getElementById('att-hero-ring-bar');
    if (ringBar) {
      const circumference = 377;
      const offset = circumference - (pct / 100) * circumference;
      ringBar.style.strokeDashoffset = offset;
    }
  },

  renderSubjects: function() {
    const container = document.getElementById('subject-cards-container');
    if (!container) return;
    container.innerHTML = '';

    this.state.subjects.forEach(sub => {
      const pct = this.getSubjectPercentage(sub);
      const isExcellent = pct >= 90;
      const isWarning = pct < 75;

      let badgeHtml = '';
      if (isExcellent) badgeHtml = `<span class="badge-tag tag-excellent"><i class="fa-solid fa-star"></i> Excellent</span>`;
      else if (isWarning) badgeHtml = `<span class="badge-tag tag-risk"><i class="fa-solid fa-triangle-exclamation"></i> Below 75%</span>`;
      else badgeHtml = `<span class="badge-tag tag-pass"><i class="fa-solid fa-circle-check"></i> Good</span>`;

      const card = document.createElement('div');
      card.className = 'subject-card';
      card.innerHTML = `
        <div class="subject-title">
          <div>
            <div style="font-weight: 800; font-size: 1.05rem;">${sub.name}</div>
            <div style="font-size: 0.75rem; color: var(--text-muted);">${sub.code} • ${sub.faculty}</div>
          </div>
          <div>${badgeHtml}</div>
        </div>

        <div style="display: flex; align-items: center; justify-content: space-between; margin: 10px 0;">
          <div style="font-size: 1.8rem; font-weight: 800; color: ${sub.color};">${pct}%</div>
          <div style="font-size: 0.82rem; color: var(--text-muted); text-align: right;">
            <div><strong>${sub.attended}</strong> Present / <strong>${sub.attended + sub.absent}</strong> Total</div>
            <div>${sub.absent} Absent • ${sub.off} Off</div>
          </div>
        </div>

        <div class="progress-bar-container" style="height: 8px; margin: 0 0 14px 0;">
          <div class="progress-bar-fill" style="width: ${pct}%; background: ${sub.color};"></div>
        </div>

        <div style="display: flex; gap: 6px;">
          <button class="btn btn-primary" onclick="AttendanceTracker.markAttendance('${sub.id}', 'Present')" style="flex:1; padding: 8px; font-size: 0.78rem; background: var(--accent-mint); color: white;">
            <i class="fa-solid fa-check"></i> Present
          </button>
          <button class="btn" onclick="AttendanceTracker.markAttendance('${sub.id}', 'Absent')" style="flex:1; padding: 8px; font-size: 0.78rem; background: var(--accent-pink-light); color: var(--accent-pink);">
            <i class="fa-solid fa-xmark"></i> Absent
          </button>
          <button class="btn" onclick="AttendanceTracker.markAttendance('${sub.id}', 'Off')" style="flex:1; padding: 8px; font-size: 0.78rem; background: var(--bg-base); border: 1px solid var(--border-color); color: var(--text-muted);">
            <i class="fa-solid fa-power-off"></i> Off
          </button>
        </div>
      `;
      container.appendChild(card);
    });
  },

  renderCalendar: function() {
    const calendarEl = document.getElementById('attendance-calendar');
    if (!calendarEl) return;
    calendarEl.innerHTML = '';

    const dayHeaders = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
    dayHeaders.forEach(dh => {
      const h = document.createElement('div');
      h.className = 'calendar-day-header';
      h.textContent = dh;
      calendarEl.appendChild(h);
    });

    this.state.calendarDays.forEach((status, idx) => {
      const cell = document.createElement('div');
      const statusClass = status === 'Present' ? 'status-present' : (status === 'Absent' ? 'status-absent' : 'status-holiday');
      cell.className = `calendar-day-cell ${statusClass}`;
      cell.innerHTML = `<span>${idx + 1}</span>`;

      cell.addEventListener('click', () => {
        const modal = document.getElementById('att-date-modal');
        const dayTitle = document.getElementById('att-date-modal-title');
        if (dayTitle) dayTitle.textContent = `${idx + 1} September Attendance`;
        if (modal) modal.classList.add('active');
      });

      calendarEl.appendChild(cell);
    });
  },

  renderHistoryTable: function(searchTerm = '', filterStatus = 'ALL') {
    const tbody = document.getElementById('att-history-tbody');
    if (!tbody) return;
    tbody.innerHTML = '';

    const filtered = this.state.history.filter(h => {
      const matchesSearch = h.subjectName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = (filterStatus === 'ALL' || h.status === filterStatus);
      return matchesSearch && matchesStatus;
    });

    filtered.forEach(h => {
      let tagClass = 'tag-excellent';
      if (h.status === 'Absent') tagClass = 'tag-risk';
      if (h.status === 'Off') tagClass = 'tag-pass';

      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td style="font-weight: 600;">${h.date}</td>
        <td style="font-weight: 700;">${h.subjectName}</td>
        <td><span class="badge-tag ${tagClass}">${h.status}</span></td>
        <td style="color: var(--text-muted); font-size: 0.85rem;">${h.faculty}</td>
        <td>
          <button class="task-action-btn" onclick="AttendanceTracker.promptEditHistory(${h.id})" title="Edit Status">
            <i class="fa-solid fa-pen"></i>
          </button>
          <button class="task-action-btn" onclick="AttendanceTracker.promptDeleteHistory(${h.id})" title="Delete Entry" style="color: var(--accent-pink);">
            <i class="fa-solid fa-trash-can"></i>
          </button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  },

  promptEditHistory: function(id) {
    const record = this.state.history.find(h => h.id === id);
    if (!record) return;
    const newStatus = prompt(`Edit status for ${record.subjectName} on ${record.date} (Present / Absent / Off):`, record.status);
    if (newStatus && ['Present', 'Absent', 'Off'].includes(newStatus)) {
      this.editHistory(id, newStatus);
    }
  },

  renderGoalCalculator: function() {
    const targetSelect = document.getElementById('calc-target');
    if (!targetSelect) return;
    const targetVal = parseInt(targetSelect.value);
    const res = this.calculateGoal(targetVal);

    const neededBox = document.getElementById('calc-needed-result');
    const missBox = document.getElementById('calc-miss-result');

    if (res.type === 'needed') {
      if (neededBox) neededBox.textContent = `Attend next ${res.needed} lectures continuously`;
      if (missBox) missBox.textContent = `Cannot miss any lecture right now`;
    } else {
      if (neededBox) neededBox.textContent = `Target achieved! Keep it up`;
      if (missBox) missBox.textContent = `Can miss at most ${res.maxMiss} lectures`;
    }
  },

  render: function() {
    this.renderSummaryCards();
    this.renderSubjects();
    this.renderCalendar();
    this.renderHistoryTable();
    this.renderGoalCalculator();
  },

  syncWithPredictor: function() {
    const pct = this.getPercentage();
    const attInput = document.getElementById('input-att');
    const attVal = document.getElementById('val-att');
    if (attInput && attVal) {
      attInput.value = pct;
      attVal.textContent = pct + '%';
      const form = document.getElementById('prediction-form');
      if (form) form.dispatchEvent(new Event('submit'));
    }
  }
};

// Main EduAI Predict Application Controller
document.addEventListener('DOMContentLoaded', function() {
  
  // 1. Navigation Controller across all 15 pages
  const navItems = document.querySelectorAll('.nav-item');
  const pages = document.querySelectorAll('.tab-page');

  function switchTab(tabId) {
    navItems.forEach(item => {
      if (item.dataset.tab === tabId) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    pages.forEach(page => {
      if (page.id === `page-${tabId}`) {
        page.classList.add('active');
      } else {
        page.classList.remove('active');
      }
    });

    if (tabId === 'analytics') {
      setTimeout(() => AnalyticsCharts.init(), 100);
    }
  }

  navItems.forEach(item => {
    item.addEventListener('click', function() {
      switchTab(this.dataset.tab);
    });
  });

  document.querySelectorAll('.nav-trigger').forEach(btn => {
    btn.addEventListener('click', function() {
      switchTab(this.dataset.tab);
    });
  });

  // 2. Sidebar Collapsible Toggle
  const sidebar = document.getElementById('sidebar');
  const sidebarToggle = document.getElementById('sidebar-toggle');
  if (sidebarToggle && sidebar) {
    sidebarToggle.addEventListener('click', () => {
      sidebar.classList.toggle('collapsed');
      const icon = sidebarToggle.querySelector('i');
      if (sidebar.classList.contains('collapsed')) {
        icon.className = 'fa-solid fa-chevron-right';
      } else {
        icon.className = 'fa-solid fa-chevron-left';
      }
    });
  }

  // 3. Dark/Light Theme Toggle
  const themeToggle = document.getElementById('theme-toggle');
  const settingsThemeToggle = document.getElementById('settings-theme-toggle');
  const themeText = document.getElementById('theme-text');

  function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    if (themeText) themeText.textContent = newTheme === 'dark' ? 'Light Mode' : 'Dark Mode';
    if (themeToggle) {
      const icon = themeToggle.querySelector('i');
      icon.className = newTheme === 'dark' ? 'fa-regular fa-sun' : 'fa-regular fa-moon';
    }
    Toast.show(`Switched to ${newTheme} mode`, 'info');
  }

  if (themeToggle) themeToggle.addEventListener('click', toggleTheme);
  if (settingsThemeToggle) settingsThemeToggle.addEventListener('click', toggleTheme);

  // 4. Slider Inputs & Real-time Value Badges
  const attSlider = document.getElementById('input-att');
  const attVal = document.getElementById('val-att');
  if (attSlider && attVal) {
    attSlider.addEventListener('input', (e) => {
      attVal.textContent = e.target.value + '%';
    });
  }

  const marksInput = document.getElementById('input-marks');
  const marksVal = document.getElementById('val-marks');
  if (marksInput && marksVal) {
    marksInput.addEventListener('input', (e) => {
      marksVal.textContent = `${e.target.value} / 50`;
    });
  }

  const assInput = document.getElementById('input-ass');
  const assVal = document.getElementById('val-ass');
  if (assInput && assVal) {
    assInput.addEventListener('input', (e) => {
      assVal.textContent = `${e.target.value} / 20`;
    });
  }

  const hoursSlider = document.getElementById('input-hours');
  const hoursVal = document.getElementById('val-hours');
  if (hoursSlider && hoursVal) {
    hoursSlider.addEventListener('input', (e) => {
      hoursVal.textContent = e.target.value + ' hrs';
    });
  }

  // 5. Prediction Form Submit Handler
  const predictionForm = document.getElementById('prediction-form');
  if (predictionForm) {
    predictionForm.addEventListener('submit', function(e) {
      e.preventDefault();

      const name = document.getElementById('input-name').value;
      const att = parseFloat(document.getElementById('input-att').value);
      const marks = parseFloat(document.getElementById('input-marks').value);
      const ass = parseFloat(document.getElementById('input-ass').value);
      const hours = parseFloat(document.getElementById('input-hours').value);

      const res = AI_Predictor.evaluate(att, marks, ass, hours);

      // Update Result Card
      const resCard = document.getElementById('result-card');
      const tierLabel = document.getElementById('result-tier-label');
      const subtext = document.getElementById('result-subtext');
      const iconBox = document.getElementById('result-icon-box');

      if (resCard) resCard.className = `prediction-result-card ${res.cssClass}`;
      if (tierLabel) tierLabel.textContent = res.tier;
      if (subtext) subtext.textContent = res.subtext;
      if (iconBox) iconBox.innerHTML = `<i class="${res.iconClass}"></i>`;

      document.getElementById('res-conf').textContent = res.confidence;
      document.getElementById('res-risk').textContent = res.risk;
      document.getElementById('res-hours').textContent = res.targetHours;
      document.getElementById('res-att-goal').textContent = res.attGoal;

      // Update Home Page Badge
      const homeBadge = document.getElementById('home-pred-badge');
      if (homeBadge) {
        const tagClass = res.tier === 'Excellent' ? 'tag-excellent' : (res.tier === 'Pass' ? 'tag-pass' : 'tag-risk');
        homeBadge.innerHTML = `<span class="badge-tag ${tagClass}" style="font-size: 1rem; padding: 6px 14px;"><i class="${res.iconClass}"></i> ${res.tier}</span>`;
      }

      // Populate AI Recommendations
      const tipsList = document.getElementById('recommendations-list');
      if (tipsList) {
        tipsList.innerHTML = res.tips.map(t => `<li class="tip-item"><div class="tip-icon"><i class="fa-solid fa-check"></i></div> ${t}</li>`).join('');
      }

      // Sync Reports Page Dynamically in Real-Time
      const currentSem = document.getElementById('input-semester') ? document.getElementById('input-semester').value : 'Semester 5';
      const currentDept = document.getElementById('input-dept') ? document.getElementById('input-dept').value : 'Computer Science & Eng';
      if (typeof ReportsModule !== 'undefined') {
        ReportsModule.update({
          name: name,
          email: `${name.toLowerCase().replace(/\s+/g, '')}@college.edu`,
          dept: currentDept,
          sem: currentSem,
          att: att,
          marks: marks,
          ass: ass,
          hours: hours,
          prediction: res.tier,
          confidence: res.confidence,
          risk: res.risk,
          targetHours: res.targetHours,
          attGoal: res.attGoal
        });
      }

      Toast.show(`AI Prediction Completed: ${res.tier} (${res.confidence})`, 'success');

      // Confetti Effect for Excellent prediction
      if (res.tier === 'Excellent' && typeof confetti === 'function') {
        confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
      }
    });
  }

  // 6. Reset Prediction Form
  const resetBtn = document.getElementById('reset-prediction-btn');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      document.getElementById('input-att').value = 82;
      document.getElementById('val-att').textContent = '82%';
      document.getElementById('input-marks').value = 42;
      document.getElementById('val-marks').textContent = '42 / 50';
      document.getElementById('input-ass').value = 16;
      document.getElementById('val-ass').textContent = '16 / 20';
      document.getElementById('input-hours').value = 5.5;
      document.getElementById('val-hours').textContent = '5.5 hrs';
      predictionForm.dispatchEvent(new Event('submit'));
      Toast.show('Predictor values reset to baseline.', 'info');
    });
  }

  // 7. Attendance Tracker Event Binding & Modals
  const openAddSubjectBtn = document.getElementById('open-add-subject-btn');
  const closeAddSubjectBtn = document.getElementById('close-add-subject-modal');
  const addSubjectModal = document.getElementById('add-subject-modal');
  const addSubjectForm = document.getElementById('add-subject-form');

  if (openAddSubjectBtn && addSubjectModal) {
    openAddSubjectBtn.addEventListener('click', () => addSubjectModal.classList.add('active'));
  }
  if (closeAddSubjectBtn && addSubjectModal) {
    closeAddSubjectBtn.addEventListener('click', () => addSubjectModal.classList.remove('active'));
  }
  if (addSubjectForm) {
    addSubjectForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('modal-sub-name').value;
      const code = document.getElementById('modal-sub-code').value;
      const faculty = document.getElementById('modal-sub-faculty').value;
      AttendanceTracker.addSubject(name, code, faculty);
      addSubjectForm.reset();
      addSubjectModal.classList.remove('active');
    });
  }

  // Calendar Date Attendance Form Submit
  const attDateForm = document.getElementById('att-date-form');
  const attDateModal = document.getElementById('att-date-modal');
  if (attDateForm) {
    attDateForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const subjectName = document.getElementById('modal-date-subject').value;
      const status = document.getElementById('modal-date-status').value;
      const sub = AttendanceTracker.state.subjects.find(s => s.name === subjectName);
      if (sub) {
        AttendanceTracker.markAttendance(sub.id, status);
      }
      if (attDateModal) attDateModal.classList.remove('active');
    });
  }

  // Attendance History Search & Status Filter
  const attSearch = document.getElementById('att-history-search');
  const attFilter = document.getElementById('att-history-filter');
  if (attSearch) {
    attSearch.addEventListener('input', () => {
      AttendanceTracker.renderHistoryTable(attSearch.value, attFilter ? attFilter.value : 'ALL');
    });
  }
  if (attFilter) {
    attFilter.addEventListener('change', () => {
      AttendanceTracker.renderHistoryTable(attSearch ? attSearch.value : '', attFilter.value);
    });
  }

  const targetSelect = document.getElementById('calc-target');
  if (targetSelect) {
    targetSelect.addEventListener('change', () => AttendanceTracker.render());
  }

  // 8. Study Planner Initialization
  Planner.init();

  // 9. Dataset Search & Filter Listeners
  const datasetSearch = document.getElementById('dataset-search');
  const datasetFilter = document.getElementById('dataset-filter-tier');

  if (datasetSearch) {
    datasetSearch.addEventListener('input', () => {
      DatasetModule.render(datasetSearch.value, datasetFilter ? datasetFilter.value : 'ALL');
    });
  }
  if (datasetFilter) {
    datasetFilter.addEventListener('change', () => {
      DatasetModule.render(datasetSearch ? datasetSearch.value : '', datasetFilter.value);
    });
  }

  // 10. Report PDF Export Button
  const printReportBtn = document.getElementById('print-report-btn');
  if (printReportBtn) {
    printReportBtn.addEventListener('click', () => {
      if (typeof ReportsModule !== 'undefined') {
        ReportsModule.downloadPDF();
      } else {
        window.print();
      }
    });
  }

  // 11. Modules Initialization
  Auth.init();
  AIChatbot.init();
  AttendanceTracker.render();
  Planner.render();
  DatasetModule.render();
  if (predictionForm) predictionForm.dispatchEvent(new Event('submit'));
});

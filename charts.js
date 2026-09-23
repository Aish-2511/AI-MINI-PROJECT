// Analytics Charts Module (Chart.js)
const AnalyticsCharts = {
  charts: {},

  init: function() {
    this.initPieChart();
    this.initBarChart();
    this.initLineChart();
    this.initScatterChart();
    this.initWeeklyHoursChart();
    this.initAssignmentTrendChart();
    this.initFeatureImportanceChart();
  },

  initPieChart: function() {
    const ctx = document.getElementById('chart-pie-pred');
    if (!ctx) return;
    if (this.charts.pie) this.charts.pie.destroy();

    this.charts.pie = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Excellent', 'Pass', 'At Risk'],
        datasets: [{
          data: [55, 35, 10],
          backgroundColor: ['#22C55E', '#5B5FEF', '#EF4444'],
          borderWidth: 0,
          borderRadius: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: 'bottom' } }
      }
    });
  },

  initBarChart: function() {
    const ctx = document.getElementById('chart-bar-marks');
    if (!ctx) return;
    if (this.charts.bar) this.charts.bar.destroy();

    this.charts.bar = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Maths', 'OS', 'DAA', 'Cybersecurity', 'CGVR', 'English'],
        datasets: [
          {
            label: 'Internal Marks (Scale 50)',
            data: [45, 38, 42, 35, 44, 48],
            backgroundColor: '#5B5FEF',
            borderRadius: 6
          },
          {
            label: 'Assignment Marks (Scale 20 x 2.5)',
            data: [45, 40, 42, 35, 45, 48],
            backgroundColor: '#06B6D4',
            borderRadius: 6
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: 'bottom' } }
      }
    });
  },

  initLineChart: function() {
    const ctx = document.getElementById('chart-line-study');
    if (!ctx) return;
    if (this.charts.line) this.charts.line.destroy();

    this.charts.line = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['1 hr', '2 hrs', '3 hrs', '4 hrs', '5 hrs', '6 hrs', '7 hrs', '8 hrs'],
        datasets: [{
          label: 'Predicted Score (%)',
          data: [58, 64, 72, 80, 88, 94, 96, 98],
          borderColor: '#22C55E',
          backgroundColor: 'rgba(34, 197, 94, 0.15)',
          fill: true,
          tension: 0.4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: 'bottom' } }
      }
    });
  },

  initScatterChart: function() {
    const ctx = document.getElementById('chart-scatter-att');
    if (!ctx) return;
    if (this.charts.scatter) this.charts.scatter.destroy();

    this.charts.scatter = new Chart(ctx, {
      type: 'scatter',
      data: {
        datasets: [{
          label: 'Student Cohort (Attendance % vs Final Score)',
          data: [
            { x: 92, y: 94 }, { x: 88, y: 89 }, { x: 78, y: 76 },
            { x: 65, y: 58 }, { x: 55, y: 48 }, { x: 95, y: 97 },
            { x: 82, y: 84 }, { x: 74, y: 70 }, { x: 90, y: 92 }
          ],
          backgroundColor: '#EF4444'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: { title: { display: true, text: 'Attendance Rate (%)' } },
          y: { title: { display: true, text: 'Final Score (%)' } }
        }
      }
    });
  },

  initWeeklyHoursChart: function() {
    const ctx = document.getElementById('chart-weekly-hours');
    if (!ctx) return;
    if (this.charts.weekly) this.charts.weekly.destroy();

    this.charts.weekly = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [{
          label: 'Study Hours Logged',
          data: [4.5, 5.0, 6.0, 5.5, 4.0, 3.5, 6.5],
          backgroundColor: '#8B5CF6',
          borderRadius: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: 'bottom' } }
      }
    });
  },

  initAssignmentTrendChart: function() {
    const ctx = document.getElementById('chart-assignment-trend');
    if (!ctx) return;
    if (this.charts.assignment) this.charts.assignment.destroy();

    this.charts.assignment = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'],
        datasets: [{
          label: 'Assignments Completed (%)',
          data: [60, 70, 75, 80, 85, 90],
          borderColor: '#F59E0B',
          backgroundColor: 'rgba(245, 158, 11, 0.15)',
          fill: true,
          tension: 0.3
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: 'bottom' } }
      }
    });
  },

  initFeatureImportanceChart: function() {
    const ctx = document.getElementById('chart-feature-importance');
    if (!ctx) return;
    if (this.charts.feature) this.charts.feature.destroy();

    this.charts.feature = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Internal Test Score', 'Attendance Rate', 'Assignment Completion', 'Daily Study Hours'],
        datasets: [{
          label: 'Feature Weight / Importance (%)',
          data: [35, 30, 20, 15],
          backgroundColor: ['#5B5FEF', '#22C55E', '#06B6D4', '#8B5CF6'],
          borderRadius: 8
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } }
      }
    });
  }
};

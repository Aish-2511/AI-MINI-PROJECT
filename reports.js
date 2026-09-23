// Dynamic Student Report & Official Pillai College PDF Exporter Module
const ReportsModule = {
  currentReportData: null,

  update: function(data) {
    if (!data) {
      data = {
        name: 'Aishwarya',
        email: 'aishwarya@college.edu',
        dept: 'Computer Science & Eng',
        sem: 'Semester 5',
        att: typeof AttendanceTracker !== 'undefined' ? AttendanceTracker.getPercentage() : 82,
        marks: 42,
        ass: 16,
        hours: 5.5,
        prediction: 'Excellent',
        confidence: '94.5%',
        risk: 'Low',
        targetHours: '5-6 hrs',
        attGoal: '> 90%'
      };
    }

    this.currentReportData = data;

    // 1. Header & Student Details
    const reportDate = document.getElementById('report-date-gen');
    if (reportDate) reportDate.textContent = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    document.querySelectorAll('.report-student-name').forEach(el => el.textContent = data.name || 'Aishwarya');
    document.querySelectorAll('.report-student-email').forEach(el => el.textContent = data.email || 'aishwarya@college.edu');
    document.querySelectorAll('.report-student-dept').forEach(el => el.textContent = data.dept || 'Computer Science & Eng');
    document.querySelectorAll('.report-student-sem').forEach(el => el.textContent = data.sem || 'Semester 5');

    // 2. Summary Metric Cards
    const reportAtt = document.getElementById('report-val-att');
    if (reportAtt) reportAtt.textContent = (data.att || 82) + '%';

    const reportPred = document.getElementById('report-val-pred');
    if (reportPred) {
      reportPred.textContent = data.prediction || 'Excellent';
      reportPred.style.color = (data.prediction === 'Excellent') ? 'var(--accent-mint)' : ((data.prediction === 'Pass') ? 'var(--primary-color)' : 'var(--accent-pink)');
    }

    const reportConf = document.getElementById('report-val-conf');
    if (reportConf) reportConf.textContent = data.confidence || '94.5%';

    const reportScore = document.getElementById('report-val-score');
    if (reportScore) {
      const overallScore = Math.round(((data.marks / 50) * 40) + ((data.ass / 20) * 20) + ((data.att / 100) * 40));
      reportScore.textContent = overallScore + ' / 100';
    }

    // 3. Subject-wise Academic Marks Table Dynamic Update
    const tableBody = document.getElementById('report-subject-table-body');
    if (tableBody) {
      const subjects = [
        { name: 'Mathematics', int: Math.min(50, data.marks + 3), ass: data.ass, att: Math.min(100, data.att + 8) },
        { name: 'Operating System', int: Math.max(20, data.marks - 4), ass: Math.max(10, data.ass - 2), att: Math.max(60, data.att - 4) },
        { name: 'Design & Analysis of Algorithms', int: data.marks, ass: data.ass, att: data.att },
        { name: 'Cybersecurity', int: Math.max(18, data.marks - 7), ass: Math.max(8, data.ass - 4), att: Math.max(55, data.att - 10) },
        { name: 'Computer Graphics & VR', int: Math.min(50, data.marks + 2), ass: Math.min(20, data.ass + 2), att: Math.min(100, data.att + 6) },
        { name: 'English', int: Math.min(50, data.marks + 6), ass: Math.min(20, data.ass + 3), att: Math.min(100, data.att + 13) }
      ];

      tableBody.innerHTML = subjects.map(s => {
        const total = Math.round((s.int) + (s.ass * 2.5));
        let statusTag = '<span class="badge-tag tag-excellent">Excellent</span>';
        if (total < 65) statusTag = '<span class="badge-tag tag-risk">Needs Improvement</span>';
        else if (total < 80) statusTag = '<span class="badge-tag tag-pass">Pass</span>';

        return `
          <tr>
            <td style="font-weight: 700;">${s.name}</td>
            <td>${s.int} / 50</td>
            <td>${s.ass} / 20</td>
            <td style="font-weight: 800; color: var(--primary-color);">${total} / 100</td>
            <td style="font-weight: 700;">${s.att}%</td>
            <td>${statusTag}</td>
          </tr>
        `;
      }).join('');
    }

    // 4. Attendance Ring in Report
    const repAttRing = document.getElementById('report-att-ring-bar');
    if (repAttRing) {
      const pct = data.att || 82;
      const circumference = 377;
      const offset = circumference - (pct / 100) * circumference;
      repAttRing.style.strokeDashoffset = offset;
    }

    const repAttPct = document.getElementById('report-att-ring-percent');
    if (repAttPct) repAttPct.textContent = (data.att || 82) + '%';
  },

  downloadPDF: function() {
    // Target the visible report container directly after full render
    const reportElement = document.getElementById('report-printable-area');
    if (!reportElement) return;

    Toast.show('Capturing visible report container for PDF export...', 'info');

    if (typeof html2pdf !== 'undefined') {
      const studentName = this.currentReportData ? this.currentReportData.name : 'Student';
      const opt = {
        margin: [0.3, 0.3, 0.3, 0.3],
        filename: `Academic_Report_${studentName}_PCE.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
          scale: 2, 
          useCORS: true, 
          logging: false,
          letterRendering: true
        },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
      };

      html2pdf().set(opt).from(reportElement).save().then(() => {
        Toast.show('High-quality PDF downloaded successfully! 📄', 'success');
      }).catch(err => {
        console.error('PDF export error:', err);
        window.print();
      });
    } else {
      window.print();
    }
  }
};

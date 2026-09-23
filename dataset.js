// Dataset Module
const DatasetModule = {
  data: [
    { id: "STU-101", name: "Aishwarya", sem: "Sem 5", att: 82, marks: 42, ass: 16, hrs: 5.5, pred: "Excellent" },
    { id: "STU-102", name: "Rohan Kumar", sem: "Sem 5", att: 94, marks: 46, ass: 19, hrs: 6.0, pred: "Excellent" },
    { id: "STU-103", name: "Ananya Sharma", sem: "Sem 5", att: 76, marks: 34, ass: 14, hrs: 3.5, pred: "Pass" },
    { id: "STU-104", name: "Vikram Reddy", sem: "Sem 5", att: 58, marks: 24, ass: 10, hrs: 2.0, pred: "At Risk" },
    { id: "STU-105", name: "Priya Nair", sem: "Sem 5", att: 88, marks: 44, ass: 18, hrs: 5.0, pred: "Excellent" },
    { id: "STU-106", name: "Karthik Raja", sem: "Sem 5", att: 72, marks: 32, ass: 12, hrs: 3.0, pred: "Pass" },
    { id: "STU-107", name: "Sneha Patel", sem: "Sem 5", att: 96, marks: 49, ass: 20, hrs: 7.0, pred: "Excellent" },
    { id: "STU-108", name: "Rahul Verma", sem: "Sem 5", att: 62, marks: 28, ass: 11, hrs: 2.5, pred: "At Risk" },
    { id: "STU-109", name: "Divya Gupta", sem: "Sem 5", att: 84, marks: 40, ass: 15, hrs: 4.5, pred: "Pass" },
    { id: "STU-110", name: "Siddharth Rao", sem: "Sem 5", att: 90, marks: 45, ass: 17, hrs: 5.5, pred: "Excellent" }
  ],

  render: function(searchTerm = '', filterTier = 'ALL') {
    const tbody = document.getElementById('dataset-tbody');
    if (!tbody) return;
    tbody.innerHTML = '';

    const filtered = this.data.filter(s => {
      const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesTier = (filterTier === 'ALL' || s.pred === filterTier);
      return matchesSearch && matchesTier;
    });

    filtered.forEach(s => {
      const tagClass = s.pred === 'Excellent' ? 'tag-excellent' : (s.pred === 'Pass' ? 'tag-pass' : 'tag-risk');
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td style="font-weight: 700;">${s.id}</td>
        <td style="font-weight: 600;">${s.name}</td>
        <td>${s.sem}</td>
        <td>${s.att}%</td>
        <td>${s.marks} / 50</td>
        <td>${s.ass} / 20</td>
        <td>${s.hrs} hrs/day</td>
        <td><span class="badge-tag ${tagClass}">${s.pred}</span></td>
      `;
      tbody.appendChild(tr);
    });
  }
};

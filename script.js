let entries = JSON.parse(localStorage.getItem("entries") || "[]");

function save(){
  localStorage.setItem("entries", JSON.stringify(entries));
}

function toggleCategory(){
  const type = document.getElementById("type").value;
  const catBox = document.getElementById("categoryBox").style.display = 
  type === "income" ? "none"  : "block";
}

function addEntry(){
  const type = document.getElementById("type").value;
  const amount = parseFloat(document.getElementById("amount").value);
  const date = document.getElementById("date").value;
  let category = "-";

  if(type === "expense"){
    category = document.getElementById("category").value;
  }

  if(!amount || !date){
    alert("Please enter valid details");
    return;
  }

  entries.push({ type, category, amount, date });
  save();
  render();
}

function renderSummary(){
  let income = 0, expense = 0;

  entries.forEach(e => {
    if(e.type === "income") income += e.amount;
    else expense += e.amount;
  });

  document.getElementById("totalIncome").textContent = "₹" + income;
  document.getElementById("totalExpense").textContent = "₹" + expense;
  document.getElementById("balance").textContent = "₹" + (income - expense);
}

function renderTable(){
  const tbody = document.getElementById("tableBody");
  const search = document.getElementById("search").value.toLowerCase();

  tbody.innerHTML = "";

  entries
    .filter(e => e.category.toLowerCase().includes(search))
    .forEach((e, i) => {
      tbody.innerHTML += `
        <tr>
          <td>${e.type}</td>
          <td>${e.category}</td>
          <td>₹${e.amount}</td>
          <td>${e.date}</td>
          <td><button onclick="del(${i})">X</button></td>
        </tr>
      `;
    });
}

function del(i){
  entries.splice(i, 1);
  save();
  render();
}

let pieChart, lineChart;

function renderCharts(){
  const ctx1 = document.getElementById("lineChart");
  const ctx2 = document.getElementById("pieChart");

  const daily = {};
  const categories = {};

  entries.forEach(e => {
    if(e.type === "expense"){
      daily[e.date] = (daily[e.date] || 0) + e.amount;
      categories[e.category] = (categories[e.category] || 0) + e.amount;
    }
  });

  if(lineChart) lineChart.destroy();
  if(pieChart) pieChart.destroy();

  lineChart = new Chart(ctx1, {
    type: "line",
    data: {
      labels: Object.keys(daily),
      datasets: [{
        data: Object.values(daily),
        borderColor: "#2563eb",
        borderWidth: 2,
        tension: 0.3,
        pointRadius: 3
      }]
    },
    options: {
      plugins: { legend: { display: false } },
      maintainAspectRatio: false
    }
  });

  pieChart = new Chart(ctx2, {
    type: "pie",
    data: {
      labels: Object.keys(categories),
      datasets: [{
        data: Object.values(categories),
        backgroundColor: ["#60a5fa", "#f87171", "#34d399", "#fbbf24", "#a78bfa"]
      }]
    },
    options: {
      plugins: { legend: { position: 'bottom' } },
      maintainAspectRatio: false
    }
  });
}
  

function render(){
  renderSummary();
  renderTable();
  renderCharts();
}

toggleCategory();
render();

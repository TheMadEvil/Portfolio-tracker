let data = {
  "Person 1": [
    { fund: "Axis Liquid Fund", amount: 1026, return: 1.35 },
    { fund: "Nippon Silver ETF FoF", amount: 3786, return: -3.79 },
    { fund: "Nippon Large Cap", amount: 2914, return: -1.85 },
    { fund: "Invesco PSU ETF", amount: 2500, return: 0 },
    { fund: "Parag Parikh Flexi Cap", amount: 2500, return: 0 },
  ],
  "Person 2": [
    { fund: "SBI Contra Regular", amount: 16247, return: 1.55 },
    { fund: "SBI Large & Mid Regular", amount: 8371.95, return: 4.65 },
    { fund: "SBI Small Cap Regular", amount: 16428, return: 2.68 },
  ]
};

const container = document.getElementById("dashboard");
const ctx = document.getElementById("chart").getContext("2d");

function createEditableCell(value, onChange) {
  const input = document.createElement("input");
  input.type = "text";
  input.value = value;
  input.onchange = (e) => onChange(e.target.value);
  input.style.width = "100px";
  return input;
}

function renderDashboard() {
  container.innerHTML = "";
  let labels = [];
  let totals = [];

  for (const [person, funds] of Object.entries(data)) {
    const personDiv = document.createElement("div");
    personDiv.className = "person-block";
    const title = document.createElement("h3");
    title.textContent = person;

    let total = 0;
    const table = document.createElement("table");
    table.innerHTML = `<tr><th>Fund Name</th><th>Amount (₹)</th><th>Return (%)</th></tr>`;

    funds.forEach((f, idx) => {
      const row = document.createElement("tr");

      const fundName = createEditableCell(f.fund, val => {
        data[person][idx].fund = val;
        renderDashboard();
      });

      const amount = createEditableCell(f.amount, val => {
        data[person][idx].amount = parseFloat(val) || 0;
        renderDashboard();
      });

      const returnCell = createEditableCell(f.return, val => {
        data[person][idx].return = parseFloat(val) || 0;
        renderDashboard();
      });

      row.appendChild(wrapInTd(fundName));
      row.appendChild(wrapInTd(amount));
      row.appendChild(wrapInTd(returnCell));
      table.appendChild(row);

      total += f.amount;
    });

    const totalDiv = document.createElement("div");
    totalDiv.innerHTML = `<strong>Total: ₹${total.toLocaleString()}</strong>`;
    personDiv.appendChild(title);
    personDiv.appendChild(table);
    personDiv.appendChild(totalDiv);
    container.appendChild(personDiv);

    labels.push(person);
    totals.push(total);
  }

  renderChart(labels, totals);
}

function wrapInTd(element) {
  const td = document.createElement("td");
  td.appendChild(element);
  return td;
}

function renderChart(labels, data) {
  if (window.chartInstance) {
    window.chartInstance.destroy();
  }

  window.chartInstance = new Chart(ctx, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [{
        label: 'Total Investment (₹)',
        data: data,
        backgroundColor: ["#36A2EB", "#FF6384", "#FFCE56", "#4BC0C0"]
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}

document.getElementById("addPerson").onclick = () => {
  const newName = prompt("Enter name of the new person:");
  if (newName && !data[newName]) {
    data[newName] = [
      { fund: "New Fund", amount: 0, return: 0 }
    ];
    renderDashboard();
  }
};

renderDashboard();

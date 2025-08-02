// Default portfolio data
const defaultData = {
  you: [
    { name: "Axis Liquid Fund", amount: 1026, return: 1.35 },
    { name: "Nippon Silver ETF FoF", amount: 3786, return: -3.79 },
    { name: "Nippon Large Cap", amount: 2914, return: -1.85 },
    { name: "Invesco PSU ETF", amount: 2500, return: 0 },
    { name: "Parag Parikh Flexi Cap", amount: 2500, return: 0 },
  ],
  spouse: [
    { name: "SBI Contra Regular", amount: 16247, return: 1.55 },
    { name: "SBI Large & Mid Regular", amount: 8371.95, return: 4.65 },
    { name: "SBI Small Cap Regular", amount: 16428, return: 2.68 },
  ],
};

// Load from localStorage or use default
const data = JSON.parse(localStorage.getItem("portfolioData")) || defaultData;
const allData = [...data.you, ...data.spouse];
const container = document.getElementById("portfolio-cards");

// Enable editing of values
function makeEditable(span, field, obj) {
  span.contentEditable = true;
  span.style.cursor = "text";
  span.style.borderBottom = "1px dashed #ccc";
  span.addEventListener("blur", () => {
    const cleanValue = span.innerText.replace(/[₹,%]/g, "").trim();
    obj[field] = parseFloat(cleanValue) || 0;
    localStorage.setItem("portfolioData", JSON.stringify(data));
    location.reload(); // Update chart
  });
}

// Render portfolio cards
allData.forEach((fund, index) => {
  const card = document.createElement("div");
  card.className = "col-md-6";
  const color = ["primary", "success", "warning", "danger", "info"][index % 5];

  card.innerHTML = `
    <div class="card border-${color} mb-3 shadow-sm">
      <div class="card-body">
        <h5 class="card-title">${fund.name}</h5>
        <p class="card-text">💰 Amount: ₹<span class="editable amount">${fund.amount}</span></p>
        <p class="card-text">📈 Return: <span class="editable return">${fund.return >= 0 ? '+' : ''}${fund.return}</span>%</p>
      </div>
    </div>
  `;
  container.appendChild(card);

  const spans = card.querySelectorAll(".editable");
  makeEditable(spans[0], "amount", fund);
  makeEditable(spans[1], "return", fund);
});

// Chart.js doughnut
const ctx = document.getElementById("portfolioChart").getContext("2d");
new Chart(ctx, {
  type: "doughnut",
  data: {
    labels: allData.map(f => f.name),
    datasets: [{
      label: "Amount in ₹",
      data: allData.map(f => f.amount),
      backgroundColor: [
        "#4e79a7", "#f28e2b", "#e15759", "#76b7b2",
        "#59a14f", "#edc949", "#af7aa1", "#ff9da7",
        "#9c755f", "#bab0ab"
      ]
    }]
  },
  options: {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom"
      },
      title: {
        display: true,
        text: "Portfolio Allocation"
      }
    }
  }
});

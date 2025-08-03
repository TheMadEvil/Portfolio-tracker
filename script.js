const people = [
  {
    name: "👤 Your Investments",
    funds: [
      { name: "Axis Liquid Fund", invested: 1026, growwCode: "axis-liquid-direct-growth", status: "Active (6 months)" },
      { name: "Nippon Silver ETF FoF", invested: 3786, growwCode: "nippon-india-silver-etf-fof-direct-growth", status: "Active (6 months)" },
      { name: "Nippon Large Cap", invested: 2914, growwCode: "nippon-india-large-cap-direct-growth", status: "Active (6 months)" },
      { name: "Invesco PSU ETF", invested: 2500, growwCode: "invesco-india-psu-equity-direct-growth", status: "Recent" },
      { name: "Parag Parikh Flexi Cap", invested: 2500, growwCode: "parag-parikh-flexi-cap-direct-growth", status: "Recent" }
    ]
  },
  {
    name: "👩‍💼 Spouse’s Investments",
    funds: [
      { name: "SBI Contra Regular", invested: 16247, growwCode: "sbi-contra-direct-growth", status: "Active (since Dec 2024)" },
      { name: "SBI Large & Mid Regular", invested: 8371.95, growwCode: "sbi-large-midcap-direct-growth", status: "Active" },
      { name: "SBI Small Cap Regular", invested: 16428, growwCode: "sbi-small-cap-direct-growth", status: "Active" }
    ]
  }
];

async function fetchGrowwNAV(code) {
  try {
    const res = await fetch(`https://groww.in/v1/api/mf_service/schemes/${code}`);
    const data = await res.json();
    return data.nav;
  } catch {
    return null;
  }
}

async function renderDashboard() {
  const dash = document.getElementById("dashboard");
  dash.innerHTML = "";
  let labels = [], investedData = [], liveData = [];

  let combinedTotal = 0;

  for (const person of people) {
    let block = document.createElement("div");
    block.className = "person-block";

    let html = `<h2>${person.name}</h2>
    <table>
      <tr><th>Fund Name</th><th>Amount Invested (₹)</th><th>Live NAV (₹)</th><th>Status</th><th>Live Value (₹)</th><th>Profit/Loss (%)</th></tr>`;

    let personTotal = 0;

    for (const fund of person.funds) {
      const nav = await fetchGrowwNAV(fund.growwCode);
      const units = fund.invested / (nav || 1);
      const liveValue = nav ? units * nav : fund.invested;
      const profitLoss = nav ? (((liveValue - fund.invested) / fund.invested) * 100).toFixed(2) : "—";

      html += `<tr>
        <td>${fund.name}</td>
        <td>₹${fund.invested.toLocaleString()}</td>
        <td>${nav ? `₹${nav.toFixed(2)}` : "—"}</td>
        <td>${fund.status}</td>
        <td>₹${liveValue.toFixed(2).toLocaleString()}</td>
        <td>${nav ? `${profitLoss}%` : "—"}</td>
      </tr>`;

      labels.push(fund.name);
      investedData.push(fund.invested);
      liveData.push(liveValue);
      personTotal += fund.invested;
    }

    html += `</table><p><strong>✅ Total (${person.name}): ₹${personTotal.toLocaleString()} invested</strong></p>`;
    combinedTotal += personTotal;

    block.innerHTML = html;
    dash.appendChild(block);
  }

  dash.innerHTML += `
    <h2>🧮 Combined Investment Summary</h2>
    <table>
      <tr><th>Category</th><th>Amount (₹)</th></tr>
      <tr><td>Your Portfolio</td><td>₹12,726</td></tr>
      <tr><td>Spouse’s Portfolio</td><td>₹41,046.95</td></tr>
      <tr><td><strong>Combined Total</strong></td><td><strong>₹53,772.95</strong></td></tr>
    </table>`;

  renderChart(labels, investedData, liveData);
}

function renderChart(labels, investedData, liveData) {
  const ctx = document.getElementById("portfolioChart").getContext("2d");
  if (window.portfolioChart) window.portfolioChart.destroy();

  window.portfolioChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Amount Invested (₹)",
          data: investedData,
          backgroundColor: "#3498db"
        },
        {
          label: "Live Value (₹)",
          data: liveData,
          backgroundColor: "#2ecc71"
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: true }
      },
      scales: {
        y: { beginAtZero: false }
      }
    }
  });
}

renderDashboard();

const people = [
  {
    name: "👤 Your Investments",
    funds: [
      { name: "Axis Liquid Fund", invested: 1026, ticker: "AXISLIQUID.NS" },
      { name: "Nippon Silver ETF FoF", invested: 3786, ticker: "NIPPONSILVER.NS" },
      { name: "Nippon Large Cap", invested: 2914, ticker: "NIPPONLARGE.NS" },
      { name: "Invesco PSU ETF", invested: 2500, ticker: "INVPSUETF.NS" },
      { name: "Parag Parikh Flexi Cap", invested: 2500, ticker: "PARAGFLEXI.NS" }
    ]
  },
  {
    name: "👩‍💼 Spouse’s Investments",
    funds: [
      { name: "SBI Contra Regular", invested: 16247, ticker: "SBICONTRA.NS" },
      { name: "SBI Large & Mid Regular", invested: 8371.95, ticker: "SBILARGEMID.NS" },
      { name: "SBI Small Cap Regular", invested: 16428, ticker: "SBISMALLCAP.NS" }
    ]
  }
];

// Fetch current price from Yahoo (public) via scraping JSON inside page
async function fetchLivePrice(ticker) {
  try {
    const response = await fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${ticker}?interval=1d&range=1d`);
    const data = await response.json();
    return data.chart.result[0].indicators.quote[0].close[0];
  } catch (error) {
    console.warn("Failed to fetch price for", ticker);
    return null;
  }
}

async function renderDashboard() {
  const dash = document.getElementById("dashboard");
  dash.innerHTML = "";
  let labels = [], investedData = [], liveData = [];

  for (const person of people) {
    const block = document.createElement("div");
    block.className = "person-block";

    let html = `<h2>${person.name}</h2>
      <table>
        <tr>
          <th>Fund Name</th>
          <th>Amount Invested (₹)</th>
          <th>Live Value (₹)</th>
          <th>Profit/Loss (%)</th>
        </tr>`;

    let personTotal = 0;

    for (const fund of person.funds) {
      const liveValue = await fetchLivePrice(fund.ticker);
      const profitLoss = liveValue
        ? (((liveValue - fund.invested) / fund.invested) * 100).toFixed(2)
        : "—";

      html += `<tr>
        <td>${fund.name}</td>
        <td>₹${fund.invested.toLocaleString()}</td>
        <td>${liveValue ? `₹${liveValue.toFixed(2).toLocaleString()}` : "—"}</td>
        <td>${liveValue ? `${profitLoss}%` : "—"}</td>
      </tr>`;

      labels.push(fund.name);
      investedData.push(fund.invested);
      liveData.push(liveValue || null);
      personTotal += fund.invested;
    }

    html += `</table><p><strong>✅ Total (${person.name}): ₹${personTotal.toLocaleString()} invested</strong></p>`;
    block.innerHTML = html;
    dash.appendChild(block);
  }

  renderChart(labels, investedData, liveData);
}

function renderChart(labels, investedData, liveData) {
  const ctx = document.getElementById("portfolioChart").getContext("2d");
  if (window.portfolioChart) window.portfolioChart.destroy();

  window.portfolioChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Invested Amount (₹)",
          data: investedData,
          borderColor: "#3498db",
          fill: false,
          tension: 0.3
        },
        {
          label: "Live Value (₹)",
          data: liveData,
          borderColor: "#27ae60",
          fill: false,
          tension: 0.3
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

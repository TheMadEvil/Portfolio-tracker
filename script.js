const youData = [
  { name: "Axis Liquid Fund", amount: 1026, return: "+1.35%" },
  { name: "Nippon Silver ETF FoF", amount: 3786, return: "–3.79%" },
  { name: "Nippon Large Cap", amount: 2914, return: "–1.85%" },
  { name: "Invesco PSU ETF", amount: 2500, return: "—" },
  { name: "Parag Parikh Flexi Cap", amount: 2500, return: "—" }
];

const spouseData = [
  { name: "SBI Contra Regular", amount: 16247, return: "+1.55%" },
  { name: "SBI Large & Mid Regular", amount: 8371.95, return: "+4.65%" },
  { name: "SBI Small Cap Regular", amount: 16428, return: "+2.68%" }
];

function renderData(data, elementId) {
  const tbody = document.getElementById(elementId);
  tbody.innerHTML = "";
  data.forEach(item => {
    const row = `
      <tr class="border-b">
        <td class="py-2">${item.name}</td>
        <td class="text-center">₹${item.amount.toLocaleString()}</td>
        <td class="text-center">${item.return}</td>
      </tr>
    `;
    tbody.innerHTML += row;
  });
}

renderData(youData, "you-data");
renderData(spouseData, "spouse-data");

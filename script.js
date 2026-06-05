const inputs = {
  purpose: document.getElementById("purpose"),
  spend: document.getElementById("spend"),
  purchases: document.getElementById("purchases"),
  satisfaction: document.getElementById("satisfaction"),
  queue: document.getElementById("queue"),
  staff: document.getElementById("staff")
};

const valueLabels = {
  spend: document.getElementById("spendValue"),
  purchases: document.getElementById("purchasesValue"),
  satisfaction: document.getElementById("satisfactionValue"),
  queue: document.getElementById("queueValue"),
  staff: document.getElementById("staffValue")
};

function updateSliderLabels() {
  valueLabels.spend.textContent = `€${inputs.spend.value}`;
  valueLabels.purchases.textContent = inputs.purchases.value;
  valueLabels.satisfaction.textContent = `${Number(inputs.satisfaction.value).toFixed(1)}/5`;
  valueLabels.queue.textContent = `${inputs.queue.value} min`;
  valueLabels.staff.textContent = `${Number(inputs.staff.value).toFixed(1)}/5`;
}

function normalizeScores(scores) {
  const total = Object.values(scores).reduce((a, b) => a + b, 0);
  const normalized = {};
  for (const key in scores) {
    normalized[key] = Math.round((scores[key] / total) * 100);
  }
  return normalized;
}

function predict() {
  const purpose = inputs.purpose.value;
  const spend = Number(inputs.spend.value);
  const purchases = Number(inputs.purchases.value);
  const satisfaction = Number(inputs.satisfaction.value);
  const queue = Number(inputs.queue.value);
  const staff = Number(inputs.staff.value);

  let scores = {
    business: 20,
    leisure: 25,
    retail: 20,
    risk: 15
  };

  if (purpose === "business") scores.business += 35;
  if (purpose === "family" || purpose === "holiday") scores.leisure += 30;
  if (purpose === "other") scores.leisure += 10;

  scores.retail += spend * 0.8;
  scores.retail += purchases * 12;

  scores.business += Math.max(0, 30 - queue) * 0.5;
  scores.risk += queue * 0.7;

  scores.leisure += satisfaction * 5;
  scores.retail += satisfaction * 4;
  scores.business += staff * 4;

  if (satisfaction < 3) scores.risk += 35;
  if (staff < 3) scores.risk += 25;
  if (spend < 8 && purchases === 0) scores.risk += 8;

  const pct = normalizeScores(scores);
  const groups = [
    ["Business Traveler", pct.business, "business"],
    ["Leisure Traveler", pct.leisure, "leisure"],
    ["Retail-Oriented Traveler", pct.retail, "retail"],
    ["Experience-Risk Traveler", pct.risk, "risk"]
  ].sort((a, b) => b[1] - a[1]);

  const top = groups[0];

  document.getElementById("businessPct").textContent = `${pct.business}%`;
  document.getElementById("leisurePct").textContent = `${pct.leisure}%`;
  document.getElementById("retailPct").textContent = `${pct.retail}%`;
  document.getElementById("riskPct").textContent = `${pct.risk}%`;

  document.getElementById("businessBar").style.width = `${pct.business}%`;
  document.getElementById("leisureBar").style.width = `${pct.leisure}%`;
  document.getElementById("retailBar").style.width = `${pct.retail}%`;
  document.getElementById("riskBar").style.width = `${pct.risk}%`;

  document.getElementById("topGroup").textContent = `${top[0]} (${top[1]}%)`;

  const explanations = {
    business: "This passenger is most likely a business traveler because the profile values efficiency, low waiting time and strong staff service.",
    leisure: "This passenger is most likely a leisure traveler because the profile matches holiday or family travel behaviour.",
    retail: "This passenger is most likely retail-oriented because the profile shows higher spending and more airport purchases.",
    risk: "This passenger is most likely experience-risk because the profile shows lower satisfaction, longer queue time or weaker service experience."
  };

  const recommendations = {
    business: "Marketing action: offer Fast Track Security, business parking packages and efficiency-focused communication.",
    leisure: "Marketing action: offer family deals, food vouchers, holiday campaigns and bundled airport services.",
    retail: "Marketing action: offer duty-free discounts, restaurant vouchers, shopping bundles and loyalty promotions.",
    risk: "Marketing action: offer recovery vouchers, proactive customer support and service improvement follow-up."
  };

  document.getElementById("explanation").textContent = explanations[top[2]];
  document.getElementById("recommendation").textContent = recommendations[top[2]];
}

Object.values(inputs).forEach(input => {
  input.addEventListener("input", () => {
    updateSliderLabels();
    predict();
  });
});

document.getElementById("predictBtn").addEventListener("click", predict);

updateSliderLabels();
predict();

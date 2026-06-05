const fields = {
  purpose: document.getElementById("purpose"),
  spend: document.getElementById("spend"),
  purchase: document.getElementById("purchase"),
  satisfaction: document.getElementById("satisfaction"),
  staff: document.getElementById("staff"),
  complaint: document.getElementById("complaint")
};

function normalize(scores) {
  const total = Object.values(scores).reduce((sum, value) => sum + value, 0);
  const result = {};
  Object.keys(scores).forEach(key => result[key] = Math.round((scores[key] / total) * 100));
  return result;
}

function predict() {
  const purpose = fields.purpose.value;
  const spend = Number(fields.spend.value || 0);
  const purchase = Number(fields.purchase.value || 0);
  const satisfaction = Number(fields.satisfaction.value || 0);
  const staff = Number(fields.staff.value || 0);
  const complaint = Number(fields.complaint.value || 0);

  let scores = {
    high: 20,
    loyal: 20,
    revenue: 20,
    risk: 20
  };

  // High-value passengers: strong spend and purchases, with good satisfaction.
  scores.high += spend * 0.8 + purchase * 12 + satisfaction * 5;

  // Loyal passengers: strong satisfaction and staff service, low complaint likelihood.
  scores.loyal += satisfaction * 12 + staff * 10 + Math.max(0, 40 - complaint) * 0.7;

  // Revenue opportunity: good experience but low current spend/purchases.
  scores.revenue += Math.max(0, 45 - spend) * 0.6 + Math.max(0, 3 - purchase) * 10 + satisfaction * 7;

  // At-risk: low satisfaction/staff score and high complaint likelihood.
  scores.risk += complaint * 1.1 + Math.max(0, 3.5 - satisfaction) * 24 + Math.max(0, 3.5 - staff) * 20;

  if (purpose === "business") {
    scores.high += 10;
    scores.loyal += 8;
  }
  if (purpose === "leisure" || purpose === "family") {
    scores.revenue += 8;
    scores.high += 5;
  }

  const pct = normalize(scores);

  const ranking = [
    ["High-Value Passenger", pct.high, "high"],
    ["Loyal Passenger", pct.loyal, "loyal"],
    ["Revenue Opportunity Passenger", pct.revenue, "revenue"],
    ["At-Risk Passenger", pct.risk, "risk"]
  ].sort((a, b) => b[1] - a[1]);

  const top = ranking[0];

  document.getElementById("pctHigh").textContent = pct.high + "%";
  document.getElementById("pctLoyal").textContent = pct.loyal + "%";
  document.getElementById("pctRevenue").textContent = pct.revenue + "%";
  document.getElementById("pctRisk").textContent = pct.risk + "%";

  document.getElementById("barHigh").style.width = pct.high + "%";
  document.getElementById("barLoyal").style.width = pct.loyal + "%";
  document.getElementById("barRevenue").style.width = pct.revenue + "%";
  document.getElementById("barRisk").style.width = pct.risk + "%";

  document.getElementById("topGroup").textContent = top[0] + " (" + top[1] + "%)";

  const explanations = {
    high: "This passenger is valuable because the profile shows strong airport spending, purchase activity and satisfaction.",
    loyal: "This passenger is likely to stay satisfied because the profile shows high satisfaction, strong staff service and low complaint likelihood.",
    revenue: "This passenger has potential because the experience is positive, but spending and purchase frequency can still be improved.",
    risk: "This passenger needs attention because the profile shows higher complaint risk or weaker satisfaction/service scores."
  };

  const recommendations = {
    high: "Recommended action: increase non-aviation revenue with targeted retail offers, loyalty promotions and premium airport services.",
    loyal: "Recommended action: maintain service quality and use loyalty campaigns to encourage repeat use of Eindhoven Airport.",
    revenue: "Recommended action: use store vouchers, restaurant discounts and bundled offers to convert satisfaction into higher airport spending.",
    risk: "Recommended action: improve service recovery, reduce complaint drivers and follow up with support or compensation offers."
  };

  document.getElementById("explanation").textContent = explanations[top[2]];
  document.getElementById("recommendation").textContent = recommendations[top[2]];
}

document.getElementById("run").addEventListener("click", predict);
Object.values(fields).forEach(field => field.addEventListener("input", predict));
predict();

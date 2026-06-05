const groups = {
  business: {
    name: "Efficient Business Traveler",
    reason: "Business purpose, shorter dwell time and lower retail focus suggest a passenger who values speed and convenience.",
    rec: "Promote Fast Track security, business parking packages and quick coffee/food offers before the flight.",
    share: "24%"
  },
  leisure: {
    name: "Holiday Leisure Traveler",
    reason: "Leisure travel and medium dwell time suggest a passenger who responds well to holiday and family-oriented offers.",
    rec: "Promote seasonal duty-free bundles, family food deals and vacation-related retail campaigns.",
    share: "41%"
  },
  retail: {
    name: "Retail-Oriented Passenger",
    reason: "High spend and long dwell time indicate strong potential for non-aviation revenue.",
    rec: "Offer restaurant vouchers, store discounts and loyalty promotions to increase spending during dwell time.",
    share: "21%"
  },
  risk: {
    name: "Experience-Risk Passenger",
    reason: "Lower satisfaction, longer queue time or lower staff service score indicate higher complaint risk.",
    rec: "Send a service recovery voucher, provide proactive support and prioritize follow-up communication.",
    share: "14%"
  }
};

function clamp(n,min,max){ return Math.max(min, Math.min(max,n)); }

function predict(){
  const purpose = document.getElementById('purpose').value;
  const spend = Number(document.getElementById('spend').value || 0);
  const dwell = Number(document.getElementById('dwell').value || 0);
  const satisfaction = Number(document.getElementById('satisfaction').value || 0);
  const queue = Number(document.getElementById('queue').value || 0);
  const service = Number(document.getElementById('service').value || 0);

  let scores = {business:20, leisure:20, retail:20, risk:20};
  if(purpose === 'business') scores.business += 35;
  if(purpose === 'leisure' || purpose === 'family') scores.leisure += 30;
  if(spend >= 30) scores.retail += 35; else if(spend >= 18) scores.retail += 18;
  if(dwell >= 70) { scores.retail += 20; scores.leisure += 12; }
  if(dwell <= 35) scores.business += 18;
  if(satisfaction < 3.2) scores.risk += 30;
  if(queue > 25) scores.risk += 20;
  if(service < 3.4) scores.risk += 20;
  if(satisfaction >= 4 && service >= 4) { scores.leisure += 8; scores.retail += 8; }

  const winner = Object.entries(scores).sort((a,b)=>b[1]-a[1])[0];
  const total = Object.values(scores).reduce((a,b)=>a+b,0);
  const likelihood = clamp(Math.round((winner[1]/total)*100 + 35), 55, 92);
  const g = groups[winner[0]];

  document.getElementById('segmentName').textContent = g.name;
  document.getElementById('confidenceText').textContent = likelihood + '%';
  document.getElementById('confidenceBar').style.width = likelihood + '%';
  document.getElementById('segmentReason').textContent = g.reason;
  document.getElementById('recommendationBox').innerHTML = `<h3>Recommended campaign</h3><p>${g.rec}</p>`;
  document.getElementById('shareKpi').textContent = g.share;
}

document.getElementById('runBtn').addEventListener('click', predict);
predict();

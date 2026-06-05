const $ = id => document.getElementById(id);
const val = id => Number($(id).value || 0);
const clamp = (n,min,max)=>Math.max(min,Math.min(max,n));
const fmtEuro = n => new Intl.NumberFormat('en-NL',{style:'currency',currency:'EUR',maximumFractionDigits:0}).format(n);
const fmt1 = n => `${n.toFixed(1)}/10`;

function employeePrediction(){
  const overtime=val('overtime'), absenteeism=val('absenteeism'), empSat=val('empSat'), workload=val('workload'), training=val('training'), turnover=val('turnover');
  const risk = clamp((overtime*2.2)+(absenteeism*3.2)+((5-empSat)*12)+(workload*7)+((100-training)*0.18)+(turnover*1.1)-28,0,100);
  const score = clamp(10 - risk/10, 0, 10);
  $('burnoutResult').textContent = `${Math.round(risk)}%`;
  $('burnoutBar').style.width = `${risk}%`;
  $('burnoutAdvice').textContent = risk>60 ? 'High risk: reduce overtime, improve staffing coverage and focus on departments with low satisfaction.' : risk>35 ? 'Medium risk: monitor workload and absenteeism before it affects passenger service.' : 'Low risk: current HR KPIs support stable airport operations.';
  $('empScore').textContent = fmt1(score);
  return {risk,score};
}

function passengerPrediction(){
  const queue=val('queue'), passSat=val('passSat'), complaints=val('complaints'), staffAvail=val('staffAvail'), wayfinding=val('wayfinding'), cleanliness=val('cleanliness');
  const score = clamp((passSat*1.55)+(wayfinding*.75)+(cleanliness*.65)+(staffAvail/100*1.2)-(queue*.055)-(complaints*.16),0,10);
  const risk = clamp(100-score*10,0,100);
  let group='Smooth Journey';
  if(score<5.5) group='Frustrated Journey';
  else if(score<7.2) group='Neutral Journey';
  else if(queue<10 && passSat>=4.2) group='High Satisfaction Journey';
  $('journeyResult').textContent = group;
  $('passengerScoreText').textContent = `Experience score: ${fmt1(score)} | Frustration risk: ${Math.round(risk)}%`;
  $('passengerBar').style.width = `${score*10}%`;
  $('passengerAdvice').textContent = score<6 ? 'Priority: reduce queue time and complaints because these directly lower the passenger journey score.' : score<7.5 ? 'Good but unstable: improve wayfinding and staff availability to prevent frustration during busy periods.' : 'Strong journey: passenger KPIs are supporting a positive airport experience.';
  $('passScore').textContent = fmt1(score);
  return {score,risk,group};
}

function storePrediction(){
  const pax=val('pax'), conversion=val('conversion')/100, avgSpend=val('avgSpend'), dwell=val('dwell'), openRate=val('openRate')/100, occupancy=val('occupancy')/100;
  const dwellFactor = clamp(0.82 + dwell/120, 0.85, 1.18);
  const revenue = pax * conversion * avgSpend * dwellFactor * openRate * occupancy;
  const target = 52000;
  const score = clamp((revenue/target)*8.2,0,10);
  $('revenueResult').textContent = fmtEuro(revenue);
  $('revenueBar').style.width = `${clamp(score*10,0,100)}%`;
  $('revenueAdvice').textContent = score<6 ? 'Commercial gap: increase store opening rate, retail occupancy or conversion during peak passenger flows.' : score<8 ? 'Moderate performance: revenue can improve by increasing conversion and average transaction value.' : 'Strong performance: non-aviation revenue is supporting the airport business model.';
  $('commercialScore').textContent = fmt1(score);
  return {revenue,score};
}

function overallPrediction(){
  const emp=employeePrediction();
  const pass=passengerPrediction();
  const store=storePrediction();
  const overall = clamp((pass.score*.40)+(emp.score*.35)+(store.score*.25),0,10);
  $('overallScore').textContent = fmt1(overall);
  $('heroScore').textContent = fmt1(overall);
  const scores = [{name:'employee wellbeing',score:emp.score},{name:'passenger experience',score:pass.score},{name:'non-aviation revenue',score:store.score}].sort((a,b)=>a.score-b.score);
  $('priorityAdvice').textContent = `First priority: improve ${scores[0].name}, because it is currently the weakest KPI area and pulls down the total Eindhoven Airport score.`;
}

document.querySelectorAll('input').forEach(input=>input.addEventListener('input', overallPrediction));
overallPrediction();


function predict(){
const spend=Number(document.getElementById('spend').value);
const purchase=Number(document.getElementById('purchase').value);
const sat=Number(document.getElementById('satisfaction').value);
const staff=Number(document.getElementById('staff').value);
const complaint=Number(document.getElementById('complaint').value);

let high=20+spend+purchase*10+sat*5;
let loyal=20+sat*12+staff*10;
let revenue=20+(50-spend)+sat*5;
let risk=20+complaint*2;

let arr=[
['High-Value Passenger',high],
['Loyal Passenger',loyal],
['Revenue Opportunity Passenger',revenue],
['At-Risk Passenger',risk]
];

arr.sort((a,b)=>b[1]-a[1]);
let total=high+loyal+revenue+risk;
let top=Math.round(arr[0][1]/total*100);

document.getElementById('group').innerText=arr[0][0];
document.getElementById('chance').innerText=top+'%';
document.getElementById('fill').style.width=top+'%';

document.getElementById('breakdown').innerHTML=
'High-Value Passenger: '+Math.round(high/total*100)+'%<br>'+
'Loyal Passenger: '+Math.round(loyal/total*100)+'%<br>'+
'Revenue Opportunity Passenger: '+Math.round(revenue/total*100)+'%<br>'+
'At-Risk Passenger: '+Math.round(risk/total*100)+'%';

document.getElementById('recommendation').innerText=
arr[0][0]=='High-Value Passenger' ?
'Increase non-aviation revenue with targeted retail offers and loyalty promotions.' :
arr[0][0]=='Loyal Passenger' ?
'Focus on retention and repeat-use campaigns.' :
arr[0][0]=='Revenue Opportunity Passenger' ?
'Use vouchers and store promotions to increase spending.' :
'Improve service recovery and reduce complaints.';

document.getElementById('explanation').innerText='The AI predicts this passenger is most likely to belong to this customer group based on the selected KPI values.';
}
predict();

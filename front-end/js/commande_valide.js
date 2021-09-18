validRequest();
function validRequest() {
   let response=localStorage.getItem('response');
   response=JSON.parse(response);

  document.querySelector('.firstname').innerHTML=`${response.contact.firstName}`;
  document.querySelector('.identificator-number').innerHTML=`${response.orderId}`
  document.querySelector('.valide-price').innerHTML=localStorage.getItem('totalCost'); 
}
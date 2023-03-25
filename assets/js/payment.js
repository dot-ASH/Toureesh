const amount = document.getElementById("amountI");
const price = document.getElementById("priceI");

let priceVal = price.value;
function myChangeFunction(input1) {
  input1 = amount.value;
  console.log(input1);
  price.value = priceVal * input1;
  console.log(price.value);
}

// function getResult(selectedValue) {
//   selectedValue = document.querySelector("#packageSelect");
//   console.log(selectedValue.value);
//   $.ajax({
//     type: "POST",
//     url: "/paymentCheck", //this  should be replace by your server side method
//     data: selectedValue.value, //this is parameter name , make sure parameter name is sure as of your sever side method
//     contentType: "application/json; charset=utf-8",
//     dataType: "json",
//     async: true,
//     success: function (Result) {
//       console.log(Result.d);
//     },
//     error: function (jqXHR, textStatus, errorThrown) {
//       alert(errorThrown);
//     },
//   });
// }

function getResult() {
  document.priceForm.action = "/paymentCheck";
  document.priceForm.submit();
}

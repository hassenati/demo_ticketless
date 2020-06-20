// Get the date and time at which we edit the receipt
let date = new Date();
var months = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];
var days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
let myDate =
  days[date.getDay()] +
  " , " +
  date.getDate() +
  "/" +
  months[date.getMonth()] +
  "/" +
  date.getFullYear() +
  " , " +
  date.getHours() +
  ":" +
  date.getMinutes() +
  ":" +
  date.getSeconds();

document.getElementById("date").innerHTML = myDate; //places the date where we want it to appear
document.getElementById("receiptDate").innerHTML = myDate;




// Definition of important global variables
let productData = document.getElementById("productId"); //productData = variable to get only the products of the chosen brand in the <select> dropdown menu
let retrievedObject;
let tempProduct = []; //list of all the products of the selected brand
let tempProductQuantity = []; //list of the quantity of the tempProducts, which will dynamically be updated and called to calculate the total amount




// Function to set the good elements (images, products...) according to what the user has chosen in the indexConnect page
function myFunction() {
  
  // Useful variables to display the good receipt (brand logo, store address...)
  let localBrand = JSON.parse(localStorage.getItem("brand"));
  let brandName = document.getElementById("brand-id");
  let headerBrandName = document.getElementById("header-brand-id");
  let storePhoneNumber = document.getElementById("phone");
  let storeStreetName = document.getElementById("street");
  let storeOpeningHours = document.getElementById("openingHours");
  document.getElementById("seller").textContent += localBrand;  //change the seller name on the receipt (seller name = brand name here)
  
  //Loops to set the correct brand name and logo
  if (
    localBrand != null &&
    localBrand != undefined &&
    localBrand != "undefined"
  ) {
    if (localBrand == "Parfums Christian Dior") {
      out = `<img src="/images/pos/pcdReceiptLogo.png" alt="">`;
      headOut = `<img src="/images/pos/pcdLogo.png" alt="">`;
      headerBrandName.innerHTML = headOut;
      brandName.innerHTML = out;
    } else if (localBrand == "Acqua Di Parma") {
      out = `<img src="/images/pos/adpReceiptLogo.png">`;
      headOut = `<img src="/images/pos/adpLogo.png">`;
      headerBrandName.innerHTML = headOut;
      brandName.innerHTML = out;
    } else if (localBrand == "Louis Vuitton") {
      out = `<img src="/images/pos/lvReceiptLogo.png">`;
      headOut = `<img src="/images/pos/lvLogo.png">`;
      headerBrandName.innerHTML = headOut;
      brandName.innerHTML = out;
    } else {
      out = `<img src="/images/pos/guerlainReceiptLogo.png">`;
      headOut = `<img src="/images/pos/guerlainLogo.png">`;
      headerBrandName.innerHTML = headOut;
    }
  }
  retrievedObject = JSON.parse(localStorage.getItem("allData"));
  let retrievedStoreName = JSON.parse(localStorage.getItem("storeName"));
  let productOut = "";
  
  //Loop to fill the tempProduct and tempProductQuantity lists with the product names and their quantity. Plus enabling the options of the dropdown select menu
  retrievedObject.forEach((data) => {
    if (data.brand == localBrand) {
      data.product.forEach((product) => {
        tempProduct.push(product.productName);  //filling the tempProdct list. Warning: tempProduct[0]="Products", but it doesn't matter
      });
      tempProduct.forEach((t, index) => {
        tempProductQuantity.push(1);  //assign to each product in tempProduct, the value of their quantity (initially, quantity = 1 for all)
        if (index == 0) {
          productOut += `<option selected='true' disabled='disabled' value="${t}">${t}</option>`; //disable the option "Products" in the dropdown select menu
        } else {
          productOut += `<option value="${t}">${t}</option>`; //enables the options of the products in the dropdown select menu
        }
      });
    }
    productData.innerHTML = productOut;
  });
  
  // Set up of the street/phone/hours of the selected store and brand
  let streetOfStore;
  retrievedObject.forEach((store) => {
    let local = localBrand;
    if (
      local == "Parfums Christian Dior" ||
      local == "Acqua Di Parma" ||
      local == "Louis Vuitton" ||
      local == "Guerlain"
    ) {
      store.stores.forEach((s) => {
        if (retrievedStoreName == s.name) {
          s.address.forEach((a) => {
            streetOfStore = a.street;
            phoneNumber = a.phone;
            openingHours = a.openingHours;
          });
        }
      });
    }
  });
  storeStreetName.innerHTML = streetOfStore;
  storePhoneNumber.innerHTML = phoneNumber;
  storeOpeningHours.innerHTML = openingHours;
}




// Definition of new important global variables
let tempTotal = 0;  //the net total of all the chosen products
let productsList = [];  //list of all the products we display on the receipt (A TERME DANS LA DEMOv2, peut etre à virer : c'est la meme chose que checkRepetition, à voir)
let checkRepetition = []; //list, initially empty, that will get the items we choose --> to avoid each time a new item is chosen, we add it only if it's NOT in the list
let totalNet = document.getElementById("total-net");
let totalTVA = document.getElementById("total-tva");




// Function that displays a new product on the receipt EACH TIME we click on a product of the dropdown select menu
function getProduct(value) {
  let basket = document.getElementById("basket-id");  //basket = where we will dynamically write our HTML code (a div for each product we select)
  let output = "";  //initiation of our embededJS
  
  //Loops to use embededJS and dynamically display our products/quantities...
  retrievedObject.forEach((getItems) => {
    getItems.product.forEach((item) => {
      let tempProductIndex = tempProduct.indexOf(String(item.productName)); //tempProduct index will be used to link the two lists tempProduct (list of all the products) amd tempProductQuantity (list of their quantity)
      if (value == item.productName) {
        item.items.forEach((itemDetails) => {
          
          // If the product has already been chosen and already appears on the receipt (so the user clicked AGAIN on the product), we increment the quantity of 1 (in the imput box & in the tempProductQuantity list & the net total)
          if (checkRepetition.includes(itemDetails.itemName)) {
            formerValue = document.getElementById("inputBox_"+itemDetails.itemID).value;  //the former value in the input box
            newValue = parseInt(formerValue) + 1; //when we click again on a product, its quantity increases by 1 in the input box
            document.getElementById("inputBox_"+itemDetails.itemID).setAttribute("value", newValue);  // we set the new quantity in the input box
            let newTotalValue = parseInt(totalNet.textContent); //we calculate new total and TVA
            newTotalValue += (newValue-formerValue)*itemDetails.itemPrice;  //RQE for DEMOv2 : could be easier, we just have to +=itemDetails.itemPrice
            totalNet.innerHTML = newTotalValue.toFixed(2);  //update of the net total and the TVA
            totalTVA.innerHTML = (newTotalValue*0.2).toFixed(2);
            tempProductQuantity[tempProductIndex] += 1; //update of the tempProductQuantity list
          
            // If the element has not yet been chosen in the product list, we add it to the receipt
          } else {
            checkRepetition.push(itemDetails.itemName); //adds the name into the checkRepetition list
            
            // If/Else to correcly display the net total
            if (checkRepetition.length == 1) {  //if it's the 1st product we choose, we display a first total and TVA
              totalNet.innerHTML = "";
              totalTVA.innerHTML = "";
              totalNet.innerHTML = (itemDetails.itemPrice).toFixed(2);
              totalTVA.innerHTML = ((itemDetails.itemPrice)*0.2).toFixed(2);
            } else {  //if it is a second or more product, we update the total and TVA
              let newItemPrice = itemDetails.itemPrice;
              let formerTotalNet = parseInt(document.getElementById("total-net").innerText);
              let formerTotalTVA = parseInt(document.getElementById("total-tva").innerText);
              totalNet.innerHTML = (formerTotalNet + newItemPrice).toFixed(2);
              totalTVA.innerHTML = (formerTotalTVA + (newItemPrice*0.2)).toFixed(2);
            }
            
            //If loop for the emebededJS, to generate the output value (= the HTML code we will add)
            if (itemDetails.itemID) {
              output += "<div class='productRef'><div class='refNumber'>" + itemDetails.itemID + "</div>";
            }
            if (itemDetails.itemName) {
              output +=
                "<div class='refName'>" + itemDetails.itemName + "</div></div>";
            }
            if (itemDetails.itemPrice) {
              output +=
              "<div class='productText'><div class='textPU'>PU Brut</div><div class='textQtty'>Qte</div></div>" + "<div class='productPrice'><div class='pricePU' id='puBrut_"+itemDetails.itemID+"'>" +(tempProductQuantity[tempProductIndex]*itemDetails.itemPrice)+ "</div>";
            }
            if (itemDetails.qty) {
              output +=
                "<div class='priceQtty'><input value='1' id='inputBox_"+itemDetails.itemID+"' class='inputStyle' type='number' min='1' onchange='changeQty(this.value,inputBox_"+itemDetails.itemID+")'></div></div>";  
              }
          }})
          
          // Generates the HTML code we put in indexPOS.html for the chosen product
          let addDiv = "<div class='basket_product'>" + output + "</div>";
          let obj = { output };
          //If we add more than 5 products, the receipt becomes a scroll bar
          productsList.push(obj);
          if (productsList.length >= 5) {
            basket.style.overflowY = "scroll";
          }
          basket.innerHTML += addDiv;
      }})})}




// Function in case we change the quantity of an input box --> updates the value of the tempProductQuantity list, of the net total and the TVA, and of the input
function changeQty (newQty, element) {
  element.setAttribute("value", newQty);  //we set the value of the input box at the new quantity selected (so that when we select another item, the values remains the same)
  let formerTotalElement = parseInt(totalNet.textContent);
  let newTotalElement = formerTotalElement;
  console.log(productsList);
  console.log(tempProduct, tempProductQuantity);

  // Loops to update the total, and the quantity of the product
  retrievedObject.forEach((getItems) => {
    console.log(getItems);
    getItems.product.forEach((item) => {
      if (tempProduct.includes(String(item.productName)) && (item.productName!="Products")) {
        if (element.id == "inputBox_"+item.items[0].itemID) {
          let tempProductIndex = tempProduct.indexOf(String(item.productName));
          let formerQty = tempProductQuantity[tempProductIndex];  //variable that store the former quantity (before change) of the product
          newTotalElement += (newQty-formerQty)*item.items[0].itemPrice;  //updates the new net total, with the difference in the number of product, multiplied by the product price
          totalNet.innerHTML = newTotalElement.toFixed(2);  //displays the values
          totalTVA.innerHTML = (newTotalElement*0.2).toFixed(2);
          tempProductQuantity[tempProductIndex] = parseInt(newQty); //updates the list tempProductQuantity

          // 2 LIGNES DU DESSOUS : AU CAS OU ON VEUILLE METTRE PU_BRUT DE LA SOMME DES ITEMS CHOISIS (sans ces lignes, le PU Brut est le prix d'1 seul produit)
          // let newPU = document.getElementById("puBrut_"+item.items[0].itemID);
          // newPU.textContent = String(item.items[0].itemPrice*newQty); //change la valeur de PU Brut
        }
      }
  })})
}




// Function that POSTs the necessary variables --> local + in /receipt.json
var fs = require('fs');
function postData() {
  
  //push of the information locally : first step, but to erase finally
  let brandLogo = document.getElementById("brand-id");
  brandLogo.setAttribute("class", "headerLogo positioning");
  localStorage.setItem("brandLogo", JSON.stringify(brandLogo.innerHTML));
  localStorage.setItem("totalAmount", JSON.stringify(totalNet.innerHTML));

  //push to receipt.json with node.js
  let listOfProducts = [];  //will contain the data of the products we bought
  retrievedObject.forEach((getItems) => {
    getItems.product.forEach((item) => {
      if (tempProduct.includes(String(item.productName)) && (item.productName!="Products")){
        item.items.forEach((itemDetails) => {
          if (checkRepetition.includes(itemDetails.itemName)) {
            let newProduct = item;
            let tempProductIndex = tempProduct.indexOf(String(item.productName));
            newProduct.productQty = String(tempProductQuantity[tempProductIndex]);
            listOfProducts.push(newProduct);
           }
        });
    }})});

  // The json that we will push on click of the "Pay" button
  const  receipt = {
    "storeInfo": [
      {
          "brand": JSON.parse(localStorage.getItem("brand")),
          "store": JSON.parse(localStorage.getItem("storeName")),
          "address": document.getElementById("street").innerHTML,
          "phoneNumber": document.getElementById("phone").innerHTML,
          "openingHours": document.getElementById("openingHours").innerHTML
      }
  ],
  "purchaseInfo": [
      {
          "time": document.getElementById("receiptDate").innerHTML,
          "products": listOfProducts,
          "payment": [
              {
                  "netTotal": totalNet.innerHTML,
                  "tva": totalTVA.innerHTML
              }
          ]
      }
  ]
  }

  // Creates a .json file called "newReceipt", with all the info
  fs.writeFile('./newReceipt.json', JSON.stringify(receipt, null, 2), err => {
    if (err) {
      console.log(err);
    } else {
      console.log('File successfully written!');
    }
  });



  //TESTS NON CONCLUANTS:
  // var transfer = {
  //   brandName : brandName.innerHTML,
  //   totalAmount : totalNet.innerHTML
  // };
  // export {transfer};

  // $ajax({
  //   url : '/javascript/appConnect.js',
  //   type : POST,
  //   data : 'totalAmount=' + totalNet.innerHTML + '&brandName=' + brandName.innerHTML,
  //   dataType : 'json',
  // });

};

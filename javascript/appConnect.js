let theClass, theDate, allData; // create variables for storing data
const dataInfo = fetch("/json/data.json") // get the data from json folder
  .then(function (resp) {
    return resp.json();
  })
  .then(function (data) {
    console.log(data);
    theClass = data.class;
    dataDate = data.date;
    allData = data.Brands; // storing the data in a variable
  });

// create an empty array to store the market values
let markets = [];
let brandsImage = "";
let showImage = document.getElementById("brand_image");
let storeImage = document.getElementById("myImage");
let selectMarket = document.getElementById("markets");
let store_image = document.getElementById("store_image");
// var a;
let x = document.getElementById("avi");
if (x === "") {
  alert("skdhbck");
}
function random(value) {
  // console.log(value);

  allData.forEach((brand) => {
    let image = brand.image;
    // let store = item.index;
    // console.log(store);
    localStorage.setItem("brand", JSON.stringify(value));
    localStorage.setItem("allData", JSON.stringify(allData));
    let tempMarkets = [];
    if (value === brand.brand) {
      brandsImage = image;
      brand.stores.forEach((store) => {
        tempMarkets.push(store.name);
        // console.log(store.name);
      });
      markets = tempMarkets;
      console.log(typeof markets);
      console.log(markets);
      return markets;
    }
  });
  //console.log(markets);
  let marketsOutput = "";

  markets.forEach((i, index) => {
    // $(selectMarket).append(new Option(i, i));
    //selectMarket.options[selectMarket.options.length] = new Option(i, i);
    // placing the market values into option
    if (index == 0) {
      marketsOutput += `<option selected='true' disabled='disabled' value="${i}">${i}</option>`;
    } else {
      marketsOutput += `<option value="${i}">${i}</option>`;
    }

    // var option = document.createElement("option");
    // option.text = i;
    // option.value = i;
    // selectMarket.add(option);
  });
  // console.log(selectMarket.innerHTML);
  selectMarket.innerHTML = marketsOutput;

  storeImage.src = brandsImage; //displays the logo of the store chosen (in replacement of the image of the client screen)
  store_image.src = '/images/connect/circle.png'; //in case we choose another brand after choosing the store --> disables the store's image in the background

  //console.log(value);
}
function storeChangeImage(value) {
  console.log(value);
  localStorage.setItem("storeName", JSON.stringify(value));
  allData.forEach((brand) => {
    brand.stores.forEach((store) => {
      if (store.name == value) {
        //console.log(store.name);
        //console.log(value);
        //console.log(store.image);
        // storeImage.src = store.image;
        // storeImage.disable = true;
        storeImage.src = '';  //disable the brand logos
        store_image.src = store.image;  //replaces the image of the circle by the image of the store
      }
    });
  });
  document.getElementsByClassName("btn_nodrop")[0].style.pointerEvents =
    "initial";
  document.getElementsByClassName("se_connect")[0].style.color = "black";

  // allData.forEach(function (itemTwo, index) {
  //   console.log(itemTwo.store[index - 1]);
  // });
}

//console.log(data);
// function random(value) {
//   allData.forEach((item) => {
//     a = item.image;
//     localStorage.setItem("brand", JSON.stringify(value));
//     if (value == item.brand) {
//       markets = item.market;
//       outputImg = "<img src = " + a + ">";
//     }
//   });
//   imageOut.innerHTML = outputImg;
//   //console.log(markets);
//   //console.log(markets);
//   let output = "";
//   markets.forEach((i) => {
//     // placing the market values into option
//     output += `<option value="${i}">${i}</option>`;
//   });

//   selectMarket.innerHTML = output;
//   //selectMarket.removeAttribute("hidden");

//   //console.log(allData.market);
// }
// var string = allData;

// let b = localStorage.setItem("added-items", JSON.stringify(string));

//localStorage.setItem("added-items", JSON.stringify(string));

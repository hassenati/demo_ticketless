// Function that gets the variables from appConnect and appPOS.js, and displays the right information
function getData () {
    // TENTATIVE AVEC AJAX
    // $ajax({
    //     url : '/javascript/appPOS.js',
    //     type : 'GET',
    //     data : 'totalAmount=' + totalNet.innerHTML + '&brandName=' + brandName.innerHTML,
    //     dataType : 'json',
    // })

    //TENTATIVE AVEC IMPORT ET EXPORT
    // import {transfer} from "/javascript/appPOS.js";
    // alert (transfer.totalAmount);
    // console.log(totalAmount);

    //TENTATIVE AVEC LE LOCAL STORAGE
    // PASSAGE PAR LE BRAND LOGO
    // const brandLogo = JSON.parse(localStorage.getItem("brandLogo"));
    // console.log(brandLogo);
    // brandLogo.setAttribute("class", "headerLogo positioning");
    // document.getElementById("brandLogo").innerHTML = brandLogo;
    // console.log(document.getElementById("brandLogo"));
    
    let localBrand = JSON.parse(localStorage.getItem("brand"));
    let headerBrandName = document.getElementById("brandLogo");
    if (
        localBrand != null &&
        localBrand != undefined &&
        localBrand != "undefined"
      ) {
        if (localBrand == "Parfums Christian Dior") {
          headOut = `<img class="headerLogo positioning" src="/images/pos/pcdLogo.png" alt="">`;
          headerBrandName.innerHTML = headOut;
        } else if (localBrand == "Acqua Di Parma") {
          headOut = `<img class="headerLogo positioning" src="/images/pos/adpLogo.png">`;
          headerBrandName.innerHTML = headOut;
        } else if (localBrand == "Louis Vuitton") {
          headOut = `<img class="headerLogo positioning" src="/images/pos/lvLogo.png">`;
          headerBrandName.innerHTML = headOut;
        } else {
          headOut = `<img class="headerLogo positioning" src="/images/pos/guerlainLogo.png">`;
          headerBrandName.innerHTML = headOut;
        }
      }

    let totalAmount = JSON.parse(localStorage.getItem("totalAmount"));
    document.getElementById("payAmount").innerHTML = totalAmount + " €";
};

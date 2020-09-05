function init() {
    fetch("https://kea-alt-del.dk/t5/api/categories").then(r => r.json()).then(
    function (data){
        categoriesRecieved(data)
    }
  )
}
init();

function categoriesRecieved(cats) {
    createNavigation(cats);
    createSections(cats);
    fetchProducts();
}

function createSections(categories) {
    //<section id="starter">
    //<h2>Starter</h2>
    categories.forEach(category => {
        const section = document.createElement("section");
        section.setAttribute("id", category);
        const h2 = document.createElement("h2");
        h2.textContent = category;
        section.appendChild(h2);
        document.querySelector(".productlist").appendChild(section);
    })
}

function createNavigation(categories) {
    categories.forEach(cat => {
    console.log(cat)
    const a = document.createElement("a");
    a.textContent = cat;
    a.setAttribute("href", `#${cat}`)
    document.querySelector("nav").appendChild(a);
})
}


function fetchProducts(){
//fetch data
fetch("https://kea-alt-del.dk/t5/api/productlist")
  .then(function(response){
    console.log(response)
    return response.json();
   })
   .then(function(data){
    //console.log(data)
    dataReceived(data);
   })
}

function dataReceived(products){
  //loop through products
  products.forEach(showProduct)
}

//executed once for each product
function showProduct(myProduct){
    console.log(myProduct)
    //finding the template
    const temp = document.querySelector("#productTemplate").content;
    //clone template
    const myCopy = temp.cloneNode(true);

    const img = myCopy.querySelector(".product_image");
    img.setAttribute("src", `https://kea-alt-del.dk/t5/site/imgs/medium/${myProduct.image}-md.jpg`)


    if (!myProduct.discount){
        //console.log("NOT DISCOUNT")
        myCopy.querySelector(".product_discount").classList.add("hidden")
    }

        ////DISCOUNT CALCULATION
    if (myProduct.discount) {
        myCopy.querySelector(".product_discount").textContent = myProduct.discount + " % DISCOUNT";

        myCopy.querySelector(".product_price").style.textDecoration = "line-through";
        const discountedPrice = document.createElement("h5");

        const price = myProduct.price;
        const discount = myProduct.discount;
        const reduction = price * (discount/100);

        discountedPrice.textContent = `${Math.round(price - reduction)}kr`;

        const parentElem = myCopy.querySelector(".prices");
        parentElem.appendChild(discountedPrice);
    }


    if (myProduct.alcohol) {
        myCopy.querySelector(".product_alcohol").textContent = "Alc. " + myProduct.alcohol + "% Vol";
    }
    if (myProduct.vegetarian){
        myCopy.querySelector(".vegetarian").classList.remove("hidden");
    }
    if (myProduct.soldout) {
        const p = document.createElement("p");
        p.textContent = "Sold Out";
        p.classList.add("soldout")
        myCopy.querySelector("article").appendChild(p)
    }
    // TENGO QUE AÑADIR ALGO DE LOS ALLERGENS AQUI TAMBIEN????
    /* DOESN'T WORK
    if (myProduct.allergens){
        myCopy.querySelector(".allergens").classList.remove("hidden");
    }*/


    //1. find the article
    const article = myCopy.querySelector("article");

    //2. add classes
    if (myProduct.vegetarian) {
        article.classList.add("vegetarian")
    }
    // I ADDED THIS - ALLERGENS FOR EACH PRODUCT
    /* DOESN'T WORK
    if (myProduct.allergens) {
        article.classList.add("allergens")
    }*/


    //fill in template
    myCopy.querySelector(".product_name").textContent = myProduct.name;
    /*console.log("I am a ", myProduct.category, "I should go to section#" + myProduct.category)*/

    // I ADDED THIS - PRICE FOR EACH PRODUCT
    myCopy.querySelector(".product_price").textContent = myProduct.price + " DKK";
    // I ADDED THIS - SHORT DESCRIPTION FOR EACH PRODUCT
    myCopy.querySelector(".short_description").textContent = myProduct.shortdescription;
    // I ADDED THIS - ALLERGENS FOR EACH PRODUCT
    /* DOESN'T WORK
    myCopy.querySelector(".allergens").textContent = myProduct.allergens;*/


    myCopy.querySelector("button").addEventListener("click", () => {
    fetch(`https://kea-alt-del.dk/t5/api/product?id=`+myProduct.id)
      .then(res => res.json())
      .then(showDetails);
  });

    //append
    const parentElem = document.querySelector("section#" + myProduct.category);
    parentElem.appendChild(myCopy)
}

const modal = document.querySelector(".modal-background");
//once we have our data, ....
function showDetails(data) {

  modal.querySelector(".modal-name").textContent = data.name;
  modal.querySelector(".modal-description").textContent = data.longdescription;
  modal.querySelector(".modal-price").textContent = data.price;
  //...
  modal.classList.remove("hide");
}


const veggiefilter = document.querySelector("#veggiefilter");
veggiefilter.addEventListener("click", veggieFilterClicked);

function veggieFilterClicked(){
    //select all non veggie
    const articles = document.querySelectorAll("article:not(.vegetarian)")
    //console.log(articles)
    articles.forEach(elem=>{
      elem.classList.toggle("hidden")
    })
}



//close the modal when clicked
modal.addEventListener("click", () => {
  modal.classList.add("hide");
});



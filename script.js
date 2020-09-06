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

        discountedPrice.textContent = `${Math.round(price - reduction)} kr.`;

        const parentElem = myCopy.querySelector(".prices");
        parentElem.appendChild(discountedPrice);
    }


    if (myProduct.vegetarian){
        myCopy.querySelector(".vegetarian").classList.remove("hidden");
    }
    if (myProduct.alcohol) {
        myCopy.querySelector(".product_alcohol").textContent = "(Alc. " + myProduct.alcohol + "% Vol)";
    }
    if (myProduct.soldout) {
        const p = document.createElement("p");
        p.textContent = "Sold Out";
        p.classList.add("soldout")
        myCopy.querySelector("article").appendChild(p)
    }


    //1. find the article
    const article = myCopy.querySelector("article");

    //2. add classes
    if (myProduct.vegetarian) {
        article.classList.add("vegetarian")
    }


    //fill in template
    myCopy.querySelector(".product_name").textContent = myProduct.name;
    /*console.log("I am a ", myProduct.category, "I should go to section#" + myProduct.category)*/

    myCopy.querySelector(".product_price").textContent = myProduct.price + " kr.";
    myCopy.querySelector(".short_description").textContent = myProduct.shortdescription;



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
  modal.querySelector(".modal-price").textContent = data.price + " kr.";

  const img = modal.querySelector(".modal-image");
  img.setAttribute("src", `https://kea-alt-del.dk/t5/site/imgs/small/${data.image}-sm.jpg`)


  if (data.vegetarian){
        modal.querySelector(".modalveg").classList.remove("hidden");
  }

  if (data.alcohol){
        modal.querySelector(".modal-alcohol").textContent = "(Alc. " + data.alcohol + "% Vol)";
  }
  if (data.allergens){
        modal.querySelector(".modal-allergens").textContent = data.allergens;
  }
  if (data.soldout) {
        const p = document.createElement("p");
        p.textContent = "Sold Out";
        p.classList.add("modal-soldout")
        modal.querySelector(".modal-content").appendChild(p)
    }

  if (data.discount) {
        modal.querySelector(".modal-discount").textContent = data.discount + " % DISCOUNT";

        modal.querySelector(".modal-price").style.textDecoration = "line-through";
        const discountedPrice = document.createElement("h6");

        const price = data.price;
        const discount = data.discount;
        const reduction = price * (discount/100);

        discountedPrice.textContent = `${Math.round(price - reduction)} kr.`;

        const parentElem = modal.querySelector(".modal-price-calc");
        parentElem.appendChild(discountedPrice);
    }



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



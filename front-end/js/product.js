//apeller les fonctions sous une fonction asynchrone
(async function () {
    //mettre l'id du produit qui se trouve dans l'url dans une variable
    const productId=getProductId();

    //recuperation dans l'api le produit qui contient uniquement l'id dans l'url  
    const product =await getProduct(productId);

    //afficher le produit dans la page
    displayProduct(product);

    //renitialiser la quantite si on change de lentille
    renitialiseInput()

    //compter le nombre de fois que le produit est ajouter au panier
    //ajouter le produit dans le localStorage 
    addCard(product);

    //fonction pour mettre a jour le panier dans la page
    productExist(product);

    //verifier la quantite ajouter
    updateInput();

    //ajouter une valeur quantite 
    //et une lentille dans l'object product 
    updateProduct(product);

   
})()

//recuperer l'id du produit dans l'url
//sous une fonction getProductId
function getProductId() {
    return new URL(location.href).searchParams.get('id');
}

//recuperer dans l'api le produit
//qui contient l'id specifier dans l'url
function getProduct(productId) {
    return fetch(`http://localhost:3000/api/cameras/${productId}`)
     .then(function(res) {
          return res.json()
    })
    .catch(function(error) {
        alert(error)
    });
}

//affichage du produits recuperer dans l'api
function displayProduct(product){
    
    const template= document.querySelector('.product-template');
    const cloneTemplate = document.importNode(template.content,true);

         //changement du dom 

         //changer l'image de la carte
         //avec celle dans l'api
         let image =cloneTemplate.querySelector('img');
         image.src=`${product.imageUrl}`;

         //changer
         //le nom et la description de la carte
         //avec ceux de l'api
         cloneTemplate.querySelector('.card-title').textContent=product.name;
         cloneTemplate.querySelector('.card-description').textContent=product.description;
         
         //changer le prix de la carte avec celui de l'api
         cloneTemplate.querySelector('.card-price').textContent=product.price + '$'; 
       
         //afficher les differentes lentilles du produits 
         let lentille= cloneTemplate.querySelector('#Lentilles')
         let lenses=product.lenses
        
         for (lense of lenses) {
           lentille.innerHTML +=`
           <option value="${lense}">${lense}</option>`
                             
        }
        
        document.querySelector('.bloc-card-product').appendChild(cloneTemplate);
}

//verifier la quantite ajouter
//si c'est un nombre entier positif
//superieur a zero
//sinon remettre 1 comme quantite
function updateInput(){
    let value=document.querySelector('#quantity');
    value.addEventListener('change' , function() {
        validValue(this);
    })

    let validValue=function(input) {
        //creation de la regexp
        let valueRegexp=new RegExp('^[1-9]([0-9]*)$')
        //tester la regexp sur l'input
        let testValue=valueRegexp.test(input.value);
        //si c'est faux
        //remettre 1 comme valeur
        if(!testValue){
            alert('Entrez une valeur entière positive superieur a zéro')
            input.value=1;
        }
    }
}

//ajouter les valeurs 
//quantite et lentille dans l'objet product
function updateProduct(product) {
     //ajouter une valeur quantite dans l'objet product
     let quantityAdd=document.querySelector('#quantity');
     let quantity=quantityAdd.value;
     product.quantity=quantity;

     //ajouter la lentille selectionner dans l'objet product
     let Lense=document.querySelector('#Lentilles');
     let lenseValue=Lense.value;
     product.lense=lenseValue;
     Lense.addEventListener('change',function (){
         lenseValue=this.value;
         product.lense=lenseValue
     })

}/*******************fin*********************** */

//ecouter le bouton ajouter au panier
function addCard(product){
    let carts= document.querySelectorAll('.add-card');
    tab=[100];
    selected=false;
   //ecouter le bouton ajouter a la panier du produit
   for (let i = 0; i < tab.length; i++) {
    carts[i].addEventListener('click' , function () {
        //compter le nombre de fois que le produit est ajouter dans le panier
        //impossible d'ajouter deux fois le meme produit dans le panier 
        //seulement si l'objectif est different 
        //remettre á jour la quantite dans le local Storage si elle est changer dans la page produit
        productQuantity(product);
        //ajouter le produit selectionner dans le localStorage
        saveItems(product);
       })   
    }
}

//creation d'un compteur
//compter le nombre de fois qu'un  produit est selectionner
function productQuantity(product){
    let Local=localStorage.getItem('productAdded');
    Local=JSON.parse(Local)

    let cardSelected=localStorage.getItem('quantity');
    cardSelected=parseInt(cardSelected);

   //additionner 1 dans le compteur du panier
   //si il y'avait deja un produit
   if(cardSelected){
        localStorage.setItem('quantity' , cardSelected + 1);
        document.querySelector('.basket_number').innerHTML=cardSelected + 1

     //sinon mettre juste 1 dans le compteur
    }else{
           localStorage.setItem('quantity' , 1);   
           document.querySelector('.basket_number').innerHTML=1
        }

    //si une lentille est deja dans le localStorage 
    //additionner zero dans le compteur  
    if(Local != null){
        let nameProduct=product.lense + product.name;
        if(Local[nameProduct]!=undefined){

            localStorage.setItem('quantity' , cardSelected + 0);
            document.querySelector('.basket_number').innerHTML=cardSelected

            //recuperation de la valeur sur l'input
            let quantity=document.querySelector('#quantity')
            quantity.value++
                            
            //changer la quantite du produit qui correspond à la valeur sur l'input quantite
            //dans le local
            let locaQuantity=parseInt(Local[nameProduct].quantity);
            let inputQuantity=parseInt(quantity.value)
            let total=locaQuantity + inputQuantity
            console.log(total)
            Local[nameProduct].quantity=total -1
            alert('Vous avez ajouter' + ` ${Local[nameProduct].quantity} ` + ' fois ce produit dans le panier!')

            //mettre a jour le produit dans le LocalStorage
            localStorage.setItem('productAdded',JSON.stringify(Local)) 
        }
    }

}


//mettre a jour le panier dans la page produits
//mettre á jour la quantite si le produit existe dans le panier
function productExist(product){
    let productNumbers=localStorage.getItem('quantity');
    if(productNumbers){
        document.querySelector('.basket_number').textContent=productNumbers;
    }
}

 
//remettre la quantite a zéro lorsqu'on change de lentille
function renitialiseInput(){
    let lentille=document.querySelector('#Lentilles');
    lentille.addEventListener('change' , function(){
        let quantity=document.querySelector('#quantity');
        quantity.value=1
        console.log(quantity.value)
        alert('vous changez de lentille')
    })   
}


//ajouter le produit dans le local storage
function saveItems(product) {
    let getProductAdded=localStorage.getItem('productAdded');
    getProductAdded = JSON.parse(getProductAdded);
       //ajouter le produit avec ce qui etait dans le localStorage  
       //si il y'avait deja un produit
       let nameProduct=product.lense + product.name;

        if(getProductAdded != null){
            if(getProductAdded[nameProduct]==undefined){
                getProductAdded={
                 ...getProductAdded,
                 [nameProduct]:product, 
                }/******* */
            //alerte
            alert('Produit ajouter')
            }
            /**************** */ 

         //sinon ajouter seulement le produit     
        }else{
            getProductAdded={
                [nameProduct]:product 
            } 
            //alerte
            alert('Produit ajouter')   
        }
        /**** ******* */
          
    localStorage.setItem('productAdded',JSON.stringify(getProductAdded))  
}
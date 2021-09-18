(function() {
    
   //afficher les produit du localStorage dans le panier 
   if(localStorage.getItem('quantity')!=null){
       getBasket(); 
   }
  
   //verifier la valeur sur le champ quantity
   verifyInputQuantity();

   //supprimer un produit du panier
   deleteProduct()

   //Mettre a jour la quantite du produit dans le localStorage
    if(localStorage.getItem('quantity')!=null){
      updateQuantity();
    }

   //Verification des champs d'input sur le formulaire
   //avec des regexps
   validForm(); 
 
})()


function getBasket() {
    //afficher les produits du localStorage sur la page panier
    let products=localStorage.getItem('productAdded');
    products=JSON.parse(products);
       Object.values(products).map(item=>{
        let add=document.querySelector('tbody');
        add.innerHTML +=`<tr>
        <th scope="row">${item.name}</th>
        <td>${item.lense}</td>
        <td class='input'><input type="number" class='quantity' min="1" id="${item.lense}" name="quantity" value="${item.quantity}"></td>
        <td class='item-price' id='${item.lense}'>${item.quantity * item.price}$</td>
        <td class="button mx-auto"><span id='${item.lense}' class=" delete"><i class="fas fa-trash"></i></span></td>
        </tr>`   
    });   

    //recuperer le prix total de tout les produits dans le panier
    let totalPrice=document.querySelectorAll('.item-price'); 
    let sommes=Array.from(totalPrice);
    let sum=0;
    for(somme of sommes){
        let value=parseInt(somme.textContent);
        sum+=value;
        document.querySelector('.total-price').innerHTML=`${sum}$`
        localStorage.setItem('totalCost' , document.querySelector('.total-price').innerHTML)
    };//fin**************
         
}//fin***********


//verifier la valeur sur  le champ quantity
function verifyInputQuantity(){
    let values=document.querySelectorAll('.quantity');
    for(value of values){
        value.addEventListener('change' , function() {
           validValue(this);
        })

        //verifier la valeur de l'input
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
}//*****************FIN*********************** */


//mettre a jour la valeur quantite dans l'objet produit dans le localStorage 
//quand on le change sur le champ quantity du panier
function updateQuantity() {
    
    let articles=document.querySelectorAll('input');
    for(article of articles){
        article.addEventListener('change' ,function() { 
           //recuperer l'id de l'input qui correspond au lentille
           //du produit selectionner
           let productId=this.id;

           //recuperer les produits du localStorage
           //dans une variable
           let quantityInit=localStorage.getItem('productAdded');
           quantityInit=JSON.parse(quantityInit)

           //changer la quantite du produit qui correspond a productId
           quantityInit[productId].quantity=this.value;

           //mettre a jour productAdded
           localStorage.setItem('productAdded',JSON.stringify(quantityInit))

           //relancer la page
           window.location.reload();
           
        })  
    
    }  

}//**************************fin**********************************//


//supprimer les produits du panier
function deleteProduct() {
   //supprimer les produits du panier
   let iconeDeletes=document.querySelectorAll('.delete');

   //ecouter le bouton supprimer de chaque produit 
   for(iconeDelete  of iconeDeletes){
        iconeDelete.addEventListener('click' , function () {
            //recuperer l'id du sur le bouton qui correspond au produit dans le panier
            let productId=this.id;

            //recuperer les produits du localStorage
            let productAdded=localStorage.getItem('productAdded');
            productAdded=JSON.parse(productAdded);

            //verifier si le produit est dans le localStorage
            if(productId in productAdded){
                //demander si le client souhaite vraiment supprimer le produit 
                //faire apparaitre la question oui ou non
                document.querySelector('.block_alerte').classList.remove('hidden')
                document.querySelector('.option_1').addEventListener('click', function() {
                    //supprimer le produit
                    //si oui
                    delete productAdded[productId];

                    //diminuer le compteur si un produit est supprimer
                    let quantity=localStorage.getItem('quantity')
                    quantity=JSON.parse(quantity)
                    quantity -=1 //fin*****************
                    
                    //faire disparaitre la question
                    document.querySelector('.block_alerte').classList.add('hidden')

                    //mettre a jour la quantite de produit dans le panier
                    //dans le localStorage
                    //qui va mettre a jour le compteur en meme temps
                    localStorage.setItem('quantity' , JSON.stringify(quantity))

                    //mettre a jour les produits ajouter dans le localStorage
                    localStorage.setItem('productAdded' , JSON.stringify(productAdded));
                    window.location.reload();
                })//si reponse == OUI  
            
                document.querySelector('.option_2').addEventListener('click', function() {
                     //faire disparaitre la question si la reponse est non
                     document.querySelector('.block_alerte').classList.add('hidden')
                })//si reponse == NON        
            }
        })
    }

}//********************************************fin**********************************/


//verification des champ du formulaire 
//envoi des donnes du formulaire et les id des produits dans le panier sur le serveur
//recuperation de la reponse du serveur dans le localStorage 
function validForm() {

    //recuperer le formulaire
    let form=document.querySelector('form')

    //Ecouter le champ pour le prenom
    form.firstName.addEventListener('change' , function(){
        validFirstName(this)
    })

    //creation de la fonction pour valider la valeur du champ
    let validFirstName=function(inputFirstName) {
         //creation de la regexp
         let firstNameRegexp=new RegExp('^[a-zA-Z\-]+$');

        //recuperation de la balise small
        let small=inputFirstName.nextElementSibling;

        let testFirstName=firstNameRegexp.test(inputFirstName.value);

        if(testFirstName){
           small.textContent='Prenom valide'
           small.classList.remove('noValid');
           small.classList.add('valid');
           return true;
        }else{
           small.textContent='Prenom invalide'
           small.classList.remove('valid');
           small.classList.add('noValid');
           return false;
        }
    }//fin*****************************************


    //ecouter le champ pour le nom
    form.secondName.addEventListener('change' , function(){
        validSecondName(this)
    })

    let validSecondName=function(inputSecondName) {
        //creation de la regexp
        let secondNameRegexp=new RegExp('^[A-Z][a-zA-Z]+$')
    
        //recuperation de la balise small
        let small=inputSecondName.nextElementSibling;

        let testSecondName=secondNameRegexp.test(inputSecondName.value);

        if(testSecondName){
           small.textContent='Nom valide'
           small.classList.remove('noValid');
           small.classList.add('valid');
           return true;
        }else{
            small.textContent='Nom invalide'
            small.classList.remove('valid');
            small.classList.add('noValid');
            return false;
        }

    }//fin******************************


    //ecouter le champ pour l'email
    form.email.addEventListener('change' , function(){
        validEmail(this)
    })

    let validEmail=function(inputEmail) {
       //creation de la regexp
       let EmailRegexp=new RegExp('^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}$','g')
    
       //recuperation de la balise small
       let small=inputEmail.nextElementSibling;

       let testEmail=EmailRegexp.test(inputEmail.value);

       if(testEmail){
           small.textContent='Email valide'
           small.classList.remove('noValid');
           small.classList.add('valid');
           return true;
        }else{
            small.textContent='Email invalide'
            small.classList.remove('valid');
            small.classList.add('noValid');
            return false;
        }
    }//fin*************************************

  
    //ecouter le champ pour la ville
    form.city.addEventListener('change' , function(){
        validCity(this)
    })

    let validCity=function(inputCity) {
       //creation de la regexp
       let cityRegexp=new RegExp(`^[a-zA-Z0-9\ s\:\,\''\-\é\è\î]*$`)
    
       //recuperation de la balise small
       let small=inputCity.nextElementSibling;

       let testCity=cityRegexp.test(inputCity.value);

       if(testCity){
           small.textContent=`ville valide`
           small.classList.remove('noValid');
           small.classList.add('valid');
           return true;
        }else{
            small.textContent=`${inputCity.value} n'est pas une ville`
            small.classList.remove('valid');
            small.classList.add('noValid');
            return false;
        }
    }//fin*******************


    //ecouter le champ pour l'adresse
    form.adresse.addEventListener('change' , function(){
        validAdresse(this)
    })

    let validAdresse=function(inputAdresse) {
        let adresseRegexp=new RegExp(`^[a-zA-Z0-9\ s\:\,\''\-\é\è\î]*$`)
        //recuperation de la balise small
        let small=inputAdresse.nextElementSibling;

        let testAdresse=adresseRegexp.test(inputAdresse.value);
 
        if(testAdresse){
            small.textContent=`adresse valide`
            small.classList.remove('noValid');
            small.classList.add('valid');
            return true
        }else{
           small.textContent=`${inputAdresse.value} n'est pas une adresse`
           small.classList.remove('valid');
           small.classList.add('noValid');
           return false;
        }
    }//fin**********************   


    //ecouter le bouton submit
    form.addEventListener('submit' , function (e) {
        e.preventDefault();
  
        //verifier si les valeurs entrees dans les champs sont correctes
        if( validFirstName(form.firstName)&&validSecondName(form.secondName)&&
            validEmail(form.email)&&validCity(form.city)&&validAdresse(form.adresse)){
            //creation d'un objet contact qui regroupe les differentes valeur du formulaire    
            let contact={
                firstName:form.firstName.value,
                lastName:form.secondName.value,
                address:form.adresse.value,
                city:form.city.value,
                email:form.email.value,
            } 

            //recuperation des produits dans le panier
            productAdded=localStorage.getItem('productAdded');
            productAdded=JSON.parse(productAdded);

            //tranferer les produits sous un autre nom dans le localStorage pour recuperer une commande 
            localStorage.setItem('LastCommande' , JSON.stringify(productAdded))

            //recuperer l'id de item price qui correspond au nom du produit
            //dans le localStorage
            let articles=document.querySelectorAll('.item-price');
            products=[];
            for(article of articles){
                //verifier si l'id des articles de trouve dans le localStorage
                if(article.id in productAdded){
                    //mettre l'id des produits dans un tableau product
                    products.push(productAdded[article.id]._id);
                }
            }
        
            //mettre les id et contact dans un obket aEnvoyer
            let aEnvoyer={
                contact : contact,
                products : products,
            }
            aEnvoyer=JSON.stringify(aEnvoyer)

            //creation d'une promesse pour envoyer l'objet aenvoyer dans le serveur
            const promise=fetch("http://localhost:3000/api/cameras/order",{
                method:'POST',
                body:aEnvoyer,
                headers:{
                    'Content-Type':'application/json',
                }  
            })

            //recuperer la reponse du serveur dans le localStorage
            promise.then(async(response)=>{
                try{
                    let contenu= await response.json();
                    contenu=JSON.stringify(contenu)
                    localStorage.setItem('response' , contenu)
                    form.submit(); 
                    window.location.replace('commande_valide.html');
                    localStorage.removeItem('productAdded')
                    localStorage.removeItem('quantity') 
                }catch(e){
                    console.log('erreur' + e);
                }
            })

        }//*************fin de la condition */
    })//*********fin de l'ecoute sur le bouton */

}

//recuperer l'order id sur la reponse
//de la commande precedente
function getorderId() {
     let response=localStorage.getItem('response');
     response=JSON.parse(response)
     let orderId=response.orderId;
     return orderId
}

//verifier si la valeur de l'input est egal á l'orderId
//afficher la commande precedente
//recuperer ou supprimer la commande
function getInputValue() {
    let response=localStorage.getItem('response');
    response=JSON.parse(response)
    let orderId=getorderId();   
    let inputValue=document.querySelector('#lastCommand');
    inputValue.addEventListener('change' , function() {
       if(this.value == orderId){
            let articles=response.products
            for(article of articles ){
                document.querySelector('.LastCommand-block').innerHTML +=`<p class='mb-2 get-command'><span>Appareil :<strong> ${article.name} </strong></span>  <span>Prix :<strong> ${article.price}$ </strong></span> </p>`
                document.querySelector('.request').classList.remove('hidden')
            }
        }
    })

    //recuperer la derniere commande
    getLastCommand();

    //supprimer la derniere commande
    removeLastCommand()

}/***********fin de la fonction**********************/

//appele de la fonction getInputValue
if(localStorage.getItem('response')!=null){
    getInputValue();
}


//recuperer la derniere commande
function getLastCommand() {
   let getCommand=document.querySelector('.recuperer');
   
   let productAdded=localStorage.getItem('productAdded')
   productAdded=JSON.parse(productAdded)

   let products=localStorage.getItem('LastCommande')
   products=JSON.parse(products)
   
   
    //ecouter le bouton recuperer
    getCommand.addEventListener('click' , function() {
        if(productAdded!=null){
            Object.values(products).map(item=>{
                productAdded={
                    ...productAdded, 
                    [(item.lense)]:item,
                }
            })
            localStorage.setItem('productAdded', JSON.stringify(productAdded))
        
        }else{
            Object.values(products).map(item=>{
                productAdded={
                    [(item.lense)]:item
                }
         
            })
            localStorage.setItem('productAdded', JSON.stringify(productAdded))
        }

       let productExist=localStorage.getItem('productAdded');
       productExist=JSON.parse(productExist);
       let quantityadded=Object.keys(productExist).length;

       localStorage.setItem('quantity', JSON.stringify(quantityadded))
       //relancer la page
       window.location.reload();
    })
 
}

//enlever l'affichage de la commande sur la page
function removeLastCommand() {
    let removeCommand=document.querySelector('.enlever');
    removeCommand.addEventListener('click' , function() {
        //relancer la page
        window.location.reload();
    })
}
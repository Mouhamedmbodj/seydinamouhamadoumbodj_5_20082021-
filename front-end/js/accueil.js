//appel des fonctions sous une fonction asynchrone
(async function(){
    //recuperation des produits dans une variable articles
    const articles=await getArticles();
    for(article of articles){
        //afficher chaque produit avec ses caracteristiques
        //dans la page 
        displayArticles(article)
    }
    productExist();
})()
  

//recuperation des articles dans notre api  
//sous une fonction getArticles
function getArticles() {
    return fetch("http://localhost:3000/api/cameras")
    .then(function(res) {
        //recuperation de la reponse de l'api
        return res.json() ;
  })
  .catch(function(error) {
      //recuperer l'erreur 
      //au cas ou l'appel a l'api ne fonctionne pas
      alert(error)
  }) 
}


//affichage des articles dans notre page d'accueil
function displayArticles(article) {
     const template= document.querySelector('#home-template');
     const cloneTemplate = document.importNode(template.content,true);

        // ajouter l'id du produit dans l'url qui mene vers la page produits
        //cela vas nous permettre d'attraper un produit specifique
        //pour l'afficher dans la page produits
        cloneTemplate.querySelector('.product-link').href += `?id=${article._id}`

        //modification de la dom 
        //pour afficher les produits dans la page d'accueil
        cloneTemplate.querySelector('.card-title').textContent=article.name;

        let image =cloneTemplate.querySelector('img');
        image.src=`${article.imageUrl}`;

        cloneTemplate.querySelector('.card-description').textContent=article.description;
        cloneTemplate.querySelector('.card-price').textContent=article.price + '$';
        document.querySelector('.bloc-card-home').appendChild(cloneTemplate);
}

//mettre a jour le compteur du panier
function productExist(){
    let productNumbers=localStorage.getItem('quantity');
    if(productNumbers){
        document.querySelector('.basket_number').textContent=productNumbers;
    }
}





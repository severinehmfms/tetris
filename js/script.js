const canvas = document.getElementById("jeu");
const context = canvas.getContext("2d");

//Mon tetris est composé de cases de 30*30
const CASE = 30;
//Hauteur et largeur de la zone de jeu
const LARGEUR = 300;
const HAUTEUR = 600;
//Nombre de lignes et de colonnes
const NBLIGNES = HAUTEUR / CASE;
const NBCOLONNES = LARGEUR / CASE;
const TIME = 400;
//On définit les différentes formes possibles
const FORME1 =  [
        [1,1,0],
        [1,1,0]
    ];
const FORME2 = [
    [1,0,0],
    [1,1,1]
];
const FORME3 = [
    [1,1,1],
    [0,0,0]
];
const FORME4 = [
    [1,1,1],
    [0,1,0]
];
const formes = [FORME1, FORME2, FORME3, FORME4];

let gameOver = false;
let score = 0;

let magrille = initGrille();

//On crée une nouvelle pièce
let piece = nouvellePiece(formes);

//On ajoute un évènement sur les touches du clavier
document.addEventListener("keydown", function(event) {
    //Calcul du nombre de lignes par pièce, et nombre de pixels par pièce, mais pour l'instant non utilisé
    //nblignespiece = getNbLignesForme(piece.forme);
    //nblignespiecepixels = nblignespiece * CASE;
    
    nbcolonnespiece = getNbColonnesForme(piece.forme);
    nbcolonnespiecepixels = nbcolonnespiece * CASE;

    if (event.key === "ArrowLeft") {
        //piece.x = piece.x - CASE > 0 ? piece.x - CASE : 0;
        piece.x = piece.x - CASE > 0 ? piece.x - CASE : 0;

        draw(piece);
    }

    if (event.key === "ArrowRight") {
        //piece.x = piece.x + CASE > LARGEUR - CASE ? LARGEUR - CASE : piece.x + CASE;
        piece.x = piece.x + CASE < LARGEUR - nbcolonnespiecepixels ? piece.x + CASE : LARGEUR - nbcolonnespiecepixels;

        draw(piece);
    }

    //Touche du haut on fait tourner la pièce 
    if (event.key === "ArrowUp") {
        tournerPiece(piece);

        //quand on fait tourner la pièce elle peut devenir plus large, si elle arrive aux limites alors on la décale
        let largeurPiece = getNbColonnesForme(piece.forme) * CASE;
        if (piece.x + largeurPiece > LARGEUR) {
            piece.x = LARGEUR - largeurPiece;
        }

        draw(piece);
    }
    
});

//Pour détecter le gameover (merci chat gpt)
function peutPlacerPiece(piece) {
    for (let i = 0; i < piece.forme.length; i++) {
        for (let j = 0; j < piece.forme[i].length; j++) {

            if (piece.forme[i][j] === 1) {
                let ligne = piece.y / CASE + i;
                let colonne = piece.x / CASE + j;

                // La pièce dépasse de la grille
                if (
                    ligne < 0 || ligne >= NBLIGNES ||
                    colonne < 0 || colonne >= NBCOLONNES
                ) {
                    return false;
                }

                // La case est déjà occupée
                if (magrille[ligne][colonne] === 1) {
                    return false;
                }
            }
        }
    }

    return true;
}

//Toutes les TIME ms
setInterval(function () {
    //Si la partie n'est pas finie
    if (!gameOver) {
        if (peutDescendre(piece)){
            let hauteurpiecepixels = getNbLignesForme(piece.forme) * CASE;        
            //On est plus obligé de faire les vérifications puisqu'on l'a fait dans la fonction peutDescendre
            //piece.y = piece.y < HAUTEUR - hauteurpiecepixels ? piece.y + CASE : HAUTEUR - hauteurpiecepixels;
            piece.y += CASE;
        }else {
            fixerPiece(piece);
            supprimerLignesCompletes();

            piece = nouvellePiece(formes);

            // Vérifier si la nouvelle pièce peut apparaître
            if (!peutPlacerPiece(piece)) {
                gameOver = true;
                alert("Game Over !");
            }
        }
        
        /*}else{
            //Si la pièce ne peut plus descendre, on enregistre sa position dans la matrice, puis on crée une nouvelle pièce
            fixerPiece(piece);
            // On supprime les lignes complètes
            supprimerLignesCompletes();
            
            //On crée une nouvelle pièce
            piece = nouvellePiece(formes);
        }*/
        draw(piece);
    }

}, TIME);


//Fonction qui vérifie si la pièce peut encore descendre (retourne false si arrivée en bas!)
//TODO Il faudra vérifier si il y a pas déjà une pièce à cet endroit! rajouter une condition si une des cases dessous de la matrice contient un 1
/*function peutDescendre(piece) {
    let hauteurPiece = getNbLignesForme(piece.forme);

    // Si la pièce atteint le bas de la grille
    if (piece.y + hauteurPiece * CASE >= HAUTEUR) {
        return false;
    }

    return true;
}*/
//Fonction peutDescendre qui cette fois vérifie la matrice (merci chatgpt)
function peutDescendre(piece) {
    // On parcourt les lignes de la forme courante
    for (let i = 0; i < piece.forme.length; i++) {

        // On parcourt les colonnes de la forme courante
        for (let j = 0; j < piece.forme[i].length; j++) {

            // On ne s'intéresse qu'aux cases occupées par la pièce
            if (piece.forme[i][j] === 1) {

                // Position de cette case dans la grille
                let ligne = piece.y / CASE + i;
                let colonne = piece.x / CASE + j;

                // Position de la case située juste en dessous
                let ligneDessous = ligne + 1;

                // Si on dépasse le bas de la grille
                if (ligneDessous >= NBLIGNES) {
                    return false;
                }

                // Si la case située en dessous est déjà occupée
                if (magrille[ligneDessous][colonne] === 1) {
                    return false;
                }
            }
        }
    }

    // Aucune collision détectée : la pièce peut descendre
    return true;
}

//Fonction pour la rotation des pièces (merci chatgpt)
//Nouvelle fonction tourner pièce qui vérifie si ça va provoquer une collision
function tournerPiece(piece) {
    let ancienneForme = piece.forme;
    let nbLignes = ancienneForme.length;
    let nbColonnes = ancienneForme[0].length;
    let nouvelleForme = [];

    for (let j = 0; j < nbColonnes; j++) {
        nouvelleForme[j] = [];

        for (let i = nbLignes - 1; i >= 0; i--) {
            nouvelleForme[j].push(ancienneForme[i][j]);
        }
    }

    // On garde temporairement l'ancienne forme
    piece.forme = nouvelleForme;

    // On corrige la position si la pièce dépasse à droite
    let largeur = getNbColonnesForme(piece.forme) * CASE;

    if (piece.x + largeur > LARGEUR) {
        piece.x = LARGEUR - largeur;
    }

    // Si la rotation provoque une collision, on l'annule
    if (!peutPlacerPiece(piece)) {
        piece.forme = ancienneForme;
    }
}
/*
function tournerPiece(piece) {
    let ancienneForme = piece.forme;
    let nbLignes = ancienneForme.length;
    let nbColonnes = ancienneForme[0].length;

    let nouvelleForme = [];

    for (let j = 0; j < nbColonnes; j++) {
        nouvelleForme[j] = [];

        for (let i = nbLignes - 1; i >= 0; i--) {
            nouvelleForme[j].push(ancienneForme[i][j]);
        }
    }

    // On remplace l'ancienne forme par la nouvelle
    piece.forme = nouvelleForme;
}*/

//Fonction qui fixe la pièce dans la grille
function fixerPiece(piece) {
    //On parcoure la pièce, les lignes
    for (let i = 0; i < piece.forme.length; i++) {
        //Puis les colonnes
        for (let j = 0; j < piece.forme[i].length; j++) {

            //Si on a 1 à cette position pour cette forme on l'inscrit dans la grille
            if (piece.forme[i][j] === 1) {
                let ligne = piece.y / CASE + i;
                let colonne = piece.x / CASE + j;

                magrille[ligne][colonne] = 1;
            }
        }
    }
}

//Fonction qui supprimer les lignes complètes (merci chatgpt) et on calcule le score
function supprimerLignesCompletes() {
    let nbLignesSupprimees = 0;
    // On parcourt les lignes de bas en haut
    for (let i = NBLIGNES - 1; i >= 0; i--) {
        // On vérifie si toute la ligne est remplie
        let ligneComplete = magrille[i].every(
            caseGrille => caseGrille === 1
        );

        if (ligneComplete) {
             // On supprime la ligne complète
            magrille.splice(i, 1);
            // On ajoute une nouvelle ligne vide en haut
            magrille.unshift(new Array(NBCOLONNES).fill(0));

            nbLignesSupprimees++;

             // On vérifie à nouveau cette ligne,
            // car les lignes du dessus sont descendues
            i++;
        }
    }

    // Barème classique de Tetris
    const points = [0, 100, 300, 500, 800];
    score += points[nbLignesSupprimees];

    document.getElementById("score").textContent = score;
}

//Fonction qui envoie une nouvelle pièce
function nouvellePiece(formes){
    //On calcule de façon aléatoire la forme de la pièce parmi les formes disponibles dans le tableau
    let indiceAleatoire = Math.floor(Math.random() * formes.length);
    let formechoisie = formes[indiceAleatoire];

    //On crée un objet pièce avec coordonnées x et y, et une taille
    let piece = {
        x: 0,
        y: 0,
        taille: CASE,
        forme: formechoisie
    };

    //On calcule de façon aléatoire la coordonnée x de la pièce (entre 0 et 300, multiple de 30)
    //On cherche un nombre aléatoire entre 0 et 10 puis on le multiplie par la taille de la case (merci chatgpt)
    //let coordX = Math.floor(Math.random() * 10 ) * CASE;
    let largeurPiece = getNbColonnesForme(piece.forme) * CASE;
    let nbPositionsPossibles = (LARGEUR - largeurPiece) / CASE + 1;
    let coordX = Math.floor(Math.random() * nbPositionsPossibles) * CASE;
    piece.x = coordX;
    return piece;
}

//Fonction qui calcule le nombre de colonnes réel que prend une forme
function getNbColonnesForme(forme){
    let idmaxavecun = 0;
    for (let i = 0; i < forme.length ; i++){
        for (let j = 0; j < forme[i].length ; j++){
            if (forme[i][j] == 1){
                if (j > idmaxavecun) idmaxavecun = j;
            }            
        }
    }
    return idmaxavecun+1;
}

//Fonction qui calcule le nombre de lignes réel que prend une forme
function getNbLignesForme(forme){
    let idmaxavecun = 0;
    for (let i = 0; i < forme.length ; i++){
        for (let j = 0; j < forme[i].length ; j++){
            if (forme[i][j] == 1){
                if (i > idmaxavecun) idmaxavecun = i;
            }            
        }
    }
    return idmaxavecun+1;
}

//Fonction qui initialise la matrice qui va représenter la grille
function initGrille(){
    //On va créer la matrice qui représente la grille, pour l'instant remplie de 0    
    let grille = [];
    //On parcoure les lignes 
    for (let i=0; i<NBLIGNES; i++) {
        // On crée une nouvelle ligne
        grille[i] = [];
        //On parcoure les colonnes 
        for (let j=0; j<NBCOLONNES; j++) {
            //On met un 0 dans la case du tableau à deux dimensions 
            grille[i][j] = 0;
        }
    }
    return grille;
}

//Fonction qui dessine la grille du tetris
function afficheGrille(){
    //On va afficher une grille de 10 colonnes et 20 lignes
    let x = 0;
    let y = 0;
    //On parcoure les lignes 
    while (x < LARGEUR) {
        console.log(x);
        //On parcoure les colonnes 
        while (y < HAUTEUR){
            //On dessine la case
            context.strokeRect(x, y, CASE, CASE);        
            y = y + CASE;
        }
        y = 0;
        x = x + CASE;
    }
}

//Fonction qui dessine la grille du tetris remplie
function afficheGrilleRemplie(){
    for (let i = 0; i < NBLIGNES; i++) {
        for (let j = 0; j < NBCOLONNES; j++) {

            // Si la case est occupée
            if (magrille[i][j] == 1) {

                context.fillStyle = "rgb(200, 0, 0)";

                //J'essaie d'afficher la case
                //context.strokeRect(j * CASE, i * CASE, CASE, CASE);    

                context.fillRect(
                    j * CASE,  // coordonnée x : colonne
                    i * CASE,  // coordonnée y : ligne
                    CASE,
                    CASE
                );
            }
        }
    }
}

//Fonction qui dessine une pièce
function drawPiece(piece) {    
    //Couleur qui sera utilisée pour la pièce 
    context.fillStyle = "rgb(200, 0, 0)";

    //On récupère la forme de la pièce, et on va afficher la bonne forme
    //context.fillRect(piece.x, piece.y, piece.taille, piece.taille);
    for (let i = 0; i < piece.forme.length ; i++){
        for (let j = 0; j < piece.forme[i].length ; j++){
            if (piece.forme[i][j] == 1){
                context.fillRect(piece.x + (j*CASE), piece.y + (i*CASE), CASE, CASE);
            }            
        }
    }

    context.lineWidth = 3;
    context.strokeStyle = "grey";
    //context.strokeRect(20, 10, 30, 30);
    //strokeRect dessine un contour rectangulaire non rempli
    //strokeRect(x, y, largeur, hauteur)
}

function draw(piece){
    //On efface toute la grille
    context.clearRect(0, 0, LARGEUR, HAUTEUR);

    //On réaffiche la grille
    //afficheGrille();
    afficheGrilleRemplie(magrille);

    //On affiche la pièce 
    drawPiece(piece)
}

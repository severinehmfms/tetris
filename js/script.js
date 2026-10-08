const canvas = document.getElementById("jeu");
const context = canvas.getContext("2d");

//Mon tetris est composé de cases de 30*30
const CASE = 30;
//Hauteur et largeur de la zone de jeu
const LARGEUR = 300;
const HAUTEUR = 600;
const TIME = 400;

const CARRE =  [
        [1,1,0],
        [1,1,0]
    ];

const L = [
    [1,0,0],
    [1,1,1]
];

const TRAIT = [
    [1,1,1],
    [0,0,0]
];

let gameOver = false;

//On calcule de façon aléatoire la coordonnée x de la pièce (entre 0 et 300, multiple de 30)
//On cherche un nombre aléatoire entre 0 et 10 puis on le multiplie par 30 (merci chatgpt)
let coordX = Math.floor(Math.random() * 10 ) * 30;
//On crée un objet pièce avec coordonnées x et y, et une taille
let piece = {
    x: coordX,
    y: 0,
    taille: CASE,
    forme: CARRE
};

//On ajoute un évènement sur les touches du clavier
document.addEventListener("keydown", function(event) {
    //Avant les pièces de plusieurs cases
    //largeurpiece = piece.taille; //CASE
    nblignespiece = piece.forme.length;
    
    nbcolonnespiece = getNbColonnesForme(piece.forme);
    //console.log("nb colonnes carré : " + getNbColonnesForme(CARRE));
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
    
});

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

//Toutes les TIME ms, on appelle la fonction chute
setInterval(function () {

    //Si la partie n'est pas finie
    if (!gameOver) {
        piece.y = piece.y < HAUTEUR - CASE ? piece.y + CASE : HAUTEUR - CASE;
        draw(piece);
    }

}, TIME);

//Fonction qui dessine la grille du tetris
function showGrid(){
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

//Fonction qui dessine une pièce
function drawPiece(piece) {    
    //Couleur qui sera utilisée pour la pièce 
    context.fillStyle = "rgb(200, 0, 0)";

    //TODO On récupère la forme de la pièce, et on va afficher la bonne forme
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
    showGrid();

    //On affiche la pièce 
    drawPiece(piece)
}

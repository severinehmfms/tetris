const canvas = document.getElementById("jeu");
const context = canvas.getContext("2d");

//Mon tetris est composé de cases de 30*30
const CASE = 30;
//Hauteur et largeur de la zone de jeu
const LARGEUR = 300;
const HAUTEUR = 600;
const TIME = 400;

let gameOver = false;

//On calcule de façon aléatoire la coordonnée x de la pièce (entre 0 et 300, multiple de 30)
//On cherche un nombre aléatoire entre 0 et 10 puis on le multiplie par 30 (merci chatgpt)
let coordX = Math.floor(Math.random() * 10 ) * 30;
//On crée un objet pièce avec coordonnées x et y, et une taille
let piece = {
    x: coordX,
    y: 0,
    taille: CASE,
    forme: [
        [0,1,1],
        [0,1,1],
        [0,0,0]
    ]
};


//On ajoute un évènement sur les touches du clavier
document.addEventListener("keydown", function(event) {
    if (event.key === "ArrowLeft") {
        //piece.x = piece.x - CASE;
        piece.x = piece.x - CASE > 0 ? piece.x - CASE : 0;

        draw(piece);
    }

    if (event.key === "ArrowRight") {
        //piece.x = piece.x + CASE;
        piece.x = piece.x + CASE > LARGEUR - CASE ? LARGEUR - CASE : piece.x + CASE;

        draw(piece);
    }
    
});

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
    //On crée un carré
    context.fillRect(piece.x, piece.y, piece.taille, piece.taille);

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

var trex, trex_running, edges;
var groundImage;
var ground;
var sueloinvisible;
var nube;
var imagennube;
var obstaculo;
var cactus1, cactus2, cactus3;
var grupoobstaculo;
var gruponubes;
var PLAYING = 1;
var GAMEOVER = 0;
var estadodejuego = PLAYING;
var sonidosalto;
var sonidomuelto;
var top100;
var puntos;
var imgover;
var play_x2;
var overover;
var x2_play;




function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trexmuelto = loadAnimation ("trexmuelto.png");
  groundImage = loadImage("ground2.png");
  imagennube = loadImage ("nubes2.png");
  cactus1 = loadImage("cactus1.png");
  cactus2 = loadImage ("cactus2.png");
  cactus3 = loadImage ("cactus3.png");
  sonidosalto = loadSound ("mario-bros-jump.mp3");
  sonidomuelto = loadSound ("Gameover.mp3");
  top100 = loadSound ("donkey-kong-coin.mp3");
  imgover = loadImage ("game_over.png");
  play_x2 = loadImage ("play_again.png");


}

function setup(){
  createCanvas(windowWidth,windowHeight);
  
  //crear sprite de Trex
  trex = createSprite(50,height-90,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation ("muelto", trexmuelto);
  edges = createEdgeSprites();
  // crear sprite suelo
  ground = createSprite (width/2,height-100,windowHeight,10);
  ground.addImage("ground", groundImage);
  puntos = 0;
  

  //agregar tamaño y posición al Trex
  trex.scale = 0.6;
  trex.x = 50

  // suelo invisible
  sueloinvisible = createSprite (width/2,height-90,windowHeight,10);
  sueloinvisible.visible = false;

  //crear grupos
  grupoobstaculo = new Group ();
  gruponubes = new Group();

  overover = createSprite (width/2,height/2);
  overover.addImage ("imgover", imgover);
  x2_play = createSprite (width/2,height/2+80);
  x2_play.addImage ("play_x2", play_x2);
  x2_play.scale = 0.2


}


function draw(){
  
  if (estadodejuego === PLAYING){
    //establecer color de fondo.
    overover.visible = false;
    x2_play.visible = false;
    background("pink");
    fill ("black");
    text("SCORE: " + puntos, 500, 25);

    //sumar puntos
    puntos = puntos + Math.round (getFrameRate()/60);  
    
    if (keyDown ("space") && trex.y >= 100){
      trex.velocityY = -8; 
      sonidosalto.play (); 
    }
    
    if (ground.x < 0 ){
      ground.x = 1000;
    }

    ground.velocityX = -3;

    trex.velocityY = trex.velocityY + 0.9


    crearnubes ();
    crearobstaculo();
    
    if (grupoobstaculo.isTouching(trex)){
      estadodejuego = GAMEOVER;
      sonidomuelto.play();
      
    }

    puntos = puntos + Math.round(frameCount/500);
    if (puntos > 0 && puntos % 100 === 0 ){
      top100.play();
    }

     
  }

  else if (estadodejuego === GAMEOVER){
     //establecer color de fondo.
     background("black");
     overover.visible = true;
     x2_play.visible = true;
     fill ("pink");
     text("SCORE: " + puntos, 500, 25);
     trex.velocityY = 0;
     gruponubes.setLifetimeEach (-5);
     grupoobstaculo.setLifetimeEach (-5);
     trex.changeAnimation ("muelto", trexmuelto);
     

      
     ground.velocityX = 0;
     grupoobstaculo.setVelocityXEach (0);
     gruponubes.setVelocityXEach (0);

     if (mousePressedOver(x2_play)){
      reiniciar ();
     }

     
     

     

  }

  
  //trex.debug = true;
  trex.setCollider ("circle", 0,0,30)
  
  

  trex.collide(sueloinvisible);

  drawSprites();

  
}

function crearnubes (){
  if (frameCount % 125 === 0 ){
    nube = createSprite (width+40,height-120,40,10);
    nube.addImage (imagennube);
    nube.scale = 0.2;
    nube.velocityX = -4;
    nube.y = Math.round (random (15,height/2));

    nube.depth = trex.depth;
    trex.depth = trex.depth + 1;
  
    nube.lifetime = 170;

    gruponubes.add(nube);
  }
}

function crearobstaculo (){
  if (frameCount % 60 === 0){
    obstaculo = createSprite (width+20,height-100 ,20,50);
    obstaculo.velocityX = -5; 
    obstaculo.lifetime = 170;
    obstaculo.debug = true;
    obstaculo.setCollider ("Rectangle", 0,0,100,90);
    
    //profundidad
    x2_play.depth = obstaculo.depth;
    obstaculo.depth = obstaculo.depth - 1;


    grupoobstaculo.add(obstaculo);      

    var numero = Math.round (random (1,3));
    switch (numero){
      case 1:
        obstaculo.addImage (cactus1);
        obstaculo.scale = 0.11        
        break;

      case 2:
        obstaculo.addImage (cactus2);
        obstaculo.scale = 0.11  
        break;

      case 3:
        obstaculo.addImage (cactus3);
        obstaculo.scale = 0.025    
        break;
    }
  }

}

 

function reiniciar (){
  estadodejuego = PLAYING;
  grupoobstaculo.destroyEach();
  gruponubes.destroyEach();
  trex.changeAnimation("running", trex_running);
  puntos = 0;
}
var px = 250;
var runTime = 0;
var ex, ey, bx, by;
var bx2, by2;
var esqux = 115, esquy = 100;
var esqux_speed = 0.2, esquy_speed = 15;
var i, j, k, l;
var bulletSum;
var bulletArray = [];
var bulletLivesArray = [];
var enemyArray = [];
var enemyLivesArray = [];
var ex = [[]];
var ey = [[]];
var gel = 50;
var state = 0;
var i2, j2;
var l1=0, l2=0, l3=0, l4=0, l5=0;
var l1p=0, l2p=0, l3p=0, l4p=0, l5p=0;
var leveltext = "Your difficulty level is  <Normal>.";
var gameSpeed = 10;
var bulletLimit = 65;
var bg_n, bg_e, bg_h, bg_play, bg_win, bg_gameover, iplayer, ialien, hitSound, winSound, loseSound, myFont;
var bg;
var cWinSound = 0, cLoseSound = 0;

function preload() {
  bg_n = loadImage('media/bg_n.png');
  bg_e = loadImage('media/bg_e.png');
  bg_h = loadImage('media/bg_h.png');
  bg_play = loadImage('media/bg_play.jpg');
  bg_win = loadImage('media/bg_win.png');
  bg_gameover = loadImage('media/bg_gameover.png');
  iplayer = loadImage('media/player.png');
  ialien = loadImage('media/alien.png');
  hitSound = loadSound('media/hit.mp3');
  winSound = loadSound('media/win.mp3');
  loseSound = loadSound('media/lose.wav');
  myFont = loadFont('media/MiniSet2.ttf');
}

function setup() {
  imageMode(CENTER);
  createCanvas(500, 500);
  createEnemy();
  bg = bg_n;
  textFont(myFont);
}

function draw() {
  if (state == 0) {
    gameStart();
  }
  
  else if (state == 1) {
    gamePlaying();
  }
  
  else if (state == 2) {
    gameWin();
  }
  
  else {
    gameOver();
  }
}

function createEnemy() {
  for(i = 0; i < 5; i++) {
    ex.push( [ ] );
    ey.push( [ ] );
  }
  
  for(i = 0; i < 5; i++) {
    for(j = 0; j < 10; j++) {
      ex[i].push(esqux + 30 * j);
      ey[i].push(esquy + 40 * i);
      var tempEnemy = new enemy(ex[i][j], ey[i][j]);
      enemyArray.push(tempEnemy);
      enemyLivesArray.push(1);
    }
  }
}

function gameStart() {
  //state = 0
  image(bg, 250, 250, 500, 500);
  fill(255);
  stroke(0);
  
  //choose a difficult level
  if (keyIsDown(69)) {
    gameSpeed = 15;
    bulletLimit = 1000;
    bg = bg_e;
  }

  else if (keyIsDown(78)) {
    gameSpeed = 10;
    bulletLimit = 65;
    bg = bg_n;
  }

  else if (keyIsDown(72)) {
    gameSpeed = 5;
    bulletLimit = 55;
    bg = bg_h;
  }
}

function gamePlaying() {
  //state = 1
  image(bg_play, 250, 250, 500, 500);
  fill(255);
  stroke(255);
  start();
  checkScore();
  
  stroke(255);
  line(65, 375, 435, 375);
  
  stroke(0);
  fill(255);
  text("Enemies Left: " + gel, 20, 60);
  
  if (bulletLimit == 1000) {
    text("Bullets Left: Unlimited", 20, 40);
  }
  else {
    text("Bullets Left: " + (bulletLimit - bulletArray.length), 20, 40);
  }
}

function gameWin() {
  //state = 2
  image(bg_win, 250, 250, 500, 500);
  
  cWinSound += 1;
  if (cWinSound == 1) {
    winSound.play();
  }
}

function gameOver() {
  //state = 3
  image(bg_gameover, 250, 250, 500, 500);
  
  cLoseSound += 1;
  if (cLoseSound == 1) {
    loseSound.play();
  }
  
  noStroke();
  fill(255);
  textSize(20);
  text("Enemies Left: " + gel, 175, 270);
}

function start() {
  player();
  runTime += 1;
  
  for(i = 0; i < 50; i++) {
    enemyArray[i].display(i);
  }
  
  bulletSum = bulletArray.length;
  for (k = 0; k < bulletSum; k++) {
    bulletArray[k].display(k);
  }
  
}

function player() {
  controlPlayer();
  image(iplayer, px, 400, 30, 30);
}

function enemy(ex2, ey2) {
  this.display = function(z) {
    moveEnemySquare(runTime);
    i2 = int(z / 10);
    j2 = int(z - i2 * 10); 
    ex2 = esqux + 30 * j2;
    ey2 = esquy + 40 * i2;
    this.enemyLives = checkEnemyLives(ex2, ey2, z);
    checkCollision(ey2);
    bulletSum = bulletArray.length;
    
    if (this.enemyLives == 0) {
      if (enemyLivesArray[z] == 1) {
        enemyLivesArray[z] = 0;
        gel -= 1;
      }
    }
    
    if (this.enemyLives != 0 && enemyLivesArray[z] != 0) {
      image(ialien, ex2, ey2, 20, 20);
    }
  }
}

function controlPlayer() {
  if (keyIsDown(65)) {
    if (px > 80) {
      px -= 2;
    }
  }
  
  if (keyIsDown(68)) {
    if (px < 420) {
      px += 2;
    }
  }
}

function keyPressed() {
  if (keyIsDown(13)) {
    if (bulletArray.length < bulletLimit) {
      var tempBullet = new bullet(px);
      bulletArray.push(tempBullet);
      bulletLivesArray.push(1);
    }
  }
}

function checkCollision(ey3) {
  for(var cc = 0; cc < 10; cc++) {
    l1p = l1;
    l1 += enemyLivesArray[cc];
  }
  
  for(var cc = 10; cc < 20; cc++) {
    l2p = l2;
    l2 += enemyLivesArray[cc];
  }
  
  for(var cc = 20; cc < 30; cc++) {
    l3p = l3;
    l3 += enemyLivesArray[cc];
  }
  
  for(var cc = 30; cc < 40; cc++) {
    l4p = l4;
    l4 += enemyLivesArray[cc];
  }
  
  for(var cc = 40; cc < 50; cc++) {
    l5p = l5;
    l5 += enemyLivesArray[cc];
  }
  
  if ((l5 != l5p) && (ey3 > 370)) {
    state = 3;
  }
  
  if ((l4 != l4p) && (ey3 > 390)) {
    state = 3;
  }
  
  if ((l3 != l3p) && (ey3 > 410)) {
    state = 3;
  }
  
  if ((l2 != l2p) && (ey3 > 430)) {
    state = 3;
  }
  
  if ((l1 != l1p) && (ey3 > 450)) {
    state = 3;
  }
}

function moveEnemySquare(runTime) {
  if(runTime % gameSpeed == 0) {
    esqux += esqux_speed;
  }
      
  if(esqux > 174 || esqux < 54) {
    esqux_speed *= -1;
    esquy += esquy_speed;
    i -= 1;
  }
}

function bullet(px) {
  this.bx = px;
  this.by = 400;
  
  this.x = function() {
    return this.bx;
  }
  
  this.y = function() {
    return this.by;
  }
  
  this.display = function(kk) {
    if (this.by > 0 && bulletLivesArray[kk] != 0) {
      fill(255, 255, 0);
      noStroke();
      ellipse(this.bx, this.by, 4, 4);
      this.by -= 1;
    }
  }
}

function checkEnemyLives(ex4, ey4, z2) {
  bulletSum = bulletArray.length;
  for (k = 0; k < bulletSum; k++) {
    bx2 = bulletArray[k].x();
    by2 = bulletArray[k].y();
    var d = dist(ex4, ey4, this.bx2, this.by2);
    if (d <= 12 && bulletLivesArray[k] != 0) {
      if (enemyLivesArray[z2] != 0) {
        bulletLivesArray[k] = 0;
        hitSound.play();
      }
      return 0;
    }
  }
}

function checkScore() {
  if(gel == 0) {
    state = 2;
  }
}

function mousePressed() {
  if (state == 0 && mouseY > 420) {
    state = 1;
  }
}
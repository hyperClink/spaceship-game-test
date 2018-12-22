//canvas init
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

//ship start variables
var yp = 100;
var xp = 20;
var speed = 0;

//bulletT1 start variables
var xspeed = 0;
var yspeed = 0;
var BulletTimer=0;
var BulletRate=1;

//control variables
var up=false;
var down=false;
var left=false;
var right=false;
var shoot=false;

var keydownkey='null';
var keyupkey='null';

//enemy variables
var EnemyTimer = 0;
var EnemyRate = 1;


//creating bullet array
var bullets=[];
var enemies=[];

//img creation
var ship = new Image();
var bg = new Image();
var bullet = new Image();
var enemy1 = new Image();

//sources of images
ship.src='img/ship.png';
bg.src='img/bg2.jpg';
bullet.src='img/bullet_custom.png';
enemy1.src='img/enemy.png';

//key check
document.addEventListener("keydown", keydownkey1);
document.addEventListener('keyup', keyupkey1);

//key down check
function keydownkey1(keyd) {
    switch(keyd.key){

      case 'W':
      case 'w':
      case 'ArrowUp':
        up = true;
      break;

      case 'S':
      case 's':
      case 'ArrowDown':
        down = true;
      break;

      case 'A':
      case 'a':
      case 'ArrowLeft':
        left = true;
      break;

      case 'D':
      case 'd':
      case 'ArrowRight':
        right = true;
      break;

      case ' ':
        shoot = true;
      break;

      default:
        console.log(keydownkey);
      break;
    }
}

//check for keys which are up
function keyupkey1(keyu) {
    switch(keyu.key){

      case 'W':
      case 'w':
      case 'ArrowUp':
        up = false;
        yspeed = 0;
      break;

      case 'S':
      case 's':
      case 'ArrowDown':
        down = false;
        yspeed = 0;
      break;

      case 'A':
      case 'a':
      case 'ArrowLeft':
        left = false;
        xspeed = 0;
      break;

      case 'D':
      case 'd':
      case 'ArrowRight':
        right = false;
        xspeed = 0;
      break;

      case ' ':
        shoot = false;
      break;

      default:
      break;
    }

  }


  //sets up the bullet
    fireBullet = function() {
      BulletTimer++;
      if (BulletTimer%BulletRate==0) {
      bullets.push({x:xp+43, y:yp+23, accel:Math.random()*2, scale:0, timer:0, xspeed:xspeed/3, yspeed:yspeed/3, flipCoin:randomInt(-1 ,1)});
        };
      };

  //adds enemies to the array
    spawnEnemy = function() {
      EnemyTimer++;
      if (EnemyTimer%EnemyRate==0) {
      enemies.push({x:canvas.width, y:randomInt(0,512)});
    };
  };

  //random integer
   randomInt = function(min, max) {
     min = Math.ceil(min);
     max = Math.floor(max);
     return Math.floor(Math.random()*(max-min+1))+min;
   };


//engine
function draw() {
  ctx.drawImage(bg, 0, 0);
  ctx.drawImage(ship, xp, yp);
  requestAnimationFrame(draw);
  spawnEnemy();

//ship acceleration
if (speed<2 && (up==true || down==true || left==true || right==true)) {speed += 0.16};
if (up==false && down==false && left==false && right==false && speed>0) {speed =0};

//ship keydown actions

  if (up == true && yp>0){
    yp -=4+speed;
    yspeed = -(4+speed);
  }

  if (down == true && yp+ship.height<canvas.height){
    yp +=4+speed;
    yspeed = 4+speed;
  }

  if (left == true && xp>0){
    xp -=5+speed;
    xspeed = -(4+speed);
  }

  if (right == true && xp+ship.width<d canvas.width){
    xp +=5+speed;
    xspeed = 4+speed;
  }

  if (shoot == true){
        fireBullet();
  }

//remove rockets
  for(var i=0; i<bullets.length; i++) {
        if(bullets[i].x >canvas.width || bullets[i].scale/5+10<0) {
            bullets.splice(i--, 1);
        };
    };

//remove enemies
  for(var i=0; i<enemies.length; i++) {
        if(enemies[i].x+enemy1.width <0){
            enemies.splice(i--, 1);
        };
    };

//enemies-bullets collision
  for(var i=0; i<bullets.length && bullets.length != 'undefined' && bullets.length != 0; i++) {
    for(var n=0; n<enemies.length && enemies.length != 'undefined' && enemies.length != 0; n++)
      if (i >= 0) {
        if(bullets[i].x>enemies[n].x &&
           bullets[i].x-enemy1.width<enemies[n].x &&
           bullets[i].y>enemies[n].y &&
           bullets[i].y<enemies[n].y+enemy1.height){
             enemies.splice(n--, 1);
             bullets.splice(i--, 1);
           };
        };
    };

//bullets logic
  for(var i=0; i<bullets.length; i++) {
      ctx.drawImage(bullet, bullets[i].x, bullets[i].y, bullets[i].scale/5+10, bullets[i].scale/5+10);
      bullets[i].x +=8+bullets[i].accel+bullets[i].xspeed;
      bullets[i].y +=(bullets[i].accel/10)*bullets[i].flipCoin;
      bullets[i].accel +=0.1;
      bullets[i].timer++;

      //size-time modification
      if (bullets[i].timer < 32) {
        bullets[i].scale = -bullets[i].timer/50;
      }

      //bullet decay
      if (bullets[i].timer > 32-randomInt(0, 5)) {
        bullets[i].y += 6*bullets[i].flipCoin*Math.random();
        bullets[i].scale -=5;
        bullets[i].accel -=Math.random()*bullets[i].timer/10;
      };

  };

  //draw enemies
    for(var i=0; i<enemies.length; i++) {
      ctx.drawImage(enemy1, enemies[i].x, enemies[i].y);
      enemies[i].x-=1;
    };


  };



draw();

//canvas init
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

//ship start variables
var yp = 100;
var xp = 20;
var speed = 0;

//specials(?)
var spec1=false;
var spec1u=true;

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
var enemyTimer = 0;
var enemyRate = 20;

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

      case 'Shift':
        spec1 = true;
      break;

      default:
        console.log(keyd.key);
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

      case 'Shift':
        spec1 = false;
        spec1u = true;
      break;

      default:
      break;
    }

  }


  //sets up the bullet
    fireBullet = function(xOffset, yOffset, defSpeed,
        accel, accelRate, scaleX, scaleY, tscr, tscd, doTimeScale,
        doTimeAccel, timerEnd, spread, xdec, ydec, xso, yso, damage, hp, kb) {

      bullets.push({x:xp+xOffset, y:yp+yOffset, defSpeed:defSpeed,
      accel:accel, accelRate:accelRate, scaleX:scaleX, scaleY:scaleY, tScaleRate:tscr,
      tAccelDecay:tscd, xDecay:xdec, yDecay:ydec, timer:0, timerEnd:timerEnd,
      xspeed:xspeed*xso, yspeed:yspeed*yso, flipCoin:randomInt(-1 ,1),
      doTimeScale:doTimeScale, spread:spread, damage:damage, sturdiness:hp, knockback:kb});
      };

  //adds enemies to the array
    spawnEnemy = function() {
      enemies.push({x:canvas.width, y:randomInt(0,512), hp:7, accel: 0});
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

//ship acceleration
if (speed<2.2 && (up==true || down==true || left==true || right==true)) {speed += 0.2};
if (up==false && down==false && left==false && right==false && speed>0) {speed =0};

//ship keydown actions

  if (up == true && yp>0){
    yp -=5+speed;
    yspeed = -(5+speed);
  }

  if (down == true && yp+ship.height<canvas.height){
    yp +=5+speed;
    yspeed = 5+speed;
  }

  if (left == true && xp>0){
    xp -=5+speed;
    xspeed = -(5+speed);
  }

  if (right == true && xp+ship.width<canvas.width){
    xp +=5+speed;
    xspeed = 5+speed;
  }

  if (shoot == true){
    BulletTimer++;
    if (BulletTimer%BulletRate==0) {

  if (spec1=true){
    spec1u=false;
  }

/*describe the bullet here

offsets 2, speed, init.acceleration, acceleration rate, intitial scale 2,
scale rate, timeScaleDecay, scale with time?, acceletation decay?, decay timer,
spread, xDecay and Ydecay 2, xspeed and yspeed mult.2, damage, sturdiness, knockback */

        fireBullet(45, 21, 10, Math.random()*2, 0.1, 11, 11, 200, 10, true, true, 40, 0.1, 1, 1, 0.3, 0.3, 1, 1, 0.5);

      };
  };

  if (spec1 == true && spec1u == true){
    for (var i = 0; i < 3; i++) {
      fireBullet(45, 21, 25, 0, 0, 20, 20, 0, 10, false, false, 0, 2, -2, 0.5, 0, 0, 1, 500, 5);
    };
      spec1u = false;
  };

//remove bullets
  for(var i=0; i<bullets.length; i++) {
        if(bullets[i].x >canvas.width || bullets[i].scaleX<0 || bullets[i].scaleY<0) {
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
    for(var n=0; n<enemies.length && enemies.length != 'undefined' && enemies.length != 0; n++) {
      if (i >= 0) {
        if(bullets[i].x>enemies[n].x &&
           bullets[i].x-enemy1.width<enemies[n].x &&
           bullets[i].y>enemies[n].y &&
           bullets[i].y<enemies[n].y+enemy1.height){

             enemies[n].hp-=bullets[i].damage;
             enemies[n].accel-=bullets[i].knockback;
             bullets[i].sturdiness--;

              if (bullets[i].sturdiness<=0) {
                bullets.splice(i--, 1);
              };

             //enemy down
             if (enemies[n].hp<=0){
               enemies.splice(n--, 1);
             };

           };
        };
    };
  };

//bullets logic
  for(var i=0; i<bullets.length; i++) {
      ctx.drawImage(bullet, bullets[i].x, bullets[i].y, bullets[i].scaleX, bullets[i].scaleY);
      bullets[i].x +=bullets[i].defSpeed + bullets[i].accel + bullets[i].xspeed;
      bullets[i].y +=bullets[i].spread * bullets[i].flipCoin * bullets[i].accel + bullets[i].yspeed;
      bullets[i].accel += bullets[i].accelRate;
      bullets[i].timer++;

      //size-time modification
      if (bullets[i].timer < bullets[i].timerEnd && bullets[i].doTimeScale==true) {
        bullets[i].scaleX = bullets[i].scaleX - bullets[i].timer/bullets[i].tScaleRate;
        bullets[i].scaleY = bullets[i].scaleY - bullets[i].timer/bullets[i].tScaleRate;
      }

      //bullet decay
      if (bullets[i].timer > bullets[i].timerEnd) {
        bullets[i].scaleX -=bullets[i].xDecay;
        bullets[i].scaleY -=bullets[i].yDecay;
        bullets[i].y += bullets[i].spread * bullets[i].flipCoin * Math.random();
          //decay acceleration
          if (bullets[i].doTimeAccel == true){
            bullets[i].accel -= Math.random() * bullets[i].timer / bullets[i].tAccelDecay;
          };

      };

  };

//enemy draw
    for(var i=0; i<enemies.length; i++) {
      ctx.drawImage(enemy1, enemies[i].x, enemies[i].y);
      enemies[i].accel+=0.01;
      enemies[i].x-=1+enemies[i].accel;
    };

//spawn enemies
    enemyTimer++;
    if (enemyTimer%enemyRate==0) {
      spawnEnemy();
    };

  };



draw();

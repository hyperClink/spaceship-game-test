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
var specTimer=0;

//bulletT1 start variables
var xspeed = 0;
var yspeed = 0;
var BulletTimer=0;
var BulletRate=4;

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
var enemyRate = 30;

//creating bullet array
var bullets=[];
var enemies=[];

//img creation
var ship = new Image();
var bg = new Image();
var bullet1 = new Image();
var enemy1 = new Image();
var enemy2 = new Image();
var spec1img = new Image();
var eBullet = new Image();

//sources of images
ship.src='img/ship.png';
bg.src='img/bg2.jpg';
bullet1.src='img/bullet_custom.png';
enemy1.src='img/enemy.png';
enemy2.src='img/enemy2.png';
spec1img.src='img/special.png';
eBullet.src='img/enemyBullet.png';

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
        doTimeAccel, timerEnd, spread, xdec, ydec, xso, yso, damage, hp, kb, type, side) {

      bullets.push({x:xOffset, y:yOffset, defSpeed:defSpeed,
      accel:accel, accelRate:accelRate, scaleX:scaleX, scaleY:scaleY, tScaleRate:tscr,
      tAccelDecay:tscd, xDecay:xdec, yDecay:ydec, timer:0, timerEnd:timerEnd,
      xspeed:xspeed*xso, yspeed:yspeed*yso, flipCoin:randomInt(-1 ,1),
      doTimeScale:doTimeScale, spread:spread, damage:damage, sturdiness:hp, knockback:kb, type:type, side:side});
      };

  //adds enemies to the array
    spawnEnemy = function(x, y, hp, speed, accelInit, accel, KBAbility, type, bx, by) {
      enemies.push({x:x, y:y, hp:hp, speed:speed, accel:accelInit, accelI:accel, kbAbility:KBAbility, type:type, bulleyX:bx, bulletY:by});
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
  specTimer++;

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
/*describe the bullet here

offsets 2, speed, init.acceleration, acceleration rate, intitial scale 2,
scale rate, timeScaleDecay, scale with time?, acceletation decay?, decay timer,
spread, xDecay and Ydecay 2, xspeed and yspeed mult.2, damage, sturdiness, knockback, type, side */
        fireBullet(45+xp, 21+yp, 10, Math.random()*2, 0.1, 11, 11, 200, 10, true, true, 60, 0.1, 1, 1, 0.3, 0.3, 1, 1, 0.5, bullet1, 1);
    };
  };

//specials
  //spawn special
  if (spec1 == true && spec1u == true && specTimer>=100){
    for (var i = 0; i < 3; i++) {
      fireBullet(45+xp, 21+yp, 25, 0, 0, 10, 15, 0, 10, false, false, 0, 4, -2.2, 0.3, 0, 0, 1, 200, 6, spec1img, 1);
    };
      spec1u = false;
      specTimer = 0;
  };

//remove bullets
  for(var i=0; i<bullets.length; i++) {
        if(bullets[i].x >canvas.width || bullets[i].x <0 || bullets[i].scaleX<0 || bullets[i].scaleY<0) {
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
           bullets[i].y<enemies[n].y+enemy1.height &&
           bullets[i].side==1)
           {
             enemies[n].hp-=bullets[i].damage;

             if (bullets[i].knockback>enemies[n].kbAbility) {
               enemies[n].accel-=bullets[i].knockback-enemies[n].kbAbility;
             };

              bullets[i].sturdiness--;

              if (bullets[i].sturdiness<=0) {
                bullets.splice(i--, 1);
              };

             //enemy down
             if (enemies[n].hp<=0){
               enemies.splice(n--, 1);
             };

           };
           if (i >= 0){
        if(bullets[i].x>xp &&
           bullets[i].x<xp+ship.width &&
           bullets[i].y>yp &&
           bullets[i].y<yp+ship.height &&
           bullets[i].side==0) {
             xp-=10;

             bullets[i].sturdiness--;
          if (bullets[i].sturdiness<=0) {
             bullets.splice(i--, 1)
           };

           };
         };

         };

    };
  };

//bullets logic
  for(var i=0; i<bullets.length; i++) {
      ctx.drawImage(bullets[i].type, bullets[i].x, bullets[i].y, bullets[i].scaleX, bullets[i].scaleY);
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
      ctx.drawImage(enemies[i].type, enemies[i].x, enemies[i].y);
      enemies[i].accel+=enemies[i].accelI;
      enemies[i].x-=enemies[i].speed+enemies[i].accel;
  };

//enemy shoots

  n=randomInt(1, enemies.length);

  //enemy2 bullets
  for (var i = 0; i < 4; i++) {
  if (enemyTimer%5==0 && enemies.length != 'undefined' && enemies.length != 0 && enemies[n-1].type === enemy2) {
  /*describe the bullet here

  offsets 2, speed, init.acceleration, acceleration rate, intitial scale 2,
  scale rate, timeScaleDecay, scale with time?, acceletation decay?, decay timer,
  spread, xDecay and Ydecay 2, xspeed and yspeed mult.2, damage, sturdiness, knockback, type, side */
    fireBullet(
    enemies[n-1].x, enemies[n-1].y+enemies[n-1].bulletY, -13,
    -Math.random()*2, -0.1, 8, 8, 100, 10,
    true, true, 6, 2, 2, 2, 0, 0, 1, 1,
    0.5, eBullet, 0);
    };
  };

  //enemy1 bullets
  if (enemyTimer%35==0 && enemies.length != 'undefined' && enemies.length != 0 && enemies[n-1].type === enemy1) {
  /*describe the bullet here

  offsets 2, speed, init.acceleration, acceleration rate, intitial scale 2,
  scale rate, timeScaleDecay, scale with time?, acceletation decay?, decay timer,
  spread, xDecay and Ydecay 2, xspeed and yspeed mult.2, damage, sturdiness, knockback, type, side */
    fireBullet(
    enemies[n-1].x, enemies[n-1].y+enemies[n-1].bulletY, -10,
    -Math.random(), -0.07, 10, 10, 100, 10,
    false, false, 30, 0, 0.1, 0.1, 0, 0, 1, 1,
    0.5, eBullet, 0);

  };



//spawn enemies
    enemyTimer++;
    if (enemyTimer%enemyRate==0) {
                //x, y, hp, speed, accelInit., accel, -knockback, type, bulletx, bullety
      spawnEnemy(canvas.width, randomInt(0,512), 2, 1, Math.random()*2, 0.01, 0, enemy1, 0, 23);
    };

    if (enemyTimer%(enemyRate*randomInt(3,8))==0) {
                  //x, y, hp, speed, accelInit., accel, -knockback, type
      spawnEnemy(canvas.width, randomInt(0,512), 1, 4, Math.random()*1.2, 0.08, -1, enemy2, 0, 20);
    };

  };



draw();

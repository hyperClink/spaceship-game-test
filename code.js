//canvas init.
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

//score init.
var score = 0;
var scoreMax = 0;
var scoreOutput = document.getElementById('score');

//ship start variables
var yp = 100;
var xp = 20;
var speed = 0;

//specials(?)
var spec1=false;
var spec1u=true;
var specTimer=0;
var specTimerOut=document.getElementById('special');

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
var enemyRate = 40;

//upgrades
var bulletUp = 0;
var bulletUp2 = 0;
var spMaxU = 2000;
var spRateU = 1;
var upgradesOut = document.getElementById('upgrades');

//creating arrays
var bullets=[];
var enemies=[];
var upgrades=[];

var bckg = [{x:0, y:0, spawned:false}];


//img creation
var ship = new Image();
var bg = new Image();
var bullet1 = new Image();
var enemy1 = new Image();
var enemy2 = new Image();
var enemy3 = new Image();
var spec1img = new Image();
var eBullet = new Image();
var bUp = new Image();
var bUp2 = new Image();
var spMax = new Image();
var spRate = new Image();

//sources of images
ship.src='img/ship.png';
bg.src='img/bg2.jpg';
bullet1.src='img/bullet_custom.png';
enemy1.src='img/enemy.png';
enemy2.src='img/enemy2.png';
enemy3.src='img/enemy3.png';
spec1img.src='img/special.png';
eBullet.src='img/enemyBullet.png';
bUp.src='img/bulletUp.png';
bUp2.src='img/bulletUp2.png';
spMax.src='img/spMax.png';
spRate.src='img/spRate.png';

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
    spawnEnemy = function(x, y, hp, speed, accelInit, accel, KBAbility, type, bx, by, bRate) {
      enemies.push({x:x, y:y, hp:hp, speed:speed, accel:accelInit, accelI:accel, kbAbility:KBAbility, type:type, bulleyX:bx, bulletY:by, bRate:bRate});
    };

  //adds bckg
    addBckg = function() {
    bckg.push({x:canvas.width, y:0})
  };

  //creates an upgrade
    spawnUpgrade = function(x, y, type) {
      upgrades.push({x:x, y:y, type:type})
    };

  //random integer
   randomInt = function(min, max) {
     min = Math.ceil(min);
     max = Math.floor(max);
     return Math.floor(Math.random()*(max-min+1))+min;
   };

//engine
function draw() {

  //bckg scroll
  for (var i = 0; i < bckg.length; i++) {
    ctx.drawImage(bg, bckg[i].x, bckg[i].y);
    if(bckg[i].x<=0 && bckg[i].spawned==false){
      bckg[i].spawned=true;
      bckg.push({x:canvas.width, y:0, spawned:false});
    }

    bckg[i].x-=1+score/150;
    if(bckg[i].x+bg.width<=-canvas.width){
      bckg.splice(i--, 1)
    }
  }

  ctx.drawImage(ship, xp, yp);
  requestAnimationFrame(draw);

  BulletRate=Math.max(1, 6-bulletUp);
//end

//score output to div
  scoreOutput.innerHTML='Score:' + Math.round(score) + ' Max Score:' + scoreMax;

//upgrades output to div
  upgradesOut.innerHTML='Bullet Rate:' + Math.min(5, bulletUp) + '(5 max)||||Bullet Multiplier: x' + (bulletUp2+1) + '||||SP MAX: ' + spMaxU/20+ '%|||| SP Charge Rate:' + spRateU;

//lose (temp.)
  if(score<0){
    score=0;
  }

  if(scoreMax<Math.round(score)){
    scoreMax=Math.round(score);
  }

//ship acceleration--
if (speed<2.2 && (up==true || down==true || left==true || right==true)) {speed += 0.2};
if (up==false && down==false && left==false && right==false && speed>0) {speed =0};
//end

//ship keydown actions--
  if (up == true && yp>0){
    yp -=5+speed;
    yspeed = -(5+speed);}

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
t scale rate, timeaccelDecay, scale with time?, acceletation decay?, decay timer,
spread, xDecay and Ydecay 2, xspeed and yspeed mult.2, damage, sturdiness, knockback, type, side */
      for (var i = 0; i < bulletUp2+1; i++) {
        fireBullet(45+xp, 21+yp, 10, Math.random()*2, 0.1, 11, 11, 1000, 1, false, false, 60, 0.1, 100, 100, 0.3, 0.3, 1, 1, 1.1, bullet1, 1);
    };
  };
};

  if (xp<=0){xp=0; xspeed = 0}
  if (xp+ship.width>=canvas.width){xp=canvas.width-ship.width; xspeed=0}
  if (yp<=0){yp=0; yspeed=0}
  if (yp+ship.height>=canvas.height){yp=canvas.height-ship.height; yspeed=0}
//end


//specials--
  //specials timer
  specTimerOut.innerHTML=Math.round(specTimer/20)+  '% SP Charge (press shift)';
  if (specTimer<spMaxU){
    specTimer+=spRateU;
  };

  if (specTimer>spMaxU){
    specTimer=spMaxU;
  };

  //spawn special
  if (spec1 == true && spec1u == true && specTimer>=2000){
    for (var i = 0; i < 4; i++) {
      fireBullet(0, 0, 0, 15+randomInt(0,8), -0.29, 10, 15, 0, 10, false, false, 0, 0, 0, -15, 0, 0, 100, 5000, 0, spec1img, 1);
    };
      spec1u = false;
      specTimer -= 2000;
  };
//end

//collisions--
//remove bullets
  for(var i=0; i<bullets.length; i++) {
        if(bullets[i].x >canvas.width || bullets[i].x <0 || bullets[i].scaleX<0 || bullets[i].scaleY<0) {
            bullets.splice(i--, 1);
        };
    };

//remove enemies
  for(var i=0; i<enemies.length && enemies.length != 'undefined' && enemies.length != 0; i++) {
        if(enemies[i].x+enemies[i].type.width <0){
            enemies.splice(i--, 1);
        };
        //enemy down
        if (i >= 0) {
          if (enemies[i].hp<=0){

            switch (enemies[i].type) {
              case enemy1:
                  score++;
                break;

              case enemy2:
                  score+=2;
                break;

                case enemy3:
                    score+=20;
                  break;

              default:
              break;
            }

            enemies.splice(i--, 1);

            if (specTimer<+spMaxU){
            specTimer+=Math.max(2*spRateU, 100-Math.ceil(score/3)*spRateU);
          };

        };
      };
    };

//enemies-bullets collision
  for(var i=0; i<bullets.length && bullets.length != 'undefined' && bullets.length != 0; i++) {
    for(var n=0; n<enemies.length && enemies.length != 'undefined' && enemies.length != 0; n++) {
      if (i >= 0) {
        //good bullets
        if(bullets[i].x+bullets[i].scaleX>enemies[n].x &&
           bullets[i].x<enemies[n].x+enemies[n].type.width &&
           bullets[i].y+bullets[i].scaleY>enemies[n].y &&
           bullets[i].y<enemies[n].y+enemies[n].type.height &&
           bullets[i].side==1)
           {
             enemies[n].hp-=bullets[i].damage;
             console.log(enemies[n].hp);

             if (bullets[i].knockback>enemies[n].kbAbility) {
               enemies[n].accel-=bullets[i].knockback-enemies[n].kbAbility;
             };

              bullets[i].sturdiness--;

              if (bullets[i].sturdiness<=0) {
                bullets.splice(i--, 1);
              };

           };
           if (i >= 0){
             //bad bullets
        if(bullets[i].x>xp &&
           bullets[i].x<xp+ship.width &&
           bullets[i].y>yp &&
           bullets[i].y<yp+ship.height &&
           bullets[i].side==0) {
             xp-=bullets[i].knockback;
             score-=bullets[i].damage;

             bullets[i].sturdiness--;
          if (bullets[i].sturdiness<=0) {
             bullets.splice(i--, 1)
           };

           };
         };

         };

    };
  };

//ship collision(enemies)--
for(var n=0; n<enemies.length && enemies.length != 'undefined' && enemies.length != 0; n++) {
    if(xp+ship.width>enemies[n].x &&
       xp<enemies[n].x+enemies[n].type.width &&
       yp+ship.width>enemies[n].y &&
       yp<enemies[n].y+enemies[n].type.height) {
         xp-=enemies[n].speed+enemies[n].accel;
         score-=2;
         xp-=15;
         enemies[n].hp--;
     };
   };
//end

//ship collision(upgrades)--
for(var n=0; n<upgrades.length && up.length != 'undefined' && upgrades.length != 0; n++) {
    if(xp+ship.width>upgrades[n].x &&
       xp<upgrades[n].x+bUp.width &&
       yp+ship.width>upgrades[n].y &&
       yp<upgrades[n].y+bUp.height) {

         if (upgrades[n].type==bUp){
         score+=5;
         bulletUp++;
       };

       if (upgrades[n].type==bUp2){
         score+=15;
         bulletUp2++;
      };

      if (upgrades[n].type==spMax){
        score+=15;
        spMaxU+=200;
      };

      if (upgrades[n].type==spRate){
        score+=20;
        spRateU+=0.2;
      };

         upgrades.splice(n--, 1);
     };
   };
//end

//upgrades--
  //draw upgrades
  for (var i = 0; i < upgrades.length; i++) {
        ctx.drawImage(upgrades[i].type, upgrades[i].x, upgrades[i].y)
        upgrades[i].x-=6;
      };

//spawn upgrades
//bullet 1
  if (1%randomInt(1, 4500)==0){
    spawnUpgrade(canvas.width,randomInt(0, canvas.height-bUp.height), bUp);
  };

//bullet 2
  if (1%randomInt(1, 10000)==0){
    spawnUpgrade(canvas.width,randomInt(0, canvas.height-bUp.height), bUp2);
  };

//sp Max
if (1%randomInt(1, 5500)==0){
  spawnUpgrade(canvas.width,randomInt(0, canvas.height-bUp.height), spMax);
};

//sp Rate
if (1%randomInt(1, 14000)==0){
  spawnUpgrade(canvas.width,randomInt(0, canvas.height-bUp.height), spRate);
};
//end

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
        bullets[i].y += bullets[i].spread * bullets[i].flipCoin;
          //decay acceleration
          if (bullets[i].doTimeAccel == true){
            bullets[i].accel -= Math.random() * bullets[i].timer / bullets[i].tAccelDecay;
          };

      };

  };

//enemies--
//enemy draw
    for(var i=0; i<enemies.length; i++) {
      ctx.drawImage(enemies[i].type, enemies[i].x, enemies[i].y);
      enemies[i].accel+=enemies[i].accelI;
      enemies[i].x-=enemies[i].speed+enemies[i].accel;
  };

//enemy shoots (scary part)
  n=randomInt(1, enemies.length);
  //enemy2 bullets
  for (var i = 0; i < enemies.length && enemies.length != 'undefined' && enemies.length != 0 && enemies[n-1].type !== enemy3; i++) {
    if (enemies[i].type===enemy3){
      if (enemyTimer%enemies[i].bRate==0) {
  /*describe the bullet here

  offsets 2, speed, init.acceleration, acceleration rate, intitial scale 2,
  scale rate, timeScaleDecay, scale with time?, acceletation decay?, decay timer,
  spread, xDecay and Ydecay 2, xspeed and yspeed mult.2, damage, sturdiness, knockback, type, side */
    fireBullet(
    enemies[i].x, enemies[i].y+enemies[i].bulletY, -13,
    0, 0, 8, 8, 50, 40,
    false, false, 0, 0, -3, -0.1, 0, 0, 0.1, 1000,
    0.1, eBullet, 0);
    };
    };
  };

  //enemy2 bullets
  for (var i = 0; i < enemies.length && enemies.length != 'undefined' && enemies.length != 0 && enemies[n-1].type !== enemy2; i++) {
    if (enemies[i].type===enemy2){
      if (enemyTimer%enemies[i].bRate==0) {
  /*describe the bullet here

  offsets 2, speed, init.acceleration, acceleration rate, intitial scale 2,
  scale rate, timeScaleDecay, scale with time?, acceletation decay?, decay timer,
  spread, xDecay and Ydecay 2, xspeed and yspeed mult.2, damage, sturdiness, knockback, type, side */
    fireBullet(
    enemies[i].x, enemies[i].y+enemies[i].bulletY, -13,
    -Math.random()*2, -0.1, 8, 8, 50, 40,
    true, true, 3, 3, 5, 5, 0, 0, 2, 4,
    40, eBullet, 0);
    };
    };
  };

  //enemy1 bullets
  if (enemies.length != 'undefined' && enemies.length != 0 && enemies[n-1].type === enemy1) {
    if (enemyTimer%enemies[n-1].bRate==0) {
      /*describe the bullet here

  offsets 2, speed, init.acceleration, acceleration rate, intitial scale 2,
  scale rate, timeScaleDecay, scale with time?, acceletation decay?, decay timer,
  spread, xDecay and Ydecay 2, xspeed and yspeed mult.2, damage, sturdiness, knockback, type, side */
      fireBullet(
    enemies[n-1].x, enemies[n-1].y+enemies[n-1].bulletY, -10,
    -Math.random(), -0.07, 10, 10, 100, 10,
    false, false, 30, 0, 0.01, 0.01, 0, 0, 8, 1,
    20, eBullet, 0);

    };
  };

//spawn enemies
    enemyTimer++;
    //enemy1
    if (enemyTimer%Math.max(1, enemyRate-Math.ceil(score/50))==0) {
                //x, y, hp, speed, accelInit., accel, -knockback, type, bulletx, bullety, bullet rate
      spawnEnemy(canvas.width, randomInt(0,canvas.height-enemy1.height), 3, 1, Math.random()*2, 0.01, 0, enemy1, 0, 23, 30);
    };

    //enemy 2
    if (enemyTimer%Math.max(2, (enemyRate*randomInt(2,10)-Math.ceil(score/25)))==0) {
                  //x, y, hp, speed, accelInit., accel, -knockback, type, bulletx, bullety, bullet rate
      spawnEnemy(canvas.width, randomInt(0,canvas.height-enemy2.height), 1, 4, Math.random()*1.2, 0.06*Math.random(), -1, enemy2, 0, 20, 2);
    };

    //enemy 3
    if (enemyTimer%Math.max(3000, enemyRate*30-Math.ceil(score/50))==0 && score>100) {
                //x, y, hp, speed, accelInit., accel, -knockback, type, bulletx, bullety, bullet rate
      spawnEnemy(canvas.width, randomInt(0,canvas.height-enemy3.height), 200, 0.8, 0, 0, 1000, enemy3, 0, 46, 1);
    };
//end

};



draw();

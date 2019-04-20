//canvas init. (we dont do var **** = ***, here)
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
var specB=false;

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
var enemyRate = 50;

//upgrades
var bulletUp = 0;
var bulletUp2 = 0;
var spMaxU = 2000;
var spRateU = 1;
var sBulletType = 0;

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
var bullet2 = new Image();
var enemy1 = new Image();
var enemy2 = new Image();
var enemy3 = new Image();
var enemy4 = new Image();
var enemy5 = new Image();
var enemy6 = new Image();
var enemymini1 = new Image();
var spec1img = new Image();
var eBullet = new Image();
var bUp = new Image();
var bUp2 = new Image();
var spMax = new Image();
var spRate = new Image();

//sources of images
ship.src='img/ship-v2-outlineshade.png';
bg.src='img/bg2.jpg';
bullet1.src='img/bullet_custom.png';
bullet2.src='img/bullet2.png';
enemy1.src='img/enemy.png';
enemy2.src='img/enemy2-v2.png';
enemy3.src='img/enemy3.png';
enemy4.src='img/enemy4.png';
enemy5.src='img/enemy5-v2-shaded.png';
enemy6.src='img/enemy6.png';
enemymini1.src='img/enemymini1.png'
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

      case 'Q':
      case 'q':
        spec1 = true;
      break;

      case 'Shift':
        specB = true;
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

      case 'Q':
      case 'q':
        spec1 = false;
        spec1u = true;
      break;

      case 'Shift':
        specB = false;
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
      xspeed:xspeed*xso, yspeed:yspeed*yso, flipCoin:coinflip(),
      doTimeScale:doTimeScale, spread:spread, damage:damage, sturdiness:hp, knockback:kb, type:type, side:side});
      };

  //adds enemies to the array
    spawnEnemy = function(x, y, hp, speedx, speedy, accelInitX, accelX, accelInitY, accelY, KBAbility, type, bx, by, bRate, score, followtype) {
      enemies.push({x:x, y:y, hp:hp, speedx:speedx, speedy:speedy, accelXinit:accelInitX, accelX:accelX, accelYinit:accelInitY, accelY:accelY, kbAbility:KBAbility, type:type, bulleyX:bx, bulletY:by, bRate:bRate, score:score, followtype:followtype});
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
   coinflip = function (){
     return Math.round(Math.random()) * 2 - 1
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
//end

  ctx.drawImage(ship, xp, yp);

  requestAnimationFrame(draw);

  BulletRate=Math.max(2, 6-bulletUp);

//score output to div
  scoreOutput.innerHTML='Score:' + Math.round(score) + ' Max Score:' + scoreMax;

//upgrades output to div
  upgradesOut.innerHTML='Bullet Rate:' + Math.min(5, bulletUp) + '(4 max, >4 - upgrade)||||Bullet Multiplier: x' + (bulletUp2+1) + '||||Bullet Level: ' + sBulletType + '||||SP MAX: ' + spMaxU/20+ '%|||| SP Charge Rate:' + spRateU;

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
t scale rate, timeaccelDecay, scale with time?\\, acceletation decay?\\, decay timer,
spread, xDecay and Ydecay 2, xspeed and yspeed mult.2, damage, sturdiness, knockback, type, side */
      for (var i = 0; i < bulletUp2+1; i++) {
        if (sBulletType == 0) {
          fireBullet(45+xp, 21+yp, 10, Math.random()*2, 0.1, 11, 11, 1, 1, false, true, 60, 0.1, 100, 100, 0.3, 0.3, 1, 1, 0.3, bullet1, 1);
        };

        if (sBulletType == 1) {
          fireBullet(45+xp, 21+yp, 10, Math.random()*2, 0.1, 11, 11, 1000, 1, false, false, 60, 0.05, 100, 100, 0.3, 0.3, 1, 3, 0.6, bullet2, 1);
        };

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

  //spawn special1
  if (spec1 == true && spec1u == true && specTimer>=2000){
    for (var i = 0; i < 4; i++) {
      fireBullet(0, 0, 0, 15+randomInt(0,8), -0.29, 10, 15, 0, 10, false, false, 0, 0, 0, -15, 0, 0, 2, 5000, 0, spec1img, 1);
    };
      spec1u = false;
      specTimer -= 2000;
  };

  //spawn special bullet
  if (specB == true && specTimer>=300){
      fireBullet(45+xp, 22+yp, 0, 0, 0, 10, 15, 0, 10, false, false, 0, 0, -100, 1.5, 0, 0, 2, 5000, 0, spec1img, 1);
      spec1u = false;
      specTimer -= 300;
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
        if(enemies[i].x+enemies[i].type.width < 0 || enemies[i].x > canvas.width+10){
            enemies.splice(i--, 1);
        };
        //enemy down
        if (i >= 0) {
          if (enemies[i].hp<=0){

            switch (enemies[i].type) {
              case enemy1:
                  score+=enemies[i].score;
                break;

              case enemy2:
                  score+=enemies[i].score;
                break;

                case enemy3:
                    score+=enemies[i].score;
                  break;

              default:
              break;
            }

            enemies.splice(i--, 1);

            if (specTimer<+spMaxU){
            specTimer+=Math.max(2*spRateU, 100-Math.ceil(score/2.5)*spRateU);
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
            // console.log(enemies[n].hp);

             if (bullets[i].knockback>enemies[n].kbAbility) {
               enemies[n].accelXinit-=bullets[i].knockback-enemies[n].kbAbility;
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
         xp-=enemies[n].speedx+enemies[n].accelXinit;
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

//upgrade bullets
  if (bulletUp > 4 && sBulletType<1){
    bulletUp = 0;
    sBulletType++;
  }

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
      bullets[i].y +=bullets[i].spread * bullets[i].flipCoin * Math.random() * bullets[i].accel + bullets[i].yspeed;
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
//enemy draw, logic
    for(var i=0; i<enemies.length; i++) {
      ctx.drawImage(enemies[i].type, enemies[i].x, enemies[i].y);
      enemies[i].accelXinit+=enemies[i].accelX;
      enemies[i].accelYinit+=enemies[i].accelY;
      enemies[i].y-=enemies[i].speedy+enemies[i].accelYinit;
      enemies[i].x-=enemies[i].speedx+enemies[i].accelXinit;
      if (enemies[i].followtype==1){
        if (enemies[i].y<yp){
          enemies[i].speedy-=0.1;
        };

        if (enemies[i].y>yp+ship.height){
          enemies[i].speedy+=0.1;
        };
      };
  };

//enemy shoots (scary part)
  //n is for random shooting intervals, remove it from the if to get a const. firerate
  n=randomInt(1, enemies.length);

  //enemymini1 bullets
  for (var i = 0; i < enemies.length && enemies.length != 'undefined' && enemies.length != 0; i++) {
    if (enemies[i].type===enemymini1){
      if (enemyTimer%enemies[i].bRate==0) {
        /*describe the bullet here

        offsets 2, speed,
        init.acceleration, acceleration rate, intitial scale 2, scale rate, timeAccDecay,
        scale with time?, acceletation decay?, decay timer, spread, xDecay and Ydecay 2, xspeed and yspeed mult.2,
        damage, sturdiness, knockback, type, side */
        fireBullet(
          enemies[i].x, enemies[i].y+5, -5-enemies[i].accelXinit,
          -Math.random(), -0.05, 5, 5, 60, 30,
          true, false, 1000, 1, 3, 3, 0, 0,
          1, 1, 1, eBullet, 0);

        };
      };
    };

  //enemy5 ""bullets""
  for (var i = 0; i < enemies.length && enemies.length != 'undefined' && enemies.length != 0; i++) {
    if (enemies[i].type===enemy5){
      if (enemyTimer%enemies[i].bRate==0) {
  /*describe the """"bullet"""" here

  x, y, hp, speed x, speed y, accelInit.x, accelx, accelInit.y, accely, -knockback, type, bulletx, bullety, bullet rate, score*/
      spawnEnemy(enemies[i].x, enemies[i].y+25+randomInt(-5,5), 1, 0, randomInt(-2,2), 0, 0.1, 0, 0, 0.3, enemymini1, 0, 0, 8+randomInt(1,4), 1, 1);
      };
    };
  };

  //enemy4 bullets
  if (enemies.length != 'undefined' && enemies.length != 0 && enemies[n-1].type === enemy4) {
    if (enemyTimer%enemies[n-1].bRate==0) {
      /*describe the bullet here

  offsets 2, speed, init.acceleration, acceleration rate, intitial scale 2,
  scale rate, timeAccelDecay, scale with time?, acceletation decay?, decay timer,
  spread, xDecay and Ydecay 2, xspeed and yspeed mult.2, damage, sturdiness, knockback, type, side */
    fireBullet(
    enemies[n-1].x, enemies[n-1].y+enemies[n-1].bulletY, -10,
    -Math.random(), -0.07, 10, 10, 100, 10,
    false, false, 30, 0, 0.01, 0.01, 0, 0, 8, 1,
    20, eBullet, 0);

    };
  };

  //enemy3 bullets
  for (var i = 0; i < enemies.length && enemies.length != 'undefined' && enemies.length != 0; i++) {
    if (enemies[i].type===enemy3){
      if (enemyTimer%enemies[i].bRate==0) {
  /*describe the bullet here

  offsets 2, speed, init.acceleration, acceleration rate, intitial scale 2,
  scale rate, timeScaleDecay, scale with time?, acceletation decay?, decay timer,
  spread, xDecay and Ydecay 2, xspeed and yspeed mult.2, damage, sturdiness, knockback, type, side */
    fireBullet(
    enemies[i].x, enemies[i].y+enemies[i].bulletY, -13,
    0, 0, 8, 8, 50, 40,
    false, false, 0, 0, -3, -0.1, 0, 0, 0.06, 1000,
    0.1, eBullet, 0);
    };
    };
  };

  //enemy2 bullets
  for (var i = 0; i < enemies.length && enemies.length != 'undefined' && enemies.length != 0; i++) {
    if (enemies[i].type===enemy2){
      if (enemyTimer%enemies[i].bRate==0) {
  /*describe the bullet here

  offsets 2, speed,
  init.acceleration, acceleration rate, intitial scale 2, scale rate, timeScaleDecay,
  scale with time?, acceletation decay?, decay timer, spread, xDecay and Ydecay 2, xspeed and yspeed mult.2,
  damage, sturdiness, knockback, type, side */
    fireBullet(
    enemies[i].x, enemies[i].y+enemies[i].bulletY, -13,
    -Math.random()*2, -0.1, 8, 8, 50, 40,
    true, true, 3, 3, 5, 5, 0, 0,
    0.5, 4, 40, eBullet, 0);
    };
    };
  };

  //enemy1 bullets
  if (enemies.length != 'undefined' && enemies.length != 0 && enemies[n-1].type === enemy1) {
    if (enemyTimer%enemies[n-1].bRate==0) {
      /*describe the bullet here

      offsets 2, speed,
      init.acceleration, acceleration rate, intitial scale 2, scale rate, timeScaleDecay,
      scale with time?, acceletation decay?, decay timer, spread, xDecay and Ydecay 2, xspeed and yspeed mult.2,
      damage, sturdiness, knockback, type, side */
      fireBullet(
    enemies[n-1].x, enemies[n-1].y+enemies[n-1].bulletY, -10,
    -Math.random(), -0.07, 10, 10, 100, 10,
    false, false, 30, 0, 0.01, 0.01, 0, 0,
    4, 1, 20, eBullet, 0);

    };
  };

//spawn enemies
    enemyTimer++;
    //enemy1
    if (enemyTimer%Math.max(1, enemyRate-Math.ceil(score/25))==0 && score<200) {
      //x, y, hp, speed x, speed y, accelInit.x, accelx, accelInit.y, accely, -knockback, type, bulletx, bullety, bullet rate, score
      spawnEnemy(canvas.width, randomInt(0,canvas.height-enemy1.height), 6, 3, 0, Math.random()*2, 0.01, 0, 0, 0, enemy1, 0, 23, 30, 1, 0);
    };

    //enemy 2
    if (enemyTimer%Math.max(2, (enemyRate*randomInt(2,10)-Math.ceil(score/18)))==0) {
      //x, y, hp, speed x, speed y, accelInit.x, accelx, accelInit.y, accely, -knockback, type, bulletx, bullety, bullet rate, score
      spawnEnemy(canvas.width, randomInt(0,canvas.height-enemy2.height), 4, 7, 0, Math.random()*1.2, 0.06*Math.random(), 0, 0, -1, enemy2, 0, 20, 2, 2, 0);
    };

    //enemy 3
    if (enemyTimer%Math.max(235, enemyRate*30-Math.ceil(score/2))==0 && score>100) {
      //x, y, hp, speed x, speed y, accelInit.x, accelx, accelInit.y, accely, -knockback, type, bulletx, bullety, bullet rate, score
      spawnEnemy(canvas.width, randomInt(0,canvas.height-enemy3.height), 200, 0.8, 0, 0, 0, 0, 0, 1000, enemy3, 0, 46, 1, 25, 0);
    };

    //enemy4
    if (enemyTimer%Math.max(1, enemyRate-Math.ceil(score/22))==0 && score>180) {
      //x, y, hp, speed x, speed y, accelInit.x, accelx, accelInit.y, accely, -knockback, type, bulletx, bullety, bullet rate, score, ft
      spawnEnemy(canvas.width, randomInt(0,canvas.height-enemy4.height), 8, 7, 0, Math.random()*3, 0.01, 0, 0, 0.4, enemy4, 0, 23, 26, 2, 0);
    };

    //enemy5
    if (enemyTimer%Math.max(300, 0)==0) {
      //x, y, hp, speed x, speed y, accelInit.x, accelx, accelInit.y, accely, -knockback, type, bulletx, bullety, bullet rate, score, ft
      spawnEnemy(canvas.width, randomInt(0,canvas.height-enemy5.height), 10, 1, 0, 0, -0.002, 0, 0, 0.05, enemy5, 0, 23, 50, 5, 0);
    };
//end

};



draw();

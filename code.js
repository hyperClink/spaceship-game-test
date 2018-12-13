//canvas init
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

//start variables
var yp = 100;
var xp = 20;
var keydownkey='null';
var keyupkey='null';
var up=false;
var down=false;
var left=false;
var right=false;
var shoot=false;
var bn=0;
var cl=1;
var speed = 0;
var xspeed = 0;
var yspeed = 0;

//creating bullet array
var bullets=[];

//img creation
var ship = new Image();
var bg = new Image();
var bullet = new Image();

//sources of images
ship.src='img/ship.png';
bg.src='img/bg2.jpg';
bullet.src='img/bullet_custom.png';

//key check
document.addEventListener("keydown", keydownkey1);
document.addEventListener('keyup', keyupkey1);

function keydownkey1(keydownkey) {

  keydownkey=keydownkey.key
    switch(keydownkey){

      case 'w':
        up = true;
      break;

      case 's':
        down = true;
      break;

      case 'a':
        left = true;
      break;

      case 'd':
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
function keyupkey1(keyupkey) {
  keyupkey=keyupkey.key;
    switch(keyupkey){

      case 'w':
        up = false;
        yspeed = 0;
      break;

      case 's':
        down = false;
        yspeed = 0;
      break;

      case 'a':
        left = false;
        xspeed = 0;
      break;

      case 'd':
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
      cl++;
      if (cl%3==0){
      bullets.push({x:xp+43, y:yp+23, accel:Math.random()*2, scale:0, timer:0, xspeed:xspeed/3, yspeed:yspeed/3, flipCoin:randomInt(-1 ,1)});
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

//ship acceleration
if (speed<2 && (up==true || down==true || left==true || right==true)) {speed += 0.16};
if (up==false && down==false && left==false && right==false && speed>0){speed =0}

//ship keydown actions
  if (up == true){
    yp -=4+speed;
    yspeed = -(4+speed);
  }

  if (down == true){
    yp +=4+speed;
    yspeed = 4+speed;
  }

  if (left == true){
    xp -=5+speed;
    xspeed = -(4+speed);
  }

  if (right == true){
    xp +=5+speed;
    xspeed = 4+speed;
  }

  if (shoot == true){
        fireBullet();
      }

//remove rocket somehow
  for(var i=0; i<bullets.length; i++) {
        if(bullets[i].x >canvas.width || bullets[i].scale/5+10<0) {
            bullets.splice(i--, 1);
        };
    };

//draw bullets
  for(var i=0; i<bullets.length; i++) {
      ctx.drawImage(bullet, bullets[i].x, bullets[i].y, bullets[i].scale/5+10, bullets[i].scale/5+10);
      bullets[i].x +=9+bullets[i].accel+bullets[i].xspeed;
      bullets[i].y +=(bullets[i].accel/10)*bullets[i].flipCoin;
      bullets[i].accel +=0.1;
      bullets[i].timer++;

      //size-time modification
      if (bullets[i].timer < 40) {
        bullets[i].scale = -bullets[i].timer/50;
      }

      //bullet full decay
      if (bullets[i].timer > 40-randomInt(0, 5)) {
        bullets[i].y += 6*bullets[i].flipCoin*Math.random();
        bullets[i].scale -=5;
        bullets[i].accel -=Math.random()*bullets[i].timer/10;
      };

  };

  };



draw();

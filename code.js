//canvas init
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

//start variables
var yp = 10;
var xp = 20;
var keydownkey='null';
var keyupkey='null';
var up=false;
var down=false;
var left=false;
var right=false;
var shoot=false;
var bn=0;
var i=1;
var speed = 0;

//creating bullet array
var bullets=[];
bullets[0] = {x:null, y:null, accel:null, scale:null};

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


function keyupkey1(keyupkey) {
  keyupkey=keyupkey.key;
    switch(keyupkey){

      case 'w':
        up = false;
      break;

      case 's':
        down = false;
      break;

      case 'a':
        left = false;
      break;

      case 'd':
        right = false;
      break;

      case ' ':
        shoot = false;
      break;

      default:
      break;
    }

  }

//engine
function draw() {
  ctx.drawImage(bg, 0, 0);
  ctx.drawImage(ship, xp, yp);
  requestAnimationFrame(draw);

if (speed<2 && (up==true || down==true || left==true || right==true)) {speed += 0.3};

  if (up == true){
    yp -=4+speed;
  }

  if (down == true){
    yp +=4+speed;
  }

  if (left == true){
    xp -=5+speed;
  }

  if (right == true){
    xp +=5+speed;
  }

  if (shoot == true){
        fireBullet();
      }

//remove rocket somehow
  for(var i=0; i<bullets.length; i++) {
        if(bullets[i].x >canvas.width) {
            bullets.splice(i--, 1);
        };
    };

//draw rocket good
  for(var i=0; i<bullets.length; i++) {
      ctx.drawImage(bullet, bullets[i].x, bullets[i].y, bullets[i].scale+0.5, bullets[i].scale+0.5);
      bullets[i].x +=5+bullets[i].accel;
      bullets[i].accel +=0.2;
      bullets[i].scale = bullets[i].accel

  };

//fires the bullet
  fireBullet = function() {
        bullets.push({x:xp+40, y:yp+23, accel:0, scale:0});

      };


  console.log(speed);
  if (up==false && down==false && left==false && right==false && speed>0){speed -=0.1}
};

draw();

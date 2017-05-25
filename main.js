var width = 250;
var height = 125;
var offsetW = 50;
var offsetH = 20;
var canvas = document.getElementById('myCanvas');
var context = canvas.getContext('2d');
var paddleWidth = 4;
var paddleHeight = 20;
var playerX = 15;
var playerY = 60;
var aiX = 180;
var aiY = 70;
var ballX = canvas.width / 2;
var ballY = canvas.height / 2;
var radius = 1;
var moustYoffset = -250;
var ballSpeed = 0.1;
var ballDir = 0;
var oldTimestamp = 0;
window.mouseY = 300;
var ballHistory = [];
var shakeTime = 120;
var shakeTimer = shakeTime;
var shake = false;
var explosion = [];

var coinFlip = function() {
    return Math.floor(Math.random() * 2);
};

var ballServe = function() {
	ballX = canvas.width / 2;
	ballY = canvas.height / 2;
	
	if (coinFlip() == 0) {
		ballDir = random(-Math.PI/4, Math.PI/4);
	} else {
		ballDir = random(Math.PI * 3/4, Math.PI * 5/4);
	}
	
};

var random = function(min, max) {
	return Math.random() * (max - min) + min;
};

var randomShake = function() {
	var heightShake = Math.random() * (6 + 6) - 6;
	var widthShake =  Math.random() * (6 + 6) - 6;
	
	context.beginPath();
	context.moveTo(offsetW+widthShake, offsetH+heightShake);
	context.lineTo(width+widthShake, offsetH+heightShake);
	context.lineTo(width+widthShake, height+heightShake);
	context.lineTo(offsetW+widthShake, height+heightShake);
	context.lineTo(offsetW+widthShake, offsetH+heightShake);
	context.strokeStyle = '#ffffff';
	context.stroke();
	
	context.fillStyle = 'rgba(0, 0, 0, .05)';
  context.fillRect(0, 0, canvas.width, canvas.height);
};

var renderCanvas = function() {
	
	if (shake){
		while(shakeTimer>0){
			console.log("Shake");
			shakeTimer--;
			randomShake();
		}
		shakeTimer=shakeTime;
		shake = false;
	}
	
	context.beginPath();
	context.moveTo(offsetW, offsetH);
	context.lineTo(width, offsetH);
	context.lineTo(width, height);
	context.lineTo(offsetW, height);
	context.lineTo(offsetW, offsetH);
	context.strokeStyle = '#ffffff';
	context.stroke();
}

var renderPlayer = function() {
	context.fillStyle = 'darkblue';
	context.fillRect(offsetW+playerX, playerY, paddleWidth, paddleHeight);
}

var renderAI = function() {
	context.fillStyle = 'darkred';
	context.fillRect(offsetW+aiX, offsetH+aiY, paddleWidth, paddleHeight);
}

var ballMovement = function(time) {

	if (ballY < 22 || ballY > 122) { //out of bounds above/below
  	ballDir = 2 * Math.PI - ballDir;
  } 
	else if (ballX > 230) { 
		if(ballY > aiY+offsetH && ballY < offsetH+aiY+paddleHeight) //ai ball hit
		{
			ballDir = Math.PI - ballDir;
		} 
  } 
	else if (ballX < 70) { 
		if(ballY > playerY && ballY < playerY+paddleHeight) //player ball hit
		{
			ballDir = Math.PI - ballDir;
		} 
  }
	
	//scored a point
	if (ballX < 55){
		startDoubleExplosion(ballX, ballY);
		shake = true;
		ballServe();
	}else if (ballX > 245){
		startDoubleExplosion(ballX, ballY);
		shake = true;
		ballServe();
	}
	
	ballX += ballSpeed * time * Math.cos(ballDir);
  ballY += ballSpeed * time * Math.sin(ballDir);

	ballHistory.push([ballX, ballY]);
	if (ballHistory.length > 25){
		ballHistory.splice(0,1);
	}
	
}

var renderBall = function() {
	context.beginPath();
	context.arc(ballX, ballY, radius, 0, 2 * Math.PI, false);
	context.lineWidth = 2;
	context.strokeStyle = 'white';
	context.stroke();
	renderTrail();
}

var renderTrail = function() {
	
	for(var i = 0; i < ballHistory.length; i++){
		var pos = ballHistory[i]
		context.beginPath();
		context.arc(pos[0], pos[1], .5, 0, 2 * Math.PI, false);
		context.lineWidth = .5;
		context.strokeStyle = '#ffffff';
		context.stroke();
	}
	
}

var render = function(time) {
	renderCanvas();
	renderPlayer();
	renderAI();
	ballMovement(time);
	renderBall();
}

var animate = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
    function(step) {
      window.setTimeout(step, 1000/60);
};

document.onmousemove = function(e) {
    var event = e || window.event;
    window.mouseX = event.clientX;
    window.mouseY = event.clientY;
		
		if (window.mouseY>353){
			window.mouseY=353;
		}
		if (window.mouseY<272){
			window.mouseY=272;
		}
	
	playerY = window.mouseY+moustYoffset;
};

var step = function(timestamp) {
    context.fillStyle = 'rgba(0, 0, 0, .05)';
  	context.fillRect(0, 0, canvas.width, canvas.height);
    render(timestamp - oldTimestamp);
		updateAndDrawExplosion(timestamp - oldTimestamp);
    animate(step);
		oldTimestamp = timestamp;
};
	
window.onload = function() {
	step(0);
	ballServe();
}
	
function Particle ()
	{
		this.scale = 1.0;
		this.x = 0;
		this.y = 0;
		this.radius = 20;
		this.color = "#000";
		this.velocityX = 0;
		this.velocityY = 0;
		this.scaleSpeed = 0.5;
		this.useGravity = false;
      
		this.update = function(ms)
		{
			// shrinking
          
			this.scale -= this.scaleSpeed * ms / 1000.0;
          
			if (this.scale <= 0)
			{
              // particle is dead, remove it
              removeFromArray(explosion, this);
              
			}
			
			// moving away from explosion center
			this.x += this.velocityX * ms/1000.0;
			this.y += this.velocityY * ms/1000.0;
          
          // and then later come downwards when our
		  // gravity is added to it. We should add parameters 
          // for the values that fake the gravity
          if(this.useGravity) {
              this.velocityY += Math.random()*4 +4;
          }
		};
		
		this.draw = function(context2D)
		{
			// translating the 2D context to the particle coordinates
			context2D.save();
			context2D.translate(this.x, this.y);
			context2D.scale(this.scale, this.scale);
			
			// drawing a filled circle in the particle's local space
			context2D.beginPath();
			context2D.arc(0, 0, this.radius, 0, Math.PI*2, true);
			//context2D.closePath();
			
			context2D.fillStyle = this.color;
			context2D.fill();
			
			context2D.restore();
		};
	}

function createExplosion(x, y, color)
{
		var minSize = 10;
		var maxSize = 30;
		var count = 10;
		var minSpeed = 60.0;
		var maxSpeed = 200.0;
		var minScaleSpeed = 1.0;
		var maxScaleSpeed = 4.0;
		
		for (var angle=0; angle<360; angle += Math.round(360/count))
		{
			var particle = new Particle();
			
			particle.x = x;
			particle.y = y;
			
            // size of particle
			particle.radius = random(1, 3);
			
			particle.color = color;
			
            // life time, the higher the value the faster particle 
            // will die
			particle.scaleSpeed = random(0.3, 0.5);
          
            // use gravity
          particle.useGravity = true;
			
			var speed = random(minSpeed, maxSpeed);
			
			particle.velocityX = speed * Math.cos(angle * Math.PI / 180.0);
			particle.velocityY = speed * Math.sin(angle * Math.PI / 180.0);
			
			explosion.push(particle);
		}
    
	}

function updateAndDrawExplosion(delta) {
   for (var i = 0; i < explosion.length; i++) {
	  var particle = explosion[i];
			
	  particle.update(delta);
	  particle.draw(context);
   }
}

function startDoubleExplosion(a, b) {
	createExplosion(a, b, "#525252");
	createExplosion(a, b, "#FFA318");
}

function removeFromArray(array, object) {
    var idx = array.indexOf(object);
    if (idx !== -1) {
        array.splice(idx, 1);
    }
    return array;
}

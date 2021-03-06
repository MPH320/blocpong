var width = 250;
var height = 125;
var offsetW = 50;
var offsetH = 20;
var canvas = document.getElementById('Canvas');
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
var mouseYoffset = -75;
//var defaultSpeed = 0.1;
var defaultSpeed = 0.07;
var ballSpeed = defaultSpeed;
var ballDir = 0;
var oldTimestamp = 0;
window.mouseY = 300;
var ballHistory = [];
var shakeTime = 120;
var shakeTimer = shakeTime;
var shake = false;
var explosion = [];
var aiSpeed = 1;
var aiPaddleCenter = 10;
var playerPoints = 0;
var aiPoints = 0;
var aiIsMoving = true;
//var speedIncrement = 0.01;
var speedIncrement = 0.005;
var scoreBool = false;
var playBool = false;
var ghost = [];
var passedPaddle = false;
var win = false;
var winScore = 6;
var winExplosions = 6;
var ceiling = 24;
var floor = 121;
var enemyYPos = 228;
var playerYPos = 71;

  // sounds:
  var explosionSound = new buzz.sound("assets/sounds/explosion/explosion1.wav");
	var bounceSound = new buzz.sound("assets/sounds/bounce/bounce1.wav");
	var hitSound = new buzz.sound("assets/sounds/hit/hit1.wav");

var playHit = function() {
	var soundNum = Math.floor(random(1, 6))
	hitSound = new buzz.sound("assets/sounds/hit/hit" + soundNum + ".wav");
  hitSound.play();
	scoreBool=!scoreBool;
};

var playExplosion = function() {
	playBool = false;
	var soundNum = Math.floor(random(1, 6))
	explosionSound = new buzz.sound("assets/sounds/explosion/explosion" + soundNum + ".wav");
  explosionSound.play();
	scoreBool=!scoreBool;
};

var playBounce = function() {
	var soundNum = Math.floor(random(1, 6))
	bounceSound = new buzz.sound("assets/sounds/bounce/bounce" + soundNum + ".wav");
  bounceSound.play();
	ballSpeed+=speedIncrement;
	scoreBool=!scoreBool;
};

var coinFlip = function() {
    return Math.floor(Math.random() * 2);
};



var renderGhost = function(player) {
	var offset = 0;
	if(!ghost[3]){
		offset = offsetH;
	}
	context.fillStyle = ghost[2];
	context.fillRect(offsetW+ghost[0], ghost[1]+offset, paddleWidth, paddleHeight);
};

var ballServe = function() {
	ballX = canvas.width / 2;
	ballY = canvas.height / 2;
	ballSpeed = defaultSpeed;
	
	if (coinFlip() == 0) {
		ballDir = random(-Math.PI/4, Math.PI/4);
	} else {
		ballDir = random(Math.PI * 3/4, Math.PI * 5/4);
	}
	
};

var random = function(min, max) {
	return Math.random() * (max - min) + min;
};

	if (coinFlip() == 0) {
		ballDir = random(-Math.PI/4, Math.PI/4);
	} else {
		ballDir = random(Math.PI * 3/4, Math.PI * 5/4);
	}

var renderWin = function(min, max) {
	context.font = "18px Verdana";
	context.textAlign = "center";
	
	//stroke
	context.fillStyle = "black";
	context.fillText( "Thanks for playing!", canvas.width/2-1, canvas.height/2-10 );
	context.fillText( "Thanks for playing!", canvas.width/2,   canvas.height/2-11 );
	context.fillText( "Thanks for playing!", canvas.width/2+1, canvas.height/2-10 );
	context.fillText( "Thanks for playing!", canvas.width/2,   canvas.height/2-9 );
	
	context.fillText( "Reload to play again.", canvas.width/2-1, canvas.height/2+10 );
	context.fillText( "Reload to play again.", canvas.width/2,   canvas.height/2+9 );
	context.fillText( "Reload to play again.", canvas.width/2+1, canvas.height/2+10 );
	context.fillText( "Reload to play again.", canvas.width/2,   canvas.height/2+11 );

	//draw normal text
	context.fillStyle = 'white';
	context.fillText("Thanks for playing!",canvas.width/2, canvas.height/2-10);
	context.fillText("Reload to play again.",canvas.width/2,canvas.height/2+10); 
};

var randomShake = function() {
	var shakeAmountX = Math.random() * (8 - 1) + 1;
	var shakeAmountY = Math.random() * (8 - 1) + 1; 
//	Math.random() * (6 + 6) - 6;
	
	context.beginPath();
	context.moveTo(offsetW+shakeAmountX, offsetH+shakeAmountY);
	context.lineTo(width-shakeAmountX, offsetH+shakeAmountY);
	context.lineTo(width-shakeAmountX, height-shakeAmountY);
	context.lineTo(offsetW+shakeAmountX, height-shakeAmountY);
	context.lineTo(offsetW+shakeAmountX, offsetH+shakeAmountY);
	context.strokeStyle = '#ffffff';
	context.stroke();
	
	context.fillStyle = 'rgba(0, 0, 0, .05)';
  context.fillRect(0, 0, canvas.width, canvas.height);
};

var renderCanvas = function() {
	
	if (shake){
		while(shakeTimer>0){
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

var moveAI = function() {
	if(ballY < aiY+offsetH+aiPaddleCenter){
		 if(aiY < 3){
			aiY = 3;
		}else {
			aiY = aiY - aiSpeed;
		}
	}
	
	else if(ballY > aiY+offsetH+aiPaddleCenter){
		 if(aiY > 82){ 
			aiY = 82;
		}else {
			aiY = aiY + aiSpeed;
		}
	}
	
}

var ballMovement = function(time) {
	
var nextBallX = ballX + ballSpeed * time * Math.cos(ballDir);
var nextBallY = ballY + ballSpeed * time * Math.sin(ballDir);

	if (nextBallY < ceiling || nextBallY > floor) { //out of bounds above/below
  		ballDir = 2 * Math.PI - ballDir;
			playHit();
  } 
	
	if (nextBallX > enemyYPos && nextBallY >= aiY+offsetH && nextBallY <= offsetH+aiY+paddleHeight) { 
			ballDir = Math.PI - ballDir;
			playBounce();
			aiIsMoving = false;
  } 
	
	if (nextBallX < playerYPos && nextBallY >= playerY && nextBallY <= playerY+paddleHeight) { 

			ballDir = Math.PI - ballDir;
			playBounce();
			aiIsMoving = true;
  }
	
	if (ballX > 230 && ballX  < 235){
			ghost[0] = aiX;
			ghost[1] = aiY;
	}
	if (ballX< 70 && ballX  > 65){
			ghost[0] = playerX;
			ghost[1] = playerY;
	}
	
	//scored a point
	if (ballX < 55){
		aiPoints+=1;
		if(aiPoints == winScore){
			win = true;
			while(winExplosions > 0){
				startDoubleExplosion(ballX, ballY);
				winExplosions--;
			}
		}
		if(!win){
			startDoubleExplosion(ballX, ballY);
			playExplosion();
			shake = true;
			ballServe();
			aiIsMoving = true;
			ghost[2] = 'darkblue';
			ghost[3] = true;
		}
		
	} else if (ballX > 245){
		playerPoints+=1;
		if(playerPoints == winScore){
			win = true;
			while(winExplosions > 0){
				startDoubleExplosion(ballX, ballY);
				winExplosions--;
			}
		}
		if(!win){
			startDoubleExplosion(ballX, ballY);
			playExplosion();
			shake = true;
			ballServe();
			aiIsMoving = true;

			ghost[2] = 'darkred';
			ghost[3] = false;
		}
	}
	
	

	ballHistory.push([ballX, ballY]);
	if (ballHistory.length > 25){
		ballHistory.splice(0,1);
	}
	
		ballX += ballSpeed * time * Math.cos(ballDir);
  	ballY += ballSpeed * time * Math.sin(ballDir);
	
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
		context.strokeStyle = '#'+Math.floor(Math.random()*16777215).toString(16);
		context.stroke();
	}
	
}

var renderScore = function(){
		if(scoreBool){
			context.fillStyle = 'darkblue';
		} else {
			context.fillStyle = 'darkred';
		}
		context.font = "18px Arial";
		if(playerPoints<10){
			context.fillText(playerPoints+":"+aiPoints,140,146);
		} else {
			context.fillText(playerPoints+":"+aiPoints,120,146);
		}
			
}

var render = function(time) {
	if(!win){
		renderCanvas();
		renderPlayer();
		if(aiIsMoving){
			moveAI();
		}
		renderAI();
		if(playBool){
			ballMovement(time);
		} else {
			renderGhost(ghost[3]);
		}
		renderBall();
		renderScore()
	} else {
		renderWin();
	}
	
}

var animate = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
    function(step) {
      window.setTimeout(step, 1000/60);
};

document.onmousemove = function(e) {
    var event = e || window.event;
    window.mouseX = event.clientX;
    window.mouseY = event.clientY;
		
		if (window.mouseY>357){
			window.mouseY=357;
		}
		if (window.mouseY<193){
			window.mouseY=193;
		}
	
	playerY = window.mouseY/2+mouseYoffset;
};

var step = function(timestamp) {
	if(!win)
	{
		context.fillStyle = 'rgba(0, 0, 0, .05)';
//  context.fillRect(0, 0, canvas.width, canvas.height);
		context.fillRect(offsetW, offsetH, width-offsetW, height-offsetH);
	}
	render(timestamp - oldTimestamp);
	updateAndDrawExplosion(timestamp - oldTimestamp);
	animate(step);
	oldTimestamp = timestamp;
};
	
window.onload = function() {
	step(0);
	
	if (playBool){
		ballServe();
	}
	
	canvas.addEventListener("mousedown" , function(evt) {
  	playBool = true;
  }, false);
	
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
	createExplosion(a, b, '#'+Math.floor(Math.random()*16777215).toString(16));
	createExplosion(a, b, '#'+Math.floor(Math.random()*16777215).toString(16));
	createExplosion(a, b, '#'+Math.floor(Math.random()*16777215).toString(16));
	createExplosion(a, b, '#'+Math.floor(Math.random()*16777215).toString(16));
}

function removeFromArray(array, object) {
    var idx = array.indexOf(object);
    if (idx !== -1) {
        array.splice(idx, 1);
    }
    return array;
}

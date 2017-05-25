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

var renderCanvas = function() {
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
		ballServe();
	}else if (ballX > 245){
		ballServe();
	}
	
	ballX += ballSpeed * time * Math.cos(ballDir);
  ballY += ballSpeed * time * Math.sin(ballDir);

	ballHistory.push([ballX, ballY]);
	if (ballHistory.length > 25){
		ballHistory.splice(0,1);
	}
	
	console.log(ballHistory);
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
    context.clearRect(0, 0, canvas.width, canvas.height);
    render(timestamp - oldTimestamp);
    animate(step);
		oldTimestamp = timestamp;
};
	
window.onload = function() {
	step(0);
	ballServe();
}
	


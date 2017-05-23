var width = 250;
var height = 125;
var offsetW = 50;
var offsetH = 20;
var canvas = document.getElementById('myCanvas');
var context = canvas.getContext('2d');
var paddleWidth = 5;
var paddleHeight = 15;
var playerX = 15;
var playerY = 20;
var aiX = 180;
var aiY = 80;

context.beginPath();
context.moveTo(offsetW, offsetH);
context.lineTo(width, offsetH);
context.lineTo(width, height);
context.lineTo(offsetW, height);
context.lineTo(offsetW, offsetH);
context.strokeStyle = '#ffffff';
context.stroke();

var renderPlayer = function() {
	context.fillStyle = 'darkblue';
	context.fillRect(offsetW+playerX, offsetH+playerY, paddleWidth, paddleHeight);
}

var renderAI = function() {
	context.fillStyle = 'darkred';
	context.fillRect(offsetW+aiX, offsetH+aiY, paddleWidth, paddleHeight);
}

renderPlayer();
renderAI();



	


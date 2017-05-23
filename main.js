var width = 250;
var height = 125;
var offsetW = 50;
var offsetH = 20;
var canvas = document.getElementById('myCanvas');
var context = canvas.getContext('2d');

context.beginPath();
context.moveTo(offsetW, offsetH);
context.lineTo(width, offsetH);
context.lineTo(width, height);
context.lineTo(offsetW, height);
context.lineTo(offsetW, offsetH);
context.strokeStyle = '#ffffff';
context.stroke();
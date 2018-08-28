var circles;
var cameraX;
var cameraY;
var keys;

function startGame() {
	circles = [];
	cameraX = 0.0;
	cameraY = 0.0;
	keys = {};
	myGameArea.start();
}

function keyActions(){
	if (keys[38]){
		cameraY -= 5;
	}
	if (keys[40]){
		cameraY += 5;
	}
	if (keys[37]){
		cameraX -= 5;
	}
	if (keys[39]){
		cameraX += 5;
	}
}

function addCircle(){
	circles.push(new Circle(Math.random() * 45 + 5, Math.random() * myGameArea.canvas.width + cameraX, Math.random() * myGameArea.canvas.height + cameraY, [Math.floor(Math.random() * 200), Math.floor(Math.random() * 200), Math.floor(Math.random() * 200)]));
	for (var i = 0; i < circles.length - 1; i++){
		circles[circles.length - 1].attracted.push(circles[i]);
		circles[i].attracted.push(circles[circles.length - 1]);
	}
}

var myGameArea = {
    canvas : document.createElement("canvas"),
    start : function() {
        this.canvas.width = window.innerWidth - 10;
        this.canvas.height = window.innerHeight - 25;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.interval = setInterval(updateGameArea, 20);
        window.addEventListener('keydown', function (e) {
            keys[e.keyCode] = true;
            if (keys[65]){
				addCircle();
			}
        })
        window.addEventListener('keyup', function (e) {
            keys[e.keyCode] = false;
        })
    },
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

function Circle(radius, x, y, color) {
    this.radius = radius
    this.x = x;
    this.y = y;
    this.color = color;
    this.actions = [];
    this.accelerationX = 0.0;
    this.accelerationY = 0.0;
    this.velocityX = 0.0;
    this.velocityY = 0.0;
    this.attracted = [];

    this.calculatePull = function(){
    	this.accelerationX = 0.0;
    	this.accelerationY = 0.0;

    	for(var i = 0; i < this.attracted.length; i++){
    		var tempAccel = this.attracted[i].radius / ((this.attracted[i].x - this.x) * (this.attracted[i].x - this.x) + (this.attracted[i].y - this.y) * (this.attracted[i].y - this.y));

    		if (((this.attracted[i].x - this.x) == 0 && (this.attracted[i].y - this.y) > 0) || ((this.attracted[i].y - this.y) == 0 && (this.attracted[i].x - this.x) > 0)){
    			this.accelerationY += tempAccel;
    			continue;
    		}
    		if (((this.attracted[i].x - this.x) == 0 && (this.attracted[i].y - this.y) < 0) || ((this.attracted[i].y - this.y) == 0 && (this.attracted[i].x - this.x) < 0)){
    			this.accelerationY -= tempAccel;
    			continue;
    		}

    		var theta = Math.atan((this.attracted[i].y - this.y) / (this.attracted[i].x - this.x));

    		if (((this.attracted[i].x - this.x) > 0 && (this.attracted[i].y - this.y) < 0) || ((this.attracted[i].x - this.x) > 0 && (this.attracted[i].y - this.y) > 0)){
    			this.accelerationX += Math.cos(theta) * tempAccel;
    			this.accelerationY += Math.sin(theta) * tempAccel;
    		}
    		if (((this.attracted[i].x - this.x) < 0 && (this.attracted[i].y - this.y) < 0) || ((this.attracted[i].x - this.x) < 0 && (this.attracted[i].y - this.y) > 0)){
    			this.accelerationX -= Math.cos(theta) * tempAccel;
    			this.accelerationY -= Math.sin(theta) * tempAccel;
    		}
    	}
    }

    this.fixCollisions = function(){
    	for (var i = 0; i < circles.length; i++){
    		if (circles[i] == this){
    			continue;
    		}

    		if (((circles[i].x - this.x) * (circles[i].x - this.x) + (circles[i].y - this.y) * (circles[i].y - this.y)) <= ((this.radius + circles[i].radius) * (this.radius + circles[i].radius))){
    			var overlap = (this.radius + circles[i].radius) - Math.sqrt(((circles[i].x - this.x) * (circles[i].x - this.x) + (circles[i].y - this.y) * (circles[i].y - this.y)));

    			var tempXVelocity1 = (this.velocityX * (this.radius - circles[i].radius) + (2 * circles[i].radius * circles[i].velocityX)) / (this.radius + circles[i].radius);
    			var tempYVelocity1 = (this.velocityY * (this.radius - circles[i].radius) + (2 * circles[i].radius * circles[i].velocityY)) / (this.radius + circles[i].radius);
    			var tempXVelocity2 = (circles[i].velocityX * (circles[i].radius - this.radius) + (2 * this.radius * this.velocityX)) / (this.radius + circles[i].radius);
    			var tempYVelocity2 = (circles[i].velocityY * (circles[i].radius - this.radius) + (2 * this.radius * this.velocityY)) / (this.radius + circles[i].radius);

    			this.velocityX = tempXVelocity1;
    			this.velocityY = tempYVelocity1;

    			circles[i].velocityX = tempXVelocity2;
    			circles[i].velocityY = tempYVelocity2;

    			if (((circles[i].x - this.x) == 0 && (circles[i].y - this.y) > 0) || ((circles[i].y - this.y) == 0 && (circles[i].x - this.x) > 0)){
    				this.y -= overlap;
    				continue;
    			}
    			if (((circles[i].x - this.x) == 0 && (circles[i].y - this.y) < 0) || ((circles[i].y - this.y) == 0 && (circles[i].x - this.x) < 0)){
    				this.y += overlap;
    				continue;
    			}

    			var theta = Math.atan((circles[i].y - this.y) / (circles[i].x - this.x));


    			if (((circles[i].x - this.x) > 0 && (circles[i].y - this.y) < 0) || ((circles[i].x - this.x) > 0 && (circles[i].y - this.y) > 0)){
    				this.x -= Math.cos(theta) * overlap;
    				this.y -= Math.sin(theta) * overlap;
    			}
    			if (((circles[i].x - this.x) < 0 && (circles[i].y - this.y) < 0) || ((circles[i].x - this.x) < 0 && (circles[i].y - this.y) > 0)){
    				this.x += Math.cos(theta) * overlap;
    				this.y += Math.sin(theta) * overlap;	
    			}
    		}
    	}
    }

    this.update = function(){
    	var toRemove = [];
    	for(var i = 0; i < this.actions.length; i++){
    		if (this.actions[i].completed == false){
    			this.actions[i].update();
    		}
    		else{
    			toRemove.push(i);
    		}
    	}
    	for(var i = 0; i < toRemove.length; i++){
    		this.actions.splice(toRemove[i] - i, 1)
    	}

    	this.calculatePull();
    	this.fixCollisions();

    	this.velocityX += this.accelerationX;
    	this.velocityY += this.accelerationY;
    	this.x += this.velocityX;
    	this.y += this.velocityY;

        ctx = myGameArea.context;

        ctx.fillStyle = "rgb(" + this.color.join(",") + ")";
	    ctx.beginPath();
    	ctx.arc(this.x - cameraX, this.y - cameraY, this.radius, 0, 2 * Math.PI);
    	ctx.closePath();
    	ctx.fill();
    }

    this.actions.push(new PopIn(this, 0.0, this.radius, 10));
}

function PopIn(node, fromRadius, toRadius, time){
	this.node = node;
	this.fromRadius = fromRadius;
	this.toRadius = toRadius;
	this.time = time;
	this.frame = 0;
	this.completed = false;

	this.update = function(){
		if (this.frame <= this.time){
			this.node.radius = ((this.toRadius - this.fromRadius) / (this.time * this.time)) * this.frame * this.frame + this.fromRadius;
			this.frame += 1;
		}
		else{
			this.completed = true;
		}
	}
}

function ColorTransition(node, fromColor, toColor, time){
	this.node = node;
	this.fromColor = fromColor;
	this.toColor = toColor;
	this.time = time;
	this.frame = 0;
	this.completed = false;

	this.update = function(){
		if (this.frame <= this.time){
			this.node.color[0] = ((this.toColor[0] - this.fromColor[0]) / this.time) * this.frame + this.fromColor[0];
			this.node.color[1] = ((this.toColor[1] - this.fromColor[1]) / this.time) * this.frame + this.fromColor[1];
			this.node.color[2] = ((this.toColor[2] - this.fromColor[2]) / this.time) * this.frame + this.fromColor[2];
			this.frame += 1;
		}
		else{
			this.completed = true;
		}
	}
}

function updateGameArea() {
    myGameArea.clear();
    keyActions();
    for(var i = 0; i < circles.length; i++){
    	circles[i].update();
    }
}


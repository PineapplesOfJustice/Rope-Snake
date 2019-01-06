// Variables

var gameStatus = "active"; // loading, blankScreen, initiation, active, inactive, gameOver, restartSequence
var gameOverScreen = false;
//var loadingStatus = {current: 0, need: 0, };
var tutorialActive = false;
var canvas = false;

var rope = [];
var food = [];
var decoration = [];
var store = [];

var habitat = false;
var marketPlace = false;

var gravity = 0.98;
var treasury = 4000;

var ropeCapacity = 100;
var foodCapacity = 1000;
var acrylicSpawnRate = 5000;

var dragObject = null;
var tutorialSlide = 1;

var segmentLength = 5;
var dragDiameter = 25;
var findFoodRate = 100;

var hungerRate = 0.1;
var hungerPenalty = 0.3;

var foodLevel = 1;
var foodPerClick = 1;
var foodDimension = 12;

var imageSrc = new Object;
var fontSrc = new Object;

var romanCheatSheet = {
    M: 1000,
    CM: 900,
    D: 500, 
    CD: 400,
    C: 100, 
    XC: 90,
    L: 50,
    XL: 40,
    X: 10,
    IX :9,
    V: 5,
    IV: 4,
    I: 1,
};


// Decoration Constructor

function Grass(x, y, w, l){
    this.x = x;
    this.y = y;
    this.w = w;
    this.l = l;
    this.color = {
        h: 100,
        s: 250,
        b: 180,        
    };
    this.line = [
        {
            x1: x, 
            y1: y+l/2,
            x2: x, 
            y2: y-l/2,
        },
        {
            x1: x, 
            y1: y+l/2, 
            x2: x-w/2, 
            y2: y-l/4,
        },
        {
            x1: x, 
            y1: y+l/2, 
            x2: x+w/2, 
            y2: y-l/4,
        },
    ];
}
Grass.prototype.show = function(){
    stroke(this.color.h, this.color.s, this.color.b);
    strokeWeight(2);  
    for(var currentLine of this.line){
        line(currentLine.x1, currentLine.y1, currentLine.x2, currentLine.y2);
    }
}

function Rock(x, y, w, l){
    this.x = x;
    this.y = y;
    this.w = w;
    this.l = l;
    this.fillColor = {
        h: 30,
        s: 100,
        b: 100,
    };
    this.strokeColor = {
        h: 30,
        s: 100,
        b: 180,
    };
    this.line = [
        {
            x1: x-w/2, 
            y1: y+l/2,
            x2: x-w/2, 
            y2: y-l/2,
        },
        {
            x1: x-w/2, 
            y1: y-l/2, 
            x2: x+w/2, 
            y2: y-l/2,
        },
        {
            x1: x+w/2, 
            y1: y-l/2,
            x2: x+w/2, 
            y2: y+l/2,
        },
    ];
}
Rock.prototype.show = function(){
    fill(this.fillColor.h, this.fillColor.s, this.fillColor.b);
    noStroke();
    rect(this.x-this.w/2, this.y-this.l/2, this.w, this.l);
    stroke(this.strokeColor.h, this.strokeColor.s, this.strokeColor.b);
    strokeWeight(2);  
    for(var currentLine of this.line){
        line(currentLine.x1, currentLine.y1, currentLine.x2, currentLine.y2);
    }
}

function Bubble(x, y, d, index){
    this.x = x;
    this.y = y;
    this.d = d;
    this.strokeColor = {
        h: 225,
        s: 180,
        b: 180,
    };
    this.index = index;
}
Bubble.prototype.update = function(){
    this.y -= gravity;
    if(this.y < -this.d){
        for(var i=this.index+1, length=decoration.length; i<length; i++){
            if(decoration[i].index != null){
                decoration[i].index -= 1;
            }
        }
        decoration.splice(this.index, 1);
        return true;
    }
    else{
        return false;
    }
}
Bubble.prototype.show = function(){
    noFill();
    stroke(this.strokeColor.h, this.strokeColor.s, this.strokeColor.b);
    strokeWeight(2);  
    ellipse(this.x, this.y, this.d);
}


// Food Constructor

function FoodLevel1(x, y, w, l, fillColorH, fillColorS, fillColorB, strokeColor){
    this.x = x-w/2;
    this.y = y-l/2;
    this.w = w;
    this.l = l;
    this.color = {
        fill: {
            h: fillColorH,
            s: fillColorS,
            b: fillColorB,
        },
        stroke: strokeColor,
    };
    this.addLength = 1;
    this.index = food.length;  
}
FoodLevel1.prototype.show = function(showColor){
    noFill();
    if(showColor){
        fill(this.color.fill.h, this.color.fill.s, this.color.fill.b);
    }
    stroke(this.color.stroke);
    strokeWeight(2);  
    triangle(this.x, this.y+this.l, this.x+this.w/2, this.y, this.x+this.w, this.y+this.l);
}
FoodLevel1.prototype.update = function(){
    if(habitat.haveGravity){
        this.y += gravity;
        if(this.y+this.l > height){
            this.y = height - this.l;
        }
    }
}

function FoodLevel2(x, y, w, l, fillColorH, fillColorS, fillColorB, strokeColor){
    this.x = x-w/2;
    this.y = y-l/2;
    this.w = w;
    this.l = l;
    this.color = {
        fill: {
            h: fillColorH,
            s: fillColorS,
            b: fillColorB,
        },
        stroke: strokeColor,
    };
    this.addLength = 2;
    this.index = food.length;  
}
FoodLevel2.prototype.show = function(showColor){
    noFill();
    if(showColor){
        fill(this.color.fill.h, this.color.fill.s, this.color.fill.b);
    }
    stroke(this.color.stroke);
    strokeWeight(2);  
    ellipse(this.x+this.w/2, this.y+this.l/2, this.w, this.l);
}
FoodLevel2.prototype.update = function(){
    if(habitat.haveGravity){
        this.y += gravity;
        if(this.y+this.l > height){
            this.y = height - this.l;
        }
    }
}

function FoodLevel3(x, y, w, l, fillColorH, fillColorS, fillColorB, strokeColor){
    this.x = x-w/2;
    this.y = y-l/2;
    this.w = w;
    this.l = l;
    this.color = {
        fill: {
            h: fillColorH,
            s: fillColorS,
            b: fillColorB,
        },
        stroke: strokeColor,
    };
    this.addLength = 5;
    this.index = food.length;  
}
FoodLevel3.prototype.show = function(showColor){
    noFill();
    if(showColor){
        fill(this.color.fill.h, this.color.fill.s, this.color.fill.b);
    }
    stroke(this.color.stroke);
    strokeWeight(2);  
    rect(this.x, this.y, this.w, this.l);
}
FoodLevel3.prototype.update = function(){
    if(habitat.haveGravity){
        this.y += gravity;
        if(this.y+this.l > height){
            this.y = height - this.l;
        }
    }
}


// Habitat Constructor

function GrassField(){
    this.type = "grassField";
    this.color = {
        h: 100,
        s: 250,
        b: 70,
    };
    this.haveGravity = false;
    this.amountOfDecorationSpawn = 50;
}
GrassField.prototype.addDecoration = function(amount){
    for(var a=0; a<amount; a++){
        decoration.push(new Grass(Math.random()*(width-10)+5, Math.random()*(height-15)+7.5, 10, 15));
    }
}

function Aquarium(){
    this.type = "aquarium";
    this.color = {
        h: 220,
        s: 250,
        b: 70,
    };
    this.bubbleSpawnRate = 125;
    this.haveGravity = true;
    this.amountOfDecorationSpawn = 1;
}
Aquarium.prototype.addDecoration = function(amount){
    for(var a=0; a<amount; a++){
        decoration.push(new Bubble(Math.random()*(width-10)+5, height+10, 13, decoration.length));
    }
}
Aquarium.prototype.specialFeature = function(){
    if(frameCount % this.bubbleSpawnRate == 0){
        this.addDecoration(1);
    }
}

function TrueSpace(){
    this.type = "trueSpace";
    this.color = {
        h: 0,
        s: 0,
        b: 0,
    };
    this.haveGravity = false;
    this.amountOfDecorationSpawn = 0;
}
TrueSpace.prototype.addDecoration = function(amount){
    // Nothing
}


// Market Place Constructor

function LandMarket(){
    this.ground = {
        x: width,
        y: height+10,
        dx: 600,
        dy: 240,
    }
    this.groundColor = {
        h: 135, 
        s: 20, 
        b: 180,
    }
    this.hoverColor = {
        h: 135, 
        s: 20, 
        b: 140,
    }
    this.postLeg = {
        x: width-5,
        y: height - 220,
        w: 5,
        l: 220,
    }
    this.postSign = {
        x: width-152,
        y: height - 210,
        w: 150,
        l: 55,
    }
    this.legColor = "black";
    this.signColor = "red";
    this.signText = "Marketplace";
    this.exitTheta = 0;
}
LandMarket.prototype.showGround = function(){
    fill(this.groundColor.h, this.groundColor.s, this.groundColor.b);
    if(dragObject != null && collidePointEllipse(dragObject.destination.x, dragObject.destination.y, this.ground.x, this.ground.y, this.ground.dx, this.ground.dy)){
        fill(this.hoverColor.h, this.hoverColor.s, this.hoverColor.b);
    }
    noStroke();
    ellipse(this.ground.x, this.ground.y, this.ground.dx, this.ground.dy);
}
LandMarket.prototype.showSign = function(){
    fill(this.signColor);
    stroke("black");
    strokeWeight(2);
    rect(this.postSign.x, this.postSign.y, this.postSign.w, this.postSign.l);
    fill(this.legColor);
    rect(this.postLeg.x, this.postLeg.y, this.postLeg.w, this.postLeg.l);
    rect(this.postLeg.x+this.postLeg.w/2-10, this.postLeg.y-10, 15, 15);
    textFont(fontSrc["chakraPetch"]);
    textAlign(CENTER, CENTER);
    textSize(20);
    fill("white");
    text(this.signText, this.postSign.x+this.postSign.w/2, this.postSign.y+this.postSign.l/2-3);
}

function SeaMarket(){
    this.ground = {
        x: width,
        y: height+10,
        dx: 800,
        dy: 230,
    }
    this.groundColor = {
        h: 45, 
        s: 270, 
        b: 200,
    }
    this.hoverColor = {
        h: 45, 
        s: 270, 
        b: 160,
    }
    this.postLeg = {
        x: width-5,
        y: height - 220,
        w: 5,
        l: 220,
    }
    this.postSign = {
        x: width-152,
        y: height - 210,
        w: 150,
        l: 55,
    }
    this.legColor = "black";
    this.signColor = "red";
    this.signText = "Marketplace";
    this.exitTheta = 0;
}
SeaMarket.prototype.showGround = function(){
    fill(this.groundColor.h, this.groundColor.s, this.groundColor.b);
    if(dragObject != null && collidePointEllipse(dragObject.destination.x, dragObject.destination.y, this.ground.x, this.ground.y, this.ground.dx, this.ground.dy)){
        fill(this.hoverColor.h, this.hoverColor.s, this.hoverColor.b);
    }
    noStroke();
    ellipse(this.ground.x, this.ground.y, this.ground.dx, this.ground.dy);
}
SeaMarket.prototype.showSign = function(){
    fill(this.signColor);
    stroke("black");
    strokeWeight(2);
    rect(this.postSign.x, this.postSign.y, this.postSign.w, this.postSign.l);
    fill(this.legColor);
    rect(this.postLeg.x, this.postLeg.y, this.postLeg.w, this.postLeg.l);
    rect(this.postLeg.x+this.postLeg.w/2-10, this.postLeg.y-10, 15, 15);
    textFont(fontSrc["chakraPetch"]);
    textAlign(CENTER, CENTER);
    textSize(20);
    fill("white");
    text(this.signText, this.postSign.x+this.postSign.w/2, this.postSign.y+this.postSign.l/2-3);
}

function SpaceMarket(){
    this.ground = {
        x: width-100,
        y: height+90,
        dx: 700,
        dy: 400,
    }
    this.groundColor = {
        h: 180, 
        s: 10, 
        b: 300,
    }
    this.hoverColor = {
        h: 180, 
        s: 10, 
        b: 240,
    }
    this.postLeg = {
        x: width-5,
        y: height - 220,
        w: 5,
        l: 220,
    }
    this.postSign = {
        x: width-152,
        y: height - 210,
        w: 150,
        l: 55,
    }
    this.legColor = "black";
    this.signColor = "red";
    this.signText = "Marketplace";
    this.exitTheta = 0;
}
SpaceMarket.prototype.showGround = function(){
    fill(this.groundColor.h, this.groundColor.s, this.groundColor.b);
    if(dragObject != null && collidePointEllipse(dragObject.destination.x, dragObject.destination.y, this.ground.x, this.ground.y, this.ground.dx, this.ground.dy)){
        fill(this.hoverColor.h, this.hoverColor.s, this.hoverColor.b);
    }
    noStroke();
    ellipse(this.ground.x, this.ground.y, this.ground.dx, this.ground.dy);
}
SpaceMarket.prototype.showSign = function(){
    fill(this.signColor);
    stroke("black");
    strokeWeight(2);
    rect(this.postSign.x, this.postSign.y, this.postSign.w, this.postSign.l);
    fill(this.legColor);
    rect(this.postLeg.x, this.postLeg.y, this.postLeg.w, this.postLeg.l);
    rect(this.postLeg.x+this.postLeg.w/2-10, this.postLeg.y-10, 15, 15);
    textFont(fontSrc["chakraPetch"]);
    textAlign(CENTER, CENTER);
    textSize(20);
    fill("white");
    text(this.signText, this.postSign.x+this.postSign.w/2, this.postSign.y+this.postSign.l/2-3);
}


// Snake Constructor

function CottonSnake(x, y, length, theta, index){
    this.type = "cottonSnake";
    this.retailPrice = 50;
    this.maxLength = 300;
    this.speed = 4;
    this.rotationSpeed = 0.5;
    this.snakeColor = {
        h: 50,  
        s: 150,  
        b: 180,  
    }     
    this.ropeColor = {
        h: 50,  
        s: 180,  
        b: 230,  
    }  
    this.strokeWeight = 12;
    
    this.hunger = {
        current: 0,
        max: 100,
        need: 1,
        hungry: false,
        brightnessPenalty: 50,
    }
    
    this.index = index;
    this.length = length;  
    this.isSnake = true;
    this.isDragged = false;
    this.isSold = false;
    
    this.segment = [];
    this.segment.push(new Segment(this, x, y, theta, 0));  
    this.addSegment(Math.floor(this.length/segmentLength)-1);
    
    if(this.hunger.current >= this.hunger.need){
        this.hunger.hungry = true;
        this.findFood();
    }
    this.loiterCoordinate = {
        x: x+length*cos(theta)*1.1,
        y: y+length*sin(theta)*1.1, 
    }
    this.closestFood = false;
}
CottonSnake.prototype.addSegment = function(amount){
  for(var i=0; i<amount; i++){  
    var previousSegment = this.segment[this.segment.length-1];
    this.segment.push(new Segment(this, previousSegment.destination.x, previousSegment.destination.y, previousSegment.theta-PI, previousSegment.index+1));
  }
}
CottonSnake.prototype.drag = function(){ 
    var dragSegment = this.segment;
    var dragIndex = dragObject.index;  
    dragObject.follow(mouseX, mouseY, "child");
    //dragObject.show();
    // dragObject's Parent  
    for(var r=dragIndex-1; r>-1; r--){
        dragSegment[r].follow(dragSegment[r+1].origin.x, dragSegment[r+1].origin.y, "child");
        //dragSegment[r].show();
    } 
    // dragObject's Child  
    for(var r=dragIndex+1, dragLength=dragSegment.length; r<dragLength; r++){
        dragSegment[r].follow(dragSegment[r-1].destination.x, dragSegment[r-1].destination.y, "parent");
        //dragSegment[r].show();
    }

    if(dragObject.origin.x < 0 || dragObject.origin.x > width || dragObject.origin.y < 0 || dragObject.origin.y > height){   
        if(collidePointEllipse(dragObject.destination.x, dragObject.destination.y, marketPlace.ground.x, marketPlace.ground.y, marketPlace.ground.dx, marketPlace.ground.dy)){
            this.sell();
            dragObject = null;
        }
        else{
            this.isDragged = false;
            this.isSnake = true;
            dragObject = null;
        }
    }
}
CottonSnake.prototype.hungerUpdate = function(){
    this.hunger.current += hungerRate;
    if(this.hunger.hungry && this.hunger.current >= this.hunger.max){
        this.length -= hungerPenalty;
        if(Math.ceil(this.length/segmentLength)-this.segment.length < 0){
            this.segment.shift();
            for(var current of this.segment){
                current.index -= 1;
            }
            if(this.segment.length == 0){
                for(var i=this.index+1, length=rope.length; i<length; i++){
                    rope[i].index -= 1;
                }
                rope.splice(this.index, 1);
                for(var i=0, length=rope.length; i<length; i++){
                    if(rope[i].closestFood){
                        rope[i].findFood();
                    }
                }
                return true;
            }
        }
    }
    else if(!this.hunger.hungry && this.hunger.current >= this.hunger.need){
        this.hunger.hungry = true;
        this.findFood();
        return false;
    }
}
CottonSnake.prototype.findFood = function(){
    if(food.length > 0){  
        var lastIndex = this.segment[this.segment.length-1].destination;
        var closestFood = food[0];
        var closestDistance = findHypotenuse(food[0].x - lastIndex.x, food[0].y - lastIndex.y);
        for(var f=1, foodLength=food.length; f<foodLength; f++){
            var currentDistance = findHypotenuse(food[f].x - lastIndex.x, food[f].y - lastIndex.y);  
            if(currentDistance < closestDistance){
                closestDistance = currentDistance;
                closestFood = food[f];
            }  
        } 
        this.closestFood = closestFood;  
    } 
    else{  
        this.findLoiterCoordinate();
        this.closestFood = false;  
    }  
}
CottonSnake.prototype.getFood = function(){   
    var ropeSegment = this.segment;  
    var lastIndex = ropeSegment[ropeSegment.length-1];  
    lastIndex.follow(this.closestFood.x, this.closestFood.y, null);
    for(var r=ropeSegment.length-2; r>-1; r--){
        ropeSegment[r].follow(ropeSegment[r+1].origin.x, ropeSegment[r+1].origin.y, "child");
    }
    if(collidePointRect(lastIndex.destination.x, lastIndex.destination.y, this.closestFood.x, this.closestFood.y, this.closestFood.w, this.closestFood.l)){
        for(var f=this.closestFood.index+1, foodLength=food.length; f<foodLength; f++){
            food[f].index -= 1;  
        }
        this.length += this.closestFood.addLength;
        if(this.length > this.maxLength){
            this.length = this.maxLength;
        }
        this.hunger.current = 0;
        this.hunger.hungry = false;
        food.splice(this.closestFood.index, 1);
        for(var current of rope){ 
            if(current.closestFood){
                current.findFood();
            }
        }      
        this.addSegment(Math.floor(this.length/segmentLength)-ropeSegment.length); 
        this.closestFood = false;
    }  
    return false;
}
CottonSnake.prototype.findLoiterCoordinate = function(){
    this.loiterCoordinate = {
        x: Math.random()*width, 
        y: Math.random()*height,
    };  
}
CottonSnake.prototype.loitering = function(){
    var ropeSegment = this.segment;  
    var lastIndex = ropeSegment[ropeSegment.length-1];  
    lastIndex.follow(this.loiterCoordinate.x, this.loiterCoordinate.y, null);
    for(var r=ropeSegment.length-2; r>-1; r--){
        ropeSegment[r].follow(ropeSegment[r+1].origin.x, ropeSegment[r+1].origin.y, "child");
    }
    if(collideCircleCircle(this.loiterCoordinate.x, this.loiterCoordinate.y, 10, lastIndex.destination.x, lastIndex.destination.y, 3)){
        this.findLoiterCoordinate();
    }
}
CottonSnake.prototype.show = function(){
    for(var current of this.segment){  
        current.show(this.isSnake, this.hunger.hungry);
    }
    if(this.isDragged){
        textFont(fontSrc["chakraPetch"]);
        textAlign(LEFT, BOTTOM);
        textSize(15);
        fill("white");
        stroke("black");
        strokeWeight(2);
        text("Type: " + this.type, mouseX+15, mouseY-30);
        text("Food: " + Math.floor(this.hunger.max-this.hunger.current) + "/" + this.hunger.max, mouseX+15, mouseY-17.5);
        text("Length: " + Math.floor(this.length) + "/" + this.maxLength, mouseX+15, mouseY-5);
        if(this.isDragged && collidePointEllipse(dragObject.destination.x, dragObject.destination.y, marketPlace.ground.x, marketPlace.ground.y, marketPlace.ground.dx, marketPlace.ground.dy)){
            text("Retail Price: " + Math.floor(this.length*this.retailPrice).toLocaleString('en-US', { style: 'currency', currency: 'USD' }).slice(0, -3), mouseX+15, mouseY+7.5);
        }
    }
}
CottonSnake.prototype.sell = function(){
    this.isSold = true;
    this.isSnake = false;
    this.isDragged = false;
    treasury += Math.floor(this.length*this.retailPrice);
}
CottonSnake.prototype.exit = function(){
    var ropeSegment = this.segment;  
    var lastIndex = ropeSegment[ropeSegment.length-1];
    var firstIndex = ropeSegment[0];  
    lastIndex.follow(lastIndex.destination.x+Math.cos(marketPlace.exitTheta)*this.speed, height-50, null);
    for(var r=ropeSegment.length-2; r>-1; r--){
        ropeSegment[r].follow(ropeSegment[r+1].origin.x, ropeSegment[r+1].origin.y, "child");
    }
    if(!collidePointRect(firstIndex.origin.x, firstIndex.origin.y, 0, 0, width, height)){
        for(var i=this.index+1, length=rope.length; i<length; i++){
            rope[i].index -= 1;
        }
        rope.splice(this.index, 1);
        return true;
    }
    return false;
}

function WoolSnake(x, y, length, theta, index){
    this.type = "woolSnake";
    this.retailPrice = 50;
    this.maxLength = 1000;
    this.speed = 2;
    this.rotationSpeed = 0.25;
    this.snakeColor = {
        h: 0,  
        s: 0,  
        b: 180,  
    }     
    this.ropeColor = {
        h: 0,  
        s: 0,  
        b: 230,  
    }  
    this.strokeWeight = 15;
    
    this.hunger = {
        current: 0,
        max: 100,
        need: 1.5,
        hungry: false,
        brightnessPenalty: 50,
    }
    
    this.index = index;
    this.length = length;  
    this.isSnake = true;
    this.isDragged = false;
    this.isSold = false;
    
    this.segment = [];
    this.segment.push(new Segment(this, x, y, theta, 0));  
    this.addSegment(Math.floor(this.length/segmentLength)-1);
    
    if(this.hunger.current >= this.hunger.need){
        this.hunger.hungry = true;
        this.findFood();
    }
    this.loiterCoordinate = {
        x: x+length*cos(theta)*1.1,
        y: y+length*sin(theta)*1.1, 
    }
    this.closestFood = false;
}
WoolSnake.prototype.addSegment = function(amount){
  for(var i=0; i<amount; i++){  
    var previousSegment = this.segment[this.segment.length-1];
    this.segment.push(new Segment(this, previousSegment.destination.x, previousSegment.destination.y, previousSegment.theta-PI, previousSegment.index+1));
  }
}
WoolSnake.prototype.drag = function(){ 
    var dragSegment = this.segment;
    var dragIndex = dragObject.index;  
    dragObject.follow(mouseX, mouseY, "child");
    //dragObject.show();
    // dragObject's Parent  
    for(var r=dragIndex-1; r>-1; r--){
        dragSegment[r].follow(dragSegment[r+1].origin.x, dragSegment[r+1].origin.y, "child");
        //dragSegment[r].show();
    } 
    // dragObject's Child  
    for(var r=dragIndex+1, dragLength=dragSegment.length; r<dragLength; r++){
        dragSegment[r].follow(dragSegment[r-1].destination.x, dragSegment[r-1].destination.y, "parent");
        //dragSegment[r].show();
    }

    if(dragObject.origin.x < 0 || dragObject.origin.x > width || dragObject.origin.y < 0 || dragObject.origin.y > height){   
        if(collidePointEllipse(dragObject.destination.x, dragObject.destination.y, marketPlace.ground.x, marketPlace.ground.y, marketPlace.ground.dx, marketPlace.ground.dy)){
            this.sell();
            dragObject = null;
        }
        else{
            this.isDragged = false;
            this.isSnake = true;
            dragObject = null;
        }
    }
}
WoolSnake.prototype.hungerUpdate = function(){
    this.hunger.current += hungerRate;
    if(this.hunger.hungry && this.hunger.current >= this.hunger.max){
        this.length -= hungerPenalty;
        if(Math.ceil(this.length/segmentLength)-this.segment.length < 0){
            this.segment.shift();
            for(var current of this.segment){
                current.index -= 1;
            }
            if(this.segment.length == 0){
                for(var i=this.index+1, length=rope.length; i<length; i++){
                    rope[i].index -= 1;
                }
                rope.splice(this.index, 1);
                for(var i=0, length=rope.length; i<length; i++){
                    if(rope[i].closestFood){
                        rope[i].findFood();
                    }
                }
                return true;
            }
        }
    }
    else if(!this.hunger.hungry && this.hunger.current >= this.hunger.need){
        this.hunger.hungry = true;
        this.findFood();
        return false;
    }
}
WoolSnake.prototype.findFood = function(){
    if(food.length > 0){  
        var lastIndex = this.segment[this.segment.length-1].destination;
        var closestFood = food[0];
        var closestDistance = findHypotenuse(food[0].x - lastIndex.x, food[0].y - lastIndex.y);
        for(var f=1, foodLength=food.length; f<foodLength; f++){
            var currentDistance = findHypotenuse(food[f].x - lastIndex.x, food[f].y - lastIndex.y);  
            if(currentDistance < closestDistance){
                closestDistance = currentDistance;
                closestFood = food[f];
            }  
        } 
        this.closestFood = closestFood;  
    } 
    else{  
        this.findLoiterCoordinate();
        this.closestFood = false;  
    }  
}
WoolSnake.prototype.getFood = function(){   
    var ropeSegment = this.segment;  
    var lastIndex = ropeSegment[ropeSegment.length-1];  
    lastIndex.follow(this.closestFood.x, this.closestFood.y, null);
    for(var r=ropeSegment.length-2; r>-1; r--){
        ropeSegment[r].follow(ropeSegment[r+1].origin.x, ropeSegment[r+1].origin.y, "child");
    }
    if(collidePointRect(lastIndex.destination.x, lastIndex.destination.y, this.closestFood.x, this.closestFood.y, this.closestFood.w, this.closestFood.l)){
        for(var f=this.closestFood.index+1, foodLength=food.length; f<foodLength; f++){
            food[f].index -= 1;  
        }
        this.length += this.closestFood.addLength;
        if(this.length > this.maxLength){
            this.length = this.maxLength;
        }
        this.hunger.current = 0;
        this.hunger.hungry = false;
        food.splice(this.closestFood.index, 1);
        for(var current of rope){ 
            if(current.closestFood){
                current.findFood();
            }
        }      
        this.addSegment(Math.floor(this.length/segmentLength)-ropeSegment.length); 
        this.closestFood = false;
    }  
    return false;
}
WoolSnake.prototype.findLoiterCoordinate = function(){
    this.loiterCoordinate = {
        x: Math.random()*width, 
        y: Math.random()*height,
    };  
}
WoolSnake.prototype.loitering = function(){
    var ropeSegment = this.segment;  
    var lastIndex = ropeSegment[ropeSegment.length-1];  
    lastIndex.follow(this.loiterCoordinate.x, this.loiterCoordinate.y, null);
    for(var r=ropeSegment.length-2; r>-1; r--){
        ropeSegment[r].follow(ropeSegment[r+1].origin.x, ropeSegment[r+1].origin.y, "child");
    }
    if(collideCircleCircle(this.loiterCoordinate.x, this.loiterCoordinate.y, 10, lastIndex.destination.x, lastIndex.destination.y, 3)){
        this.findLoiterCoordinate();
    }
}
WoolSnake.prototype.show = function(){
    for(var current of this.segment){  
        current.show(this.isSnake, this.hunger.hungry);
    }
    if(this.isDragged){
        textFont(fontSrc["chakraPetch"]);
        textAlign(LEFT, BOTTOM);
        textSize(15);
        fill("white");
        stroke("black");
        strokeWeight(2);
        text("Type: " + this.type, mouseX+15, mouseY-30);
        text("Food: " + Math.floor(this.hunger.max-this.hunger.current) + "/" + this.hunger.max, mouseX+15, mouseY-17.5);
        text("Length: " + Math.floor(this.length) + "/" + this.maxLength, mouseX+15, mouseY-5);
        if(this.isDragged && collidePointEllipse(dragObject.destination.x, dragObject.destination.y, marketPlace.ground.x, marketPlace.ground.y, marketPlace.ground.dx, marketPlace.ground.dy)){
            text("Retail Price: " + Math.floor(this.length*this.retailPrice).toLocaleString('en-US', { style: 'currency', currency: 'USD' }).slice(0, -3), mouseX+15, mouseY+7.5);
        }
    }
}
WoolSnake.prototype.sell = function(){
    this.isSold = true;
    this.isSnake = false;
    this.isDragged = false;
    treasury += Math.floor(this.length*this.retailPrice);
}
WoolSnake.prototype.exit = function(){
    var ropeSegment = this.segment;  
    var lastIndex = ropeSegment[ropeSegment.length-1];
    var firstIndex = ropeSegment[0];  
    lastIndex.follow(lastIndex.destination.x+Math.cos(marketPlace.exitTheta)*this.speed, height-50, null);
    for(var r=ropeSegment.length-2; r>-1; r--){
        ropeSegment[r].follow(ropeSegment[r+1].origin.x, ropeSegment[r+1].origin.y, "child");
    }
    if(!collidePointRect(firstIndex.origin.x, firstIndex.origin.y, 0, 0, width, height)){
        for(var i=this.index+1, length=rope.length; i<length; i++){
            rope[i].index -= 1;
        }
        rope.splice(this.index, 1);
        return true;
    }
    return false;
}

function SilkSnake(x, y, length, theta, index){
    this.type = "silkSnake";
    this.retailPrice = 700;
    this.maxLength = 750;
    this.speed = 5;
    this.rotationSpeed = 0.5;
    this.snakeColor = {
        h: 315,  
        s: 270,  
        b: 230,  
    }  
    this.ropeColor = {
        h: 315,  
        s: 270,  
        b: 270,  
    }
    this.strokeWeight = 9;
    
    this.hunger = {
        current: 0,
        max: 100,
        need: 30,
        hungry: false,
        brightnessPenalty: 70,
    }
    
    this.index = index;
    this.length = length;  
    this.isSnake = true;
    this.isDragged = false;
    this.isSold = false;
    
    this.segment = [];
    this.segment.push(new Segment(this, x, y, theta, 0));  
    this.addSegment(Math.floor(this.length/segmentLength)-1);
    
    if(this.hunger.current >= this.hunger.need){
        this.hunger.hungry = true;
        this.findFood();
    }
    this.loiterCoordinate = {
        x: x+length*cos(theta)*1.1,
        y: y+length*sin(theta)*1.1, 
    }
    this.closestFood = false;
}
SilkSnake.prototype.addSegment = function(amount){
  for(var i=0; i<amount; i++){  
    var previousSegment = this.segment[this.segment.length-1];
    this.segment.push(new Segment(this, previousSegment.destination.x, previousSegment.destination.y, previousSegment.theta-PI, previousSegment.index+1));
  }
}
SilkSnake.prototype.drag = function(){ 
    var dragSegment = this.segment;
    var dragIndex = dragObject.index;  
    dragObject.follow(mouseX, mouseY, "child");
    //dragObject.show();
    // dragObject's Parent  
    for(var r=dragIndex-1; r>-1; r--){
        dragSegment[r].follow(dragSegment[r+1].origin.x, dragSegment[r+1].origin.y, "child");
        //dragSegment[r].show();
    } 
    // dragObject's Child  
    for(var r=dragIndex+1, dragLength=dragSegment.length; r<dragLength; r++){
        dragSegment[r].follow(dragSegment[r-1].destination.x, dragSegment[r-1].destination.y, "parent");
        //dragSegment[r].show();
    }

    if(dragObject.origin.x < 0 || dragObject.origin.x > width || dragObject.origin.y < 0 || dragObject.origin.y > height){   
        if(collidePointEllipse(dragObject.destination.x, dragObject.destination.y, marketPlace.ground.x, marketPlace.ground.y, marketPlace.ground.dx, marketPlace.ground.dy)){
            this.sell();
            dragObject = null;
        }
        else{
            this.isDragged = false;
            this.isSnake = true;
            dragObject = null;
        }
    }
}
SilkSnake.prototype.hungerUpdate = function(){
    this.hunger.current += hungerRate;
    if(this.hunger.hungry && this.hunger.current >= this.hunger.max){
        this.length -= hungerPenalty;
        if(Math.ceil(this.length/segmentLength)-this.segment.length < 0){
            this.segment.shift();
            for(var current of this.segment){
                current.index -= 1;
            }
            if(this.segment.length == 0){
                for(var i=this.index+1, length=rope.length; i<length; i++){
                    rope[i].index -= 1;
                }
                rope.splice(this.index, 1);
                for(var i=0, length=rope.length; i<length; i++){
                    if(rope[i].closestFood){
                        rope[i].findFood();
                    }
                }
                return true;
            }
        }
    }
    else if(!this.hunger.hungry && this.hunger.current >= this.hunger.need){
        this.hunger.hungry = true;
        this.findFood();
        return false;
    }
}
SilkSnake.prototype.findFood = function(){
    if(rope.length > 1){  
        var lastIndex = this.segment[this.segment.length-1].destination;
        var closestFood = false;
        var closestDistance = width*height + 1;
        for(var i=0, length=rope.length; i<length; i++){
            if(rope[i].type == "cottonSnake" && !rope[i].isSold){
                var foodLastIndex = rope[i].segment[rope[i].segment.length-1].destination;
                var currentDistance = findHypotenuse(foodLastIndex.x - lastIndex.x, foodLastIndex.y - lastIndex.y);  
                if(currentDistance < closestDistance){
                    closestDistance = currentDistance;
                    closestFood = rope[i];
                }
            }
        } 
        this.closestFood = closestFood; 
        if(!closestFood){
            this.findLoiterCoordinate();
        }
    } 
    else{  
        this.findLoiterCoordinate();
        this.closestFood = false;  
    }  
}
SilkSnake.prototype.getFood = function(){   
    var ropeSegment = this.segment;  
    var lastIndex = ropeSegment[ropeSegment.length-1]; 
    var foodLastIndex = this.closestFood.segment[this.closestFood.segment.length-1];
    lastIndex.follow(foodLastIndex.destination.x, foodLastIndex.destination.y, null);
    for(var r=ropeSegment.length-2; r>-1; r--){
        ropeSegment[r].follow(ropeSegment[r+1].origin.x, ropeSegment[r+1].origin.y, "child");
    }
    if(collidePointRect(lastIndex.destination.x, lastIndex.destination.y, foodLastIndex.destination.x, foodLastIndex.destination.y, this.closestFood.strokeWeight, this.closestFood.strokeWeight)){
        for(var i=this.closestFood.index+1, length=rope.length; i<length; i++){
            rope[i].index -= 1;  
        }
        this.length += Math.floor(this.closestFood.length/10);
        if(this.length > this.maxLength){
            this.length = this.maxLength;
        }
        this.hunger.current = 0;
        this.hunger.hungry = false;
        rope.splice(this.closestFood.index, 1);
        for(var current of rope){ 
            if(current.closestFood){
                current.findFood();
            }
        }      
        this.addSegment(Math.floor(this.length/segmentLength)-ropeSegment.length); 
        this.closestFood = false; 
        return true;
    }  
    else{
        return false;
    }
}
SilkSnake.prototype.findLoiterCoordinate = function(){
    this.loiterCoordinate = {
        x: Math.random()*width, 
        y: Math.random()*height,
    };  
}
SilkSnake.prototype.loitering = function(){
    var ropeSegment = this.segment;  
    var lastIndex = ropeSegment[ropeSegment.length-1];  
    lastIndex.follow(this.loiterCoordinate.x, this.loiterCoordinate.y, null);
    for(var r=ropeSegment.length-2; r>-1; r--){
        ropeSegment[r].follow(ropeSegment[r+1].origin.x, ropeSegment[r+1].origin.y, "child");
    }
    if(collideCircleCircle(this.loiterCoordinate.x, this.loiterCoordinate.y, 10, lastIndex.destination.x, lastIndex.destination.y, 3)){
        this.findLoiterCoordinate();
    }
}
SilkSnake.prototype.show = function(){
    for(var current of this.segment){  
        current.show(this.isSnake, this.hunger.hungry);
    }
    if(this.isDragged){
        textFont(fontSrc["chakraPetch"]);
        textAlign(LEFT, BOTTOM);
        textSize(15);
        fill("white");
        stroke("black");
        strokeWeight(2);
        text("Type: " + this.type, mouseX+15, mouseY-30);
        text("Food: " + Math.floor(this.hunger.max-this.hunger.current) + "/" + this.hunger.max, mouseX+15, mouseY-17.5);
        text("Length: " + Math.floor(this.length) + "/" + this.maxLength, mouseX+15, mouseY-5);
        if(this.isDragged && collidePointEllipse(dragObject.destination.x, dragObject.destination.y, marketPlace.ground.x, marketPlace.ground.y, marketPlace.ground.dx, marketPlace.ground.dy)){
            text("Retail Price: " + Math.floor(this.length*this.retailPrice).toLocaleString('en-US', { style: 'currency', currency: 'USD' }).slice(0, -3), mouseX+15, mouseY+7.5);
        }
    }
}
SilkSnake.prototype.sell = function(){
    this.isSold = true;
    this.isSnake = false;
    this.isDragged = false;
    treasury += Math.floor(this.length*this.retailPrice);
}
SilkSnake.prototype.exit = function(){
    var ropeSegment = this.segment;  
    var lastIndex = ropeSegment[ropeSegment.length-1];
    var firstIndex = ropeSegment[0];  
    lastIndex.follow(lastIndex.destination.x+Math.cos(marketPlace.exitTheta)*this.speed, height-50, null);
    for(var r=ropeSegment.length-2; r>-1; r--){
        ropeSegment[r].follow(ropeSegment[r+1].origin.x, ropeSegment[r+1].origin.y, "child");
    }
    if(!collidePointRect(firstIndex.origin.x, firstIndex.origin.y, 0, 0, width, height)){
        for(var i=this.index+1, length=rope.length; i<length; i++){
            rope[i].index -= 1;
        }
        rope.splice(this.index, 1);
        return true;
    }
    return false;
}

function AcrylicSnake(x, y, length, theta, index){
    this.type = "acrylicSnake";
    this.retailPrice = 50;
    this.maxLength = 2500;
    this.speed = 5;
    this.rotationSpeed = 0.5;
    this.snakeColor = {
        h: 0,  
        s: 270,  
        b: 190,  
    }     
    this.ropeColor = {
        h: 0,  
        s: 270,  
        b: 230,  
    }  
    this.strokeWeight = 10;
    
    this.hunger = {
        current: 0,
        max: 100,
        need: 2,
        hungry: false,
        brightnessPenalty: 70,
    }
    
    this.index = index;
    this.length = length;  
    this.isSnake = true;
    this.isDragged = false;
    this.isSold = false;
    
    this.segment = [];
    this.segment.push(new Segment(this, x, y, theta, 0));  
    this.addSegment(Math.floor(this.length/segmentLength)-1);
    
    if(this.hunger.current >= this.hunger.need){
        this.hunger.hungry = true;
        this.findFood();
    }
    this.loiterCoordinate = {
        x: x+length*cos(theta)*1.1,
        y: y+length*sin(theta)*1.1, 
    }
    this.closestFood = false;
}
AcrylicSnake.prototype.addSegment = function(amount){
  for(var i=0; i<amount; i++){  
    var previousSegment = this.segment[this.segment.length-1];
    this.segment.push(new Segment(this, previousSegment.destination.x, previousSegment.destination.y, previousSegment.theta-PI, previousSegment.index+1));
  }
}
AcrylicSnake.prototype.drag = function(){ 
    var dragSegment = this.segment;
    var dragIndex = dragObject.index;  
    dragObject.follow(mouseX, mouseY, "child");
    //dragObject.show();
    // dragObject's Parent  
    for(var r=dragIndex-1; r>-1; r--){
        dragSegment[r].follow(dragSegment[r+1].origin.x, dragSegment[r+1].origin.y, "child");
        //dragSegment[r].show();
    } 
    // dragObject's Child  
    for(var r=dragIndex+1, dragLength=dragSegment.length; r<dragLength; r++){
        dragSegment[r].follow(dragSegment[r-1].destination.x, dragSegment[r-1].destination.y, "parent");
        //dragSegment[r].show();
    }

    if(dragObject.origin.x < 0 || dragObject.origin.x > width || dragObject.origin.y < 0 || dragObject.origin.y > height){   
        if(collidePointEllipse(dragObject.destination.x, dragObject.destination.y, marketPlace.ground.x, marketPlace.ground.y, marketPlace.ground.dx, marketPlace.ground.dy)){
            this.sell();
            dragObject = null;
        }
        else{
            this.isDragged = false;
            this.isSnake = true;
            dragObject = null;
        }
    }
}
AcrylicSnake.prototype.hungerUpdate = function(){
    this.hunger.current += hungerRate;
    if(this.hunger.hungry && this.hunger.current >= this.hunger.max){
        this.length -= hungerPenalty;
        if(Math.ceil(this.length/segmentLength)-this.segment.length < 0){
            this.segment.shift();
            for(var current of this.segment){
                current.index -= 1;
            }
            if(this.segment.length == 0){
                for(var i=this.index+1, length=rope.length; i<length; i++){
                    rope[i].index -= 1;
                }
                rope.splice(this.index, 1);
                for(var i=0, length=rope.length; i<length; i++){
                    if(rope[i].closestFood){
                        rope[i].findFood();
                    }
                }
                return true;
            }
        }
    }
    else if(!this.hunger.hungry && this.hunger.current >= this.hunger.need){
        this.hunger.hungry = true;
        this.findFood();
        return false;
    }
}
AcrylicSnake.prototype.findFood = function(){
    if(rope.length > 1){  
        var lastIndex = this.segment[this.segment.length-1].destination;
        var closestFood = false;
        var closestDistance = width*height + 1;
        for(var i=0, length=rope.length; i<length; i++){
            if(rope[i].type != "acrylicSnake" && !rope[i].isSold){
                var foodLastIndex = rope[i].segment[rope[i].segment.length-1].destination;
                var currentDistance = findHypotenuse(foodLastIndex.x - lastIndex.x, foodLastIndex.y - lastIndex.y);  
                if(currentDistance < closestDistance){
                    closestDistance = currentDistance;
                    closestFood = rope[i];
                }
            }
        } 
        if(!closestFood){
            for(var i=0, length=rope.length; i<length; i++){
                if(rope[i] != this && !rope[i].isSold){
                    var foodLastIndex = rope[i].segment[rope[i].segment.length-1].destination;
                    var currentDistance = findHypotenuse(foodLastIndex.x - lastIndex.x, foodLastIndex.y - lastIndex.y);  
                    if(currentDistance < closestDistance){
                        closestDistance = currentDistance;
                        closestFood = rope[i];
                    }
                }
            }
        }
        this.closestFood = closestFood;    
    } 
    else{  
        this.isSold = true;
        this.isDragged = false;
    }  
}
AcrylicSnake.prototype.getFood = function(){   
    var ropeSegment = this.segment;  
    var lastIndex = ropeSegment[ropeSegment.length-1]; 
    var foodLastIndex = this.closestFood.segment[this.closestFood.segment.length-1];
    lastIndex.follow(foodLastIndex.destination.x, foodLastIndex.destination.y, null);
    for(var r=ropeSegment.length-2; r>-1; r--){
        ropeSegment[r].follow(ropeSegment[r+1].origin.x, ropeSegment[r+1].origin.y, "child");
    }
    if(collidePointRect(lastIndex.destination.x, lastIndex.destination.y, foodLastIndex.destination.x, foodLastIndex.destination.y, this.closestFood.strokeWeight, this.closestFood.strokeWeight)){
        for(var i=this.closestFood.index+1, length=rope.length; i<length; i++){
            rope[i].index -= 1;  
        }
        this.length += Math.floor(this.closestFood.length/segmentLength);
        if(this.length > this.maxLength){
            this.length = this.maxLength;
        }
        this.hunger.current = 0;
        this.hunger.hungry = false;
        rope.splice(this.closestFood.index, 1);
        for(var current of rope){ 
            if(current.closestFood){
                current.findFood();
            }
        }      
        this.addSegment(Math.floor(this.length/segmentLength)-ropeSegment.length); 
        this.closestFood = false; 
        return true;
    }  
    else{
        return false;
    }
}
AcrylicSnake.prototype.findLoiterCoordinate = function(){
    this.loiterCoordinate = {
        x: Math.random()*width, 
        y: Math.random()*height,
    };  
}
AcrylicSnake.prototype.loitering = function(){
    var ropeSegment = this.segment;  
    var lastIndex = ropeSegment[ropeSegment.length-1];  
    lastIndex.follow(this.loiterCoordinate.x, this.loiterCoordinate.y, null);
    for(var r=ropeSegment.length-2; r>-1; r--){
        ropeSegment[r].follow(ropeSegment[r+1].origin.x, ropeSegment[r+1].origin.y, "child");
    }
    if(collideCircleCircle(this.loiterCoordinate.x, this.loiterCoordinate.y, 10, lastIndex.destination.x, lastIndex.destination.y, 3)){
        this.findLoiterCoordinate();
    }
}
AcrylicSnake.prototype.show = function(){
    for(var current of this.segment){  
        current.show(this.isSnake, this.hunger.hungry);
    }
    if(this.isDragged){
        textFont(fontSrc["chakraPetch"]);
        textAlign(LEFT, BOTTOM);
        textSize(15);
        fill("white");
        stroke("black");
        strokeWeight(2);
        text("Type: " + this.type, mouseX+15, mouseY-30);
        text("Food: " + Math.floor(this.hunger.max-this.hunger.current) + "/" + this.hunger.max, mouseX+15, mouseY-17.5);
        text("Length: " + Math.floor(this.length) + "/" + this.maxLength, mouseX+15, mouseY-5);
        if(this.isDragged && collidePointEllipse(dragObject.destination.x, dragObject.destination.y, marketPlace.ground.x, marketPlace.ground.y, marketPlace.ground.dx, marketPlace.ground.dy)){
            text("Retail Price: " + Math.floor(this.length*this.retailPrice).toLocaleString('en-US', { style: 'currency', currency: 'USD' }).slice(0, -3), mouseX+15, mouseY+7.5);
        }
    }
}
AcrylicSnake.prototype.sell = function(){
    this.isSold = true;
    this.isSnake = false;
    this.isDragged = false;
    treasury += Math.floor(this.length*this.retailPrice);
}
AcrylicSnake.prototype.exit = function(){
    var ropeSegment = this.segment;  
    var lastIndex = ropeSegment[ropeSegment.length-1];
    var firstIndex = ropeSegment[0];  
    lastIndex.follow(lastIndex.destination.x+Math.cos(marketPlace.exitTheta)*this.speed, height-50, null);
    for(var r=ropeSegment.length-2; r>-1; r--){
        ropeSegment[r].follow(ropeSegment[r+1].origin.x, ropeSegment[r+1].origin.y, "child");
    }
    if(!collidePointRect(firstIndex.origin.x, firstIndex.origin.y, 0, 0, width, height)){
        for(var i=this.index+1, length=rope.length; i<length; i++){
            rope[i].index -= 1;
        }
        rope.splice(this.index, 1);
        return true;
    }
    return false;
}

function Segment(parent, x, y, theta, index){
    this.parent = parent;
    this.theta = theta;
    this.snakeColor = parent.snakeColor; 
    this.ropeColor = parent.ropeColor;
    this.brightnessPenalty = parent.hunger.brightnessPenalty;
    this.strokeWeight = parent.strokeWeight;
    this.speed = parent.speed; 
    this.rotationSpeed = parent.rotationSpeed; 

    this.origin = {
        x: x, 
        y: y,
    }

    this.destination = {
        x: x + Math.cos(theta)*segmentLength,
        y: y + Math.sin(theta)*segmentLength,
    };
    this.index = index;
}
Segment.prototype.follow = function(x, y, relationship){
    if(relationship == "child"){
        var dx = x - this.origin.x;  
        var dy = y - this.origin.y;
        this.theta = findRotation(dx, dy);  
        this.destination.x = this.origin.x + Math.cos(this.theta)*segmentLength;
        this.destination.y = this.origin.y + Math.sin(this.theta)*segmentLength;

        dx = x - this.destination.x;
        dy = y - this.destination.y;

        this.origin.x += dx;
        this.origin.y += dy;
        this.destination.x += dx;
        this.destination.y += dy;
    }
    else if(relationship == "parent"){
        var dx = x - this.destination.x;  
        var dy = y - this.destination.y;
        this.theta = findRotation(dx, dy);  
        this.origin.x = this.destination.x + Math.cos(this.theta)*segmentLength;
        this.origin.y = this.destination.y + Math.sin(this.theta)*segmentLength;

        dx = x - this.origin.x;
        dy = y - this.origin.y;

        this.origin.x += dx;
        this.origin.y += dy;
        this.destination.x += dx;
        this.destination.y += dy;
    }
    else{
        var dx = x - this.origin.x;  
        var dy = y - this.origin.y;
        var dtheta = findRotation(dx, dy) - this.theta; 
        if(Math.abs(dtheta) > PI){
            dtheta = dtheta + this.theta + (TWO_PI-this.theta)*posNeg(this.theta);  
        }  
        if(Math.abs(dtheta) > this.rotationSpeed){
            this.theta += posNeg(dtheta)*this.rotationSpeed;  
        }
        else{
            this.theta += dtheta;  
        }
        if(Math.abs(this.theta) > PI){
            this.theta = posNeg(this.theta)*(this.theta-TWO_PI);  
        }

        this.destination.x = this.origin.x + Math.cos(this.theta)*segmentLength;
        this.destination.y = this.origin.y + Math.sin(this.theta)*segmentLength;

        dx = x - this.destination.x;
        dy = y - this.destination.y;
        var dh = findHypotenuse(dx, dy);
        if(dh > this.speed){
            this.origin.x += Math.cos(this.theta)*this.speed;
            this.origin.y += Math.sin(this.theta)*this.speed;
            this.destination.x += Math.cos(this.theta)*this.speed;
            this.destination.y += Math.sin(this.theta)*this.speed;
        }
        else if(dh > 0){
            this.origin.x += dx;
            this.origin.y += dy;
            this.destination.x += dx;
            this.destination.y += dy;
        }
    }
}
Segment.prototype.show = function(isSnake, isHungry){  
    if(!isSnake){
        stroke(this.ropeColor.h, this.ropeColor.s, this.ropeColor.b);  
    }  
    else if(isHungry){
        stroke(this.snakeColor.h, this.snakeColor.s, this.snakeColor.b - this.brightnessPenalty);  
    }  
    else{
        stroke(this.snakeColor.h, this.snakeColor.s, this.snakeColor.b);  
    }  
    strokeWeight(this.strokeWeight);  
    line(this.origin.x, this.origin.y, this.destination.x, this.destination.y);
}


// Store Constructor

function CottonSnakeStore(){
    this.x = 100;
    this.y = -10;
    this.w = 100;
    this.l = 130;
    this.name = "cottonSnake";
    this.cost = 5000;
    this.ropeColor = {
        h: 50,  
        s: 180,  
        b: 230,  
    }  
    this.backgroundColor = {
        main: "black",
        secondary: "white",
    };
    this.letter = "Z", 
    this.waitTime = {
        current: 7,
        need: 7,
    };
    this.unlocked = true;
    this.unlockPrice = 10000;
    this.line = [
        {
            x1: this.x+this.w-20,
            y1: this.y+30,
            x2: this.x+20,
            y2: this.y+30,
        },
        {
            x1: this.x+20,
            y1: this.y+30,
            x2: this.x+20, 
            y2: this.y+this.l/2+20,
        },
        {
            x1: this.x+20, 
            y1: this.y+this.l/2+20,
            x2: this.x+this.w/2, 
            y2: this.y+50,
        },
        {
            x1: this.x+this.w/2, 
            y1: this.y+50,
            x2: this.x+this.w/2, 
            y2: this.y+100,
        },
    ];
}
CottonSnakeStore.prototype.buy = function(){
    if(treasury >= this.cost && this.waitTime.current >= this.waitTime.need && rope.length < ropeCapacity){
        treasury -= this.cost;
        rope.push(new CottonSnake(this.x+(Math.random()*this.w/2)+this.w/4, this.y+this.l-Math.sin(PI/2)*Math.floor(50/segmentLength)*segmentLength, 50, PI/2, rope.length));
        this.waitTime.current = 0;
    }
}
CottonSnakeStore.prototype.unlock = function(){
    if(treasury >= this.unlockPrice){
        treasury -= this.unlockPrice;
        this.unlocked = true;
    }
}
CottonSnakeStore.prototype.show = function(){
    // Background
    fill(this.backgroundColor.main);
    stroke(this.backgroundColor.secondary);
    strokeWeight(2);
    rect(this.x, this.y, this.w, this.l);
    fill(this.backgroundColor.secondary);
    rect((this.x), this.y+this.l-20, this.w, 20);
    
    // Key Input and Price 
    textFont(fontSrc["chakraPetch"]);
    textAlign(RIGHT, BOTTOM);
    textSize(15);
    noStroke();
    fill(this.backgroundColor.secondary);
    text(this.letter, this.x+this.w-3, this.y+this.l-22);
    fill(this.backgroundColor.main);
    textAlign(CENTER, CENTER);
    if(this.unlocked){
        text(this.cost.toLocaleString('en-US', { style: 'currency', currency: 'USD' }).slice(0, -3), (this.x+this.w/2), this.y+this.l-12);
    }
    else{
        text(this.unlockPrice.toLocaleString('en-US', { style: 'currency', currency: 'USD' }).slice(0, -3), (this.x+this.w/2), this.y+this.l-12);
    }
    
    // Rope
    stroke(this.ropeColor.h, this.ropeColor.s, this.ropeColor.b);
    strokeWeight(5);
    for(var currentLine of this.line){
        line(currentLine.x1, currentLine.y1, currentLine.x2, currentLine.y2);
    }
    
    // Box Shadow
    if(!this.unlocked){
        fill(0, 0, 0, 320);
        stroke(this.backgroundColor.secondary);
        strokeWeight(2);
        rect(this.x, this.y, this.w, this.l-20);
        noFill()
        stroke(this.backgroundColor.secondary);
        strokeWeight(1);
        ellipse(this.x+this.w/2, this.y+this.l/2-4, 10, 15)
        fill(this.ropeColor.h, this.ropeColor.s, this.ropeColor.b);
        rect(this.x+this.w/2-10, this.y+this.l/2-5, 20, 10);
    }
    else if(this.waitTime.current < this.waitTime.need){
        fill(0, 0, 0, 200);
        noStroke();
        var waitHeight = map(this.waitTime.current, 0, this.waitTime.need, this.l, 0);
        rect(this.x, this.y, this.w, waitHeight);
        this.waitTime.current += 1;
    }
}

function WoolSnakeStore(){
    this.x = 225;
    this.y = -10;
    this.w = 100;
    this.l = 130;
    this.name = "woolSnake";
    this.cost = 10000;
    this.ropeColor = {
        h: 0,  
        s: 0,  
        b: 230,  
    }  
    this.backgroundColor = {
        main: "black",
        secondary: "white",
    };
    this.letter = "X", 
    this.waitTime = {
        current: 7,
        need: 7,
    };
    this.unlocked = false;
    this.unlockPrice = 25000;
    this.line = [
        {
            x1: this.x+this.w-20,
            y1: this.y+30,
            x2: this.x+20,
            y2: this.y+30,
        },
        {
            x1: this.x+20,
            y1: this.y+30,
            x2: this.x+20, 
            y2: this.y+this.l/2+20,
        },
        {
            x1: this.x+20, 
            y1: this.y+this.l/2+20,
            x2: this.x+this.w/2, 
            y2: this.y+50,
        },
        {
            x1: this.x+this.w/2, 
            y1: this.y+50,
            x2: this.x+this.w/2, 
            y2: this.y+100,
        },
    ];
}
WoolSnakeStore.prototype.buy = function(){
    if(treasury >= this.cost && this.waitTime.current >= this.waitTime.need && rope.length < ropeCapacity){
        treasury -= this.cost;
        rope.push(new WoolSnake(this.x+(Math.random()*this.w/2)+this.w/4, this.y+this.l-Math.sin(PI/2)*Math.floor(50/segmentLength)*segmentLength, 50, PI/2, rope.length));
        this.waitTime.current = 0;
    }
}
WoolSnakeStore.prototype.unlock = function(){
    if(treasury >= this.unlockPrice){
        treasury -= this.unlockPrice;
        this.unlocked = true;
    }
}
WoolSnakeStore.prototype.show = function(){
    // Background
    fill(this.backgroundColor.main);
    stroke(this.backgroundColor.secondary);
    strokeWeight(2);
    rect(this.x, this.y, this.w, this.l);
    fill(this.backgroundColor.secondary);
    rect((this.x), this.y+this.l-20, this.w, 20);
    
    // Key Input and Price 
    textFont(fontSrc["chakraPetch"]);
    textAlign(RIGHT, BOTTOM);
    textSize(15);
    noStroke();
    fill(this.backgroundColor.secondary);
    text(this.letter, this.x+this.w-3, this.y+this.l-22);
    fill(this.backgroundColor.main);
    textAlign(CENTER, CENTER);
    if(this.unlocked){
        text(this.cost.toLocaleString('en-US', { style: 'currency', currency: 'USD' }).slice(0, -3), (this.x+this.w/2), this.y+this.l-12);
    }
    else{
        text(this.unlockPrice.toLocaleString('en-US', { style: 'currency', currency: 'USD' }).slice(0, -3), (this.x+this.w/2), this.y+this.l-12);
    }
    
    // Rope
    stroke(this.ropeColor.h, this.ropeColor.s, this.ropeColor.b);
    strokeWeight(5);
    for(var currentLine of this.line){
        line(currentLine.x1, currentLine.y1, currentLine.x2, currentLine.y2);
    }
    
    // Box Shadow
    if(!this.unlocked){
        fill(0, 0, 0, 320);
        stroke(this.backgroundColor.secondary);
        strokeWeight(2);
        rect(this.x, this.y, this.w, this.l-20);
        noFill()
        stroke(this.backgroundColor.secondary);
        strokeWeight(1);
        ellipse(this.x+this.w/2, this.y+this.l/2-4, 10, 15)
        fill(this.ropeColor.h, this.ropeColor.s, this.ropeColor.b);
        rect(this.x+this.w/2-10, this.y+this.l/2-5, 20, 10);
    }
    else if(this.waitTime.current < this.waitTime.need){
        fill(0, 0, 0, 200);
        noStroke();
        var waitHeight = map(this.waitTime.current, 0, this.waitTime.need, this.l, 0);
        rect(this.x, this.y, this.w, waitHeight);
        this.waitTime.current += 1;
    }
}

function SilkSnakeStore(){
    this.x = 350;
    this.y = -10;
    this.w = 100;
    this.l = 130;
    this.name = "silkSnake";
    this.cost = 75000;
    this.ropeColor = {
        h: 315,  
        s: 270,  
        b: 270,  
    }  
    this.backgroundColor = {
        main: "black",
        secondary: "white",
    };
    this.letter = "C", 
    this.waitTime = {
        current: 7,
        need: 7,
    };
    this.unlocked = false;
    this.unlockPrice = 125000;
    this.line = [
        {
            x1: this.x+this.w-20,
            y1: this.y+30,
            x2: this.x+20,
            y2: this.y+30,
        },
        {
            x1: this.x+20,
            y1: this.y+30,
            x2: this.x+20, 
            y2: this.y+this.l/2+20,
        },
        {
            x1: this.x+20, 
            y1: this.y+this.l/2+20,
            x2: this.x+this.w/2, 
            y2: this.y+50,
        },
        {
            x1: this.x+this.w/2, 
            y1: this.y+50,
            x2: this.x+this.w/2, 
            y2: this.y+100,
        },
    ];
}
SilkSnakeStore.prototype.buy = function(){
    if(treasury >= this.cost && this.waitTime.current >= this.waitTime.need && rope.length < ropeCapacity){
        treasury -= this.cost;
        rope.push(new SilkSnake(this.x+(Math.random()*this.w/2)+this.w/4, this.y+this.l-Math.sin(PI/2)*Math.floor(50/segmentLength)*segmentLength, 50, PI/2, rope.length));
        this.waitTime.current = 0;
    }
}
SilkSnakeStore.prototype.unlock = function(){
    if(treasury >= this.unlockPrice){
        treasury -= this.unlockPrice;
        this.unlocked = true;
    }
}
SilkSnakeStore.prototype.show = function(){
    // Background
    fill(this.backgroundColor.main);
    stroke(this.backgroundColor.secondary);
    strokeWeight(2);
    rect(this.x, this.y, this.w, this.l);
    fill(this.backgroundColor.secondary);
    rect((this.x), this.y+this.l-20, this.w, 20);
    
    // Key Input and Price 
    textFont(fontSrc["chakraPetch"]);
    textAlign(RIGHT, BOTTOM);
    textSize(15);
    noStroke();
    fill(this.backgroundColor.secondary);
    text(this.letter, this.x+this.w-3, this.y+this.l-22);
    fill(this.backgroundColor.main);
    textAlign(CENTER, CENTER);
    if(this.unlocked){
        text(this.cost.toLocaleString('en-US', { style: 'currency', currency: 'USD' }).slice(0, -3), (this.x+this.w/2), this.y+this.l-12);
    }
    else{
        text(this.unlockPrice.toLocaleString('en-US', { style: 'currency', currency: 'USD' }).slice(0, -3), (this.x+this.w/2), this.y+this.l-12);
    }
    
    // Rope
    stroke(this.ropeColor.h, this.ropeColor.s, this.ropeColor.b);
    strokeWeight(5);
    for(var currentLine of this.line){
        line(currentLine.x1, currentLine.y1, currentLine.x2, currentLine.y2);
    }
    
    // Box Shadow
    if(!this.unlocked){
        fill(0, 0, 0, 320);
        stroke(this.backgroundColor.secondary);
        strokeWeight(2);
        rect(this.x, this.y, this.w, this.l-20);
        noFill()
        stroke(this.backgroundColor.secondary);
        strokeWeight(1);
        ellipse(this.x+this.w/2, this.y+this.l/2-4, 10, 15)
        fill(this.ropeColor.h, this.ropeColor.s, this.ropeColor.b);
        rect(this.x+this.w/2-10, this.y+this.l/2-5, 20, 10);
    }
    else if(this.waitTime.current < this.waitTime.need){
        fill(0, 0, 0, 200);
        noStroke();
        var waitHeight = map(this.waitTime.current, 0, this.waitTime.need, this.l, 0);
        rect(this.x, this.y, this.w, waitHeight);
        this.waitTime.current += 1;
    }
}

function FoodUpgrade(){
    this.x = 525;
    this.y = -10;
    this.w = 100;
    this.l = 130;
    this.level = 1;
    this.maxLevel = 3;
    this.name = "foodUpgrade";
    this.cost = 15000;  
    this.backgroundColor = {
        main: "black",
        secondary: "white",
    };
    this.letter = "V", 
    this.waitTime = {
        current: 7,
        need: 7,
    };
    this.unlocked = true;
    this.unlockPrice = 1000;
    this.ornamentFood = [
        new FoodLevel1(this.x+22, this.y+this.l*2/3, foodDimension*2/3, foodDimension*2/3, 135, 180, 180, "white"),
        new FoodLevel2(this.x+this.w/2-foodDimension/2-10, this.y+this.l/2-4, foodDimension, foodDimension, 45, 180, 180, "white"),
        new FoodLevel3(this.x+this.w-foodDimension/2-15, this.y+this.l/5+10, foodDimension*4/3, foodDimension*4/3, 0, 180, 180, "white"),
    ];
}
FoodUpgrade.prototype.upgrade = function(){
    if(treasury >= this.cost && this.waitTime.current >= this.waitTime.need && this.level < this.maxLevel){
        treasury -= this.cost;
        this.waitTime.current = 0;
        this.level += 1;
        foodLevel += 1;
        this.cost *= 10/3;
    }
}
FoodUpgrade.prototype.unlock = function(){
    if(treasury >= this.unlockPrice){
        treasury -= this.unlockPrice;
        this.unlocked = true;
    }
}
FoodUpgrade.prototype.show = function(){
    // Background
    fill(this.backgroundColor.main);
    stroke(this.backgroundColor.secondary);
    strokeWeight(2);
    rect(this.x, this.y, this.w, this.l);
    fill(this.backgroundColor.secondary);
    rect((this.x), this.y+this.l-20, this.w, 20);
    
    // Key Input and Price 
    textFont(fontSrc["chakraPetch"]);
    textAlign(RIGHT, BOTTOM);
    textSize(15);
    noStroke();
    fill(this.backgroundColor.secondary);
    text(this.letter, this.x+this.w-3, this.y+this.l-22);
    fill(this.backgroundColor.main);
    textAlign(CENTER, CENTER);
    if(this.level < this.maxLevel){
        text(this.cost.toLocaleString('en-US', { style: 'currency', currency: 'USD' }).slice(0, -3), (this.x+this.w/2), this.y+this.l-12);
    }
    else{
        text("MAX", (this.x+this.w/2), this.y+this.l-12);
    }
    
    // Food
    for(var i=0, currentLength=this.ornamentFood.length; i<currentLength; i++){
        this.ornamentFood[i].show((i+1) == foodLevel);
    }
        
    // Box Shadow
    if(this.waitTime.current < this.waitTime.need){
        fill(0, 0, 0, 200);
        noStroke();
        var waitHeight = map(this.waitTime.current, 0, this.waitTime.need, this.l, 0);
        rect(this.x, this.y, this.w, waitHeight);
        this.waitTime.current += 1;
    }
}

function FoodQuantity(){
    this.x = 650;
    this.y = -10;
    this.w = 100;
    this.l = 130;
    this.level = 1;
    this.maxLevel = 10;
    this.name = "foodQuantity";
    this.cost = 5000;  
    this.backgroundColor = {
        main: "black",
        secondary: "white",
    };
    this.letter = "B", 
    this.waitTime = {
        current: 7,
        need: 7,
    };
    this.unlocked = true;
    this.unlockPrice = 1000;
    this.numeral = "I";
}
FoodQuantity.prototype.upgrade = function(){
    if(treasury >= this.cost && this.waitTime.current >= this.waitTime.need && this.level < this.maxLevel){
        treasury -= this.cost;
        this.waitTime.current = 0;
        this.level += 1;
        foodPerClick += 1;
        this.cost = this.level * 5000;
        this.numeral = romanNumeral(this.level);
    }
}
FoodQuantity.prototype.unlock = function(){
    if(treasury >= this.unlockPrice){
        treasury -= this.unlockPrice;
        this.unlocked = true;
    }
}
FoodQuantity.prototype.show = function(){
    // Background
    fill(this.backgroundColor.main);
    stroke(this.backgroundColor.secondary);
    strokeWeight(2);
    rect(this.x, this.y, this.w, this.l);
    fill(this.backgroundColor.secondary);
    rect((this.x), this.y+this.l-20, this.w, 20);
    
    // Key Input and Price 
    textFont(fontSrc["chakraPetch"]);
    textAlign(RIGHT, BOTTOM);
    textSize(15);
    noStroke();
    fill(this.backgroundColor.secondary);
    text(this.letter, this.x+this.w-3, this.y+this.l-22);
    fill(this.backgroundColor.main);
    textAlign(CENTER, CENTER);
    if(this.level < this.maxLevel){
        text(this.cost.toLocaleString('en-US', { style: 'currency', currency: 'USD' }).slice(0, -3), (this.x+this.w/2), this.y+this.l-12);
    }
    else{
        text("MAX", (this.x+this.w/2), this.y+this.l-12);
    }
    
    // Roman Numeral
    textFont(fontSrc["fellEnglish"]);
    textSize(45);
    fill(this.backgroundColor.secondary);
    text(this.numeral, (this.x+this.w/2), this.y+this.l/2-10);
        
    // Box Shadow
    if(this.waitTime.current < this.waitTime.need){
        fill(0, 0, 0, 200);
        noStroke();
        var waitHeight = map(this.waitTime.current, 0, this.waitTime.need, this.l, 0);
        rect(this.x, this.y, this.w, waitHeight);
        this.waitTime.current += 1;
    }
}


// Game Instruction

console.clear();

console.log("\nPlayer's Control: \n \n"
            + "Mouse Input: \n"
            + "Mouse Press: Release Food \n"
            + "Mouse Press: Grab Snake \n"
            + "Mouse Released: Release Snake \n \n"
            + "Keyboard Input: \n"
            + "Z Keydown: Buy Cotton Snake \n"
            + "X Keydown: Buy Wool Snake \n"
            + "C Keydown: Buy Silk Snake \n"
            + "V Keydown: Upgrade Food \n"
            + "B Keydown: Increase Food \n \n"
            + "I Keydown: Toggle Tutorial \n"
            + "O Keydown: Toggle fullscreen \n"
            + "P Keydown: Add $10,000 \n \n"
            + "1 Keydown: Spawn Cotton Snake \n"
            + "2 Keydown: Spawn Wool Snake \n"
            + "3 Keydown: Spawn Silk Snake \n"
            + "4 Keydown: Spawn Acrylic Snake \n \n"
            + "Space Keydown: Pause game \n"
            + "R Keydown: Restart \n"
            + "T Keydown: Title Screen \n \n" 
);

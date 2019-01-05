// Game Setup

function loadFinished(loadedFile){
    loadingStatus.current += 1;
    if(loadingStatus.current == loadingStatus.need){
        setTimeout(function(){
            gameStatus = "blankScreen"
            updateInput();
            pokeball.data = [];
            beacon = [];
            background(0);
        }, 1800);
        setTimeout(function(){
            gameStatus = "initiation";
            pokeball.data = [];
            beacon = [];
        }, 2100);
    }
}

function preload() {
    fontSrc["chakraPetch"] = loadFont("Assets/Fonts/ChakraPetch-Medium.ttf", loadFinished);
    fontSrc["fellEnglish"] = loadFont("Assets/Fonts/Fell English.ttf", loadFinished);
}

function setup() {
    canvas = createCanvas(1200, 640);
    var offsetX = 0;  
    var offsetY = 0;
    if(windowWidth > width){
        offsetX = (windowWidth - width) / 2;
    }
    if(windowHeight > height){
        offsetY = (windowHeight - height) / 2;
    }  
    canvas.position(offsetX, offsetY);
    canvas.parent("canvasContainer");
    colorMode(HSL, 360);
    
    //gameStatus = "loading";

    rope.push(new CottonSnake(50, 100+50, 250, 0, 0));
    
    store.push(new CottonSnakeStore());
    store.push(new WoolSnakeStore());
    store.push(new SilkSnakeStore());
    store.push(new FoodUpgrade());
    store.push(new FoodQuantity());
    
    habitat = new TrueSpace();
    habitat.addDecoration(1);
    
    marketPlace = new SpaceMarket();
    
    //displayTutorialAgain();
}


// Main Loop

function draw() {
    background(habitat.color.h, habitat.color.s, habitat.color.b);
    if(habitat.specialFeature != null){
        habitat.specialFeature();
    }
  
    for(var d=0, decorationLength=decoration.length; d<decorationLength; d++){
        var current = decoration[d];
        current.show();  
        if(current.update != null){
            var decorationDeath = current.update();
            if(decorationDeath){
                d -= 1;
                decorationLength -= 1;
            }
        }
    } 
    
    marketPlace.showGround();
    
    for(var f=0, foodLength=food.length; f<foodLength; f++){
        var current = food[f];
        if(current.update != null){
            current.update();
        }
        current.show(true);  
    }  
    
    for(var r=0, ropeLength=rope.length; r<ropeLength; r++){
        var current = rope[r];
        if(current.isSold){}
        else if(current.isDragged){ 
            current.drag();    
        }
        else{
            if(current.hunger.hungry && frameCount % findFoodRate == 0){   
                current.findFood();
            }
            if(current.hunger.hungry && current.closestFood){
                var killedSnake = current.getFood();
                if(killedSnake){
                    r -= 1;
                    ropeLength -= 1;
                }
            }      
            else{
                current.loitering();  
            }
        }  
        current.show();
        if(current.isSold){
            var snakeDeath = current.exit();
            if(snakeDeath){
                r -= 1;
                ropeLength -= 1;
            }
        }
        else if(current.isSnake){
            var snakeDeath = current.hungerUpdate();
            if(snakeDeath){
                r -= 1;
                ropeLength -= 1;
            }
        }
    }

    for(var s=0, storeLength=store.length; s<storeLength; s++){
        var current = store[s];
        current.show();
        if(collidePointRect(mouseX, mouseY, current.x, current.y, current.w, current.l)){
            textFont(fontSrc["chakraPetch"]);
            textAlign(LEFT, BOTTOM);
            textSize(15);
            fill("white");
            stroke("black");
            strokeWeight(2);
            text(current.name, mouseX+2, mouseY-2);
        }
    }
    
    marketPlace.showSign();
    
    textFont(fontSrc["chakraPetch"]);
    textAlign(RIGHT, TOP);
    textSize(20);
    fill("white");
    stroke("black");
    strokeWeight(3);
    text("Treasury: " + treasury.toLocaleString('en-US', { style: 'currency', currency: 'USD' }).slice(0, -3), width-15, 15);
    text("Snake: " + rope.length + "/" + ropeCapacity, width-15, 50);
    text("Food: " + food.length + "/" + foodCapacity, width-15, 85);

    if(gameStatus == "initiation"){
        push();
        textFont(fontSrc["chakraPetch"]);
        textAlign(CENTER, BOTTOM);  
        textSize(64);
        stroke("black");
        strokeWeight(5);
        fill("white");
        text("Mission: Defense", width*4/7, height*3/7);  
        if(sin(frameCount*0.05) > -0.64){  
            textAlign(CENTER, TOP);  
            textSize(30);
            strokeWeight(3);
            text("Click to Start", width*4/7, height*3/7); 
        }
        pop();  
    }
    else if(gameOverScreen){
        noStroke();
        fill(0, 0, 0, 55+sin(frameCount*0.05)*25);
        rect(0, 0, width, height);
        push();
        textFont(fontSrc["chakraPetch"]);
        textAlign(CENTER, BOTTOM);
        textSize(64);
        stroke("black");
        strokeWeight(5);
        fill("white");
        text("Game Over: Bankruptcy", width*4/7, height*3/7);  
        if(sin(frameCount*0.05) > -0.64){  
            textAlign(CENTER, TOP);  
            textSize(30);
            strokeWeight(3);
            text("Press Space to restart", width*4/7, height*3/7); 
        }
        pop();
    }    

    else if(gameStatus == "loading"){
        background(0);
        image(imageSrc["graySky"], 0, 0, 1200, 640);
        fill(0, 0, 0, 150);
        rect(0, 0, 1200, 640);
        textAlign(CENTER, CENTER);
        for(var i=0, length=beacon.length; i<length; i++){
			fill("red")
            stroke("black")
            strokeWeight(1);
            textSize(15);
			text("R", beacon[i].x, beacon[i].y);
			var currentAlpha = map(beacon[i].radius, 0, beacon[i].limit, 300, 100)
			var currentWeight = map(beacon[i].radius, 0, beacon[i].limit, 5, 1)
            stroke(0, 0, 255, currentAlpha)
			strokeWeight(currentWeight)
            noFill();
			ellipse(beacon[i].x, beacon[i].y, beacon[i].radius,  beacon[i].radius);
			beacon[i].radius += beacon[i].expansionSpeed;
			if(beacon[i].radius > beacon[i].limit){
				beacon.splice(i, 1);
				i -= 1;
				length -= 1;
			}
		}
        if(frameCount % 7 == 0){
            pokeball.data[pokeball.data.length] = {
            x: Math.random()*(400) + 400,
            y: 92,
            moveX: 0,
            moveY: 0,
            affectedByGravity: true,
            type: "pokeball",
            };
        }
        for(var i=0, length=pokeball.data.length; i<length; i++){
            push();
            var pokeballRotation = findRotation(pokeball.data[i].moveX, pokeball.data[i].moveY);

            translate(pokeball.data[i].x, pokeball.data[i].y);
            rotate(pokeballRotation);
            image(imageSrc[pokeball.data[i].type], 0, pokeball.height/2*-1, pokeball.width, pokeball.height);
            pop();
            if((pokeball.data[i].y-pokeball.height/2) > (height*5/6-60)){
                pokeball.data.splice(i, 1);
                i -= 1;
                length -= 1;
            }
        }
        
        strokeWeight(3);
		stroke("white")
		fill("white")
		rect(375, height*5/6-15, width-750, 30, 5)
		var currentWidth = map(loadingStatus.current, 0, loadingStatus.need, 0, width-750)
		fill("green")
		rect(375, height*5/6-15, currentWidth, 30, 5)
        
        var headerText = "Welcome to Kanto!";
        textFont(fontSrc["chakraPetch"]);
        textAlign(CENTER, TOP);
        fill("white");
        textSize(80);
        text(headerText, width/2, 0);
        stroke("white");
        var headerWidth = textWidth(headerText)
        rect(width/2-headerWidth/2, 84, headerWidth, 4);
        stroke("black");
        
        textAlign(RIGHT, BOTTOM);
        noStroke();
        textSize(25);
        text("Version 1.2", width-20, height-10);
    }
    else if(gameStatus == "blankScreen"){
        background(0);
    }
}


// Player's Interaction

function mousePressed() {
    var objectCollision = false;
    
    if(collidePointRect(mouseX, mouseY, marketPlace.postSign.x, marketPlace.postSign.y, marketPlace.postSign.w, marketPlace.postSign.l)){
        rope.push(new AcrylicSnake(width, height-50, 50, -PI, rope.length));
        objectCollision = true;
    }
    
    for(var s=0, storeLength=store.length; s<storeLength; s++){  
        var object = store[s];
        if(collidePointRect(mouseX, mouseY, object.x, object.y, object.w, object.l)){
            if(object.unlocked && object.buy != null){
                object.buy();
            }
            else if(object.unlocked && object.upgrade != null){
                object.upgrade();
            }
            else{
                object.unlock();
            }
            objectCollision = true;
            s = storeLength;
        }
    }
    
    for(var r=0, ropeLength=rope.length; r<ropeLength && !objectCollision; r++){
        if(!rope[r].isSold){
            for(var object of rope[r].segment){  
                if(collidePointLine(mouseX, mouseY, object.origin.x, object.origin.y, object.destination.x, object.destination.y, dragDiameter)){
                    dragObject = object;
                    dragObject.parent.isDragged = true;
                    dragObject.parent.isSnake = false;
                    objectCollision = true;
                }
            }
        }
    }
    
    if(!objectCollision && collidePointRect(mouseX, mouseY, 15, 15, width-30, height-30) && food.length < foodCapacity){
        if(foodPerClick == 1){
            spawnFood(mouseX, mouseY, foodDimension, foodDimension, Math.random()*360, Math.random()*50+150, Math.random()*50+100, "white");
        }
        else if(foodPerClick == 3){
            spawnFood(mouseX-foodDimension*3/4+(Math.random()-0.5)*foodDimension/2, mouseY+foodDimension*3/4+(Math.random()-0.5)*foodDimension/2, foodDimension, foodDimension, Math.random()*360, Math.random()*50+150, Math.random()*50+100, "white");  
            spawnFood(mouseX+foodDimension*3/4+(Math.random()-0.5)*foodDimension/2, mouseY+foodDimension*3/4+(Math.random()-0.5)*foodDimension/2, foodDimension, foodDimension, Math.random()*360, Math.random()*50+150, Math.random()*50+100, "white");  
            spawnFood(mouseX+(Math.random()-0.5)*foodDimension/2, mouseY+foodDimension/4+(Math.random()-0.5)*foodDimension/2, foodDimension, foodDimension, Math.random()*360, Math.random()*50+150, Math.random()*50+100, "white");  
        }
        else{
            for(var i=0; i<foodPerClick; i++){
                spawnFood(mouseX+(Math.random()-0.5)*foodDimension*foodPerClick/2, mouseY-foodDimension/2+(Math.random()-0.5)*foodDimension*foodPerClick/2, foodDimension, foodDimension, Math.random()*360, Math.random()*50+150, Math.random()*50+100, "white"); 
            }
        } 
    }  
}

function mouseReleased() {
    if(dragObject != null && collidePointEllipse(dragObject.destination.x, dragObject.destination.y, marketPlace.ground.x, marketPlace.ground.y, marketPlace.ground.dx, marketPlace.ground.dy)){
        dragObject.parent.sell();
        dragObject = null;
    }
    else if(dragObject != null){
        dragObject.parent.isDragged = false;
        dragObject.parent.isSnake = true;
        dragObject = null;
    }
}

function keyPressed(){
    // Space Key
    if(keyCode == 32 && gameStatus == 'active'){
        if(dragObject != null){
            dragObject.parent.isDragged = false;
            dragObject.parent.isSnake = true;
            dragObject = null;
        }
        gameStatus = "inactive";
        noLoop();
    }
    else if(keyCode == 32 && gameStatus == 'gameOver'){
        for(var b=0, bossLength=boss.data.length; b<bossLength; b++){
            pokeball.data[pokeball.data.length] = { x: boss.data[b].x+boss[boss.data[b].type].width/2-pokeball.width/2, y: boss.data[b].y+boss[boss.data[b].type].height/2-pokeball.height/2, moveX: 0, moveY: 0, affectedByGravity: true, type: "masterball", empty: true, value: 50000, };
            boss.data.splice(b, 1);
            b -= 1;
            bossLength -= 1;
        }
        for(var h=0, enemyLength=enemy.data.length; h<enemyLength; h++){
            pokeball.data[pokeball.data.length] = { x: enemy.data[h].x+enemy[enemy.data[h].type].width/2-pokeball.width/2, y: enemy.data[h].y+enemy[enemy.data[h].type].height/2-pokeball.height/2, moveX: 0, moveY: 0, affectedByGravity: true, type: "rocketball", empty: true, value: 1000, };
            enemy.data.splice(h, 1);
            h -= 1;
            enemyLength -= 1;
        }
        gameStatus = "restartSequence";
    }
    else if(keyCode == 32 && gameStatus == "inactive"){
        gameStatus = "active";
        loop();
    }
    
    // R Key
    else if(keyCode == 82){
        for(var b=0, bossLength=boss.data.length; b<bossLength; b++){
            pokeball.data[pokeball.data.length] = { x: boss.data[b].x+boss[boss.data[b].type].width/2-pokeball.width/2, y: boss.data[b].y+boss[boss.data[b].type].height/2-pokeball.height/2, moveX: 0, moveY: 0, affectedByGravity: true, type: "masterball", empty: true, value: 50000, };
            boss.data.splice(b, 1);
            b -= 1;
            bossLength -= 1;
        }
        for(var h=0, enemyLength=enemy.data.length; h<enemyLength; h++){
            pokeball.data[pokeball.data.length] = { x: enemy.data[h].x+enemy[enemy.data[h].type].width/2-pokeball.width/2, y: enemy.data[h].y+enemy[enemy.data[h].type].height/2-pokeball.height/2, moveX: 0, moveY: 0, affectedByGravity: true, type: "rocketball", empty: true, value: 1000, };
            enemy.data.splice(h, 1);
            h -= 1;
            enemyLength -= 1;
        }
        gameStatus = "restartSequence";
    }    
    // O Key
    else if(keyCode == 79){
        var currentStatus = fullscreen();
        fullscreen(!currentStatus);
    }
}

function windowResized(){
    var offsetX = 0;
    var offsetY = 0;
    if(windowWidth > width){
        offsetX = (windowWidth - width) / 2;
    }
    if(windowHeight > height){
        offsetY = (windowHeight - height) / 2;
    }
    canvas.position(offsetX, offsetY);
}


// Support Function

function spawnFood(x, y, w, l, fillColorH, fillColorS, fillColorB, strokeColor){
    if(foodLevel == 1){
        food.push(new FoodLevel1(x, y, w, l, fillColorH, fillColorS, fillColorB, strokeColor));
    }
    else if(foodLevel == 2){
        food.push(new FoodLevel2(x, y, w, l, fillColorH, fillColorS, fillColorB, strokeColor));
    }
    if(foodLevel == 3){
        food.push(new FoodLevel3(x, y, w, l, fillColorH, fillColorS, fillColorB, strokeColor));
    }
}

function findHypotenuse(dx, dy){
  return Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
}

function findProportionalFactor(dx, dy, dh){
  var k = 0;
  if(dx != 0 || dy != 0){
    k = Math.sqrt(Math.pow(dh, 2) / (Math.pow(dx, 2)+Math.pow(dy, 2)));
  }
  return k;
}

function findRotation(dx, dy){
  var dh = Math.sqrt(Math.pow(dy, 2) + Math.pow(dx, 2));  
  var rotationRadian = 0;
  if(dh != 0){
    rotationRadian = Math.acos(dx / dh);
  }
  if(dy < 0){
    rotationRadian *= -1;
  } 
  return rotationRadian;
}

function posNeg(number){
  if(number != 0){
    return number / Math.abs(number);
  }
  else {
    return 0;
  }
}

// This was found online. Credit to jaggedsoft on StackOverflow.
function romanNumeral(number) {
  var romanNumeral = "";
  for(var n in romanCheatSheet){
    while ( number >= romanCheatSheet[n] ) {
      romanNumeral += n;
      number -= romanCheatSheet[n];
    }
  }
  return romanNumeral;
} 


// Reset Function

function resetGame(){
    treasury = 10000;
    captureCount.current = 0;
    captureCount.toNextLevel = 1;
    chargeMeter.current = 0;
    powerUp.freezeTimer = 0;
    powerUp.launcherTimer = 0;
    for(var p=0, powerLength=powerUp.data.length; p<powerLength; p++){
        powerUp.data[p].waitTime.current = 0;
    }
    pokeball.data = [];
    enemy.data = [];
    boss.data = [];
    boss.maxLength = 0;
    boss.previous = false;
}


//Draggable Tutorial

dragElement(document.getElementById("tutorialSpace"));
function dragElement(elmnt) {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    if (document.getElementById(elmnt.id + "Header")) {
        /* if present, the header is where you move the DIV from:*/
        document.getElementById(elmnt.id + "Header").onmousedown = dragMouseDown;
    } else {
        /* otherwise, move the DIV from anywhere inside the DIV:*/
        elmnt.onmousedown = dragMouseDown;
    }

    function dragMouseDown(e) {
        e = e || window.event;
        // get the mouse cursor position at startup:
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e = e || window.event;
        // calculate the new cursor position:
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        // set the element's new position:
        elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
        elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
        /* stop moving when mouse button is released:*/
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

function displayTutorialAgain(){
    document.getElementById("tutorialSpace").setAttribute("style", "display: inline; top: 50%; left: 50%; transform: (-50%, -50%);");  
    slide = 1;  
    displayNextSlide();
    tutorialActive = true;
    if(dragObject != null){
        dragObject.parent.isDragged = false;
        dragObject.parent.isSnake = true;
        dragObject = null;
    }
    gameStatus = "inactive";  
    noLoop();
}

function hideTutorialSpace(){
    document.getElementById("tutorialSpace").setAttribute("style", "display: none;");
    if(!gameOverScreen){
        gameStatus = "active";
    }
    else{
        gameStatus = "gameOver";
    }
    tutorialActive = false;
    loop();
}

var slide=1;
function displayNextSlide(){
    if(slide == 1){
        document.getElementById("tutorialText").innerHTML = "<p>Welcome to Greece! You are the first volunteer to try out the new Labyrinth built by Daedalus! However, be warned that not all test dummies came out safely. But don't worry. The gods, themselves, oversee your journey. Athena, goddess of knowledge, blesses you with the brain to navigate the maze. Hermes, god of thief, make you the supreme sneak! Ares, god of war, gave you the courage to push forth. Daedalus himself gave you the key. Go, Hero!</p><button class='nextButton' onclick='displayNextSlide()'>Next: <i class='arrow right'></i></button>"; 
        document.getElementById("tutorialSpaceHeader").innerHTML = "Background";
        slide = 2;
  }
}

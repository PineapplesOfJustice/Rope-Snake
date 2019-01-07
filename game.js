// Game Setup

function loadFinished(loadedFile){
    loadingStatus.current += 1;
    if(loadingStatus.current == loadingStatus.need){
        setTimeout(function(){
            gameStatus = "blankScreen";
            background(0);
        }, 1800);
        setTimeout(function(){
            gameStatus = "initiation";
        }, 2100);
    }
}

function preload() {
    fontSrc["chakraPetch"] = loadFont("Assets/Fonts/ChakraPetch-Medium.ttf");
    fontSrc["fellEnglish"] = loadFont("Assets/Fonts/Fell English.ttf");
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
    
    habitat = new TrueSpace();
    marketPlace = new SpaceMarket();
    
    gameStatus = "initiation";
}


// Main Loop

function draw() {
    if(habitat){
        background(habitat.color.h, habitat.color.s, habitat.color.b);
        if(habitat.specialFeature != null){
            habitat.specialFeature();
        }
    }
    else{
        background("black");
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
    
    if(marketPlace){
        marketPlace.showGround();
    }
    
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
    
    if(marketPlace){
        marketPlace.showSign();
    }
    spawnAcrylicSnake();
    
    textFont(fontSrc["chakraPetch"]);
    textAlign(RIGHT, TOP);
    textSize(20);
    fill("white");
    stroke("black");
    strokeWeight(3);
    text("Treasury: " + treasury.toLocaleString('en-US', { style: 'currency', currency: 'USD' }).slice(0, -3), width-15, 15);
    text("Snake: " + rope.length + "/" + ropeCapacity, width-15, 50);
    text("Food: " + food.length + "/" + foodCapacity, width-15, 85);
    
    if(treasury < 5000 && rope.length == 0 && gameStatus == "active"){
        gameStatus = "gameOver";
        gameOverScreen = true;
    }
    else if(gameStatus == "initiation"){
        fill(0);
        rect(0, 0, width, height);
        textFont(fontSrc["chakraPetch"]);
        textAlign(CENTER, TOP);  
        textSize(64);
        stroke("black");
        strokeWeight(5);
        fill("white");
        text("Rope Snake", width/2, height/10);  
        textSize(20);
        text("Choose your Farm", width/2, height*3/7);
        
        fill("black");
        stroke("white");
        strokeWeight(3);
        if(collidePointRect(mouseX, mouseY, width/2-100, height*4/7, 200, 50)){
            fill(220, 250, 70);
        }
        rect(width/2-100, height*4/7, 200, 50, 5);
        fill("white");
        stroke("black");
        strokeWeight(3);
        text("Aquarium", width/2, height*4/7+10);
        
        fill("black");
        stroke("white");
        strokeWeight(3);
        if(collidePointRect(mouseX, mouseY, width/4-100, height*4/7, 200, 50)){
            fill(100, 250, 70);
        }
        rect(width/4-100, height*4/7, 200, 50, 5);
        fill("white");
        stroke("black");
        strokeWeight(3);
        text("Grass Field", width/4, height*4/7+10);
        
        fill("black");
        stroke("white");
        strokeWeight(3);
        rect(width*3/4-100, height*4/7, 200, 50, 5);
        fill("white");
        stroke("black");
        if(collidePointRect(mouseX, mouseY, width*3/4-100, height*4/7, 200, 50)){
            line(width*3/4-100, height*4/7, width*3/4-20, height*4/7+50);
            line(width*3/4-20, height*4/7+50, width*3/4, height*4/7);
            line(width*3/4, height*4/7, width*3/4+20, height*4/7+50);
            line(width*3/4+20, height*4/7+50, width*3/4+100, height*4/7);
            
        }
        strokeWeight(3);
        text("True Space", width*3/4, height*4/7+10);
    }
    else if(gameOverScreen){
        textFont(fontSrc["chakraPetch"]);
        textAlign(CENTER, BOTTOM);
        textSize(45);
        stroke("black");
        strokeWeight(5);
        fill("white");
        text("Game Over: Bankruptcy", width/2, height*3/7);  
        if(sin(frameCount*0.05) > -0.64){  
            textAlign(CENTER, TOP);  
            textSize(30);
            text("Press Space", width/2, height*3/7); 
        }
    }    
    if(gameStatus == "restartSequence"){
        if(rope.length == 0){
            gameOverScreen = false;
            resetGame(false);
            startGame();
        }
    }
}


// Player's Interaction

function mousePressed() {
    if(gameStatus == "active" || gameStatus == "gameOver"){
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
    else if(gameStatus == "initiation"){
        if(collidePointRect(mouseX, mouseY, width/4-100, height*4/7, 200, 50)){
            habitat = new GrassField();
            marketPlace = new LandMarket();
            resetGame(false);
            habitat.addDecoration(habitat.amountOfDecorationSpawn);
            startGame();
            if(!window.sessionStorage.tutorialDisplayed){
                displayTutorialSpace();
                window.sessionStorage.tutorialDisplayed = true;
            }
        }
        else if(collidePointRect(mouseX, mouseY, width/2-100, height*4/7, 200, 50)){
            habitat = new Aquarium();
            marketPlace = new SeaMarket();
            resetGame(false);
            habitat.addDecoration(habitat.amountOfDecorationSpawn);
            startGame();
            if(!window.sessionStorage.tutorialDisplayed){
                displayTutorialSpace();
                window.sessionStorage.tutorialDisplayed = true;
            }
        }
        else if(collidePointRect(mouseX, mouseY, width*3/4-100, height*4/7, 200, 50)){
            habitat = new TrueSpace();
            marketPlace = new SpaceMarket();
            resetGame(false);
            habitat.addDecoration(habitat.amountOfDecorationSpawn);
            startGame();
            if(!window.sessionStorage.tutorialDisplayed){
                displayTutorialSpace();
                window.sessionStorage.tutorialDisplayed = true;
            }
        }
    }
}

function mouseReleased() {
    if(gameStatus == "active"){
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
}

function keyPressed(){    
    // Z Key
    if(keyCode == 90 && (gameStatus == "active" || gameStatus == "gameOver")){
        if(store[0].unlocked){
            if(store[0].buy != null){
                store[0].buy();
            }
            else if(store[0].upgrade != null){
                store[0].upgrade();
            }
        }
        else{
            store[0].unlock();
        }
    }
    // X Key
    else if(keyCode == 88 && (gameStatus == "active" || gameStatus == "gameOver")){
        if(store[1].unlocked){
            if(store[1].buy != null){
                store[1].buy();
            }
            else if(store[1].upgrade != null){
                store[1].upgrade();
            }
        }
        else{
            store[1].unlock();
        }
    }
    // C Key
    else if(keyCode == 67 && (gameStatus == "active" || gameStatus == "gameOver")){
        if(store[2].unlocked){
            if(store[2].buy != null){
                store[2].buy();
            }
            else if(store[2].upgrade != null){
                store[2].upgrade();
            }
        }
        else{
            store[2].unlock();
        }
    }
    // V Key
    else if(keyCode == 86 && (gameStatus == "active" || gameStatus == "gameOver")){
        if(store[3].unlocked){
            if(store[3].buy != null){
                store[3].buy();
            }
            else if(store[3].upgrade != null){
                store[3].upgrade();
            }
        }
        else{
            store[3].unlock();
        }
    }
    // B Key
    else if(keyCode == 66 && (gameStatus == "active" || gameStatus == "gameOver")){
        if(store[4].unlocked){
            if(store[4].buy != null){
                store[4].buy();
            }
            else if(store[4].upgrade != null){
                store[4].upgrade();
            }
        }
        else{
            store[4].unlock();
        }
    }
    
    // 1 Key
    else if(keyCode == 49 && (gameStatus == "active" || gameStatus == "gameOver")){
        if(rope.length < ropeCapacity){
            rope.push(new CottonSnake(store[0].x+(Math.random()*store[0].w/2)+store[0].w/4, store[0].y+store[0].l-Math.sin(PI/2)*Math.floor(50/segmentLength)*segmentLength, 50, PI/2, rope.length));
        }
    }
    // 2 Key
    else if(keyCode == 50 && (gameStatus == "active" || gameStatus == "gameOver")){
        if(rope.length < ropeCapacity){
            rope.push(new WoolSnake(store[1].x+(Math.random()*store[1].w/2)+store[1].w/4, store[1].y+store[1].l-Math.sin(PI/2)*Math.floor(50/segmentLength)*segmentLength, 50, PI/2, rope.length));
        }
    }
    // 3 Key
    else if(keyCode == 51 && (gameStatus == "active" || gameStatus == "gameOver")){
        if(rope.length < ropeCapacity){
            rope.push(new SilkSnake(store[2].x+(Math.random()*store[2].w/2)+store[2].w/4, store[2].y+store[2].l-Math.sin(PI/2)*Math.floor(50/segmentLength)*segmentLength, 50, PI/2, rope.length));
        }
    }
    // 4 Key
    else if(keyCode == 52 && (gameStatus == "active" || gameStatus == "gameOver")){
        rope.push(new AcrylicSnake(width, height-50, 50, -PI, rope.length));
    }
    
    // I Key
    else if(keyCode == 73 && (gameStatus == "active" || gameStatus == "inactive" || gameStatus == "gameOver")){
        if(tutorialActive){
            hideTutorialSpace();
        }
        else{
            displayTutorialSpace();
        }
    }
    // O Key
    else if(keyCode == 79){
        var currentStatus = fullscreen();
        fullscreen(!currentStatus);
    }
    // P Key
    else if(keyCode == 80 && (gameStatus == "active" || gameStatus == "gameOver")){
        treasury += 10000;
    }
    
    // Space Key
    else if(keyCode == 32 && gameStatus == 'active'){
        if(dragObject != null){
            dragObject.parent.isDragged = false;
            dragObject.parent.isSnake = true;
            dragObject = null;
        }
        gameStatus = "inactive";
        noLoop();
    }
    else if(keyCode == 32 && gameStatus == 'gameOver'){
        for(var i=0; i<5; i++){
            rope.push(new AcrylicSnake(width, height-50, 50, -PI, rope.length));
        }
        gameStatus = "restartSequence";
    }
    else if(keyCode == 32 && gameStatus == "inactive"){
        gameStatus = "active";
        loop();
    }
    // R Key
    else if(keyCode == 82 && (gameStatus == "active" ||  gameStatus == "gameOver" || gameStatus == "restartSequence")){
        for(var i=0; i<5; i++){
            rope.push(new AcrylicSnake(width, height-50, 50, -PI, rope.length));
        }
        gameStatus = "restartSequence";
    }  
    // T Key
    else if(keyCode == 84 && (gameStatus == "active" || gameStatus == "gameOver")){
        resetGame(true);
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

function spawnAcrylicSnake(){
    if(frameCount % acrylicSpawnRate == 0 && rope.length > 0 && gameStatus == "active"){
        if(Math.random() < 0.7){
            rope.push(new AcrylicSnake(width, height-50, 50, -PI, rope.length));
        }
        else{
            rope.push(new AcrylicSnake(width, height-50, 50, -PI, rope.length));
            rope.push(new AcrylicSnake(width, height-50, 50, -PI, rope.length));
        }
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

function resetGame(trueReset){
    treasury = 25000;
    foodLevel = 1;
    foodPerClick = 1;
    rope = [];
    food = [];
    store = [];
    if(trueReset){
        habitat = false;
        marketPlace = false;
        decoration = [];
    }
    if(tutorialActive){
        hideTutorialSpace();
    }
    gameOverScreen = false;
    frameCount = 0;
    gameStatus = "initiation";
}

function startGame(){
    rope.push(new CottonSnake(50, 150, 250, 0, 0));
    
    store.push(new CottonSnakeStore());
    store.push(new WoolSnakeStore());
    store.push(new SilkSnakeStore());
    store.push(new FoodUpgrade());
    store.push(new FoodQuantity());    
    
    //console.log(frameCount);
    gameStatus = "active";
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
        if(elmnt.offsetLeft > windowWidth-330){
            elmnt.style.left = (windowWidth - 330) + "px";
        }
        else if(elmnt.offsetLeft < 330){
            elmnt.style.left = 330 + "px";
        }
        if(elmnt.offsetTop > windowHeight-155){
            elmnt.style.top = (windowHeight - 155) + "px";
        }
        else if(elmnt.offsetTop < 155){
            elmnt.style.top = 155 + "px";
        }
    }

    function closeDragElement() {
        /* stop moving when mouse button is released:*/
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

function displayTutorialSpace(){
    document.getElementById("tutorialSpace").setAttribute("style", "display: inline; top: 50%; left: 50%; transform: (-50%, -50%);");  
    tutorialSlide = 1;  
    tutorialContent();
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

function tutorialContent(){
    if(tutorialSlide == 1){
        document.getElementById("tutorialText").innerHTML = "<p style='text-indent: 50px;'>In Schrödinger's famous experiment, a cat cans be simutaneously alive, dead, or both. Likewise, a snake rope is simultaneously a snake, a rope, and a snake rope. At your very own snake rope farm, you will rear and harvest the next generation of snake rope for the greater good of the public. But not all will be pleased by your successes. In the battle to claim the cream of the business, Sir Piente engineered a cannibalistic breed to unleash on his competitors. Best of luck to you, my successor.</p><button class='nextButton' onclick='displayNextSlide()'>Next: <i class='arrow right'></i></button>"; 
        document.getElementById("tutorialSpaceHeader").innerHTML = "Background";
    }
    else if(tutorialSlide == 2){
        document.getElementById("tutorialText").innerHTML = "<p>Mouse Input:<br>&emsp;Mouse Press: Grab snake/Release Food<br>&emsp;Mouse Release: Release Snake<br>Keyboard Input:<br>&emsp;Space Keydown: Pause<br>&emsp;R Keydown: Restart<br>&emsp;T Keydown: Title Screen<br>&emsp;I Keydown: Toggle Tutorial<br>&emsp;O Keydown: Toggle Fullscreen</p><button class='previousButton' onclick='displayPreviousSlide()'><i class='arrow left'></i> :Previous</button><button class='nextButton' onclick='displayNextSlide()'>Next: <i class='arrow right'></i></button>"; 0
        document.getElementById("tutorialSpaceHeader").innerHTML = "Instruction";
    }
    else if(tutorialSlide == 3){
        document.getElementById("tutorialText").innerHTML = "<p>Cotton Snake:<br>&emsp;Length: 50 - 300 units<br>&emsp;Diameter: 12 units<br>&emsp;Hatchling Price: $5,000<br>&emsp;Retail Price: $50 per unit<br>&emsp;Diet: Food Pellet<br>&emsp;Speed: 4 units per frame<br>&emsp;Characteristic: Big Appetite</p><button class='previousButton' onclick='displayPreviousSlide()'><i class='arrow left'></i> :Previous</button><button class='nextButton' onclick='displayNextSlide()'>Next: <i class='arrow right'></i></button>"; 0
        document.getElementById("tutorialSpaceHeader").innerHTML = "Snakopedia";
    }
    else if(tutorialSlide == 4){
        document.getElementById("tutorialText").innerHTML = "<p>Wool Snake:<br>&emsp;Length: 50 - 1000 units<br>&emsp;Diameter: 15 units<br>&emsp;Hatchling Price: $10,000<br>&emsp;Retail Price: $50 per unit<br>&emsp;Diet: Food Pellet<br>&emsp;Speed: 3 units per frame<br>&emsp;Characteristic: Warm-blooded</p><button class='previousButton' onclick='displayPreviousSlide()'><i class='arrow left'></i> :Previous</button><button class='nextButton' onclick='displayNextSlide()'>Next: <i class='arrow right'></i></button>"; 0
        document.getElementById("tutorialSpaceHeader").innerHTML = "Snakopedia";
    }
    else if(tutorialSlide == 5){
        document.getElementById("tutorialText").innerHTML = "<p>Silk Snake:<br>&emsp;Length: 50 - 750 units<br>&emsp;Diameter: 9 units<br>&emsp;Hatchling Price: $75,000<br>&emsp;Retail Price: $700 per unit<br>&emsp;Diet: Cotton Snake<br>&emsp;Speed: 5 units per frame<br>&emsp;Characteristic: Carnivorous</p><button class='previousButton' onclick='displayPreviousSlide()'><i class='arrow left'></i> :Previous</button><button class='nextButton' onclick='displayNextSlide()'>Next: <i class='arrow right'></i></button>"; 0
        document.getElementById("tutorialSpaceHeader").innerHTML = "Snakopedia";
    }
    else if(tutorialSlide == 6){
        document.getElementById("tutorialText").innerHTML = "<p>Acrylic Snake:<br>&emsp;Length: 50 - 2500 units<br>&emsp;Diameter: 10 units<br>&emsp;Hatchling Price: $?,???,???<br>&emsp;Retail Price: $50 per unit<br>&emsp;Diet: Snake<br>&emsp;Speed: 5 units per frame<br>&emsp;Characteristic: Synthetic</p><button class='previousButton' onclick='displayPreviousSlide()'><i class='arrow left'></i> :Previous</button>"; 0
        document.getElementById("tutorialSpaceHeader").innerHTML = "Snakopedia";
    }
}

function displayNextSlide(){
    tutorialSlide += 1;
    tutorialContent();
}

function displayPreviousSlide(){
    tutorialSlide -= 1;
    tutorialContent();
}

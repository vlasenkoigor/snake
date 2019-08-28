import * as PIXI from 'pixi.js'


const scale = 25,
    N  = 32,
    M = 24;

let score = 0, isGameOver = true; 

const app = new PIXI.Application({
    width: N * scale, height: M * scale, backgroundColor: 0x1099bb, resolution: 1,
});
document.body.appendChild(app.view);

const drawSnakeRect = (p)=>{
    graphics.beginFill(0xffffff);
    graphics.lineStyle(1, 0x0)
    graphics.drawRect(p.x * scale, p.y * scale, scale, scale);
    graphics.endFill();
}


const drawFood = (p)=>{
    foodsGraphics.beginFill(0xfc3503);
    foodsGraphics.drawRect(p.x * scale, p.y * scale, scale, scale);
    foodsGraphics.endFill();
}

const pointToIndex = (p)=>{
    return p.y * N + p.x;
}


const addFood = ()=> {

    let index = getRandomInt(0, (N * M) - 1, snake.map(pointToIndex));

    return new PIXI.Point(index % N, Math.floor(index / N));
}   



const getRandomInt = (min, max, excluded = []) => {

    min = Math.ceil(min);
    max = Math.floor(max);

    let n = Math.floor(Math.random() * (max - min + 1)) + min;
    return excluded.indexOf(n) === -1 ? n : getRandomInt(min, max, excluded);
}


//time of last interval tick 
let lastTime = performance.now();


//snake graphics
const graphics = new PIXI.Graphics();
app.stage.addChild(graphics);

//food graphics 
const foodsGraphics = new PIXI.Graphics();
app.stage.addChild(foodsGraphics);


const [startX, startY] = [Math.floor(N / 2), Math.floor(M / 2)]

let snake = [],
    cv = new PIXI.Point(), //current vector 
    nv = new PIXI.Point(0, 1), //next vector
    foods = [];


//SCORE TEXT 
let scoreText = new PIXI.Text('Score : ' + score, 
    {
        fontFamily : 'Orbitron', 
        fill : 0xffffff,
        align : 'center',
        strokeThickness : 2,
        stroke : 0x000000,
        wordWrap : true,
        wordWrapWidth : app.view.width
    })

scoreText.x = app.view.width / 2;
scoreText.y = scoreText.height;
scoreText.anchor.set(0.5);
app.stage.addChild(scoreText);


//GAME OVER TEXT  
let gameOverText = new PIXI.Text('TAP TO PLAY!', 
    {
        fontFamily : 'Orbitron', 
        fontSize : 60,
        fontWeight : 'bold',
        fill : 0xffffff,
        strokeThickness : 7,
        stroke : 0x000000,
        align : 'center',
        wordWrap : true,
        wordWrapWidth : app.view.width
    })

gameOverText.x = app.view.width / 2;
gameOverText.y = app.view.height/2;
gameOverText.anchor.set(0.5);
app.stage.addChild(gameOverText);




function start(){

    isGameOver = false;
    score = 0;


    graphics.clear();
    snake = [
        new PIXI.Point(startX, startY),  
        new PIXI.Point(startX, startY-1),
        new PIXI.Point(startX, startY-2)
    ],
    cv = new PIXI.Point(), //current vector 
    nv = new PIXI.Point(0, 1); //next vector
    foods = [addFood()];
    foodsGraphics.clear();
    drawFood(foods[0]);

    scoreText.text = 'Score : ' + (score);

    gameOverText.visible = false;
    gameOverText.text = 'GAME\nOVER!';


}



window.addEventListener("keydown", event => {
    switch (event.keyCode) {
        case 37:
            if (cv.x === 0) nv.set(-1, 0); break; //move left
        case 38:
            if (cv.y === 0) nv.set(0, -1); break; //move up
        case 39:
            if (cv.x === 0) nv.set(1, 0); break; //move right
        case 40:
            if (cv.y === 0) nv.set(0, 1); break; //move down

        default : break;
    }

});



window.addEventListener('mousedown', ()=>{
    if (isGameOver){
        start();
        isGameOver = false;
    }

})



app.ticker.add(() => {

    if (isGameOver) return;

    const currentTime = performance.now();

    if ( currentTime >= lastTime + 100){
        lastTime = currentTime;

        cv.copyFrom(nv);
        
        let nextHeadPosition = new PIXI.Point(
            snake[0].x +cv.x,
            snake[0].y +cv.y
        );
        let {x, y} = nextHeadPosition;
    
        if (x < 0) nextHeadPosition.x = N - 1;
        if (x >= N) nextHeadPosition.x = x % N;

        if (y < 0) nextHeadPosition.y = M - 1;
        if (y >= M) nextHeadPosition.y = y % M;



        const foodColidedIndex = foods.findIndex( f => nextHeadPosition.equals(f)),
              isFoodColision =  foodColidedIndex > -1,
              isTailColision =  snake.findIndex( f => nextHeadPosition.equals(f)) !== -1;

        if (isTailColision) {
            isGameOver = true;
            gameOverText.visible = true;    
            return;
        }

        if (isFoodColision){
            //update score and text
            scoreText.text = 'Score : ' + (++score);


            foods.splice(foodColidedIndex, 1, addFood());
            snake.unshift(nextHeadPosition);

            foodsGraphics.clear();
            for (let i = 0; i<foods.length; i++){
                drawFood(foods[i]);
            }

        } else {

            for (let i = snake.length-1; i > 0; i--){
                snake[i].copyFrom(snake[i-1]);
            }

            snake[0].copyFrom(nextHeadPosition);

        }

       

        //draw snake trail
        graphics.clear();
        for (let i = 0; i<snake.length; i++){
            drawSnakeRect(snake[i]);
        }

    }
    

});



    
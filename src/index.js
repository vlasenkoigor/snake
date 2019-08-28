import * as PIXI from 'pixi.js'


const scale = 25,
    N  = 32,
    M = 24;

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


const addFood = ()=>new PIXI.Point(getRandomInt(0, N-1), getRandomInt(0, M-1))

const getRandomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
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

const snake = [
    new PIXI.Point(startX, startY),  
    new PIXI.Point(startX, startY-1),
    new PIXI.Point(startX, startY-2)
],
    v = new PIXI.Point(0, 1),
    foods = [addFood()];
    drawFood(foods[0]);



let scoreText = new PIXI.Text('Score : 0', 
    {
        fontFamily : 'Orbitron', 
        fill : 0xffffff,
        align : 'center',
        wordWrap : true,
        wordWrapWidth : app.view.width
    })

app.stage.addChild(scoreText);
scoreText.x = app.view.width / 2;
scoreText.y = scoreText.height;
scoreText.anchor.set(0.5);


window.addEventListener("keydown", event => {
    switch (event.keyCode) {
        case 37:
            v.set(-1, 0); break; //move left
        case 38:
            v.set(0, -1); break; //move up
        case 39:
            v.set(1, 0); break; //move right
        case 40:
            v.set(0, 1); break; //move down

        default : break;
    }

});



app.ticker.add(() => {


    const currentTime = performance.now();

    if ( currentTime >= lastTime + 100){
        lastTime = currentTime;

        


        let nextHeadPosition = new PIXI.Point(
            snake[0].x +v.x,
            snake[0].y +v.y
        );

        const colidedIndex = foods.findIndex( f => nextHeadPosition.equals(f)),
              isColision =  colidedIndex > -1; 

        if (isColision){

            foods.splice(colidedIndex, 1, addFood());
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



    
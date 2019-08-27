import * as PIXI from 'pixi.js'

const app = new PIXI.Application({
    width: 800, height: 600, backgroundColor: 0x1099bb, resolution: 1,
});
document.body.appendChild(app.view);

// Rectangle
const graphics = new PIXI.Graphics();

const scale = 25,
    snake = [{x : 3, y : 3}],
    v = new PIXI.Point(0, 1);

app.stage.addChild(graphics);

// Listen for animate update
app.ticker.speed = 1;
app.ticker.minFPS  = 4;
app.ticker.maxFPS   = 4;

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

    //update snake tail position
    snake[0].x +=v.x;
    snake[0].y +=v.y;


    //draw snake with head and tail
    graphics.clear();

    graphics.beginFill(0xDE3249);
    graphics.drawRect(snake[0].x * scale, snake[0].y * scale, scale, scale);
    graphics.endFill();

});

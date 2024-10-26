import Loader from "./modules/loader.js";
import Keyboard from "./modules/keyboard.js";
import Player from "./modules/player.js";
import Apple from "./modules/fruit.js";
import scoreTraker from "./modules/score.js";


CanvasRenderingContext2D.prototype.clear = function(){
    this.clearRect(0, 0, this.canvas.width, this.canvas.height);
}

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const devicePixelRatio = window.devicePixelRatio || 1;

canvas.width = canvas.clientWidth * devicePixelRatio;
canvas.height = canvas.clientHeight * devicePixelRatio;
ctx.scale(devicePixelRatio, devicePixelRatio);

let player = null;
const FRUITS = [];
const SCORE = new scoreTraker(ctx);

Loader.asset("playerGraphics", "./images/player.png");
Loader.asset("apple", "./images/apple.png");
Loader.asset("grapes", "./images/grapes.png");
Loader.asset("strawbary", "./images/strawbary.png");
Loader.asset("charries", "./images/charries.png");


Loader.onload = () =>{
    const playerGraphics = Loader.get("playerGraphics");
    player = new Player(100, 100, 50, 50, playerGraphics, ctx);

    const [fruit1, fruit2] = [getRandomFruit(), getRandomFruit()];
    FRUITS.push(
        new Apple(ctx, Loader.get(fruit1)),
        new Apple(ctx, Loader.get(fruit2))
    ); // 2 fruits as default

    Keyboard.record();
    mainloop();
}

Loader.onerror = err => console.log(err);

Loader.loadAll();



Keyboard.on("KeyW", () =>{
    player.move(0, -5);

});
Keyboard.on("KeyS", () =>{
    player.move(0, 5);
});
Keyboard.on("KeyD", () =>{
    player.move(5, 0);
});

Keyboard.on("KeyA", () =>{
    player.move(-5, 0);
});

Keyboard.on("KeyR", () =>{
    player.home();
});

function collisionHandler(){
    const [playerX, playerY] = player.center();
    const radius = player.width < player.height ? player.width : player.height; // radius of collision circel
    FRUITS.forEach((fruit, index) =>{
        const distance = Math.sqrt((playerX - fruit.X) ** 2 + (playerY - fruit.Y) ** 2);
        if(distance < radius){
            delete FRUITS[index];
            const newFruit = getRandomFruit();
            FRUITS.push(new Apple(ctx, Loader.get(newFruit)));
            SCORE.increase();
        }
    });
}

function renderFruits(){
    FRUITS.forEach(fruit =>{
        fruit.render();
    });
}

function getRandomFruit(){
    return  ["apple", "strawbary", "grapes", "charries"][Math.floor(Math.random() * 4)];
}

function mainloop(){
    ctx.clear();
    collisionHandler();
    renderFruits();
    player.render();
    SCORE.render();
    Keyboard.apply();
    requestAnimationFrame(mainloop);
}






















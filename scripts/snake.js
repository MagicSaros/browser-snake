let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
let fieldWidth = canvas.width;
let fieldHeight = canvas.height;
let canfi = new CanFi(canvas);

class Segment {
    constructor(x, y, size, color) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.color = color;
    }

    draw() {
        let oldColor = ctx.fillStyle;
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x - this.size / 2, this.y - this.size / 2, this.size, this.size);
        ctx.fillStyle = oldColor;
    }

    isHit(x, y) {
        if (this.x == x && this.y == y) {
            return true;
        } else {
            return false;
        }
    }
}

class Snake {
    constructor(x, y, length, size, color, speed) {
        this.x = x;
        this.y = y;
        this.length = length;
        this.size = size;        
        this.color = color;
        this.speed = speed;
        this.xSpeed = speed;
        this.ySpeed = 0;
        this.body = [];
        for (let i = 0; i < this.length; i++) {
            this.body.push(new Segment(this.x - i * this.size, this.y, this.size, this.color));
        }
    }

    draw() {
        this.body.forEach(segment => segment.draw());
    }

    move() {
        this.x += this.xSpeed * this.size;
        this.y -= this.ySpeed * this.size;
        this.body.unshift(new Segment(this.x, this.y, this.size, this.color));
        this.body.pop();
    }

    changeDirection(direction) {
        switch(direction) {
            case 'up':
                this.xSpeed = 0;
                this.ySpeed = this.speed;
                break;
            case 'down':
                this.xSpeed = 0;
                this.ySpeed = -this.speed;
                break;
            case 'left':
                this.xSpeed = -this.speed;
                this.ySpeed = 0;
                break;
            case 'right':
                this.xSpeed = this.speed;
                this.ySpeed = 0;
                break;
        }
    }

    checkFood(food) {
        if (food.isHit(this.x, this.y)) {
            return true;
        } else {
            return false;
        }
    }
    
    eatFood(food) {
            let bodyLast = this.body[this.body.length - 1];
            this.body.push(new Segment(bodyLast.x - this.xSpeed, bodyLast.y + this.ySpeed, this.size, this.color));
    }

    checkFoodCollision(food) {
        return this.body.some(segment => food.isHit(segment.x, segment.y));
    }
    
    checkSelfCollision(segment) {
        return this.body.slice(3).some(segment => segment.isHit(this.x, this.y));        
    }

    checkWallCollision() {
        if (this.x <= 0 || this.x >= fieldWidth || this.y <= 0 || this.y >= fieldHeight) {
            return true;
        } else {
            return false;
        }
    }
}

class Food extends Segment {
    constructor(x, y, size, color) {
        super(x, y, size, color);
    }

    draw() {
        let oldColor = ctx.fillStyle;
        ctx.fillStyle = this.color;
        canfi.fillCircle(this.x, this.y, this.size / 2);
        ctx.fillStyle = oldColor;
    }
}

let snake = null;
let size = 20;
let snakeStartX = fieldWidth / 2;
let snakeStartY = fieldHeight / 2;
let snakeLength = 5;
let snakeColor = 'Red';
let snakeSpeed = 1;
let food = null;
let foodX = 0;
let foodY = 0;
let foodColor = 'Green';
let score = 0;
let gameID = null;
let gameRunning = false;
let key = 37;
let prevKey = 39;

const keyActions = {
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down'
};

let checkOppositeKey = (key, prevKey) => {
    if (Math.abs(key - prevKey) == 2) {
        return true;
    } else {
        return false;
    }
};

$('body').keydown(event => {
    key = event.keyCode;
    if (!checkOppositeKey(key, prevKey)) {
        switch(key) {
            case 37:
            case 38:
            case 39:
            case 40:
            snake.changeDirection(keyActions[key]);
            break;
        };
        prevKey = key;
    }
});

$('.button-start').click(() => {
    snake = new Snake(snakeStartX, snakeStartY, snakeLength, size, snakeColor, snakeSpeed);
    snake.draw();
    
    do {
        foodY = Math.floor(Math.random() * (Math.floor(fieldHeight / size) - 2) + 1) * size;
        foodX = Math.floor(Math.random() * (Math.floor(fieldWidth / size) - 2) + 1) * size;
        food = new Food(foodX, foodY, size, foodColor);
    } while (snake.checkFoodCollision(food));
    food.draw();

    if (!gameRunning) {
        score = 0;
        $('.score-points').html(score);
        $('.gameover').addClass('hidden');
        gameRunning = true;
        gameID = setInterval(() => {
            ctx.clearRect(0, 0, fieldWidth, fieldHeight);
            snake.move();
            if (snake.checkSelfCollision() || snake.checkWallCollision()) {
                clearInterval(gameID);
                gameRunning = false;
                $('.gameover').removeClass('hidden');
            } 
            if (snake.checkFood(food)) {
                snake.eatFood(food);
                score++;
                $('.score-points').html(score);
                do {
                    foodY = Math.floor(Math.random() * (Math.floor(fieldHeight / size) - 2) + 1) * size;
                    foodX = Math.floor(Math.random() * (Math.floor(fieldWidth / size) - 2) + 1) * size;
                    food = new Food(foodX, foodY, size, foodColor);
                } while (snake.checkFoodCollision(food));
            }
            food.draw();
            snake.draw();
        }, 100);
    }
});
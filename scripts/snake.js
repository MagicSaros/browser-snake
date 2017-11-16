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
        this.xSpeed = 0;
        this.ySpeed = 0;
        this.direction = null;
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
        if (!this.checkDirectionCollision(direction)) {
            this.direction = direction;
            switch(this.direction) {
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
    }

    checkDirectionCollision(newDirection) {
        if (this.direction === 'up' && newDirection === 'down') {
            return true;
        } else if (this.direction === 'down' && newDirection === 'up') {
            return true;
        } else if (this.direction === 'left' && newDirection === 'right') {
            return true;
        } else if (this.direction === 'right' && newDirection === 'left') {
            return true;
        } else {
            return false;
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

let snake1 = null;
let snake2 = null;
let size = 20;
let snake1StartX = fieldWidth / 2;
let snake1StartY = fieldHeight / 2;
let snake2StartX = fieldWidth / 2 + size * 2;
let snake2StartY = fieldHeight / 2 + size * 2;
let snake1Length = 5;
let snake2Length = 5;
let snake1Color = 'Red';
let snake2Color = 'Blue';
let snake1Speed = 1;
let snake2Speed = 1;
let snake1Direction = 'right';
let snake2Direction = 'right';
let food = null;
let foodX = null;
let foodY = null;
let foodColor = 'Green';
let score1 = null;
let score2 = null;
let gameID = null;
let gameRunning = false;

const keyActions = {
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down', 
    65: 'left',
    87: 'up',
    68: 'right',
    83: 'down'
};

$('body').keydown(event => {
    let key = event.keyCode;
        switch(key) {
            case 37:
            case 38:
            case 39:
            case 40:
            snake1.changeDirection(keyActions[key]);
            break;
            case 65: // A
            case 87: // W
            case 68: // D
            case 83: // S
            snake2.changeDirection(keyActions[key]);
            break;
        };
}); 

$('.button-start').click(() => {
    snake1 = new Snake(snake1StartX, snake1StartY, snake1Length, size, snake1Color, snake1Speed, snake1Direction);
    snake2 = new Snake(snake2StartX, snake2StartY, snake2Length, size, snake2Color, snake2Speed, snake2Direction);
    snake1.draw();
    snake2.draw();
    snake1.changeDirection(snake1Direction);
    snake2.changeDirection(snake2Direction);
    
    do {
        foodY = Math.floor(Math.random() * (Math.floor(fieldHeight / size) - 2) + 1) * size;
        foodX = Math.floor(Math.random() * (Math.floor(fieldWidth / size) - 2) + 1) * size;
        food = new Food(foodX, foodY, size, foodColor);
    } while (snake1.checkFoodCollision(food) || snake2.checkFoodCollision(food));
    food.draw();

    if (!gameRunning) {
        score1 = 0;
        $('.score-points').html(score1);
        $('.gameover').addClass('hidden');
        gameRunning = true;
        gameID = setInterval(() => {
            ctx.clearRect(0, 0, fieldWidth, fieldHeight);
            snake1.move();
            snake2.move();
            if ((snake1.checkSelfCollision() || snake1.checkWallCollision()) || (snake2.checkSelfCollision() || snake2.checkWallCollision())) {
                clearInterval(gameID);
                gameRunning = false;
                $('.gameover').removeClass('hidden');
            } 
            if (snake1.checkFood(food)) {
                snake1.eatFood(food);
                score1++;
                $('.score-points').html(score1);
                do {
                    foodY = Math.floor(Math.random() * (Math.floor(fieldHeight / size) - 2) + 1) * size;
                    foodX = Math.floor(Math.random() * (Math.floor(fieldWidth / size) - 2) + 1) * size;
                    food = new Food(foodX, foodY, size, foodColor);
                } while (snake1.checkFoodCollision(food));
            } else if (snake2.checkFood(food)) {
                snake2.eatFood(food);
                score1++;
                $('.score-points').html(score1);
                do {
                    foodY = Math.floor(Math.random() * (Math.floor(fieldHeight / size) - 2) + 1) * size;
                    foodX = Math.floor(Math.random() * (Math.floor(fieldWidth / size) - 2) + 1) * size;
                    food = new Food(foodX, foodY, size, foodColor);
                } while (snake2.checkFoodCollision(food));
            }
            food.draw();
            snake1.draw();
            snake2.draw();
        }, 100);
    }
});
const GameSettings = {
    SNAKE_SPEED: 250,
}

const gameState = {
    scores: 0,
    direction: `right`,
    isStep: false
}

const body = document.querySelector(`body`);

const createNewNode = (nodeName, nodeClassList) => {
    const item = document.createElement(nodeName);
    item.className = nodeClassList;
    return item;
}

const field = createNewNode(`div`, `field`);

for (let i = 0; i < 100; i++) {
    const cell = createNewNode(`div`, `cell`);
    field.appendChild(cell);
}

const scoresBlock = createNewNode(`div`, `scores`);
scoresBlock.textContent = `Scores: ${gameState.scores}`;

body.appendChild(field);
body.appendChild(scoresBlock);

const grid = document.querySelectorAll(`.cell`);

let x = 1,
    y = 10;

for (let i = 0; i < grid.length; i++) {
    if (x > 10) {
        x = 1;
        y--;
    }
    grid[i].setAttribute(`data-posX`, x);
    grid[i].setAttribute(`data-posY`, y);
    x++;
}

const getSnakeStartCoords = (max, minX, minY) => {
    const posX = Math.floor(Math.random() * (max - minX + 1) + minX);
    const posY = Math.floor(Math.random() * (max - minY + 1) + minY);
    return [posX, posY];
}
const startCoords = getSnakeStartCoords(10, 3 ,1);
const snakeBody = [document.querySelector(`[data-posX="${startCoords[0]}"][data-posY="${startCoords[1]}"]`),
                   document.querySelector(`[data-posX="${startCoords[0] - 1}"][data-posY="${startCoords[1]}"]`),
                   document.querySelector(`[data-posX="${startCoords[0] - 2}"][data-posY="${startCoords[1]}"]`)];

for (let i = 0; i < snakeBody.length; i++) {
    snakeBody[i].classList.add(`snake-body`);
}
snakeBody[0].classList.add(`snake-head`);

let mouse;

const createMouse = () => {
    const getMouseCoords = (max, min) => {
        const posX = Math.floor(Math.random() * (max - min + 1) + min);
        const posY = Math.floor(Math.random() * (max - min + 1) + min);
        return [posX, posY];
    }
    const mouseCoords = getMouseCoords(10, 1);
    mouse = document.querySelector(`[data-posX="${mouseCoords[0]}"][data-posY="${mouseCoords[1]}"]`);

    if (mouse.classList.contains(`snake-body`)) {
        const getMouseCoords = (max, min) => {
            const posX = Math.floor(Math.random() * (max - min + 1) + min);
            const posY = Math.floor(Math.random() * (max - min + 1) + min);
            return [posX, posY];
        }
        const mouseCoords = getMouseCoords(10, 1);
        mouse = document.querySelector(`[data-posX="${mouseCoords[0]}"][data-posY="${mouseCoords[1]}"]`);
    }
    mouse.classList.add(`mouse`);
}
createMouse();

const move = () => {
    const snakeCoords = [+snakeBody[0].dataset.posx, +snakeBody[0].dataset.posy];
    snakeBody[0].classList.remove(`snake-head`);
    snakeBody[snakeBody.length - 1].classList.remove(`snake-body`);
    snakeBody.pop();

    switch (gameState.direction) {
        case `right`: 
            if (snakeCoords[0] < 10) {
                snakeBody.unshift(document.querySelector(`[data-posX="${snakeCoords[0] + 1}"][data-posY="${snakeCoords[1]}"]`));
            } else {
                snakeBody.unshift(document.querySelector(`[data-posX="${1}"][data-posY="${snakeCoords[1]}"]`));
            }
            break;
        case `left`: 
            if (snakeCoords[0] > 1) {
                snakeBody.unshift(document.querySelector(`[data-posX="${snakeCoords[0] - 1}"][data-posY="${snakeCoords[1]}"]`));
            } else {
                snakeBody.unshift(document.querySelector(`[data-posX="${10}"][data-posY="${snakeCoords[1]}"]`));
            }
            break;
        case `up`: 
            if (snakeCoords[1] < 10) {
                snakeBody.unshift(document.querySelector(`[data-posX="${snakeCoords[0]}"][data-posY="${snakeCoords[1] + 1}"]`));
            } else {
                snakeBody.unshift(document.querySelector(`[data-posX="${snakeCoords[0]}"][data-posY="${1}"]`));
            }
            break;
        case `down`: 
            if (snakeCoords[1] > 1) {
                snakeBody.unshift(document.querySelector(`[data-posX="${snakeCoords[0]}"][data-posY="${snakeCoords[1] - 1}"]`));
            } else {
                snakeBody.unshift(document.querySelector(`[data-posX="${snakeCoords[0]}"][data-posY="${10}"]`));
            }
            break;
    }

    if (snakeBody[0].dataset.posx === mouse.dataset.posx && snakeBody[0].dataset.posy === mouse.dataset.posy) {
        mouse.classList.remove(`mouse`);
        const x = +snakeBody[snakeBody.length - 1].dataset.posx;
        const y = +snakeBody[snakeBody.length - 1].dataset.posy;
        snakeBody.push(document.querySelector(`[data-posX="${x}"][data-posY="${y}"]`));
        createMouse();
        gameState.scores++;
        scoresBlock.textContent = `Scores: ${gameState.scores}`;
    }

    if (snakeBody[0].classList.contains(`snake-body`)) {
        clearInterval(interval);
        for (let i = 0; i < snakeBody.length; i++) {
            snakeBody[i].classList.add(`snake-body--game-over`);
        }
    }

    snakeBody[0].classList.add(`snake-head`);
    for (let i = 0; i < snakeBody.length; i++) {
        snakeBody[i].classList.add(`snake-body`);
    }

    gameState.isStep = true;
}

const interval = setInterval(move, GameSettings.SNAKE_SPEED);

window.addEventListener(`keydown`, (evt) => {
    if (gameState.isStep === true) {
        if (evt.key === `ArrowRight` && gameState.direction !== `left`) {
            gameState.direction = `right`;
            gameState.isStep = false;
        }
        else if (evt.key === `ArrowLeft` && gameState.direction !== `right`) {
            gameState.direction = `left`;
            gameState.isStep = false;
        }
        else if (evt.key === `ArrowUp` && gameState.direction !== `down`) {
            gameState.direction = `up`;
            gameState.isStep = false;
        }
        else if (evt.key === `ArrowDown` && gameState.direction !== `up`) {
            gameState.direction = `down`;
            gameState.isStep = false;
        }
    }
});

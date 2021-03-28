// initial state
let initialState = {
    canvas: [
        ['','','','','','','','','','','','','','','','','','','',''],
        ['','','','','','','','','','','','','','','','','','','',''],
        ['','','','','','','','','','','','','','','','','','','',''],
        ['','','','','','','','','','','','','','','','','','','',''],
        ['','','','','','','','','','','','','','','','','','','',''],
        ['','','','','','','','','','','','','','','','','','','',''],
        ['','','','','','','','','','','','','','','','','','','',''],
        ['','','','','','','','','','','','','','','','','','','',''],
        ['','','','','','','','','','','','','','','','','','','',''],
        ['','','','','','','','','','','','','','','','','','','',''],
        ['','','','','','','','','','','','','','','','','','','',''],
        ['','','','','','','','','','','','','','','','','','','',''],
        ['','','','','','','','','','','','','','','','','','','',''],
        ['','','','','','','','','','','','','','','','','','','',''],
        ['','','','','','','','','','','','','','','','','','','',''],
        ['','','','','','','','','','','','','','','','','','','',''],
        ['','','','','','','','','','','','','','','','','','','',''],
        ['','','','','','','','','','','','','','','','','','','',''],
        ['','','','','','','','','','','','','','','','','','','',''],
        ['','','','','','','','','','','','','','','','','','','','']
    ]
}

// initial snake
let snake = {
    body: [ [10, 2], [10, 3], [10, 4], [10, 5] ],
    nextDirection: [0, 1]
}

// initial score
let gameScore = 0

// list of highscores
let highscore = []

// builds the initial game state that starts the game
function buildInitialState(){
    $('#heading').text('SNAKE').css('color', 'white')
    gameScore = 0
    snake = {
        body: [ [10, 2], [10, 3], [10, 4], [10, 5] ],
        nextDirection: [0, 1]
    }

    renderState()
    buildSnake()
    updateScore()
    loadHighscore()
    displayHighscore()
    spawnFood()
}

// render the game space
function renderState(){
    const canvasElement = $('#canvas')

    canvasElement.empty()

    initialState.canvas.forEach(function(row, rowIndex){
        row.forEach(function(column, columnIndex){
            const segmentElement = $(`<div class="segment" data-x=${rowIndex} data-y=${columnIndex}></div>`)
            
            canvasElement.append(segmentElement)
        })
    })
}

// adds one to the current score and changes the current score on the page
// if the current score is also the best score, update the best score on page as well
function updateScore(){
    $('#current-score-value').text(gameScore)

    if (gameScore > Number($('#best-score-value').text())){
        $('#best-score-value').text(gameScore)
    }
}

// display the highscores on the highscore list
function displayHighscore(){
    highscore.forEach(function(score, scoreIndex){
        $(`#highscore${scoreIndex + 1}`).text(`${score}`)
        $(`#highscore${scoreIndex + 1}`).css('text-align', 'right')
    })
}

// load highscores from localStorage
function loadHighscore(){
    highscore = localStorage.getItem('highscore')
    ? JSON.parse(localStorage.getItem('highscore'))
    : ['', '', '', '', '']

    displayHighscore()
}

// save highscores to localStorage
function saveHighscore(){
    highscore.push(gameScore)
    highscore.sort(function(a,b){
        return b - a
    })
    if (highscore.length > 5){
        highscore.splice(5)
    }

    localStorage.setItem('highscore', JSON.stringify(highscore))
}

// creates a snake from its body coordinates
function buildSnake(){
    $('.segment').removeClass('snake')

    snake.body.forEach(function(coordinates){
        const coordX = coordinates[0]
        const coordY = coordinates[1]
        const segmentElement = $(`[data-x="${coordX}"][data-y="${coordY}"]`)
        
        segmentElement.addClass('snake')
    })
}

// every tick the snake removes its tail and adds on to its head
// check if the newly added segment causes a gameover
function updateSnake(){
    snake.body.shift()

    const newSegmentX = snake.body[snake.body.length-1][0] + snake.nextDirection[0]
    const newSegmentY = snake.body[snake.body.length-1][1] + snake.nextDirection[1]

    snake.body.push([newSegmentX, newSegmentY])

    checkGameover(newSegmentX, newSegmentY)
}

// if it eats food, add to head without removing tail and update the score
function growSnake(){
    const newSegmentX = snake.body[snake.body.length-1][0] + snake.nextDirection[0]
    const newSegmentY = snake.body[snake.body.length-1][1] + snake.nextDirection[1]

    snake.body.push([newSegmentX, newSegmentY])

    gameScore += 1
    updateScore()
}

// generate a random integer
function randomInt(min, max){
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min + 1) + min)
}

// picks a random coordinate, checks if occupied by snake body, 
// if not occupied, spawn food, else pick a new random coordinate
function spawnFood(){
    let foodX = randomInt(0, 19)
    let foodY = randomInt(0, 19)
    let foodTile = $(`[data-x="${foodX}"][data-y="${foodY}"]`)
    
    if (foodTile.hasClass('snake')){
        spawnFood()
    } else{
        $('.segment').removeClass('food')
        foodTile.addClass('food')
    }
}

// check if the head of snake has entered a space with food
function checkFood(){
    const checkX = snake.body[snake.body.length-1][0]
    const checkY = snake.body[snake.body.length-1][1]

    return $(`[data-x="${checkX}"][data-y="${checkY}"]`).hasClass('food')
}

// check if head of snake has collided with its body
function selfCollide(coordX, coordY){
    const segmentElement = $(`[data-x="${coordX}"][data-y="${coordY}"]`)
    return segmentElement.hasClass('snake')
}

// check if head of snake has left the bounds of the game
function outOfBounds(coordX, coordY){
    return coordX < 0 || coordX > 19 || coordY < 0 || coordY > 19
}

// check if a gameover has happened
// if it did, reset the snake and score
function checkGameover(newSegmentX, newSegmentY){
    if (selfCollide(newSegmentX, newSegmentY) || outOfBounds(newSegmentX, newSegmentY)){
        gameover()

        gameScore = 0
        snake = {
            body: [ [10, 2], [10, 3], [10, 4], [10, 5] ],
            nextDirection: [0, 1]
        }
    }
}

// if gameover happens, stop the game, save highscores, and show end screen
function gameover(){
    clearInterval(snakeGame)
    saveHighscore()
    displayHighscore()

    snakeGame = false

    $('.snake').addClass('dead')

    $('#heading').text('GAME OVER').css('color', 'red')
}

// every tick updates the snake
// if food is eaten, grow the snake and spawn a new food
function tick(){
    if(checkFood()){
        growSnake()
        spawnFood()
    } else{
        updateSnake()
    }
    if (snakeGame !== false){
        buildSnake()
    }
}

// listener for keydown events, changes direction of the snake when arrow keys pressed
// does not allow the snake to change direction into itself
$(window).on('keydown', function (event){
    if (event.key === "ArrowUp" && snake.nextDirection[0] !== 1 && snake.nextDirection[1] !== 0){
        snake.nextDirection = [-1, 0]
    } else if(event.key ==="ArrowDown" && snake.nextDirection[0] !== -1 && snake.nextDirection[1] !== 0){
        snake.nextDirection = [1, 0]
    } else if(event.key ==="ArrowLeft" && snake.nextDirection[0] !== 0 && snake.nextDirection[1] !== 1){
        snake.nextDirection = [0, -1]
    } else if(event.key ==="ArrowRight" && snake.nextDirection[0] !== 0 && snake.nextDirection[1] !== -1){
        snake.nextDirection = [0, 1]
    }
})

// tick interval variable declaration
let snakeGame;

// the tick interval for easy game
function startGame(){
    clearInterval(snakeGame)
    snakeGame = setInterval(tick, 250)
}

// build the initial state and start the easy game
$('#new-game-button').click(function(){
    buildInitialState()
    startGame()
})

// the tick interval for hard game
function startHardGame(){
    clearInterval(snakeGame)
    snakeGame = setInterval(tick, 100)
}

// build the initial state and start the hard game
$('#hard-game-button').click(function(){
    buildInitialState()
    startHardGame()
})

// set up game page before game has started
renderState()
buildSnake()
updateScore()
loadHighscore()
displayHighscore()
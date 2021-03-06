var canvas = "";
var canvasContext = "";

var ballX = 50;
var ballY = 50;
var ballSpeedX = 10;
var ballSpeedY = 4;

var player1Score = 0;
var player2Score = 0;
const WINNING_SCORE = 5;

var showingWinScreen = false;

var paddle1Y = 250;
var paddle2Y = 250;
const PADDLE_HEIGHT = 100;
const PADDLE_THICKNESS = 10;



function calculateMousePos(evt) {
    var rect = canvas.getBoundingClientRect(); 
    var root = document.documentElement;
    var mouseX = evt.clientX - rect.left - root.scrollLeft;
    var mouseY = evt.clientY - rect.top - root.scrollTop;
    return {
        x: mouseX,
        y: mouseY,
    };
}

function handleMouseClick(evt) {
    if (showingWinScreen) {
        player1Score = 0;
        player2Score = 0;
        showingWinScreen = false;
    }
}

window.onload = function () {
    canvas = document.getElementById("gameCanvas");
    canvasContext = canvas.getContext("2d");
    canvasContext.font = "20px Arial";

    var framesPerSecond = 30;
    setInterval(function () {

        moveEverything();
        drawEverything();
    }, 1000 / framesPerSecond);

    canvas.addEventListener("mousedown", handleMouseClick);

    canvas.addEventListener("mousemove",
        function (evt) {
            var mousePos = calculateMousePos(evt);
            paddle1Y = mousePos.y - (PADDLE_HEIGHT / 2);

        });
}

function ballReset() {

    if (player1Score >= WINNING_SCORE || player2Score >= WINNING_SCORE) {
        showingWinScreen = true;
    }

    ballSpeedX = - ballSpeedX;
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
}

function computerMovement() {

    var paddle2YCenter = paddle2Y + (PADDLE_HEIGHT / 2);

    if (paddle2YCenter < ballY - 35) {
        paddle2Y += 5;
    } else if (paddle2YCenter > ballY + 35) {
        paddle2Y -= 5;
    }
}

function moveEverything() {

    if (showingWinScreen) {
        return
    }
    computerMovement();

    ballX += ballSpeedX; //everytime function drawEverything is called, like above window.onload, 20 will be added.
    /* ballSpeedX = ballSpeedX+1; if you want to speed up the element*/

    if (ballX < 0) {
        // ballSpeedX = -ballSpeedX;
        if (ballY > paddle1Y && ballY < paddle1Y + PADDLE_HEIGHT) {
            ballSpeedX = -ballSpeedX;

            var deltaY = ballY - (paddle1Y + PADDLE_HEIGHT / 2)
            ballSpeedY = deltaY * 0.35;

        } else {
            player2Score++; //must be BEFORE ballReset()
            ballReset();

        }

    } else if (ballX > canvas.width) {
        if (ballY > paddle2Y && ballY < paddle2Y + PADDLE_HEIGHT) {
            ballSpeedX = -ballSpeedX;

            var deltaY = ballY - (paddle2Y + PADDLE_HEIGHT / 2)
            ballSpeedY = deltaY * 0.35;

        } else {
            player1Score++; //must be BEFORE ballReset()
            ballReset();

        }
    }


    ballY += ballSpeedY;
    if (ballY < 0) {
        ballSpeedY = -ballSpeedY;
        ;
    } else if (ballY > canvas.height) {
        ballSpeedY = -ballSpeedY;
    }
}


function drawNet() {
    for (var i = 0; i < canvas.height; i += 40) {
        colorRect(canvas.width / 2 - 1, i, 2, 20, "white")
    }
}

function drawEverything() {
    //next line blanks out the screen with black
    colorRect(0, 0, canvas.width, canvas.height, "#023B0D"); /* 0, 0 margin https://www.screencast.com/t/XElHZACM8xJ */

    if (showingWinScreen) {
        canvasContext.fillStyle = "white";
        canvasContext.textAlign = "center";

        if (player1Score >= WINNING_SCORE) {
            canvasContext.fillText("Congrats! You won with the computer:)", canvas.width / 2, canvas.height / 2 - 50);
        }
        else if (player2Score >= WINNING_SCORE) {
            canvasContext.fillText("Computer won :(", canvas.width / 2, canvas.height / 2 - 50);
        }
        canvasContext.fillText("Click to play again!", canvas.width / 2, canvas.height / 2 + 50);
        return;
    }

    drawNet();

    //this is left player paddle
    colorRect(0, paddle1Y, PADDLE_THICKNESS, PADDLE_HEIGHT, "white");

    //this is right player paddle
    colorRect(canvas.width - PADDLE_THICKNESS, paddle2Y, PADDLE_THICKNESS, PADDLE_HEIGHT, "white");

    //nex line draws the ball
    colorCirle(ballX, ballY, 10, "white");

    canvasContext.fillText(player1Score, 100, 100);
    canvasContext.fillText(player2Score, canvas.width - 100, 100)


}

function colorCirle(centerX, centerY, radius, drawColor) {
    canvasContext.fillStyle = drawColor;
    canvasContext.beginPath();
    canvasContext.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
    canvasContext.fill();
}

function colorRect(leftX, topY, width, height, drawColor) {
    canvasContext.fillStyle = drawColor;
    canvasContext.fillRect(leftX, topY, width, height, drawColor);
}

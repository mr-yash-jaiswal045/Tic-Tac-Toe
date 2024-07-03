// Wait for the DOM to fully load before executing the code
document.addEventListener("DOMContentLoaded", () => {
    // Get references to the game elements
    let boxes = document.querySelectorAll(".box");
    let resetBtn = document.querySelector("#reset-btn");
    let newGameBtn = document.querySelector("#new-btn");
    let msgContainer = document.querySelector(".msg-container");
    let msg = document.querySelector("#msg");

    let turnUser = true; // Track whether it's the user's turn
    let count = 0; // Count the number of moves to check for draw

    // Define winning patterns
    const winPatterns = [
        [0, 1, 2],
        [0, 3, 6],
        [0, 4, 8],
        [1, 4, 7],
        [2, 5, 8],
        [2, 4, 6],
        [3, 4, 5],
        [6, 7, 8],
    ];

    // Function to reset the game
    const resetGame = () => {
        turnUser = true; // Reset turn to user
        count = 0; // Reset move count
        enableBoxes(); // Enable all boxes
        msgContainer.classList.remove("show"); // Hide the message container
    };

    // Add event listeners to each box for user move
    boxes.forEach((box, index) => {
        box.addEventListener("click", () => {
            if (turnUser) {
                box.innerText = "X"; // Mark the box with 'X'
                turnUser = false; // Switch turn to computer
                count++; // Increment move count
                box.disabled = true; // Disable the box
                let isWinner = checkWinner("X"); // Check if user won
                if (isWinner) {
                    showWinner("X"); // Show user as winner
                } else if (count === 9) {
                    gameDraw(); // Check for draw
                } else {
                    setTimeout(computerMove, 500); // Computer makes a move after a delay
                }
            }
        });
    });

    // Function for computer's move
    const computerMove = () => {
        let moveMade = false;

        // Try to win
        moveMade = makeStrategicMove("O");
        if (!moveMade) {
            // Try to block user's win
            moveMade = makeStrategicMove("X");
        }
        if (!moveMade) {
            // Choose a random empty box
            let emptyBoxes = [];
            boxes.forEach((box, index) => {
                if (box.innerText === "") {
                    emptyBoxes.push(index);
                }
            });

            if (emptyBoxes.length > 0) {
                let randomIndex = emptyBoxes[Math.floor(Math.random() * emptyBoxes.length)];
                boxes[randomIndex].innerText = "O"; // Mark the box with 'O'
                boxes[randomIndex].disabled = true; // Disable the box
                count++; // Increment move count
                let isWinner = checkWinner("O"); // Check if computer won
                if (isWinner) {
                    showWinner("O"); // Show computer as winner
                    return;
                } else if (count === 9) {
                    gameDraw(); // Check for draw
                    return;
                }
            }
        }
        turnUser = true; // Switch turn back to user
    };

    // Function to make a strategic move (either win or block)
    const makeStrategicMove = (symbol) => {
        for (let pattern of winPatterns) {
            let [a, b, c] = pattern;
            if (boxes[a].innerText === symbol && boxes[b].innerText === symbol && boxes[c].innerText === "") {
                boxes[c].innerText = "O"; // Mark the box with 'O'
                boxes[c].disabled = true; // Disable the box
                count++; // Increment move count
                let isWinner = checkWinner("O"); // Check if computer won
                if (isWinner) {
                    showWinner("O"); // Show computer as winner
                    return true;
                }
                return true;
            } else if (boxes[a].innerText === symbol && boxes[c].innerText === symbol && boxes[b].innerText === "") {
                boxes[b].innerText = "O"; // Mark the box with 'O'
                boxes[b].disabled = true; // Disable the box
                count++; // Increment move count
                let isWinner = checkWinner("O"); // Check if computer won
                if (isWinner) {
                    showWinner("O"); // Show computer as winner
                    return true;
                }
                return true;
            } else if (boxes[b].innerText === symbol && boxes[c].innerText === symbol && boxes[a].innerText === "") {
                boxes[a].innerText = "O"; // Mark the box with 'O'
                boxes[a].disabled = true; // Disable the box
                count++; // Increment move count
                let isWinner = checkWinner("O"); // Check if computer won
                if (isWinner) {
                    showWinner("O"); // Show computer as winner
                    return true;
                }
                return true;
            }
        }
        return false;
    };

    // Function to handle a draw
    const gameDraw = () => {
        msg.innerText = `Game was a Draw.`; // Set draw message
        msgContainer.classList.add("show"); // Show the message container
        disableBoxes(); // Disable all boxes
    };

    // Function to disable all boxes
    const disableBoxes = () => {
        boxes.forEach(box => box.disabled = true);
    };

    // Function to enable all boxes
    const enableBoxes = () => {
        boxes.forEach(box => {
            box.disabled = false;
            box.innerText = "";
        });
    };

    // Function to show the winner
    const showWinner = (winner) => {
        msg.innerText = `Congratulations, Winner is ${winner}`; // Set winner message
        msgContainer.classList.add("show"); // Show the message container
        disableBoxes(); // Disable all boxes
    };

    // Function to check if there's a winner
    const checkWinner = (symbol) => {
        return winPatterns.some(pattern => {
            return pattern.every(index => boxes[index].innerText === symbol);
        });
    };

    // Add event listeners to reset and new game buttons
    newGameBtn.addEventListener("click", resetGame);
    resetBtn.addEventListener("click", resetGame);
});

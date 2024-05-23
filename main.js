function gameBoard(){
    const rows = 3;
    const columns = 3;
    const board = [];

    // Creating the 2D matrix for the board[i][j]
    for (let i = 0; i < rows; i++){
        board[i] = [];
        for (let j = 0; j < columns; j++) {
            board[i].push(Cell());
        }
    }

    const getBoard = () => board;

    // Choosing a cell and adding the corresponding value to it (1 or 2)
    function chooseCell(row, column, player){
        // Check if its empty cell
        if (board[row][column].getValue() !== 0){
            console.log("occupied");
            return 1;
        } 
        board[row][column].addValue(player);
    };

    function printBoard(){
        const boardCells = board.map((row) => row.map((cell) => cell.getValue()));
        console.log(boardCells);
    };

    return {getBoard, chooseCell, printBoard};
}

// This is the cell with an initial value of 0 it is added to the board's cells.
function Cell(){
    let value = 0;
    
    const addValue = (player) => {
        value = player;
   };

    const getValue = () => value;

    return {addValue, getValue};
}

function gameController(playerOneName = "Player One", playerTwoName = "Player Two"){
    
    const board = gameBoard();

    const getBoard = () => board.getBoard();
    const players = [
        {
            name: playerOneName,
            value: 1,
        },
        {
            name: playerTwoName,
            value: 2,
        },

    ];

    // Later I can add a randomized active player
    let activePlayer = players[0];

    function switchPlayerTurn(){
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    }

    const getActivePlayer = () => activePlayer;

    function printNewRound(){
        board.printBoard();
        console.log(`${getActivePlayer().name}'s turn.`);
    }

    function playRound(row, column){
        // To ensure that there are no actions if a player click on an occupied tile.
        let returnValue = board.chooseCell(row,column,getActivePlayer().value);
        if (returnValue === 1) return;

        // Check if it is a win
        //TO DO...
        checkWin(players[0]);

        switchPlayerTurn();
        printNewRound();
    }

    function checkWin(player){
        const checkArray = checkPlayerValues(player);
        console.log(checkArray);

        // I might eliminate the magic number 3
        if (checkArray.length < 3) return false;
        // Check Horizontally
        if (checkHorizontally(checkArray)) return true;
        // Check Vertically
        if (checkVertically(checkArray)) return true;
        // Check Diagonally
        if (checkDiagonally(checkArray)) return true;

        return false;
        
    }

    function checkPlayerValues(player){
        const checkBoard = getBoard();
        const playerPositions = [];

        checkBoard.forEach((row, i) => {
            row.forEach((cell, j) => {
                if (cell.getValue() === player.value) {
                    playerPositions.push([i, j]);
                }
            });
        });

        return playerPositions;
    }

    function checkHorizontally(checkArray){
        // Step1 - Check if the first elements are the same
        const iIndex = checkArray[0][0];
        for (let i = 0; i < checkArray.length; i++){
            if (iIndex !== checkArray[i][0]){
                return false;
            }
        }

        // Step2 - Extract the jIndexes
        const jIndexes = checkArray.map(obj => obj[1])
        

        // Step3 - Sort the jIndexes
        jIndexes.sort((a, b) => a - b);

        // Step 4 - Check if the sorted jIndexes are consecutive
        for (let i = 0; i < jIndexes.length - 1; i++) {
        if (jIndexes[i] + 1 !== jIndexes[i + 1]) {
            return false;
        }
        }
        console.log("horizontal");
        return true;
    }

    function checkVertically(checkArray){
        // Step1 - Check if the second elements are the same
        const jIndex = checkArray[0][1];
        for (let i = 0; i < checkArray.length; i++){
            if (jIndex !== checkArray[i][1]){
                return false;
            }
        }

        // Step2 - Extract the iIndexes
        const iIndexes = checkArray.map(obj => obj[0])
        

        // Step3 - Sort the iIndexes
        iIndexes.sort((a, b) => a - b);

        // Step 4 - Check if the sorted iIndexes are consecutive
        for (let i = 0; i < iIndexes.length - 1; i++) {
        if (iIndexes[i] + 1 !== iIndexes[i + 1]) {
            return false;
        }
        }
        console.log("vertical");
        return true;
    }

    function checkDiagonally(checkArray){
        // Step1 - Extract the iIndexes and jIndexes
        const iIndexes = checkArray.map(obj => obj[0])

        // Step2 - Sort the iIndexes and jIndexes
        iIndexes.sort((a, b) => a - b);
        jIndexes.sort((a, b) => a - b);

        // Step 3 - Check if the sorted iIndexes and jIndexes are consecutive
        for (let i = 0; i < iIndexes.length - 1; i++) {
        if (iIndexes[i] + 1 !== iIndexes[i + 1]) {
            return false;
        }
        }
        console.log("diagonal");
        return true;
    }

    return {playRound, getActivePlayer, getBoard}

}

const game = gameController();

game.playRound(0,1);
game.playRound(2,1);

game.playRound(1,0);
game.playRound(1,2);

game.playRound(2,2);


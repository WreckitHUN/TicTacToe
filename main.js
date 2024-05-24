function gameBoard(){
    const win = 3;
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
    const getWin = () => win;
    const getColumn = () => columns;
    const getRow = () => rows;

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

    return {getBoard, getWin, getRow, getColumn, chooseCell, printBoard};
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
    const collectToWin = board.getWin();
    const columns = board.getColumn();
    const rows = board.getRow();

    const getBoard = () => board.getBoard();
    const getColumn = () => columns;
    const getRow = () => rows;

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
        // To ensure that there are no actions if a player click on an occupied tile. The return value is 1.
        let returnValue = board.chooseCell(row,column,getActivePlayer().value);
        if (returnValue === 1) return;

        // Check if it is a win
        if (checkWin(activePlayer)){
            console.log(`${activePlayer.name} Win!`);
            location.reload();
        }
        
        switchPlayerTurn();
        printNewRound();

    }

    function checkWin(player){
        const checkArray = checkPlayerValues(player);

        // CollectToWin : How many to collect to WIN
        if (checkArray.length < collectToWin) return false;
        // Check Horizontally
        if (checkHorizontally(checkArray, collectToWin)) return true;
        // Check Vertically
        if (checkVertically(checkArray, collectToWin)) return true;
        // Check Diagonally
        if (checkDiagonally(checkArray, collectToWin)) return true;

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
        console.log(playerPositions);
        return playerPositions;
    }

    function checkHorizontally(checkArray, collectToWin){
        const sortedArray = checkArray.sort();
        let count = 0;
        for (let i = 0; i < sortedArray.length - 1; i++){
            // They are in the same row
            if (sortedArray[i][0] === sortedArray[i + 1][0]){
                // They are next to each other
                if(sortedArray[i + 1][1] - sortedArray[i][1] === 1){
                    count++;
                    if (count >= collectToWin - 1){
                        console.log("Horizontal");
                        return true;
                    } 
                } else count = 0;
            }else count = 0;
        }
        return false;
    }

    function checkVertically(checkArray, collectToWin){
        // Swap array elements
        const newCheckArray = checkArray.map((arr) => [arr[1], arr[0]]);
        const sortedArray = newCheckArray.sort();
    
        let count = 0;

        for (let i = 0; i < sortedArray.length - 1; i++){
            // They are in the same row
            if (sortedArray[i][0] === sortedArray[i + 1][0]){
                // They are next to each other
                if(sortedArray[i + 1][1] - sortedArray[i][1] === 1){
                    count++;
                } else count = 0;
                if (count >= collectToWin - 1){
                    console.log("Vertical");
                    return true;
                } 
            }else count = 0;
        }
        return false;
    }

    function checkDiagonally(checkArray, collectToWin){
        
        const oneDimensionArray = checkArray.map(([i, j]) => i * columns + j);
        console.log(oneDimensionArray);
        // Top left -> bottom right
        const stepLR = columns + 1;

        for (let i = 0; i < oneDimensionArray.length; i++){
            let count = 0;
            let num = oneDimensionArray[i];
            for (let i = 0; i < collectToWin - 1; i++){
               if (oneDimensionArray.includes(num + (i + 1) * stepLR)) count++;
               if (count >= collectToWin - 1){
                console.log("Top left -> bottom right");
                return true;
                } 
            }
        }

        // Top right -> bottom left
        const stepRL = columns - 1;

        for (let i = 0; i < oneDimensionArray.length; i++){
            let count = 0;
            let num = oneDimensionArray[i];
            for (let i = 0; i < collectToWin - 1; i++){
               if (oneDimensionArray.includes(num + (i + 1) * stepRL)) count++;
               if (count >= collectToWin - 1){
                console.log("Top right -> bottom left");
                return true;
                } 
            }
        }

    }

    return {playRound, getActivePlayer, getBoard, getColumn, getRow}

}

function screenController(){
    // Open the modal 
    const modal = document.querySelector(".modal");
    modal.showModal();

    // Get the information
    const gameForm = document.querySelector("#gameForm");
    gameForm.addEventListener('submit', handleFormSubmit);

    function handleFormSubmit(event){
        //event.preventDefault();
        //modal.close();
        // Here I will give the names
        const p1Name = document.querySelector("#p1").value;
        const p2Name = document.querySelector("#p2").value;

        const game = gameController(p1Name, p2Name);
        // Clear the inputs
        p1Name.textContent = "";
        p2Name.textContent = "";

        const activePlayer = game.getActivePlayer();
        
        const rows = game.getRow();
        const columns = game.getColumn();

        const playerTurnDiv = document.querySelector('.turn');
        const boardDiv = document.querySelector(".board");

        // Create the corresponding grid
        boardDiv.style.gridTemplateRows = `repeat(${rows}, 1fr)`
        boardDiv.style.gridTemplateColumns = `repeat(${columns}, 1fr)`

        function initialScreen() {
            // Clear the board
            boardDiv.textContent = "";
            
            // Get the newest version of the board and player turn
            const board = game.getBoard();

            // Display player's turn
            playerTurnDiv.textContent = `${activePlayer.name}'s turn...` 
            
            // Render board buttons
            board.forEach((row, i) => {
            row.forEach((cell, j) => {
                // Anything clickable should be a button!!
                const cellButton = document.createElement("button");
                cellButton.classList.add("cell");
                // Create a data attribute to identify the column
                // This makes it easier to pass into our `playRound` function 
                cellButton.dataset.row = i;
                cellButton.dataset.column = j;
                boardDiv.appendChild(cellButton);
            })
            })
        }

        function updateScreen(cell){
            const activePlayer = game.getActivePlayer();
            // Display player's turn
            playerTurnDiv.textContent = `${activePlayer.name}'s turn...`
            cell.classList.add(`player${activePlayer.value === 1 ? 2 : 1}`);
        }

        // Add event listener for the board
        function clickHandlerBoard(e) {
            const cell = e.target;
            const selectedCellRow = cell.dataset.row;
            const selectedCellColumn = cell.dataset.column;
            // Make sure I've clicked a cell and not the gaps in between
            if (!selectedCellRow) return;
            
            game.playRound(selectedCellRow, selectedCellColumn);
            updateScreen(cell);
            
    }
    boardDiv.addEventListener("click", clickHandlerBoard);
    // Initial render
    initialScreen();
}
}
screenController();



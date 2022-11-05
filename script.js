/**
 * Factory function that creates player object
 *  
 * @param {string} marker - Marker that will be placed on gameboard (X or O)
 * @param {string} name - Name of player
 * @param {Boolean} cpu - If player is A.I or not
 * @returns 
 */
const Player = (marker, name, cpu = false) => {

    //If name is just whitespace
    if(!name.trim()){
        name = "Anonymous";
    } else {
        //Get rid of whitespace
        this.name = name.trim();
    }

    let _wins = 0;

    function incrementWins(){
        _wins++;
    }

    function getWins(){
        return _wins;
    }

    function resetWins(){
        _wins = 0;
    }



    return {marker, name, incrementWins, getWins, resetWins, cpu};
};

/**
 * Gameboard madule
 */
let GameBoard = (function() {

    //Player objects
    let _playerX;
    let _playerO;

    //Gameboard array
    let _gameBoard = [];

    //Additional gameboard controls
    let _moveCount = 0;
    let _ties = 0;

    //Timeout id's
    let _compReset;
    let _roundReset;
    let _blinkingCells;


    /**
     * Gets each cell node in each row and stores them
     * into gameBoard[]
     */
    function _createGameBoard(){
        //Each row contains three cell nodes
         const row1 = document.querySelectorAll(".row-1 > [class*='cell']");
         const row2 = document.querySelectorAll(".row-2 > [class*='cell']");
         const row3 = document.querySelectorAll(".row-3 > [class*='cell']");

        _gameBoard.push(row1, row2, row3);

    }

    /**
     * Adds event listeners to start button and 
     * restart buttons
     */
    function _createGameControl(){
        const startButton = document.querySelector(".start-button");
        startButton.addEventListener("click", _displayGame);

        const restartButton = document.querySelector(".restart-button");
        restartButton.addEventListener("click", _restartGame);
    }


    /**
     * Adds event listeners to each cell ONLY if
     * the player is not an AI. Otherwise, call method
     * that lets computer make a move.
     * 
     * @param {object} player - player who currently has control over gameboard
     * @returns - null
     */
    function _addCellListeners(player){ 

        //If winner is found, exit function
        if (_checkWinner()){
            return;
        }

        //Show the current player
        _showCurrentPlayer(player);

        //If there are enough moves on board, check for winner
        if(_moveCount >= 5){
            _checkWinner();
        }

        //If player is not ai, add listeners
        if(player.cpu === false){
            _gameBoard.forEach((row) =>{
                row.forEach((cell) =>{
                    if(player.marker === "X"){
                        cell.removeEventListener('click', _placeO);
                        cell.addEventListener('click', _placeX);         
                    } else if(player.marker === "O"){
                        cell.removeEventListener('click', _placeX);
                        cell.addEventListener('click', _placeO);
                    }
                });
            });
        } else {
            //Let computer play
            _computerChoice(player);
        }

    }

     /**
     * Callback function
     * 
     * Adds 'O' marker to cell
     */
    function _placeX(){     
        if(!this.innerText){
            this.innerText = "X";
            this.classList.add("noClick");
            _moveCount++; //Log move
            
        }
            //If there is no winner yet, add
            if(!_checkWinner()){
                _addCellListeners(_playerO);
            }
    }

    
    /**
     * Callback function
     * 
     * Adds 'X' marker to cell
     */
    function _placeO(){
        if(!this.innerText){
            this.innerText = "O";
            this.classList.add("noClick");
            _moveCount++; 
        }

        if(!_checkWinner()){
            _addCellListeners(_playerX);
        }
    }

    /**
     * Will check for winner in each possible dimension
     * (row, column, or diagonal) 
     * 
     * @returns if winner is found or if there is a tie
     */
    function _checkWinner(){
        if(_moveCount < 5){
            return;
        }

        //Keeps track of number of cells in 
        let winnerFound = false;

        //Stores possible winning cells
        let winningCellsX = [];
        let winningCellsO = [];

        /**
         * Checks the length of winning cells arrays
         * if either of them have 3 then winner is found
         */
        function countOccurrences(){
            winnerFound = winningCellsX.length === 3 || winningCellsO.length === 3 ? true : false;
        }

        //if any players gets a row of their marker
        for (let i = 0; i < _gameBoard.length && winnerFound === false; i++){
            winningCellsX = [];
            winningCellsO = []; 

            //Checks each cell in a row
            _gameBoard[i].forEach((cell) => {
                if(cell.innerText === 'X'){
                    winningCellsX.push(cell);
                } else if (cell.innerText === 'O'){
                    winningCellsO.push(cell);
                }
            });

            countOccurrences();
        }

        //if any player get a column of their marker
        //Outer loop controls column
        for (let i = 0; i < _gameBoard.length && winnerFound === false; i++){
            winningCellsX = [];
            winningCellsO = []; 

            //Inner loop controls row
            for (let n = 0; n < _gameBoard.length; n++){

                if(_gameBoard[n][i].innerText === "X"){
                    winningCellsX.push(_gameBoard[n][i]);
                } else if(_gameBoard[n][i].innerText === "O"){
                    winningCellsO.push(_gameBoard[n][i]);
                }
            }
            
            //Check for winner
            countOccurrences();
    
        }
        
        /**
         * Reset arrays if necessary 
         * Done outside of for loop since only one dimension is being 
         * checked in the next two loops
         */
       if(winnerFound === false){
            winningCellsX = [];
            winningCellsO = []; 
       }
       
       //Checks left diagonal
        for(let i = 0; i < _gameBoard.length && winnerFound === false; i++){
            //Starting at the top left cell, going down
            if(_gameBoard[i][i].innerText === "X"){
                winningCellsX.push(_gameBoard[i][i]);
            } else if (_gameBoard[i][i].innerText === "O"){
                winningCellsO.push(_gameBoard[i][i]);
            }
        }

        countOccurrences();


        //Check right diagonal
        if(winnerFound === false) {
            winningCellsX = [];
            winningCellsO = []; 
        }

        //Starting at the top right cell working down
        for(let i = 0; i < _gameBoard.length && winnerFound === false; i++){
            //Moves over one cell by subtracting i from max index in column
            if(_gameBoard[i][Math.abs(i - 2)].innerText === "X"){
                winningCellsX.push(_gameBoard[i][Math.abs(i - 2)]);
            } else if (_gameBoard[i][Math.abs(i - 2)].innerText === "O"){
                winningCellsO.push(_gameBoard[i][Math.abs(i - 2)]);
            }
        }


        //Perform appropriate actions when winner is found
        if(winningCellsX.length === 3){
            _printRoundResult(_playerX);
            _playerX.incrementWins();
            _updateScore();
            _showWinningCells(winningCellsX);
            _restartRound();
            return true;
        } else if(winningCellsO.length === 3) { 
            _printRoundResult(_playerO);
           _playerO.incrementWins();
           _updateScore();
           _showWinningCells(winningCellsO);
           _restartRound();
            return true;
        //If no winner is found and board is full, there is a tie
        } else if (_moveCount === 9){
            _printRoundResult("tie");
            _restartRound();
            _ties++;
            _updateScore();
            return true;
        }
    }

    /**
     * Print and let user know who's turn it is
     * 
     * @param {object} player - Players whose turn it is 
     */
    function _showCurrentPlayer(player){
        const displayPlayer = document.querySelector(".game-status");
        displayPlayer.innerText = `${player.name} (${player.marker}) ${player.cpu ? "(A.I)" : ""}'s Turn`;
    }

    /**
     * Update scoreboard
     */
    function _updateScore(){
        const playerXWins = document.querySelector(".playerX-wins");
        const playerOWins = document.querySelector(".playerO-wins");
        const ties = document.querySelector(".ties");

        playerXWins.innerText = `${_playerX.name} (${_playerX.marker}) ${_playerX.cpu ? "(A.I):" : ":"} ${_playerX.getWins()}`;
        playerOWins.innerText = `${_playerO.name} (${_playerO.marker}) ${_playerO.cpu ? "(A.I):" : ":"} ${_playerO.getWins()}`;
        ties.innerText = `Ties: ${_ties}`;
    }

    /**
     * Prints result of round
     * 
     * @param {object, string} result - player who won or string representing tie 
     * @returns null
     */
    function _printRoundResult(result){
        const displayResult = document.querySelector(".game-status");

        if(result === "tie"){ 
            displayResult.innerText = `It's a tie!`;
            return;
        }

        //Print winner of round
        displayResult.innerText = `${result.name} (${result.marker}) ${result.cpu ? "(A.I)" : ""} Wins!`;
    }

    /**
     * Restarts round
     */
    function _restartRound(){
        _moveCount = 0;
        const cells = document.querySelectorAll("[class*= 'cell']");

        //Makes all of the cells no clickable
        cells.forEach((cell) => {
            cell.classList.add("noClick");
        });

        //Wait 2 seconds before starting next round
            _roundReset = setTimeout(() => {
                cells.forEach((cell) => {
                    cell.innerText = "";
                    cell.classList.remove("noClick");
                })

                _addCellListeners(_playerX);

            }, 2000);

    }

    /**
     * Creates two player objects
     * 
     * @param {string} name1 - Player one's name
     * @param {string} name2 - Player two's name
     * @param {Boolean} cpu1 - If player one is AI
     * @param {Boolean} cpu2 - If player two is AI
     */
    function _createPlayers(name1, name2, cpu1, cpu2){
        _playerX = Player("X", name1, cpu1);
        _playerO = Player("O", name2, cpu2);

        //If both players are AI make gameboard non-clickable
        if (cpu1 && cpu2){
            const gameBoard = document.querySelector(".gameboard");
            gameBoard.classList.add("noClick-permanent");
        }
    }

    /**
     * Restarts game
     */
    function _restartGame(){
        //Reset all gameboard control variables
        _playerX.resetWins();
        _playerO.resetWins();
        _ties = 0;
        _moveCount = 0;

        //Removes class from cells if they are applied
        _gameBoard.forEach((row) => {
            row.forEach((cell) => {
                cell.innerText = "";
                cell.classList.remove("blinkCell");
                cell.classList.remove("noClick");
            });
        });

        //Clear setTimeout methods via id
        clearTimeout(_compReset);
        clearTimeout(_roundReset);
        clearTimeout(_blinkingCells);

        //Create new player objects as prototypes 
        newPlayerX = Object.create(_playerX);
        newPlayerO = Object.create(_playerO);

        /** Set current objects as new prototypes, this is mainly to
         * create new instances of setTimeout methods
        **/
        _playerX = newPlayerX;
        _playerO = newPlayerO;

        //Update scoreboard
        _updateScore();
        //Let player 1 go first
        _addCellListeners(_playerX);

    }

    /**
     * Displays game and creates player objects
     */
    function _displayGame(){
        //Gameboard elements and buttons for control
        const gameBoard = document.querySelector(".gameboard");
        const gameDetails = document.querySelector(".game-details");
        const playerMenu = document.querySelector(".player-menu");
        const restartButton = document.querySelector(".restart-button");
        
        //Values required to create player objects
        const name1 = document.querySelector("#player1-name").value;
        const name2 = document.querySelector("#player2-name").value;
        const player1CPU = document.querySelector("#player1-cpu").checked;
        const player2CPU = document.querySelector("#player2-cpu").checked;

        //Hide player menu and display game
        gameBoard.style.visibility = "visible";
        gameDetails.style.display = "block";
        playerMenu.style.display= "none";
        restartButton.style.display = "block";
    
        _createPlayers(name1 ,name2, player1CPU, player2CPU);
        _addCellListeners(_playerX);
        _updateScore();

    }

    /**
     * Chooses random legal move for AI player
     * 
     * @param {object} player - player object that is AI 
     */
    function _computerChoice(player){

        const gameBoard = document.querySelector(".gameboard");
        
        //Will add fade effect to whatever cell is selected
        const cellText = document.createElement("div");
        cellText.classList.add("fadeText");

        //Picks random row and column on gameboard;
        let cell = _gameBoard[ _getRandomNum()][_getRandomNum()];
        let invalidCell = true;

        //While cell is invalid...
        while(invalidCell){
            //If cell is empty, it's a legal move
            if(!cell.innerText){
                cellText.innerText = player.marker;
                //Add node with fade effect
                cell.appendChild(cellText);

                //Make cell and gameboard non-clickable and  
                cell.classList.add("noClick");
                gameBoard.classList.add("noClick");
                _moveCount++;
                invalidCell = false;
            } else { 
                //If move is illegal, pick new cell
                cell = _gameBoard[ _getRandomNum()][_getRandomNum()];
            }
        }
              //Resets gameboard after computer's turn is done
               _compReset = setTimeout(() => {
                    player.marker === "X" ? _addCellListeners(_playerO) : 
                                            _addCellListeners(_playerX);
                    //Remove div with fade effect
                    cell.removeChild(cellText);
                    //Set cell's innerText to player marker
                    cell.innerText = player.marker;
                    gameBoard.classList.remove("noClick");
                }, 1000);
    }

    /**
     * Generates random number between 0 and 2
     * 
     * @returns random number
     */
    function _getRandomNum(){
        return Math.floor(Math.random() * 3);
    }

    /**
     *  Shows player what cells won the game 
     * 
     * @param {array} cells - Array of cell nodes that won game
     */
    function _showWinningCells(cells){
        //Add blinking animation to cel;s
        cells.forEach((cell) =>{
            cell.classList.add("blinkCell")
        });

        //Remove blinking animation on next round
        _blinkingCells = setTimeout(() => {
            cells.forEach((cell) =>{
                cell.classList.remove("blinkCell")
            });
        },2000);
    }

    /**
     * Starts game
     */
    function playGame(){
        _createGameBoard();
        _createGameControl();
    }

    //Create gameboard object with one method, playGame
    return {playGame};
})();


GameBoard.playGame();








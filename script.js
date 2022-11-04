/**factory function */
const Player = (marker, name, cpu = false) => {

    if(!name.trim()){
        name = "Anonymous";
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

/**module */
let GameBoard = (function() {

//put some of these into player() as private properties
    let _playerX;
    let _playerO;
    let _gameBoard = [];
    let _moveCount = 0;
    let _ties = 0;

    //Timeout id's
    let _compXReset;
    let _compOReset;
    let _roundReset;
    let _blinkingCells;

    function _createGameBoard(){
         const row1 = document.querySelectorAll(".row-1 > [class*='cell']");
         const row2 = document.querySelectorAll(".row-2 > [class*='cell']");
         const row3 = document.querySelectorAll(".row-3 > [class*='cell']");

        _gameBoard.push(row1, row2, row3);

    }

    function _createGameControl(){
        const startButton = document.querySelector(".start-button");
        startButton.addEventListener("click", _displayGame);

        const restartButton = document.querySelector(".restart-button");
        restartButton.addEventListener("click", _restartGame);
    }


    function _addCellListeners(player){ 

        if (_checkWinner()){
            return;
        }

        _showCurrentPlayer(player);

        if(_moveCount >= 5){
            _checkWinner();
        }

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
            _computerChoice(player);
        }

    }

    function _placeX(){     
        if(!this.innerText){
            this.innerText = "X";
            this.classList.add("noClick");
            _moveCount++;
            
        }
            if(!_checkWinner()){
                _addCellListeners(_playerO);
            }
    }

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

    function _checkWinner(){
        if(_moveCount < 5){
            return;
        }

        let playerXCount;
        let playerOCount;
        let winnerFound = false;

        let winningCellsX = [];
        let winningCellsO = [];

        function countOccurrences(){
            winnerFound = playerXCount === 3 || playerOCount === 3 ? true : false;
        }

        //if any players gets a row of their marker
        for (let i = 0; i < _gameBoard.length && winnerFound === false; i++){
            playerXCount = 0;
            playerOCount = 0;
            winningCellsX = [];
            winningCellsO = []; 

            _gameBoard[i].forEach((cell) => {
                if(cell.innerText === 'X'){
                    playerXCount++;
                    winningCellsX.push(cell);
                } else if (cell.innerText === 'O'){
                    playerOCount++;
                    winningCellsO.push(cell);
                }
            });

            countOccurrences();
        }

        //if any player get a column of their marker
        //Column control
        for (let i = 0; i < _gameBoard.length && winnerFound === false; i++){
            playerXCount = 0;
            playerOCount = 0;
            winningCellsX = [];
            winningCellsO = []; 

            //Row control
            for (let n = 0; n < _gameBoard.length; n++){

                if(_gameBoard[n][i].innerText === "X"){
                    playerXCount++
                    winningCellsX.push(_gameBoard[n][i]);
                } else if(_gameBoard[n][i].innerText === "O"){
                    playerOCount++;
                    winningCellsO.push(_gameBoard[n][i]);
                }
            }
            
            countOccurrences();
    
        }
        
        //Check right diagonal
       if(winnerFound === false){
            playerXCount = 0;
            playerOCount = 0;
            winningCellsX = [];
            winningCellsO = []; 
       }

        for(let i = 0; i < _gameBoard.length && winnerFound === false; i++){
            if(_gameBoard[i][i].innerText === "X"){
                playerXCount++;
                winningCellsX.push(_gameBoard[i][i]);
            } else if (_gameBoard[i][i].innerText === "O"){
                playerOCount++;
                winningCellsO.push(_gameBoard[i][i]);
            }
        }

        countOccurrences();


        //Check left diagonal
        if(winnerFound === false) {
            playerXCount = 0;
            playerOCount = 0;
            winningCellsX = [];
            winningCellsO = []; 
        }

        for(let i = 0; i < _gameBoard.length && winnerFound === false; i++){
            if(_gameBoard[i][Math.abs(i - 2)].innerText === "X"){
                playerXCount++;
                winningCellsX.push(_gameBoard[i][Math.abs(i - 2)]);
                //Move over to the left one column on each iteration
            } else if (_gameBoard[i][Math.abs(i - 2)].innerText === "O"){
                playerOCount++;
                winningCellsO.push(_gameBoard[i][Math.abs(i - 2)]);
            }
        }
            
        countOccurrences();


        //Print and return winner
        if(playerXCount === 3){
            _printGameResult(_playerX);
            _playerX.incrementWins();
            _updateScore();
            _showWinningCells(winningCellsX);
            _restartRound();
            return true;
        } else if(playerOCount === 3) { 
            _printGameResult(_playerO);
           _playerO.incrementWins();
           _updateScore();
           _showWinningCells(winningCellsO);
           _restartRound();
            return true;
        } else if (_moveCount === 9){
            _printGameResult("tie");
            _restartRound();
            _ties++;
            _updateScore();
            return true;
        }
    }

    function _showCurrentPlayer(player){
        const displayPlayer = document.querySelector(".game-status");
        displayPlayer.innerText = `${player.name} (${player.marker}) ${player.cpu ? "(A.I)" : ""}'s Turn`;
    }

    function _updateScore(){
        const playerXWins = document.querySelector(".playerX-wins");
        const playerOWins = document.querySelector(".playerO-wins");
        const ties = document.querySelector(".ties");

        playerXWins.innerText = `${_playerX.name} (${_playerX.marker}) ${_playerX.cpu ? "(A.I):" : ":"} ${_playerX.getWins()}`;
        playerOWins.innerText = `${_playerO.name} (${_playerO.marker}) ${_playerO.cpu ? "(A.I):" : ":"} ${_playerO.getWins()}`;
        ties.innerText = `Ties: ${_ties}`;
    }

    function _printGameResult(result){
        const displayResult = document.querySelector(".game-status");

        if(result === "tie"){ 
            displayResult.innerText = `It's a tie!`;
            return;
        }

        //Print winner of round
        displayResult.innerText = `${result.name} (${result.marker}) Wins!`;
    }

    function _restartRound(){
        _moveCount = 0;
        const cells = document.querySelectorAll("[class*= 'cell']");

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

    function _createPlayers(name1, name2, cpu1, cpu2){
        _playerX = Player("X", name1, cpu1);
        _playerO = Player("O", name2, cpu2);

        if (cpu1 && cpu2){
            const gameBoard = document.querySelector(".gameboard");
            gameBoard.classList.add("noClick-permanent");
        }
    }

    function _restartGame(){
        _playerX.resetWins();
        _playerO.resetWins();
        _ties = 0;
        _moveCount = 0;

        _gameBoard.forEach((row) => {
            row.forEach((cell) => {
                cell.innerText = "";
                cell.classList.remove("blinkCell");
                cell.classList.remove("noClick");
            });
        });

        //Clear settimeout methods via id
        clearTimeout(_compXReset);
        clearTimeout(_compOReset);
        clearTimeout(_roundReset);
        clearTimeout(_blinkingCells);

        //Create new player objects as prototypes 
        newPlayerX = Object.create(_playerX);
        newPlayerO = Object.create(_playerO);

        //Set current objects as new prototypes, creating new timeout instances of EVERYTHING (including set timeout methods)
        _playerX = newPlayerX;
        _playerO = newPlayerO;

        _updateScore();
        _addCellListeners(_playerX);

    }

    function _displayGame(){
        const gameBoard = document.querySelector(".gameboard");
        const gameDetails = document.querySelector(".game-details");
        const playerMenu = document.querySelector(".player-menu");
        const restartButton = document.querySelector(".restart-button");
        
        const name1 = document.querySelector("#player1-name").value;
        const name2 = document.querySelector("#player2-name").value;
        const player1CPU = document.querySelector("#player1-cpu").checked;
        const player2CPU = document.querySelector("#player2-cpu").checked;

        //Add input fields and hide them on game start
        gameBoard.style.visibility = "visible";
        gameDetails.style.display = "block";
        playerMenu.style.display= "none";
        restartButton.style.display = "block";
        _createPlayers(name1 ,name2, player1CPU, player2CPU);
        _addCellListeners(_playerX);
        _updateScore();

    }

    function _computerChoice(player){

        const gameBoard = document.querySelector(".gameboard");
        
        const cellText = document.createElement("div");
        cellText.classList.add("fadeText");

        let cell = _gameBoard[ _getRandomNum()][_getRandomNum()];
        let invalidCell = true;

        while(invalidCell){
            if(!cell.innerText){
                cellText.innerText = player.marker;
                cell.appendChild(cellText);
                cell.classList.add("noClick");
                gameBoard.classList.add("noClick");
                _moveCount++;
                invalidCell = false;
            } else { 
                cell = _gameBoard[ _getRandomNum()][_getRandomNum()];
            }
        }
         

        if(player.marker === "X"){
            _compOReset =setTimeout(() => {
                _addCellListeners(_playerO);
                cell.removeChild(cellText);
                cell.innerText = player.marker;
                gameBoard.classList.remove("noClick");
                _OReset = true;
            }, 1000);
        }else {
             _compXReset = setTimeout(() => {
                _addCellListeners(_playerX);
                cell.removeChild(cellText);
                cell.innerText = player.marker;
                gameBoard.classList.remove("noClick");
                _XReset = true;
            }, 1000)
        }

    }

    function _getRandomNum(){
        return Math.floor(Math.random() * 3);
    }

    function _showWinningCells(cells){
        cells.forEach((cell) =>{
            cell.classList.add("blinkCell")
        });

        _blinkingCells = setTimeout(() => {
            cells.forEach((cell) =>{
                cell.classList.remove("blinkCell")
            });
        },2000);
    }

    function playGame(){
        _createGameBoard();
        _createGameControl();
    }


    return {playGame};
})();

GameBoard.playGame();

/**
 * Let player pick between playing against person and AI
 * Commit 
 * Add effect to cells that containing winning markers
 * Commit 
 */







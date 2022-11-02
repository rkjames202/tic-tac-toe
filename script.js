/**factory function */
const Player = (marker, name) => {

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

    return {marker, name, incrementWins, getWins, resetWins};
};

/**module */
let GameBoard = (function() {

//put some of these into player() as private properties
    let _playerX;
    let _playerO;
    let _gameBoard = [];
    let _moveCount = 0;
    let _ties = 0;
    //TODO: Give winning cells an effect on win
    let _winningCellsX = [];
    let _winningCellsO = [];

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


    function _addCellListeners(playerMarker){ 
        _gameBoard.forEach((row) =>{
            row.forEach((cell) =>{
                //Test if cell has x or o in it already
                if(playerMarker === "X"){
                    cell.removeEventListener('click', _placeO);
                    cell.addEventListener('click', _placeX);         
                } else if(playerMarker === "O"){
                    cell.removeEventListener('click', _placeX);
                    cell.addEventListener('click', _placeO);
                }
            });
        });
    }

    function _placeX(){     
        if(!this.innerText){
            this.innerText = "X";
            _addCellListeners("O");
            _moveCount++;
            _showCurrentPlayer(_playerO);
        }
   

        if(_moveCount >= 5){
            _checkWinner();
        }
    }

    function _placeO(){
        if(!this.innerText){
            this.innerText = "O";
            _addCellListeners("X");
            _moveCount++;
            _showCurrentPlayer(_playerX);
        }

        if (_moveCount >= 5){
            _checkWinner();
        }
    }

    function _checkWinner(){
        let playerXCount;
        let playerOCount;
        let winnerFound = false;

        function countOccurrences(){
            winnerFound = playerXCount === 3 || playerOCount === 3 ? true : false;
        }

        //if any players gets a row of their marker
        for (let i = 0; i < _gameBoard.length && winnerFound === false; i++){
            playerXCount = 0;
            playerOCount = 0;
            _gameBoard[i].forEach((cell) => {
                if(cell.innerText === 'X'){
                    playerXCount++;
                } else if (cell.innerText === 'O'){
                    playerOCount++;
                }
            });

            countOccurrences();
        }

        //if any player get a column of their marker
        //Column control
        for (let i = 0; i < _gameBoard.length && winnerFound === false; i++){
            playerXCount = 0;
            playerOCount = 0;
            
            //Row control
            for (let n = 0; n < _gameBoard.length; n++){

                if(_gameBoard[n][i].innerText === "X"){
                    playerXCount++
    
                } else if(_gameBoard[n][i].innerText === "O"){
                    playerOCount++;
                }
            }
            
            countOccurrences();
    
        }
        
        //Check right diagonal
       if(winnerFound === false){
            playerXCount = 0;
            playerOCount = 0;
       }
        for(let i = 0; i < _gameBoard.length && winnerFound === false; i++){
            if(_gameBoard[i][i].innerText === "X"){
                playerXCount++;
            } else if (_gameBoard[i][i].innerText === "O"){
                playerOCount++;
            }
        }

        //Check for right diagonal winner
        if(playerXCount === 3 || playerOCount === 3){
            winnerFound = true;
        }

        //Check left diagonal
        if(winnerFound === false){
            playerXCount = 0;
            playerOCount = 0;
        }
        
        for(let i = 0; i < _gameBoard.length && winnerFound === false; i++){
            if(_gameBoard[i][Math.abs(i - 2)].innerText === "X"){
                playerXCount++;
                //Move over to the left one cell on each iteration
            } else if (_gameBoard[i][Math.abs(i - 2)].innerText === "O"){
                playerOCount++;
            }
        }
            
           countOccurrences();


        //Print and return winner
        if(playerXCount === 3){
            _printGameResult(_playerX.name);
            _playerX.incrementWins();
            _updateScore();
            _restartRound();
        } else if(playerOCount === 3) { 
            _printGameResult(_playerO.name);
           _playerO.incrementWins();
           _updateScore();
            _restartRound();
        } else if (_moveCount === 9){
            _printGameResult("tie");
            _restartRound();
            _ties++;
            _updateScore();
        }
    }

    function _showCurrentPlayer(player){
        const displayPlayer = document.querySelector(".game-status");
        displayPlayer.innerText = `${player.name} (${player.marker})'s Turn`;
    }

    function _updateScore(){
        const playerXWins = document.querySelector(".playerX-wins");
        const playerOWins = document.querySelector(".playerO-wins");
        const ties = document.querySelector(".ties");

        playerXWins.innerText = `${_playerX.name}: ${_playerX.getWins()}`;
        playerOWins.innerText = `${_playerO.name}: ${_playerO.getWins()}`;
        ties.innerText = `Ties: ${_ties}`;
    }

    function _printGameResult(result){
        const displayResult = document.querySelector(".game-status");

        if(result === "tie"){
            displayResult.innerText = `It's a tie!`;
            return;
        }

        //Print winner of round
        displayResult.innerText = `${result} Wins!`;
    }

    function _restartRound(){
        _moveCount = 0;
        const cells = document.querySelectorAll("[class*= 'cell']");
        
        cells.forEach((cell) => {
            cell.classList.add("noClick");
        });

        _moveCount = 0;

        //Wait 2 seconds before starting next round
        setTimeout(() => {
            _gameBoard.forEach((row) => {
                row.forEach((cell) => {
                    cell.innerText = "";
                    _showCurrentPlayer(_playerX);
                    _addCellListeners(_playerX.marker);
                    cells.forEach((cell) => {
                        cell.classList.remove("noClick");
                    });
                });
            });
        }, 2000);

    
    }

    function _createPlayers(name1, name2){
        _playerX = Player("X", name1);
        _playerO = Player("O", name2);
    }

    function _restartGame(){
        _playerX.resetWins();
        _playerO.resetWins();
        _ties = 0;
        _moveCount = 0;

        _gameBoard.forEach((row) => {
            row.forEach((cell) => {
                cell.innerText = "";
            });
        });

        _updateScore();
        _addCellListeners(_playerX.marker);
        _showCurrentPlayer(_playerX);
    }

    function _displayGame(){
        const gameBoard = document.querySelector(".gameboard");
        const gameDetails = document.querySelector(".game-details");
        const playerMenu = document.querySelector(".player-menu");
        const restartButton = document.querySelector(".restart-button");
        const name1 = document.querySelector("#player1-name").value;
        const name2 = document.querySelector("#player2-name").value;

        //Add input fields and hide them on game start
        gameBoard.style.visibility = "visible";
        gameDetails.style.display = "block"
        playerMenu.style.display= "none"
        restartButton.style.display = "block";
        _createPlayers(name1 ,name2);
        _showCurrentPlayer(_playerX);
        _addCellListeners(_playerX.marker);
        _updateScore();

    }

    function playGame(){
        _createGameBoard();
        _createGameControl();
    }


    return {playGame};
})();

GameBoard.playGame();

/**
 * Commit along the way
 * Add effect to cells that containing winning markers
 * Add button to restart game
 * Commit along the way
 * Let play pick between playing against person and AI
 */







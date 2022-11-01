/**factory function */
//TODO: Create name for player
const player = (marker, name) => {
    //Let player add their marker to board
    return {marker, name};
};

let playerX = player("x", "John");
let playerO = player("o", "Doe");

/**module */
let gameBoard = (function() {


    let _gameBoard = [];
    let _moveCount = 0;
    let _playerXWins = 0;
    let _playerOWins = 0;
    let _ties = 0;
    let _winningCellsX = [];
    let _winningCellsO = [];

    function _createGameBoard(){
        
         const row1 = document.querySelectorAll(".row-1 > [class*='cell']");
         const row2 = document.querySelectorAll(".row-2 > [class*='cell']");
         const row3 = document.querySelectorAll(".row-3 > [class*='cell']");

        _gameBoard.push(row1, row2, row3);

    }


    function _addCellListeners(playerMarker){ 
        _gameBoard.forEach((row) =>{
            row.forEach((cell) =>{
                //Test if cell has x or o in it already
                if(playerMarker === "x"){
                    cell.removeEventListener('click', _placeO);
                    cell.addEventListener('click', _placeX);         
                } else if(playerMarker === "o"){
                    cell.removeEventListener('click', _placeX);
                    cell.addEventListener('click', _placeO);
                }
            });
        });
    }

    function _placeX(){     
        if(!this.innerText){
            this.innerText = "x";
            _addCellListeners("o");
            _moveCount++;
            _showCurrentPlayer(playerO.name);
        }
   

        if(_moveCount >= 5){
            _checkWinner();
        }
    }

    function _placeO(){
        if(!this.innerText){
            this.innerText = "o";
            _addCellListeners("x");
            _moveCount++;
            _showCurrentPlayer(playerX.name);
        }

        if (_moveCount >= 5){
            _checkWinner();
        }
    }

    function _checkWinner(){
        let playerXCount;
        let playerOCount;
        let winnerFound = false;

        //if any players gets a row of their marker
        for (let i = 0; i < _gameBoard.length && winnerFound === false; i++){
            playerXCount = 0;
            playerOCount = 0;
            _gameBoard[i].forEach((cell) => {
                if(cell.innerText === 'x'){
                    playerXCount++;
                } else if (cell.innerText === 'o'){
                    playerOCount++;
                }
            });

            //Put inside compare occurences function
            if(playerXCount === 3 || playerOCount === 3){
                winnerFound = true;
            }
        }

        //if any player get a column of their marker
        //Column control
        for (let i = 0; i < _gameBoard.length && winnerFound === false; i++){
            playerXCount = 0;
            playerOCount = 0;
            
            //Row control
            for (let n = 0; n < _gameBoard.length; n++){

                if(_gameBoard[n][i].innerText === "x"){
                    playerXCount++
    
                } else if(_gameBoard[n][i].innerText === "o"){
                    playerOCount++;
                }
            }
            
            if(playerXCount === 3 || playerOCount === 3){
                winnerFound = true; 
            }

        }
        
        //Check right diagonal
       if(winnerFound === false){
            playerXCount = 0;
            playerOCount = 0;
       }
        for(let i = 0; i < _gameBoard.length && winnerFound === false; i++){
            if(_gameBoard[i][i].innerText === "x"){
                playerXCount++;
            } else if (_gameBoard[i][i].innerText === "o"){
                playerOCount++;
            }
        }

        //Check right diagonal winner
        if(playerXCount === 3 || playerOCount === 3){
            winnerFound = true;
        }

        //Check left diagonal
        if(winnerFound === false){
            playerXCount = 0;
            playerOCount = 0;
        }
        
        for(let i = 0; i < _gameBoard.length && winnerFound === false; i++){
            if(_gameBoard[i][Math.abs(i - 2)].innerText === "x"){
                playerXCount++;
                //Move over to the left one cell on each iteration
            } else if (_gameBoard[i][Math.abs(i - 2)].innerText === "o"){
                playerOCount++;
            }
        }

        if(playerXCount === 3 || playerOCount === 3){
            winnerFound = true;
        }

        //Print and return winner
        if(playerXCount === 3){
            _printWinner(playerX.name);
            _playerXWins++;
            _restartRound();
        } else if(playerOCount === 3) { 
            _printWinner(playerO.name);
            _playerOWins++;
            _restartRound();
        } else if (_moveCount === 9){
            _printWinner("tie");
            _restartRound();
            _ties++;
        }
    }

    function _showCurrentPlayer(name){
        const displayPlayer = document.querySelector(".main-content > p");
        displayPlayer.innerText = `${name}'s Turn`;
    }

    function _printWinner(name){
        const displayResult = document.querySelector(".main-content > p");
        
        if(name === "tie"){
            displayResult.innerText = `It's a tie!`;
            return;
        }

        displayResult.innerText = `${name} Wins!`;
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
                    _showCurrentPlayer(playerX.name);

                    cells.forEach((cell) => {
                        cell.classList.remove("noClick");
                    });
                });
            });
        }, 2000);

       
    
    }

    function _restartGame(){
        _playerXWins = 0;
        _playerXWins = 0;   
        _ties = 0;
    }

    function playGame(){

        const startButton = 

        _createGameBoard();
        _showCurrentPlayer(playerX.name);
        _addCellListeners(playerX.marker);
        
    }


    return {playGame};
})();

gameBoard.playGame();

/**
 * Commit
 * Add check for tie
 * Add round win counter
 * Add button to restart game
 * Add winner screen (first to 3 wins)
 * Commit along the way
 * Let play pick between playing against person and AI
 */







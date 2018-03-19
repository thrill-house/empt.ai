// Level generation parameters
let generateLevelParams = {
  // Size of the play area
  lvlSize: 21,
  // Max number of steps you are allowed to take in a direction
  maxSteps: 3,
  // Percentage of steps made forwards
  forwardsBias: 60,
  // Max iterations after which we abort
  maxIterations: 100,
  // Whether to continue moving after the goal has been reached once
  continueAfterReachingGoal: false
};
// Different grids
let movementQueue = {};
let cellScoreQueue = {};

function init() {
  document.getElementById('levelImport').addEventListener('change', readSingleFile, false);
  initMovementQueue();
  initCellScoreQueue();

  ui.createQueue();
  generateLevel();
}

function initMovementQueue() {
  movementQueue = getNewQueue(generateLevelParams.lvlSize);
  /*
  moves.queue = movementQueue;
  movementQueue.create();
  let solution = [1,2,1,2,3,1,2,1,3,2,1,2,2,2,1,1,3,1,1];

  for(let i = 2; i <= generateLevelParams.lvlSize-1; i++) {
    movementQueue.getCell(i).distanceToReach = solution[i-2];
  }
  */
}

function initCellScoreQueue() {
  cellScoreQueue = getNewQueue(generateLevelParams.lvlSize);
  cellScoreQueue.goalReached = false;
  cellScoreQueue.getNextMove = function() {
    moves.calculateValidMoves();
    console.log('Valid moves: ' + JSON.stringify(moves.validMoves));
    var canReachGoal = this.canReachGoal(moves.validMoves);
    if(canReachGoal !== 0) {
      // If we can reach the goal in one turn, go for it
      return canReachGoal;
    } else {
      var validMovesForwards = moves.validMoves.filter(m => m > 0);
      var validMovesBackwards = moves.validMoves.filter(m => m < 0);
      // If we can only move in one direction, we draw from the original set of moves
      if(validMovesForwards.length === 0 || validMovesBackwards.length === 0) {
        // Draw sample from the set of valid moves
        var rnd = getRandomNumber(0, moves.validMoves.length-1);
        return moves.validMoves[rnd];
      } else {
        // Different probabilities for different directions
        var dir = getRandomNumber(1,100);
        if(dir <= generateLevelParams.forwardsBias) {
          // 60% chance to go forwards
          console.log('Valid moves forwards: ' + JSON.stringify(validMovesForwards));
          var rnd = getRandomNumber(0, validMovesForwards.length-1);
          return validMovesForwards[rnd];
        } else {
          // 40% chance to go backwards
          console.log('Valid moves backwards: ' + JSON.stringify(validMovesBackwards));
          var rnd = getRandomNumber(0, validMovesBackwards.length-1);
          return validMovesBackwards[rnd];
        }
      }
    }
  };
  cellScoreQueue.canReachGoal = function(validMoves) {
    for(var i = 0; i < validMoves.length; i++) {
      if(validMoves[i] > 0) {
        // Can't reach the goal with a backwards move
        if(this.getCell(this.currentIndex + 2*validMoves[i]).isGoal === true) {
          return i;
        }
      }
      // Unable to reach goal
      return 0;
    }
  };
  cellScoreQueue.executeMoves = function() {
    cellScoreQueue.goalReached = false;
    for(var i = 0; i < generateLevelParams.maxIterations; i++) {
      var nextMove = this.getNextMove();
      if(this.getCell(this.currentIndex + nextMove).distanceToReach === '') {
        // Set the distance if it has not been set yet
        this.getCell(this.currentIndex + nextMove).distanceToReach = Math.abs(nextMove);
      }
      moves.execute(nextMove, true);
      ui.updateCellScoreQueue();

      if(this.currentIndex == generateLevelParams.lvlSize) {
        console.log("Goal reached after " + (i+1) + " steps");
        cellScoreQueue.goalReached = true;
        if(!generateLevelParams.continueAfterReachingGoal) {
          console.log("Stopping movement and filling holes.");
          break;
        }
      }
    }
    this.fillHoles();
    if(!cellScoreQueue.goalReached) {
      alert("Could not reach goal after " + generateLevelParams.maxIterations + " iterations");
    }
  };
  cellScoreQueue.fillHoles = function() {
    var holesFilled = 0;
    for(var i = 1; i < generateLevelParams.lvlSize + 1; i++) {
      if(this.getCell(i).distanceToReach === '' && !this.getCell(i).isStart && !this.getCell(i).isGoal) {
        this.getCell(i).distanceToReach = getRandomNumber(1,3);
        holesFilled++;
      }
    }
    console.log("Filled " + holesFilled + " holes.");
  };
  cellScoreQueue.copyToQueue = function(destination) {
    for(var i = 1; i < generateLevelParams.lvlSize + 1; i++) {
      destination.getCell(i).distanceToReach = this.getCell(i).distanceToReach;
    }
  }
}

// Creates a grid of a certain size from a template
function getNewQueue(queueLength) {
	return {
    // 2D array holding the grid data
		queue: [],
		queueLength: queueLength,
    currentIndex: 1,
    // Creates the 2D grid array and assigns a default object to each cell
    create: function() {
      this.clear();
      let startCell = this.getDefaultCell();
      startCell.isStart = true;
      startCell.isOccupied = true;
      this.queue.push(startCell);
      for(let x = 1; x < this.queueLength-1; x++) {
        this.queue.push(this.getDefaultCell());
    	}
      let endCell = this.getDefaultCell();
      endCell.isGoal = true;
      this.queue.push(endCell);
    },
    // Completely wipes the grid
    clear: function() {
      this.currentIndex = 1;
      this.queue = [];
    },
    // The default data to use for each cell
    getDefaultCell: function() {
      return {
        distanceToReach: '',
        isStart: false,
        isGoal: false,
        isOccupied: false
      }
    },
    // 1-based getter for cell data
		getCell: function(i) {
			return this.queue[i-1];
		},
    // 1-based setter for cell data
		setCell: function(i, c) {
			this.queue[i-1] = c;
	  }
  }
}

function generateLevel() {
  ui.createQueue();

  initCellScoreQueue();
  cellScoreQueue.create();
  moves.queue = cellScoreQueue;
  cellScoreQueue.executeMoves();

  initMovementQueue();
  movementQueue.create();
  cellScoreQueue.copyToQueue(movementQueue);

  moves.queue = movementQueue;
  ui.updateMovementQueue();
  //ui.updateCellScoreQueue();
}

// Returns a signed random integer between signed min and max
function getSignedRandomNumber(min, max) {
  var rnd = getRandomNumber(0, 1);
  var sign = 1;
  if(rnd === 0) {
    sign = -1;
  }
	return sign * getRandomNumber(min, max);
}

// Returns a positive random integer between positive min and max
function getRandomNumber(min, max) {
	return parseInt(Math.random() * (max-min) + min + 0.5);
}


let moves = {
  // Array of previous moves of the form {direction, steps}
  history: [],
  // The object containing the queue model which the movement logic manipulates
  queue: {},
  /* Execute a move
   * @param direction Direction to move in ('forwards', 'backwards')
   * @param steps Number of steps to take
   */
  execute: function(steps, addToHistory) {
    // Don't execute the move if it's not valid
    if(!this.validate(steps)) {
      alert('There is no cell to reach in ' + steps + ' steps');
      return false;
    }
    console.log("Executing move: (" + steps + ")");

    this.queue.getCell(this.queue.currentIndex).isOccupied = false;
    this.queue.currentIndex += 2*steps;
    this.queue.getCell(this.queue.currentIndex).isOccupied = true;

    // Save last move
    addToHistory = addToHistory !== undefined ? addToHistory : true;
    if(addToHistory) {
      this.history.push({steps});
    }
    return true;
  },
  // Check if we can perform the move without bumbing into a wall or occupied cell
  validate: function(steps) {
    // Check if the cell can be reached from the current position, also takes into account blank targets, they can be reached via any means
    let toReachIndex = this.queue.currentIndex + steps;
    if(toReachIndex <= 0 || toReachIndex > generateLevelParams.lvlSize || (this.queue.getCell(toReachIndex).distanceToReach !== Math.abs(steps) && this.queue.getCell(toReachIndex).distanceToReach !== '')) {
      return false;
    }
    // Check if the destination is within bounds
    let destinationIndex = this.queue.currentIndex + 2*steps;
    if(destinationIndex <= 0 || destinationIndex > generateLevelParams.lvlSize) {
      return false;
    }

    return true;
  },
  // Revert the last move from the history and remove it from the history
  revertLast: function() {
    if(this.history.length > 0) {
      let lastMove = this.history.pop();
      this.execute(-lastMove.steps, false);
    }
  },
  generateMove: function(startIndex, endIndex) {
    let steps = endIndex - startIndex;
    return {
      steps: steps
    }
  },
  calculateValidMoves: function() {
    this.validMoves = [];
    for(let i = 1; i <= generateLevelParams.maxSteps; i++) {
      if(this.validate(i)) {
        this.validMoves.push(i);
      }
      if(this.validate(-i)) {
        this.validMoves.push(-i);
      }
    }
  },
  validMoves: []
};




// Button handlers

// Executes move based on selected parameters
function onMoveClicked(selectedIndex) {
  let move = moves.generateMove(movementQueue.currentIndex, selectedIndex);
	moves.execute(move.steps);
  ui.updateMovementQueue();
}

// Reverts last move
function onRevertClicked() {
  moves.revertLast();
  ui.updateMovementQueue();
}

function onRestartClicked() {
  moves.history = [];
  moves.queue.getCell(moves.queue.currentIndex).isOccupied = false;
  moves.queue.currentIndex = 1;
  moves.queue.getCell(moves.queue.currentIndex).isOccupied = true;
  ui.updateMovementQueue();
}

function onGenerateClicked() {
  generateLevelParams.maxSteps = parseInt($('#maxStepsGen input:radio:checked').val());
  generateLevelParams.forwardsBias = parseInt($('#forwardsBiasGen').val());
  generateLevelParams.lvlSize = parseInt($('#lvlSizeGen').val());
  generateLevelParams.maxIterations = parseInt($('#numItsGen').val());
  generateLevelParams.continueAfterReachingGoal = $('#continueAfterReachingGoalGen').is(':checked');

  generateLevel();
}





function onExportClicked() {
  console.log('Exporting level');

  let csv = '';
  // Exclude first (start) and last (goal) cells
  for(let i = 2; i < generateLevelParams.lvlSize; i++) {
    csv += movementQueue.getCell(i).distanceToReach + ',';
  }
  csv = csv.replace(/,\s*$/, "");

  var d = new Date();
  downloadCSV(csv, 'SwingyLevel' + parseInt(d.getTime() / 1000) + '.csv');
}

function downloadCSV(csv, filename) {
    let csvFile = new Blob([csv], {type: "text/csv"});
    let downloadLink = document.createElement("a");
    downloadLink.download = filename;
    downloadLink.href = window.URL.createObjectURL(csvFile);
    downloadLink.style.display = "none";

    // Add the link to DOM and remove it after we are done
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
}

function readSingleFile(e) {
  var file = e.target.files[0];
  if (!file) {
    return;
  }
  var reader = new FileReader();
  reader.onload = function(e) {
    var contents = e.target.result;
    parseLevel(contents);
  };
  reader.readAsText(file);
}

function parseLevel(csv) {
  console.log('Importing Level');
  // Create new grid
  movementQueue.create();

  // Windows carriage returns
  let tokens = csv.replace(/\r/g, '').split(',');
  //Ignore header
  for(var token = 0; token < tokens.length; token++){
    console.log(tokens[token]);
    movementQueue.getCell(token+2).distanceToReach = parseInt(tokens[token]);
  }

  ui.updateMovementQueue();
}




/* Visualization of the queue
 * Creates a one row html table with each cell having a unique id of the form "cellx" where "x" is the index of the cell in the queue
 * The first queue index is defined to be 1 instead of 0
 */
let ui = {
  clearQueue: function() {
    console.log("Clearing visual queue");
    $('#main-area').empty();
  },
  createQueue: function() {
    console.log("Create visual queue");
    this.clearQueue();
    $('#main-area').append(
      $('<table></table>')
      .addClass('table')
      .attr('id', 'board-table')
    );

    // Create x index header
    $('#board-table').append(
      $('<tr></tr>')
      .attr('id', 'x-header')
    );
    for(let i = 1; i < generateLevelParams.lvlSize+1; i++) {
      $('#x-header').append(
        $('<td></td>')
        .addClass('table-cell')
        .text(i)
      );
    };
    $('#board-table').append(
      $('<tr></tr>')
      .attr('id', 'cells')
    );

    // Create all rows
    for(let i = 1; i < generateLevelParams.lvlSize+1; i++) {
      this.createCell(i);
    }
  },
  createCell: function(currCol) {
    //console.log("Create cell");
    $('#cells').append(
      $('<td></td>')
  		.addClass('table-cell bordered-cell')
  		.attr('id', 'cell'+currCol)
  		.click((function(i) {
  			return function() {
          // This function allows us to select a cell via mouse click
          if($('#cell'+i).hasClass('cell-valid')) {
            onMoveClicked(i);
          } else {
            alert("Cell " + i + " is not reachable!");
          }
  			}
  		})(currCol))
  		.text('0')
    );
  },
  // Render movement queue
  updateMovementQueue: function() {
    for(let i = 1; i < generateLevelParams.lvlSize+1; i++) {
			let d = movementQueue.getCell(i).distanceToReach;
			$('#cell'+i).text(d);
      if(movementQueue.getCell(i).isOccupied) {
				$('#cell'+i).addClass('cell-occupied');
        $('#cell'+i).removeClass('cell-start');
        $('#cell'+i).removeClass('cell-goal');
			} else {
				$('#cell'+i).removeClass('cell-occupied');

        if(movementQueue.getCell(i).isGoal) {
  				$('#cell'+i).addClass('cell-goal');
  			} else {
  				$('#cell'+i).removeClass('cell-goal');
  			}
        if(movementQueue.getCell(i).isStart) {
  				$('#cell'+i).addClass('cell-start');
  			} else {
  				$('#cell'+i).removeClass('cell-start');
  			}
			}

      moves.calculateValidMoves();
      $('.cell-valid').removeClass('cell-valid');
      for(let j = 0; j < moves.validMoves.length; j++) {
        let newIndex = movementQueue.currentIndex + moves.validMoves[j];
        $('#cell'+newIndex).addClass('cell-valid');
      }
  	}
  },
  // Render cell score
  updateCellScoreQueue: function() {
    for(let i = 1; i < generateLevelParams.lvlSize+1; i++) {
			let d = cellScoreQueue.getCell(i).distanceToReach;
			$('#cell'+i).text(d);
      if(cellScoreQueue.getCell(i).isOccupied) {
				$('#cell'+i).addClass('cell-occupied');
        $('#cell'+i).removeClass('cell-start');
        $('#cell'+i).removeClass('cell-goal');
			} else {
				$('#cell'+i).removeClass('cell-occupied');

        if(cellScoreQueue.getCell(i).isGoal) {
  				$('#cell'+i).addClass('cell-goal');
  			} else {
  				$('#cell'+i).removeClass('cell-goal');
  			}
        if(cellScoreQueue.getCell(i).isStart) {
  				$('#cell'+i).addClass('cell-start');
  			} else {
  				$('#cell'+i).removeClass('cell-start');
  			}
			}
  	}
  },
}

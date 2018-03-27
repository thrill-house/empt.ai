// Level generation parameters
let generateLevelParams = {
  // Size of the play area
  lvlSize: 21,
  // Max number of steps you are allowed to take in a direction
  maxSteps: 3,
  // If we prevent consecutive backwards moves
  preventConsecutiveBackwardMoves: false,
  // If we prevent consecutive same moves
  preventConsecutiveSameMoves: false,
  // Generate the shortest possible solution
  noLoops: true,
  // Percentage of steps made forwards
  forwardsBias: 60,
  // Max iterations after which we abort
  maxIterations: 100,
  // Whether to continue moving after the goal has been reached once
  continueAfterReachingGoal: false,
  // Whether to allow consecutive moves that cancel each other out
  noImmediateMoveReversal: false,
  // Step weights, how probable it is to draw a step
  stepWeights: [1, 1, 1, 1]
};
var showPossibleMoves = true;
// Different grids
let movementQueue = {};
let cellScoreQueue = {};

function init() {
  document.getElementById('levelImport').addEventListener('change', readSingleFile, false);
  showPossibleMoves = $('#showPossibleMovesCtrl').is(':checked');
  
  initMovementQueue();
  initCellScoreQueue();

  ui.createQueue();
  onGenerateClicked();
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
  cellScoreQueue.pickWeighedRandomMove = function(validMoves) {
    var summedWeights = [];
    for(var i = 0; i < validMoves.length; i++) {
      var oldWeight = summedWeights[i-1] ? summedWeights[i-1] : 0;
      var weighedStep = generateLevelParams.stepWeights[Math.abs(validMoves[i])-1];
      summedWeights.push(oldWeight + weighedStep);
    }

    var totalWeights = summedWeights[summedWeights.length-1];
    var rnd = getRandomNumber(1, totalWeights);

    for(var i = 0; i < summedWeights.length; i++) {
      if(summedWeights[i] >= rnd) {
        return validMoves[i];
      }
    }
    return 0;
  };
  cellScoreQueue.setInvalidSteps = function(validMoves) {
    // Convert to positive steps only and filter duplicates
    validMoves = validMoves.map(m => Math.abs(m)).filter(function(item, pos, self) {
        return self.indexOf(item) == pos;
    });
    for(let i = 0; i < validMoves.length; i++) {
      let toReachIndex = this.currentIndex + validMoves[i];
      if(toReachIndex <= generateLevelParams.lvlSize) {
        if(this.getCell(toReachIndex).invalidStepsToReach.indexOf(validMoves[i]) === -1) {
          this.getCell(toReachIndex).invalidStepsToReach.push(validMoves[i]);
        }
        if(this.getCell(toReachIndex).invalidStepsToReach.indexOf(-validMoves[i]) === -1) {
          this.getCell(toReachIndex).invalidStepsToReach.push(-validMoves[i]);
        }
        console.log("Invalid steps for index " + toReachIndex + ": " + JSON.stringify(this.getCell(toReachIndex).invalidStepsToReach));
      }
    }
  };
  cellScoreQueue.getNextMove = function() {
    moves.calculateValidMoves(generateLevelParams.noLoops);
    console.log('Valid moves: ' + JSON.stringify(moves.validMoves));
    console.log('Aggregated moves: ' + JSON.stringify(moves.aggregatedMoves));
    if(moves.validMoves.length === 0) {
      return 0;
    }
    var canReachGoal = this.canReachGoal(moves.validMoves);
    if(canReachGoal !== 0) {
      // If we can reach the goal in one turn, go for it
      console.log("Can reach goal in " + canReachGoal + " steps");
      return canReachGoal;
    } else {
      // If we moved a certain number of steps last move, ensure we don't immediately revert that move
      if(generateLevelParams.noImmediateMoveReversal) {
        if(moves.history.length > 0) {
          var lastMove = moves.history[moves.history.length-1];
          var vmIndex = moves.validMoves.indexOf(-lastMove.steps);
          if(vmIndex !== -1) {
            console.log("Removing last step " + (-lastMove.steps));
            moves.validMoves.splice(vmIndex, 1);
            console.log('Trimmed valid moves: ' + JSON.stringify(moves.validMoves));
          }
        }
      }

      if(generateLevelParams.preventConsecutiveSameMoves) {
        if(moves.history.length > 0) {
          var lastMove = moves.history[moves.history.length-1];
          var vmIndex = moves.validMoves.indexOf(lastMove.steps);
          if(vmIndex !== -1) {
            console.log("Removing last step " + lastMove.steps);
            moves.validMoves.splice(vmIndex, 1);
            console.log('Trimmed valid moves: ' + JSON.stringify(moves.validMoves));
          }
        }
      }

      var validMovesForwards = moves.validMoves.filter(m => m > 0);
      var validMovesBackwards = moves.validMoves.filter(m => m < 0);
      // If we can only move in one direction, we draw from the original set of moves
      if(validMovesForwards.length === 0 || validMovesBackwards.length === 0) {
        // Draw sample from the set of valid moves
        var rndMove = this.pickWeighedRandomMove(moves.validMoves);
        moves.validMoves.splice(moves.validMoves.indexOf(rndMove),1);
        this.setInvalidSteps(moves.validMoves);
        return rndMove;
        //var rnd = getRandomNumber(0, moves.validMoves.length-1);
        //return moves.validMoves[rnd];
      } else {
        // Different probabilities for different directions
        // If we moved backwards last, then move forwards next
        var dir;
        if(generateLevelParams.preventConsecutiveBackwardMoves && moves.history.length > 0 && moves.history[moves.history.length-1].steps < 0) {
          console.log("Last move was backwards, moving forwards");
          dir = 0;
        } else {
          dir = getRandomNumber(1,100);
        }

        //var dir = getRandomNumber(1,100);
        if(dir <= generateLevelParams.forwardsBias) {
          // 60% chance to go forwards
          console.log('Valid moves forwards: ' + JSON.stringify(validMovesForwards));

          var rndMove = this.pickWeighedRandomMove(validMovesForwards);
          validMovesForwards.splice(validMovesForwards.indexOf(rndMove),1);
          this.setInvalidSteps(validMovesForwards);
          return rndMove;
          //var rnd = getRandomNumber(0, validMovesForwards.length-1);
          //return validMovesForwards[rnd];
        } else {
          // 40% chance to go backwards
          console.log('Valid moves backwards: ' + JSON.stringify(validMovesBackwards));
          var rndMove = this.pickWeighedRandomMove(validMovesBackwards);
          validMovesForwards.splice(validMovesForwards.indexOf(rndMove),1);
          this.setInvalidSteps(validMovesBackwards);
          return rndMove;
          //var rnd = getRandomNumber(0, validMovesBackwards.length-1);
          //return validMovesBackwards[rnd];
        }
      }
    }
  };
  cellScoreQueue.canReachGoal = function(validMoves) {
    for(var i = 0; i < validMoves.length; i++) {
      if(validMoves[i] > 0) {
        // Can't reach the goal with a backwards move
        if(this.getCell(this.currentIndex + 2*validMoves[i]).isGoal === true) {
          return 0; //i
        }
      }
    }
    // Unable to reach goal
    return 0;
  };
  cellScoreQueue.executeMoves = function() {
    moves.history = [];
    moves.queue = this;
    this.create();
    this.goalReached = false;
    var solution = [];
    for(var i = 0; i < generateLevelParams.maxIterations; i++) {
      var nextMove = this.getNextMove();
      console.log("Next move " + nextMove);
      if(nextMove === 0) {
        console.log("No more valid moves");
        return false;
      }
      solution.push(nextMove);
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

      ui.updateCellScoreQueue();
    }
    if(this.goalReached) {
      this.fillHoles();
      console.log(JSON.stringify(solution));
    } else {
      console.log("Could not reach goal after " + generateLevelParams.maxIterations + " iterations");
    }

    return this.goalReached;
  };
  cellScoreQueue.fillHoles = function() {
    var holesFilled = 0;

    var allSteps = [];
    for(var i = 1; i <= generateLevelParams.maxSteps; i++) {
      allSteps.push(i);
    }

    // Fill last few cells with steps that will ensure you cannot easily reach the goal
    for(var i = 1; i <= generateLevelParams.maxSteps; i++) {
      //console.log("Checking " + i + " before goal");
      allStepsCopy = allSteps.slice();
      if(this.getCell(generateLevelParams.lvlSize-i).distanceToReach === '') {
        var index = allStepsCopy.indexOf(i);
        allStepsCopy.splice(index,1);
        //console.log("Steps for " + i + ": " + JSON.stringify(allStepsCopy));
        var rnd = getRandomNumber(0, allStepsCopy.length-1);
        this.getCell(generateLevelParams.lvlSize-i).distanceToReach = allStepsCopy[rnd];
      }
    }

    // Fill up with valid steps
    for(var i = 1; i < generateLevelParams.lvlSize + 1 - generateLevelParams.maxSteps; i++) {
      if(this.getCell(i).distanceToReach === '' && !this.getCell(i).isStart && !this.getCell(i).isGoal) {
        var validSteps = [];
        for(var j = 0; j < generateLevelParams.maxSteps; j++) {
          validSteps.push(j+1);
        }
        for(var j = 0; j < this.getCell(i).invalidStepsToReach.length; j++) {
          var index = validSteps.indexOf(this.getCell(i).invalidStepsToReach[j]);
          if(index !== -1) {
            validSteps.splice(index,1);
          }
        }
        //this.getCell(i).distanceToReach = getRandomNumber(1,3);
        var rnd = getRandomNumber(0, validSteps.length-1);
        this.getCell(i).distanceToReach = validSteps[rnd];
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
        isOccupied: false,
        invalidStepsToReach: []
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
  while(!cellScoreQueue.executeMoves()) {
    console.log("Trying again.");
  };

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
  validate: function(steps, noLoops) {
    // Check if the cell can be reached from the current position, also takes into account blank targets, they can be reached via any means
    let toReachIndex = this.queue.currentIndex + steps;
    if(toReachIndex <= 0 ||
       toReachIndex > generateLevelParams.lvlSize ||
       (this.queue.getCell(toReachIndex).distanceToReach !== Math.abs(steps) && this.queue.getCell(toReachIndex).distanceToReach !== '') ||
       this.queue.getCell(toReachIndex).invalidStepsToReach.indexOf(steps) !== -1) {
      return false;
    }
    // Shortest solutions do not have loops
    if(noLoops) {
      for(let i = 0; i < moves.aggregatedMoves.length; i++) {
        if(moves.aggregatedMoves[i] + steps === 0) {
          // Found a loop
          //console.log("Found a loop");
          return false;
        }
      }
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
  calculateValidMoves: function(noLoops) {
    if(noLoops) {
      this.calculateAggregatedMoves();
    }
    this.validMoves = [];
    for(let i = 1; i <= generateLevelParams.maxSteps; i++) {
      if(this.validate(i, noLoops)) {
        this.validMoves.push(i);
      }
      if(this.validate(-i, noLoops)) {
        this.validMoves.push(-i);
      }
    }
  },
  calculateAggregatedMoves: function() {
    this.aggregatedMoves = [];
    for(let i = 0; i < this.history.length; i++) {
      let sum = 0;
      for(let j = i; j < this.history.length; j++) {
        let lastMove = this.history[j];
        sum = sum + lastMove.steps;
      }
      this.aggregatedMoves.push(sum);
    }
  },
  validMoves: [],
  aggregatedMoves: []
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
  generateLevelParams.preventConsecutiveBackwardMoves = $('#preventConsecutiveBackwardMovesGen').is(':checked');
  generateLevelParams.preventConsecutiveSameMoves = $('#preventConsecutiveSameMovesGen').is(':checked');
  generateLevelParams.noLoops = $('#noLoopsGen').is(':checked');
  generateLevelParams.continueAfterReachingGoal = $('#continueAfterReachingGoalGen').is(':checked');
  generateLevelParams.noImmediateMoveReversal = $('#noImmediateMoveReversalGen').is(':checked');

  generateLevel();
}

function onShowPossibleMovesChanged() {
  showPossibleMoves = $('#showPossibleMovesCtrl').is(':checked');
  ui.updateMovementQueue();
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
          if($('#cell'+i).hasClass('cell-valid-base')) {
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

      $('.cell-valid').removeClass('cell-valid');
      $('.cell-valid-base').removeClass('cell-valid-base');
      moves.calculateValidMoves(false);
      for(let j = 0; j < moves.validMoves.length; j++) {
        let newIndex = movementQueue.currentIndex + moves.validMoves[j];
        if(showPossibleMoves) {
          $('#cell'+newIndex).addClass('cell-valid');
        }
        $('#cell'+newIndex).addClass('cell-valid-base');
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

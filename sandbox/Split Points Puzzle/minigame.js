// Size of the play area
let globalGridWidth = 10;
let globalGridHeight = 10;
// Level generation parameters
let generateLevelParams = {
  // Whether to use the default starting position (5,5)
  useDefaultStartPos: true,
  // Start position
  startPos: {x:5,y:5},
  // Default start position
  defaultStartPos: {x:5,y:5},
  // Number of goals in the play area
  numGoals: 6,
  // Max number of steps you are allowed to take in a direction
  maxSteps: 3,
  // Whether to show the solution after we generate the level
  generateSolved: false,
  // Number of moves to simulate before generating goals
  maxIterations: 20,
  // Max depth determines how many moves we look ahead when scoring a cell
  maxRecursions: 5
};
// Different grids
let movementGrid = {};
let startScoreGrid = {};
let cellScoreGrid = {};

function init() {
  document.getElementById('levelImport').addEventListener('change', readSingleFile, false);
  ui.createGrid();

  initMovementGrid();
  initStartScoreGrid();
  initCellScoreGrid();

  //generateLevel();
}

function initMovementGrid() {
  // Generate a grid that holds information about static cell properties and cells we visited at which time
  movementGrid = getNewGrid(globalGridWidth, globalGridHeight);
  // A default cell has multiple properties, goal and start should be mutually exclusive, so maybe merge those to a single property
  // depth is the smallest number of steps that was used used to get to this cell
  movementGrid.getDefaultCell = function() {
    return {
      "isStart": false,
      "isGoal": false,
      "depth": 0
    }
  };
  // A cell is blocked if we go out of bounds, if the cell is the starting position or if we have already moved there previously
  movementGrid.isBlocked = function(x, y) {
    return (x < 1 || y < 1 || x > this.width || y > this.height || this.getCell(x,y).depth > 0 || this.getCell(x,y).isStart);
  };
  // Get an array of occupied cells containing x and y coordinates
  movementGrid.calculateOccupied = function() {
    let occupiedCells = [];
    for(let x = 1; x < this.width+1; x++) {
      for(let y = 1; y < this.height+1; y++) {
        if(this.getCell(x,y).depth > 0 || this.getCell(x,y).isStart) {
          occupiedCells.push({x,y});
        }
      }
    }
    return occupiedCells;
  };
  // Reset all ceels to non-occupied
  movementGrid.resetOccupied = function() {
    for(let x = 1; x < this.width+1; x++) {
      for(let y = 1; y < this.height+1; y++) {
        this.getCell(x,y).depth = 0;
      }
    }
  };
  // Flat grid is the 1D representation of the grid
  // Values of this array are the sums of all depth values from the first to the current cell
  movementGrid.flatGrid = [];
  // This function creates the flat grid
  movementGrid.flatten = function() {
    this.flatGrid = [];
    for(let y = 0; y < this.height; y++) {
      for(let x = 0; x < this.width; x++) {
        let previous = this.flatGrid[y*this.width + x - 1] ? this.flatGrid[y*this.width + x - 1] : 0;
        //TODO: Apply a score function
        this.flatGrid[y*this.width + x] = previous + this.grid[x][y].depth;
      }
    }
  };
  // Returns a random cell by drawing a cell based on its score in the flat grid
  movementGrid.getRandomCell = function() {
    // We're drawing a number between 1 and the max score in the array
    let maxVal = this.flatGrid[this.flatGrid.length-1];
    // If all values are 0, we are unable to draw a value
    if(maxVal === 0) {
      return {x: -1, y: -1};
    }
    let rnd = getRandomNumber(1, maxVal);
    let rndPos = {x: 0, y: 0};

    // Iterate over the whole array to find the first value that surpasses the randomly generated number
    for(let y = 0; y < this.height; y++) {
      for(let x = 0; x < this.width; x++) {
        //console.log("Current Val: " + this.flatGrid[rndPos.y*this.width + rndPos.x] + " < " + this.flatGrid[y*this.width + x]);
        if(this.flatGrid[y*this.width + x] >= rnd) {
          rndPos = {x,y};
          // Increase by 1 since our grid accessor logic is 1 based, i.e. the first cell is at 1,1 instead of 0,0
          rndPos.x += 1;
          rndPos.y += 1;
          return rndPos;
        }
      }
    }
    // It would be weird if we got to this point
    return {x: -1, y: -1};
  };

  // Movement grid serves as base for the movement logic
  moves.grid = movementGrid;
}

function initStartScoreGrid() {
  // Generate a grid that is used for holding score values that allow us to probabilistically draw a starting position
  startScoreGrid = getNewGrid(globalGridWidth, globalGridHeight);
  /* This function assigns a score to each cell which will determine how likely the cell is to be chosen
   * Create grid of the following form:
   * 0 0 0 0 0
   * 0 1 1 1 0
   * 0 1 2 1 0
   * 0 1 1 1 0
   * 0 0 0 0 0
   * The probability increases the further we get to the center. The borders are set to 0 because that would end the game instantly.
   */
  startScoreGrid.score = function() {
    for(let n = 1; n < parseInt((Math.min(this.width,this.height)+1)/2); n++) {
      for(let x = n; x < this.width - n; x++) {
    		for(let y = n; y < this.height - n; y++) {
          //TODO: This gives a good bias towards the center of the play area, but not too much, can experiment with different functions
          this.grid[x][y] = n*n;
    		}
    	}
    }
  };
  // Flat grid is the 1D representation of the grid
  // Values of this array are the sums of all score values from the first to the current cell
  startScoreGrid.flatGrid = [];
  // This function creates the flat grid
  startScoreGrid.flatten = function() {
    for(let y = 0; y < this.height; y++) {
      for(let x = 0; x < this.width; x++) {
        let previous = this.flatGrid[y*this.width + x - 1] ? this.flatGrid[y*this.width + x - 1] : 0;
        this.flatGrid[y*this.width + x] = previous + this.grid[x][y];
      }
    }
  };
  // Returns a random cell by drawing a cell based on its score in the flat grid
  startScoreGrid.getRandomCell = function() {
    // We're drawing a number between 1 and the max score in the array
    let maxVal = this.flatGrid[this.flatGrid.length-1];
    // If all values are 0, we are unable to draw a value
    if(maxVal === 0) {
      return {x: -1, y: -1};
    }
    let rnd = getRandomNumber(1, maxVal);
    let rndPos = {x: 0, y: 0};

    // Iterate over the whole array to find the first value that surpasses the randomly generated number
    for(let y = 0; y < this.height; y++) {
      for(let x = 0; x < this.width; x++) {
        if(this.flatGrid[y*this.width + x] >= rnd) {
          rndPos = {x,y};
          // Increase by 1 since our grid accessor logic is 1 based, i.e. the first cell is at 1,1 instead of 0,0
          rndPos.x += 1;
          rndPos.y += 1;
          return rndPos;
        }
      }
    }
    // It would be weird if we got to this point
    return {x: -1, y: -1};
  };
}

function initCellScoreGrid() {
  // Generate a grid that is used for holding score values that allow us to probabilistically draw a starting position for the next move
  cellScoreGrid = getNewGrid(globalGridWidth, globalGridHeight);

  // A default cell has multiple properties, moves is an array consisting of a direction ('horizontal','vertical'), score is the number of possible
  // moves from this cell and visited indicated if the cell should be ignored (visited=true) when computing possible moves
  cellScoreGrid.getDefaultCell = function() {
    return {
      moves: [], //{direction,possibleSteps}
      score: 0,
      visited: false
    }
  };
  // Score all occupied cells based on how many unique moves we can make using this starting position
  // This will recursively score all subsequent cells that can be reached via a move, using the same method, up to a depth of generateLevelParams.maxRecursions
  cellScoreGrid.score = function() {
    //console.log("Scoring cells");
    // Start from a clean grid, all scores reset to 0
    this.clearCells();
    // Get the starting set of cells which are the occupied ones, i.e. the ones eligible to move from
    let occupiedCells = movementGrid.calculateOccupied();
    console.log('Got ' + occupiedCells.length + ' occupied cells');
    // Starting depth is 0
    this.scoreCells(occupiedCells, 0);
    console.log('Cells scored');

    // When we're finished scoring, we want to calculate the valid moves from each of the occupied positions
    for(let i = 0; i < occupiedCells.length; i++) {
      this.calculatePossibleMoves(occupiedCells[i].x, occupiedCells[i].y);
    }
  };
  /* Scores a set of cells
   * @param cells The cells to score, an array of objects of the form {x: xPos, y: xPos}
   * @param depth The depth of recursion
   */
  cellScoreGrid.scoreCells = function(cells, depth) {
    // Return if we reached the max recursion depth
    //console.log('Recursion depth ' + depth + '/' + generateLevelParams.maxRecursions);
    if(depth > generateLevelParams.maxRecursions) {
      return;
    }

    // Mark all cells as visited. This is necessary to indicate we consider these cells as blocked beause we traversed them as part of the same move.
    for(let i = 0; i < cells.length; i++) {
      let c = cells[i];
      this.getCell(c.x, c.y).visited = true;
    }

    // Each cell will be applied a score based on the number of possible moves.
    for(let i = 0; i < cells.length; i++) {
      let c = cells[i];
      this.scoreCell(c.x, c.y, depth+1);
    }

    // Mark all cells as not visited. This unwinds the current move, so siblings do not get blocked while we horizontally traverse the tree of possible moves.
    for(let i = 0; i < cells.length; i++) {
      let c = cells[i];
      this.getCell(c.x, c.y).visited = false;
    }
  };
  //
  cellScoreGrid.scoreCell = function(x, y, depth) {
    // Score neighboring cells first and enter the recursion
    // When we return from this function, we are able to add the neighboring scores to the score for this cell
    let neighboringCells = this.getNeighboringCells(x, y);
    //console.log('Number of neighboring cells: ' + neighboringCells.length);
    this.scoreCells(neighboringCells, depth);

    //console.log(depth + ' - Number of possible moves: ' + this.getCell(x, y).moves.length);

    // Number of steps from this position in each direction acts as the base score.
    for(let i = 0; i < this.getCell(x, y).moves.length; i++) {
      //TODO: Use a better scoring function, power of 3 works well for now, gives a lot of bias towards cells with a high number of possible moves
      this.getCell(x, y).score += this.getCell(x, y).moves[i].possibleSteps*this.getCell(x, y).moves[i].possibleSteps*this.getCell(x, y).moves[i].possibleSteps;
    }
    // Reset moves to avoid other recursion levels to just keep adding moves to this array
    this.getCell(x,y).moves = [];

    // Add scores of neighboring cells to the starting position cell score
    for(let i = 0; i < neighboringCells.length; i++) {
      let nc = neighboringCells[i];
      // x_orig and y_orig denote the starting position that was used to reach this cell
      this.getCell(nc.x_orig, nc.y_orig).score += this.getCell(nc.x, nc.y).score;
      // Reset score to avoid other recursion levels to just keep adding score to this cell
      this.getCell(nc.x, nc.y).score = 0;
    }
  };
  // Calculates the possible moves in each direction
  cellScoreGrid.calculatePossibleMoves = function(x,y) {
    // Horizontal
    let possibleSteps = 0;
    for(let j = 1; j <= generateLevelParams.maxSteps; j++) {
      if(!movementGrid.isBlocked(x-j, y) && !movementGrid.isBlocked(x+j, y)) {
        possibleSteps = j;
      } else {
        break;
      }
    }
    if(possibleSteps > 0) {
      this.getCell(x,y).moves.push({
        direction: 'horizontal',
        possibleSteps: possibleSteps
      });
    }

    // Vertical
    possibleSteps = 0;
    for(let j = 1; j <= generateLevelParams.maxSteps; j++) {
      if(!movementGrid.isBlocked(x, y-j) && !movementGrid.isBlocked(x, y+j)) {
        possibleSteps = j;
      } else {
        break;
      }
    }
    if(possibleSteps > 0) {
      this.getCell(x,y).moves.push({
        direction: 'vertical',
        possibleSteps: possibleSteps
      });
    }
  };
  // A lot like calculatePossibleMoves, just that it also returns the neighboring cells that are reachable via those moves
  // It will also add a more restrictive condition to not consider visited cells as valid neighboring cells
  // @returns array of objects of the form {x, y, x_orig, y_orig} where x,y denotes the position of the neighboring cell that can be reached via a move
  //          from the starting position denoted by x_orig,y_orig
  cellScoreGrid.getNeighboringCells = function(x, y) {
    let neighboringCells = [];

    // Horizontal
    let possibleSteps = 0;
    for(let j = 1; j <= generateLevelParams.maxSteps; j++) {
      if(!movementGrid.isBlocked(x-j, y) && !movementGrid.isBlocked(x+j, y) && !this.getCell(x-j, y).visited && !this.getCell(x+j, y).visited) {
        neighboringCells.push({x: x-j, y: y, x_orig: x, y_orig: y});
        neighboringCells.push({x: x+j, y: y, x_orig: x, y_orig: y});
        possibleSteps = j;
      } else {
        break;
      }
    }
    if(possibleSteps > 0) {
      this.getCell(x,y).moves.push({
        direction: 'horizontal',
        possibleSteps: possibleSteps
      });
    }

    // Vertical
    possibleSteps = 0;
    for(let j = 1; j <= generateLevelParams.maxSteps; j++) {
      if(!movementGrid.isBlocked(x, y-j) && !movementGrid.isBlocked(x, y+j) && !this.getCell(x, y-j).visited && !this.getCell(x, y+j).visited) {
        neighboringCells.push({x: x, y: y-j, x_orig: x, y_orig: y});
        neighboringCells.push({x: x, y: y+j, x_orig: x, y_orig: y});
        possibleSteps = j;
      } else {
        break;
      }
    }
    if(possibleSteps > 0) {
      this.getCell(x,y).moves.push({
        direction: 'vertical',
        possibleSteps: possibleSteps
      });
    }

    return neighboringCells;
  };
  // Flat grid is the 1D representation of the grid
  // Values of this array are the sums of all score values from the first to the current cell
  cellScoreGrid.flatGrid = [];
  // This function creates the flat grid
  cellScoreGrid.flatten = function() {
    this.flatGrid = [];
    for(let y = 0; y < this.height; y++) {
      for(let x = 0; x < this.width; x++) {
        let previous = this.flatGrid[y*this.width + x - 1] ? this.flatGrid[y*this.width + x - 1] : 0;
        //TODO: Could use a scoring function here, but maybe we want to keep the scoring to its dedicated function and just add up the values here
        this.flatGrid[y*this.width + x] = previous + this.grid[x][y].score*this.grid[x][y].score*this.grid[x][y].score;
      }
    }
  };
  // Returns a random cell by drawing a cell based on its score in the flat grid
  cellScoreGrid.getRandomCell = function() {
    // We're drawing a number between 1 and the max score in the array
    let maxVal = this.flatGrid[this.flatGrid.length-1];
    // If all values are 0, we are unable to draw a value
    if(maxVal === 0) {
      return {x: -1, y: -1};
    }
    let rnd = getRandomNumber(1, maxVal);
    let rndPos = {x: 0, y: 0};

    // Iterate over the whole array to find the first value that surpasses the randomly generated number
    for(let y = 0; y < this.height; y++) {
      for(let x = 0; x < this.width; x++) {
        //console.log("Current Val: " + this.flatGrid[rndPos.y*this.width + rndPos.x] + " < " + this.flatGrid[y*this.width + x]);
        if(this.flatGrid[y*this.width + x] >= rnd) {
          rndPos = {x,y};
          // Increase by 1 since our grid accessor logic is 1 based, i.e. the first cell is at 1,1 instead of 0,0
          rndPos.x += 1;
          rndPos.y += 1;
          return rndPos;
        }
      }
    }
    // It would be weird if we got to this point
    return {x: -1, y: -1};
  };
}

function getRandomStartPos() {
  // Grid holding scores for the starting position
  startScoreGrid.create();
  // Get a random starting position
  startScoreGrid.score();
  startScoreGrid.flatten();
  return startScoreGrid.getRandomCell();
}

function generateLevel() {
  // Grid holding all moves
  movementGrid.create();

  if(generateLevelParams.useDefaultStartPos) {
    generateLevelParams.startPos = generateLevelParams.defaultStartPos;
  } else {
    generateLevelParams.startPos = getRandomStartPos();
  }

  console.log('Start at: ' + generateLevelParams.startPos.x + ' ' + generateLevelParams.startPos.y);
  movementGrid.getCell(generateLevelParams.startPos.x, generateLevelParams.startPos.y).isStart = true;

  // Grid holding scores for all moves
  cellScoreGrid.create();
  // Generate a number of moves based on cell scores
  let i = 0;
  for(; i < generateLevelParams.maxIterations; i++) {
    console.log("Level Generation - Move " + i);
    // Scores the currently occupied cells in the movementGrid by checking how many possible, subsequent moves they offer. If there is a path that
    // only offers one possible move afterwards, it should be score lower than a path that offers 3 possible moves. A higher score will result in
    // a higher probability that this cell will be chosen as starting point for the next move. This reduces the chance of getting gridlocked early
    // on in the game because of some bad rng
    cellScoreGrid.score();
    // Flattening the grid means turning the 2D grid into a 1D vector
    // For each cell we then add up all previous scores and write the new score to that cell position. This will allow us to draw a cell by choosing
    // a number between 0 and the score of the last cell in the flattened grid
    cellScoreGrid.flatten();

    // Update movement to show the start position
    //ui.updateMovement();
    //ui.updateCellScore();

    // Get the starting position for the next move
    let rndPos = cellScoreGrid.getRandomCell();
    //console.log('RndPos: ' + rndPos.x + ' ' + rndPos.y);
    // This happens if there are no more possible moves to be made
    if(rndPos.x === -1 && rndPos.y === -1) {
      break;
    }

    //console.log('generateLevel: ' + JSON.stringify(cellScoreGrid.getCell(rndPos.x, rndPos.y)));
    // Get the set of valid moves from the starting position. This set gets generates when the grid is scored, so we reuse it.
    let validMoves = cellScoreGrid.getCell(rndPos.x, rndPos.y).moves;
    // There's always one valid move at this point. A move consists of a direction and a maximum number of possible steps to take in that direction
    // Usually this only returns one move as we can only move in one direction from each cell apart from the first move which is multi-directional
    let rndMove = validMoves.length === 1 ? validMoves[0] : validMoves[getRandomNumber(0,validMoves.length-1)];
    // Get random number of steps to take
    //TODO: Could score steps based on how many subsequent moves they offer, right now all steps are worth the same
    let rndSteps = getRandomNumber(1, rndMove.possibleSteps);

    // Take our random parameters and execute the move
    moves.execute(rndMove.direction, rndSteps, rndPos.x, rndPos.y);
  }

  alert("Level was generated using " + i + "/" + generateLevelParams.maxIterations + " steps");

  // Based on our end state of moves, generate goals ontop of the occupied cells, so that we can ensure that the level is solvable
  generateGoals();

  if(!generateLevelParams.generateSolved) {
    moves.history = [];
    movementGrid.resetOccupied();
  }

  // Take a look at our creation
  ui.updateMovement();

  // Uncomment these lines to show the cells scores for a potential next step
  //cellScoreGrid.score();
  //ui.updateCellScore();

  //addDownloadUrl();
}

/* Generates a set of goals ontop of currently occupied cells
 * This function takes the level generation parameter generateLevelParams.numGoals to determine the number of goals to be generated
 */
function generateGoals() {
  // We use the movement grid to score, more specifically, we want to have a bias towards cells that will take longer to get to, so we don't
  // generate all of our goals within 2-3 steps from the start
  movementGrid.flatten();
  let i = 0;
  // Can't use a for loop because we might generate the same goal twice, so we iterate until we have enough goals
  // This could potentially loop forever :)
  while(i < generateLevelParams.numGoals) {
    let rndGoal = movementGrid.getRandomCell();
    console.log("Goal " + i + ": (" + rndGoal.x + ", " + rndGoal.y + ")");
    if(!movementGrid.getCell(rndGoal.x, rndGoal.y).isStart && !movementGrid.getCell(rndGoal.x, rndGoal.y).isGoal) {
      movementGrid.getCell(rndGoal.x, rndGoal.y).isGoal = true;
      i++;
    }
  }
};

// Returns a random integer between min and max
function getRandomNumber(min, max) {
	return parseInt(Math.random() * (max-min) + min + 0.5);
}

// Creates a grid of a certain size from a template
function getNewGrid(width, height) {
	return {
    // 2D array holding the grid data
		grid: [],
		width: width,
		height: height,
    // Creates the 2D grid array and assigns a default object to each cell
    create: function() {
      this.clear();
      for(let x = 0; x < this.width; x++) {
    		let col = [];
    		for(let y = 0; y < this.height; y++) {
    			col.push(this.getDefaultCell());
    		}
    		this.grid.push(col);
    	}
    },
    // Completely wipes the grid
    clear: function() {
      this.grid = [];
    },
    // Resets all cells to default value
    clearCells: function() {
      for(let x = 0; x < this.width; x++) {
    		for(let y = 0; y < this.height; y++) {
    			this.grid[x][y] = this.getDefaultCell();
    		}
    	}
    },
    // The default data to use for each cell
    getDefaultCell: function() {
      return 0;
    },
    // 1-based getter for cell data
		getCell: function(x, y) {
			return this.grid[x-1][y-1];
		},
    // 1-based setter for cell data
		setCell: function(x, y, c) {
			this.grid[x-1][y-1] = c;
	  }
  }
}

// Movement logic
let moves = {
  // Array of previous moves of the form {direction, steps, x_origin, y_origin}
  history: [],
  // The object containing the grid model which the movement logic manipulates
  grid: {},
  /* Execute a move
   * @param direction Direction to move in ('horizontal', 'vertical')
   * @param steps Number of steps to take
   * @param x_origin Start position x coordinate
   * @param y_origin Start position y coordinate
   */
  execute: function(direction, steps, x_origin, y_origin) {
    // Don't execute the move if it's not valid
    if(!this.validate(direction, steps, x_origin, y_origin)) {
      return false;
    }
    console.log("Executing move: (" + x_origin + ", " + y_origin + ", " + direction + ", " + steps + ")");
    // Increment the depth from the start position by one
    let curDepth = movementGrid.getCell(x_origin, y_origin).depth+1;
    // Set adjacent cells to occupied based on the move parameters
  	if(direction === "horizontal") {
  		let x_left = x_origin - steps;
  		let x_right = x_origin + steps;

  		for(let x = x_left; x < x_origin; x++) {
  			movementGrid.getCell(x, y_origin).depth = curDepth;
  		}
  		for(let x = x_right; x > x_origin; x--) {
  			movementGrid.getCell(x, y_origin).depth = curDepth;
  		}
  	} else if(direction === "vertical") {
  		let y_top = y_origin - steps;
  		let y_bot = y_origin + steps;

  		for(let y = y_top; y < y_origin; y++) {
  			movementGrid.getCell(x_origin, y).depth = curDepth;
  		}
  		for(let y = y_bot; y > y_origin; y--) {
  			movementGrid.getCell(x_origin, y).depth = curDepth;
  		}
  	};
    // Save last move
    this.history.push({direction, steps, x_origin, y_origin});
    return true;
  },
  // Clears the cells that were occupied by a move
  revert: function(move) {
    if(move.direction === "horizontal") {
  		let x_left = move.x_origin - move.steps;
  		let x_right = move.x_origin + move.steps;

  		for(let x = x_left; x < move.x_origin; x++) {
  			movementGrid.getCell(x, move.y_origin).depth = 0;
  		}
  		for(let x = x_right; x > move.x_origin; x--) {
  			movementGrid.getCell(x, move.y_origin).depth = 0;
  		}
  	} else if(move.direction === "vertical") {
  		let y_top = move.y_origin - move.steps;
  		let y_bot = move.y_origin + move.steps;

  		for(let y = y_top; y < move.y_origin; y++) {
  			movementGrid.getCell(move.x_origin, y).depth = 0;
  		}
  		for(let y = y_bot; y > move.y_origin; y--) {
  			movementGrid.getCell(move.x_origin, y).depth = 0;
  		}
  	}
  },
  // Revert the last move from the history and remove it from the history
  revertLast: function() {
    if(this.history.length > 0) {
      let lastMove = this.history.pop();
      this.revert(lastMove);
    }
  },
  validateStart: function(x_origin, y_origin) {
    // Check if the current position is valid. Valid positionas are either the start or an occupied cell, i.e. one with a non-zero depth
  	if(movementGrid.getCell(x_origin, y_origin).isStart || movementGrid.getCell(x_origin, y_origin).depth !== 0) {
  		return true;
  	} else {
      alert("Not a valid starting position for the next move: " + x_origin + ", " + y_origin);
      return false;
    }
  },
  // Check if we can perform the move without bumbing into a wall or occupied cell
  validate: function(direction, steps, x_origin, y_origin) {
    if(!this.validateStart(x_origin, y_origin)) {
      return false;
    }

  	if(direction === "horizontal") {
  		// First check if not blocked by walls
  		let x_left = x_origin - steps;
  		let x_right = x_origin + steps;

  		if(x_left <= 0 || x_right > globalGridWidth) {
  			alert("Move blocked by walls");
  			return false;
  		}

  		// Now check if blocked by previous moves, i.e. occupied cells
  		for(let x = x_left; x < x_origin; x++) {
  			if(movementGrid.getCell(x, y_origin).depth > 0) {
  				alert("Move blocked on left side");
  				return false;
  			}
  		}
  		for(let x = x_right; x > x_origin; x--) {
  			if(movementGrid.getCell(x, y_origin).depth > 0) {
  				alert("Move blocked on right side");
  				return false;
  			}
  		}

  		// No blockers
  		return true;

  	} else if(direction === "vertical") {
  		// First check if not blocked by walls
  		let y_top = y_origin - steps;
  		let y_bot = y_origin + steps;

  		if(y_top <= 0 || y_bot > globalGridHeight) {
  			alert("Move blocked by walls");
  			return false;
  		}

  		// Now check if blocked by previous moves, i.e. occupied cells
  		for(let y = y_top; y < y_origin; y++) {
  			if(movementGrid.getCell(x_origin, y).depth > 0) {
  				alert("Move blocked at top");
  				return false;
  			}
  		}
  		for(let y = y_bot; y > y_origin; y--) {
  			if(movementGrid.getCell(x_origin, y).depth > 0) {
  				alert("Move blocked at bot");
  				return false;
  			}
  		}

  		// No blockers
  		return true;
  	}
  }
}


// Button handlers

// Executes move based on selected parameters
function onMoveClicked() {
  let direction = $('#directionCtrl input:radio:checked').val();
  let steps = parseInt($('#stepsCtrl input:radio:checked').val());
  let startX = parseInt($('#startXCtrl').val());
  let startY = parseInt($('#startYCtrl').val());
	moves.execute(direction, steps, startX, startY);
  //cellScoreGrid.score();
  ui.updateMovement();
  //ui.updateStartScore();
  //ui.updateCellScore();
}

// Reverts last move
function onRevertClicked() {
  moves.revertLast();
  cellScoreGrid.score();
  ui.updateMovement();
  //ui.updateStartScore();
  //ui.updateCellScore();
}

// Clear all moves
function onRestartClicked() {
  moves.history = [];
  movementGrid.resetOccupied();
  ui.updateMovement();
}

function onGenerateClicked() {
  generateLevelParams.useDefaultStartPos = $('#startGen input:radio:checked').val() === 'default';
  generateLevelParams.numGoals = parseInt($('#numGoalsGen').val());
  generateLevelParams.maxSteps = parseInt($('#maxStepsGen input:radio:checked').val());
  generateLevelParams.generateSolved = $('#generateSolvedGen').is(':checked');
  generateLevelParams.maxIterations = parseInt($('#numItsGen').val());
  generateLevelParams.maxRecursions = parseInt($('#numRecGen').val());

  generateLevel();
}

function onThreeStepsCtrlToggled(element) {
  let checked = $(element).is(':checked');
  $('#threeStepsCtrlRadio').prop('disabled', !checked);

  // Uncheck the three steps radio button if we disabled the use of three steps
  if(!checked && parseInt($('#stepsCtrl input:radio:checked').val()) === 3) {
    $('#stepsCtrl input:radio:checked').prop('checked', false);
  }
}

function onExportClicked() {
  console.log('Exporting level');

  var csv = 'x,y,isStart,isGoal\n';
  for(let x = 0; x < movementGrid.width; x++) {
    for(let y = 0; y < movementGrid.height; y++) {
      let row = x + ',' + y + ',' + movementGrid.grid[x][y].isStart + ',' + movementGrid.grid[x][y].isGoal;
      csv += row;
      csv += "\n";
    }
  }

  var d = new Date();
  downloadCSV(csv, 'ExpandoLevel' + parseInt(d.getTime() / 1000) + '.csv');
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
  movementGrid.create();

  // Windows carriage returns
  let lines = csv.replace(/\r/g, '').split('\n');
  //Ignore header
  for(var line = 1; line < lines.length; line++){
    console.log(lines[line]);
    let tokens = lines[line].split(',');
    if(tokens.length !== 4) {
      continue;
    }
    let x = parseInt(tokens[0]);
    let y = parseInt(tokens[1]);
    let isStart = (tokens[2] == 'true');
    let isGoal = (tokens[3] == 'true');
    movementGrid.grid[x][y].isStart = isStart;
    movementGrid.grid[x][y].isGoal = isGoal;
  }

  ui.updateMovement();
}

/* Visualization of the movement grid
 * Creates a checker board based on an html table with each cell having a unique id of the form "cellx-y" where "x" and "y" are the positions in the grid
 * Grid indices are 1 based instead of 0 based, i.e.  grid starts at (1,1) in the top left corner
 */
let ui = {
  createGrid: function() {
    console.log("Create visual grid");
    $('#main-area-left').append(
      $('<table></table>')
      .addClass('table')
      .attr('id', 'board-table')
    );

    // Create x index header
    $('#board-table').append(
      $('<tr></tr>')
      .attr('id', 'x-header').append(
        $('<td></td>')
        .addClass('table-cell')
        .text('')
      )
    );
    for(let i = 1; i < globalGridWidth+1; i++) {
      $('#x-header').append(
        $('<td></td>')
        .addClass('table-cell')
        .text(i)
      );
    }

    // Create all rows
    for(let i = 1; i < globalGridHeight+1; i++) {
      this.createRow(i, globalGridWidth);
    }
  },
  createRow: function(currRow, width) {
    //console.log("Create row");
  	$('#board-table').append(
  		$('<tr></tr>')
  		.attr('id', 'row'+currRow)
  		.append(
  			$('<td></td>')
  			.addClass('table-cell')
  			.text(currRow)
  		)
  	);
  	// Create all cells
  	for(let i = 1; i < width+1; i++) {
  		this.createCell(currRow, i);
  	}
  },
  createCell: function(currRow, currCol) {
    //console.log("Create cell");
  	$('#row'+currRow).append(
  		$('<td></td>')
  		.addClass('table-cell bordered-cell')
  		.attr('id', 'cell'+currCol+'-'+currRow)
  		.click((function(x, y) {
  			return function() {
          // This function allows us to select a cell via mouse click
          if(moves.validateStart(currCol,currRow)) {
            $('#startXCtrl').val(currCol);
            $('#startYCtrl').val(currRow);
    				$('.table-cell').removeClass('selected');
    				$(this).addClass('selected');
          }
  			}
  		})(currRow, currCol))
  		.text('0')
  	);
  },
  // Render movement grid
  updateMovement: function() {
    for(let x = 1; x < globalGridWidth+1; x++) {
  		for(let y = 1; y < globalGridHeight+1; y++) {
  			let d = movementGrid.getCell(x,y).depth;
  			$('#cell'+x+'-'+y).text(d);
  			if(d > 0) {
  				$('#cell'+x+'-'+y).addClass('cell-occupied');
  			} else {
  				$('#cell'+x+'-'+y).removeClass('cell-occupied');
  			}
  			if(movementGrid.getCell(x,y).isStart) {
  				$('#cell'+x+'-'+y).addClass('cell-start');
  			} else {
  				$('#cell'+x+'-'+y).removeClass('cell-start');
  			}
  			if(movementGrid.getCell(x,y).isGoal) {
  				$('#cell'+x+'-'+y).addClass('cell-goal');
  			} else {
  				$('#cell'+x+'-'+y).removeClass('cell-goal');
  			}
  		}
  	}
  },
  // Render start score grid
  updateStartScore: function() {
    for(let x = 1; x < globalGridWidth+1; x++) {
  		for(let y = 1; y < globalGridHeight+1; y++) {
        $('#cell'+x+'-'+y).text(startScoreGrid.getCell(x,y));
      }
    }
  },
  // Render cell score grid
  updateCellScore: function() {
    for(let x = 1; x < globalGridWidth+1; x++) {
  		for(let y = 1; y < globalGridHeight+1; y++) {
        $('#cell'+x+'-'+y).text(cellScoreGrid.getCell(x,y).score);
      }
    }
  }
}

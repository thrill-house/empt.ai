You have different control panes at the top and the play area at the bottom.
The start position is black, goals are red, occupied cells are teal.

Movement Control
Direction: The direction of the next move.
Max Steps: The number of steps for the next move.
Move: Execute the next move with the selected parameters.
Selected Position: Click on one of the occupied cells or the start in the play area to mark it as a starting position of the next move.
Revert: Revert the last executed move.
Restart: Restart the whole level from scratch

Level Generation:
Start: Whether to use the default (5,5) start position or a randomly selected one.
Number of Goals: How many goals will be generated.
Max Steps:  How many steps we will use to generate a solution.
Generate Solved: Whether or not to show the solution after level generation.
Iterations: How many moves to simulate when generating a solution. 20 works well in most circumstances. Usually we won't make to many more than that anyway due to limited options on the board.
Recursions: How many moves we look ahead when scoring a cell. Anything above 3 does not perform noticably better. This might become more significant if we change the scoring function.

Level Import/Export:
Click the Export button to download a level file in csv format.
Search for or drag the level file into the input widget to load a level. 
General overview:
Start cell: black
Currently occupied cell: teal
Valid cells to rotate around: green
Goal cell: red

Movement Control:
You move by clicking one of the green cells. Revert and Restart should be self-explanatory.

Level Generation:
Max Steps: How many steps are used to generate the level
Percentage of steps forwards: How likely we are to move forwards instead of backwards
Level size: Size of the board
Iterations: Max number of moves before we give up
Continue after reaching goal: If checked, we will move the full number of iterations hoping to fill out the board. If unchecked, we stop after reaching the goal. In either case we fill holes in the board with random numbers.

Level Import/Export
Current board size should match the exported level's size. There is currently no validation.
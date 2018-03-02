
### Sample component
This is a sample component, file and folder structure should be preserved to match the example set out here. Docs can be directly edited in the component itself. **Tweakers** can be added manually in the app component, to allow interaction with the component to demonstrate functionality. Component names should always be made up of two words, e.g. **sample-component**, so as to more easily distinguish them from standard HTML elements.

##### Properties
- `message` — A message to be displayed in the component

##### Instantiation
`<sample-component message="Hey there!"></sample-component>`

---

### Game events
The component lists all events associated with the game that are stored in the global data store. This is a helper component used for testing and balancing that won't be used as an interface element in the game.

##### Instantiation
`<game-events></game-events>`

---

### Game time
The component displays how much time has elapsed between the first event and the current time.

##### Instantiation
`<game-time></game-time>`

---

### Game score
The component provides a representation of the player's current game score, meaning the number of **data** and **confidence** resources it has currently accumulated.

##### Instantiation
`<game-score></game-score>`

---

### Game factors
The component displays the current values for multipliers used to calculate the score at the given moment.

##### Instantiation
`<game-factors></game-factors>`

---

### Enabled ability
The enabled ability is an ability that is currently enabled within a socket.

##### Properties
- `label` — A label referring to an ability in the global store. Determining whether the ability is displayed is whether a corresponding valid event exists. 

##### Instantiation
`<enabled-ability label="data-socket-slot-label"></enabled-ability>`

---

### Ability slot
The ability slot is a space attached to a data sources. When an ability is assigned to the socket, it's multipliers will be included in the score calculation.

##### Properties
- `label` — An ability slot label, which by definition is connected to a data socket in the global store. The slot may also have abilities assigned to it by virtue of a matching event.

##### Instantiation
`<ability-slot label="data-socket-slot-label"></ability-slot>`

---

### Data socket
The data socket is the base component that abilities are attached to. When enabled, their multipliers are applied to the score calculation.

##### Properties
- `label` — A label referring to a data socket in the global store.

##### Instantiation
`<data-socket label="data-socket-label"></data-socket>`

---

### Available ability
The component displays an ability that is defined within the global data store. If the player is not determined to be past the ability threshold, it will not be shown in any form to the player. If they are, depending on the whether a corresponding **research** or **purchase** event exists for the ability, it either displays options to enable it within the playing field, or to research it using in-game resources.

##### Instantiation
`<available-ability></available-ability>`

---

### Ability library
The component displays abilities that are available to the player to research or enable within the playing field.

##### Instantiation
`<ability-library></ability-library>`

---

### Purchaseable ability
Displays an ability that is listed on the marketplace and is available for purchase by the player.

##### Instantiation
`<purchaseable-ability></purchaseable-ability>`

---

### Ability market
Lists all abilities that are available on the marketplace for the player to purchase.

##### Instantiation
`<ability-market></ability-market>`

---

### Primary navigation
Provides a method to navigate between the different primary screens of the game interface.

##### Instantiation
`<primary-navigation></primary-navigation>`

---

### Playing field
The component displays all **data sockets**, **socket slots** and **enabled abilities** on the field in their correct locations.

##### Instantiation
`<playing-field></playing-field>`

---

### Emotion diagram
Displays the player's emotional status as a result of their currently enabled abilities on the playing field. 

##### Instantiation
`<emotion-diagram></emotion-diagram>`

---

### Leader boards
Displays a players progress in relation to other players of the game, based on a variety of different criteria.

##### Instantiation
`<leader-boards></leader-boards>`

---

### Narrative output
Displays story elements that occur throughout the course of the narrative as a result of in-game events.

##### Instantiation
`<narrative-output></narrative-output>`

---

### User profile
Displays information pertaining to the player's profile.

##### Instantiation
`<user-profile></user-profile>`

---

### Mini-game
Displays a mini-game to the user that can be completed to receive a score bonus in the game.

##### Instantiation
`<mini-game></mini-game>`

---

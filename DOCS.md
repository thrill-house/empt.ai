
---
### Sample component
This is a sample component, file and folder structure should be preserved to match the example set out here. Docs can be directly edited in the component itself. **Tweakers** can be added manually in the app component, to allow interaction with the component to demonstrate functionality. Component names should always be made up of two words, e.g. **sample-component**, so as to more easily distinguish them from standard HTML elements.

##### Properties
- `message` — A message to be displayed in the component

##### Instantiation
`<sample-component message="Hey there!"></sample-component>`
---

---
### Game events
The component lists all events associated with the game that are stored in the global data store. This is a helper component used for testing and balancing that won't be used as an interface element in the game.

##### Instantiation
`<game-events></game-events>`
---

---
### Game time
The component displays how much time has elapsed between the first event and the current time.

##### Instantiation
`<game-time></game-time>`
---

---
### Game score
The component provides a representation of the player's current game score, meaning the number of **data** and **confidence** resources it has currently accumulated.

##### Instantiation
`<game-score></game-score>`
---

---
### Game factors
The component displays the current values for multipliers used to calculate the score at the given moment.

##### Instantiation
`<game-factors></game-factors>`
---

---
### Enabled ability
The enabled ability is an ability that is currently enabled within a socket.

##### Properties
- `label` — A label referring to an ability in the global store. Determining whether the ability is displayed is whether a corresponding valid event exists. 

##### Instantiation
`<enabled-ability label="data-socket-slot-label"></enabled-ability>`
---

---
### Ability slot
The ability slot is a space attached to a data sources. When an ability is assigned to the socket, it's multipliers will be included in the score calculation.

##### Properties
- `label` — An ability slot label, which by definition is connected to a data socket in the global store. The slot may also have abilities assigned to it by virtue of a matching event.

##### Instantiation
`<ability-slot label="data-socket-slot-label"></ability-slot>`
---

---
### Data socket
The data socket is the base component that abilities are attached to. When enabled, their multipliers are applied to the score calculation.

##### Properties
- `label` — A label referring to a data socket in the global store.

##### Instantiation
`<data-socket label="data-socket-label"></data-socket>`
---

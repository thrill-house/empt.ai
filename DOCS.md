### Game events

The component lists all events associated with the game that are stored in the global data store. This is a helper component used for testing and balancing that won't be used as an interface element in the game.

##### Instantiation

`<game-events></game-events>`

### Game time

The component displays how much time has elapsed between the first event and the current time.

##### Instantiation

`<game-time></game-time>`

### Game score

The component provides a representation of the player's current game score, meaning the number of **data** and **confidence** resources it has currently accumulated.

##### Instantiation

`<game-score></game-score>`

### Game factors

The component displays the current values for multipliers used to calculate the score at the given moment.

##### Instantiation

`<game-factors></game-factors>`

### Icon

Reference to a SVG sprite id for usage as icon.

##### Properties

- `label` — A label referring to the icon id in the SVG sprite.

##### Instantiation

`<icon label="icon-id"></icon>`

### Era stage

Representation of an elements era relative to the total number of era's

##### Properties

- `label` — A label referring to the era.

##### Instantiation

`<era-stage label="era-label"></era-stage>`

### Factor value

A representation of a factor with a corresponding icon and value.

##### Properties

- `label` — A label referring to the factor.
- `value` — The numerical value of the factor.

##### Instantiation

`<factor-value label="factor-label" value="123"></factor-value>`

### Symbiotic ability

An ability that has some sort of relationship (depends on or is depended on) with another ability.

##### Properties

- `label` — A label referring to an ability in the global store.

##### Instantiation

`<symbiotic-ability label="ability-label"></symbiotic-ability>`

### Emotion values

Displays the provided values within an emotion diagram.

##### Instantiation

```
<emotion-values
  :scale.number="10"
  :values.object="{
    happiness: 1,
    sadness: 2,
    excitement: 3,
    fear: 4,
    tenderness: 5,
    anger: 6
  }"></emotion-values>
```

### Emotion diagram

Displays the a diagram of emotions, given a single or set of value sets

##### Instantiation

```
<emotion-diagram
  :scale.number="10"
  :hideLabels.boolean="true"
  :values.object="{
    happiness: 1,
    sadness: 2,
    excitement: 3,
    fear: 4,
    tenderness: 5,
    anger: 6
  }" OR :values.array="[{
    happiness: 6,
    sadness: 5,
    excitement: 4,
    fear: 3,
    tenderness: 2,
    anger: 1
  },...]">Optional label</emotion-diagram>
```

### Enabled ability

The enabled ability is an ability that is currently enabled within a socket.

##### Properties

- `label` — A label referring to an ability in the global store. Determining whether the ability is displayed is whether a corresponding valid event exists.

##### Instantiation

`<enabled-ability label="ability-label"></enabled-ability>`

### Ability slot

The ability slot is a space attached to a data sources. When an ability is assigned to the socket, it's multipliers will be included in the score calculation.

##### Properties

- `label` — An ability slot label, which by definition is connected to a data socket in the global store. The slot may also have abilities assigned to it by virtue of a matching event.

##### Instantiation

`<ability-slot label="data-socket-slot-label"></ability-slot>`

### Data socket

The data socket is the base component that abilities are attached to. When enabled, their multipliers are applied to the score calculation.

##### Properties

- `label` — A label referring to a data socket in the global store.

##### Instantiation

`<data-socket label="data-socket-label"></data-socket>`

### Research ability

The component displays options for researching an ability, when available. A button is displayed that triggers a modal to select emotion values and confirm the ability research.

##### Instantiation

`<research-ability label="ability-label"></research-ability>`

### The Modal

Helper element to display modal dialogs within, that take a z-index priority over all other elements

##### Instantiation

`<the-modal></the-modal>`

### Ability dialog

A shared component for researching and installing abilities

##### Instantiation

`<ability-dialog task="install|research" ability="{ ability-object }"></ability-dialog>`

### Dialog install

Displays a modal dialog for selecting an ability to install.

##### Instantiation

`<dialog-install label="ability-label" emotions="{}"></dialog-install>`

### Install ability

The component displays options for selecting an ability to install in a slot. A button is displayed that triggers a modal to select which emotional profile of those available (instances of this ability researched) and "tags" the selected instance temporarily to move it to an available slot in the playing field.

##### Instantiation

`<install-ability label="ability-label"></install-ability>`

### Available ability

The component displays an ability that is defined within the global data store. If the player is not determined to be past the ability threshold, it will not be shown in any form to the player. If they are, depending on the whether a corresponding **research** or **purchase** event exists for the ability, it either displays options to enable it within the playing field, or to research it using in-game resources.

##### Instantiation

`<available-ability label="ability-label"></available-ability>`

### Ability library

The component displays abilities that are available to the player to research or enable within the playing field.

##### Instantiation

`<ability-library></ability-library>`

### Purchaseable ability

Displays an ability that is listed on the marketplace and is available for purchase by the player.

##### Instantiation

`<purchaseable-ability></purchaseable-ability>`

### Ability market

Lists all abilities that are available on the marketplace for the player to purchase.

##### Instantiation

`<ability-market></ability-market>`

### Primary navigation

Provides a method to navigate between the different primary screens of the game interface.

##### Instantiation

`<primary-navigation></primary-navigation>`

### Playing field

The component displays all **data sockets**, **socket slots** and **enabled abilities** on the field in their correct locations.

##### Instantiation

`<playing-field></playing-field>`

### Emotional profile

Aggregates the player's current emotional profile based on currently slotted abilities.

##### Instantiation

`<emotional-profile></emotional-profile>`

### Leader boards

Displays a players progress in relation to other players of the game, based on a variety of different criteria.

##### Instantiation

`<leader-boards></leader-boards>`

### Narrative output

Displays story elements that occur throughout the course of the narrative as a result of in-game events.

##### Instantiation

`<narrative-output></narrative-output>`

### User profile

Displays information pertaining to the player's profile.

##### Instantiation

`<user-profile></user-profile>`

### Mini-game

Displays a mini-game to the user that can be completed to receive a score bonus in the game.

##### Instantiation

`<mini-game></mini-game>`

### Dialog research

Displays a modal dialog for researching an ability.

##### Instantiation

`<dialog-research label="ability-label" emotions="{}"></dialog-research>`

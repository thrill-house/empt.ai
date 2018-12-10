### Base icon

Reference to a SVG sprite id for usage as base-icon.

##### Properties

- `label` — A label referring to the base-icon id in the SVG sprite.

##### Instantiation

`<base-icon label="icon-label"></base-icon>`

### Ownable factor

A representation of a factor with a corresponding base-icon and value.

##### Properties

- `label` — A label referring to the factor.
- `value` — The numerical value of the factor.

##### Instantiation

`<base-factor
label.string="factor-label"
value.number="123"

> </base-factor>`

### Emotion values

Displays the provided values within an emotion diagram.

##### Properties

- `color` — Color of the emotion values. Default light.
- `scale` — Scale of the values provided. Default calculated based on values provided.
- `values` — An object or array of objects of emotion values.

##### Instantiation

```
<emotion-values
  color.string="light"
  scale.number="10"
  values.object="{object}"
></emotion-values>
```

### Emotion diagram

Displays the a diagram of emotions, given a single or set of value sets

##### Properties

- `labels` — Boolean, if labels should be displayed for emotions. Default true.
- `color` — Color of the emotion values. Default light.
- `scale` — Scale of the values provided. Default calculated based on values provided.
- `values` — An object or array of objects of emotion values.

##### Instantiation

```html
<emotion-diagram
  labels.boolean="true"
  color.string="light"
  scale.number="10"
  values.object="{object}"
  OR
  values.array="[{object},...]"
  >Optional label</emotion-diagram
>
```

### The Modal

Helper element to display modal dialogs within, that take a z-index priority over all other elements.

##### Instantiation

`<the-modal></the-modal>`

### Ability dialog

A shared component for researching and installing abilities

##### Properties

- `label` — A label referring to an ability in the global store.
- `costs` — Object of costs for the dialog action.
- `emotions` — Optional object of emotion values, will be combined with emotion profile for comparison.
- `show` — Show or hide the dialog.

##### Instantiation

`<ability-dialog
label.string="ability-label"
costs.object="{object}"
emotions.object="{object}"
show.boolean="true"

> </ability-dialog>`

### Ability install

Displays a modal dialog for selecting an ability to install.

##### Instantiation

`<ability-install></ability-install>`

### Ability installable

Displays options for selecting an ability to install in a slot. A button is displayed that triggers a modal to select which emotional profile of those available (instances of this ability researched) and "tags" the selected instance temporarily to move it to an available slot in the playing field.

##### Properties

- `label` — A label referring to an ability in the global store.

##### Instantiation

`<ability-installable label.string="ability-label"></ability-installable>`

### Ability researchable

Displays options for researching an ability, when available. A button is displayed that triggers a modal to select emotion values and confirm the ability research.

##### Properties

- `label` — A label referring to an ability in the global store.

##### Instantiation

`<ability-researchable label.string="ability-label"></ability-researchable>`

### Ability symbiosis

An ability that has some sort of relationship (depends on or is depended on) with another ability.

##### Properties

- `label` — A label referring to an ability in the global store.

##### Instantiation

`<ability-symbiosis label.string="ability-label"></ability-symbiosis>`

### Ownable era

Representation of an element's era relative to the total number of eras.

##### Properties

- `label` — A label referring to the era.

##### Instantiation

`<base-era label.string="era-label"></base-era>`

### Available ability

The component displays an ability that is defined within the global data store. If the player is not determined to be past the ability threshold, it will not be shown in any form to the player. If they are, depending on the whether a corresponding **research** or **purchase** event exists for the ability, it either displays options to enable it within the playing field, or to research it using in-game resources.

##### Properties

- `label` — A label referring to an ability in the global store.

##### Instantiation

`<ability-available label.string="ability-label"></ability-available>`

### Ability enabled

The enabled ability is an ability that is currently enabled within a socket.

##### Properties

- `instance` — An instance ID referring to an owned ability in the global store.

##### Instantiation

`<ability-enabled instance.string="ability-instance-id"></ability-enabled>`

### Ability purchaseable

Displays an ability that is listed on the marketplace and is available for purchase by the player.

##### Instantiation

`<ability-purchaseable></ability-purchaseable>`

### Ability research

Displays a modal dialog for researching an ability.

##### Instantiation

`<ability-research></ability-research>`

### Emotion profile

Aggregates the player's current emotional profile based on currently slotted abilities.

##### Instantiation

`<emotion-profile></emotion-profile>`

### Socket slot

The ability slot is a space attached to a data sources. When an ability is assigned to the socket, it's multipliers will be included in the score calculation.

##### Properties

- `label` — An ability slot label, which by definition is connected to a data socket in the global store. The slot may also have abilities assigned to it by virtue of a matching event.

##### Instantiation

`<socket-slot label.string="slot-label"></socket-slot>`

### Socket activated

The data socket is the base component that abilities are attached to. When enabled, their multipliers are applied to the score calculation.

> **TODO**: Refactor to **socket**, **socket-inactive** & **socket-activated**.

##### Properties

- `label` — A label referring to a data socket in the global store.

##### Instantiation

`<socket-activated label.string="socket-activated-label"></socket-activated>`

### Socket challenge

Displays a mini-game to the user that can be completed to receive a score bonus in the game.

##### Instantiation

`<socket-challenge></socket-challenge>`

### The abilities

The component displays abilities that are available to the player to research or enable within the playing field.

##### Instantiation

`<the-abilities></the-abilities>`

### The events

The component lists all events associated with the game that are stored in the global data store. This is a helper component used for testing and balancing that won't be used as an interface element in the game.

##### Instantiation

`<the-events></the-events>`

### The factors

The component displays the current values for multipliers used to calculate the score at the given moment.

##### Instantiation

`<the-factors></the-factors>`

### The leaders

Displays a players progress in relation to other players of the game, based on a variety of different criteria.

##### Instantiation

`<the-leaders></the-leaders>`

### The marketplace

Lists all abilities that are available on the marketplace for the player to purchase.

##### Instantiation

`<the-marketplace></the-marketplace>`

### The menu

Provides a method to navigate between the different primary screens of the game interface.

##### Instantiation

`<the-menu></the-menu>`

### The player

Displays information pertaining to the player's profile.

##### Instantiation

`<the-player></the-player>`

### The score

The component provides a representation of the player's current game score, meaning the number of **data** and **confidence** resources it has currently accumulated.

##### Instantiation

`<the-score></the-score>`

### The sockets

The component displays all **sockets**, and by extension all **slots** and **abilities** on the field in their correct locations.

##### Instantiation

`<the-sockets></the-sockets>`

### The story

Displays story elements that occur throughout the course of the narrative as a result of in-game events.

##### Instantiation

`<the-story></the-story>`

### The time

The component displays how much time has elapsed between the first event and the current time.

##### Instantiation

`<the-time></the-time>`

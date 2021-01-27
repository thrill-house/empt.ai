# EmPT·ai

_**EM**otionally **P**erceptive **T**echnology_ — an attempt to make Artificial Intelligence with Empathy. It is the belief of the author that the proven psychological benefits people derive from being seen and being understood, can and should be applied in the decision making undertaken by machines.

## The game

**EmPT.ai** is about the implications of considering the full spectrum of our emotions when designing that which attempts to replicate our intelligence — and the consequences that can arise if we don’t. Gain access to new sources of data and a mesmerising array of abilities to imbue your very own Artificial Intelligence with, while also trying to instill in it some resemblance of an emotional compass. The question is, can you replicate what it is to be human, or is to even try an exercise in either futility or irresponsibility?

## This repository

**EmPT.ai** is an experiment in radically open source game development. All the source code for the project is made public and members of the community are welcomed and encouraged to submit their fixes and suggestions at any time. That said, the game is primarily developed and published by [Thrillhouse OÜ](https://thrill.house) and playable at [empt.ai](https://empt.ai), and final decisions on the development of the game ultimately lie at our feet.

## Technology

### Front-end

The game runs entirely in a player’s web browser. Some of the technologies utilised are as follows:

- A [Vue 3](https://v3.vuejs.org/) _SPA_ (Single Page Application)
- [Vuex](https://next.vuex.vuejs.org/) for state management
- [Tailwind CSS](https://tailwindcss.com/) for styles

### Back-end

The game utilises new technology provided by the [Dash Platform](https://www.dash.org/platform/) and network for affordably and efficiently storing player and game data.

Since the _DPP_ (Dash Platform Protocol) can be accessed and interacted with completely securely from within the browser with full cryptographic confidence, the game requires no traditional servers and essentially utilises Dash as a decentralised cloud service.

There are a few revolutionary aspects to this approach. Players will be able to submit their own remixes of the core game assets with values balanced to their exact taste and pay style, and these can be shared and iterated upon endlessly. Additionally, it makes possible the ability to load a read-only version of _ANY_ other player’s game, for purposes like live streaming or learning new strategies.

For those interested, the contract schema used for the application can be found in the `/.contract` directory.

## Project setup

Clone this repository, then run the following command to install project dependencies.

```
yarn install
```

The project expects the following 3 environment variables to be set. The official test values are listed below. Using these will get you up and running right away.

```toml
# Dash Platform contract identity
VUE_APP_GAME_CONTRACT="HVNpipv3UyZapzGatqJ8tWCkrEQSqAJS4ZSwaSJcFHjM"

# Dash Platform identity ID
VUE_APP_GAME_IDENTITY="EQ4ijQcbpwJnNWudTd1PRvUPL7Me6CBEBmQe8pcYtaUB"

# One of "livenet", "testnet" or "evonet"
VUE_APP_GAME_NETWORK="testnet"
```

To use values you have defined yourself, you'll need to create a new identity for yourself on and then submit a valid set of your own documents to the contract. There is a rudimentary admin interface for this where you can provide the Mnemonic required to make writes, however if you're running this locally you can also save yourself some trouble by storing an additional environment variable to speed up that process.

```toml
# Dash Identity Mnemonic
VUE_APP_GAME_MNEMONIC="... ... ..."
```

## Running locally

To run in development mode, so that changes you make to code are hotloaded, use the following command.

```
yarn serve
```

The app will now be accessible at http://localhost:8080 and the admin interface at http://localhost:8080/admin

To create a production build of the application, you can use the following command:

```
yarn build
```

## Contributing

Please check the [Contributing guidelines](/CONTRIBUTING.md) before submitting Pull Requests to this repository.

## License

The contents of this repository are licensed under the GNU General Public License. For more information please check the [License](/LICENSE.md) file.

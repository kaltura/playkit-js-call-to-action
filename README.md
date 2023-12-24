# Playkit JS Call To Action - Call To Action plugin for the [PlayKit JS Player]

[playkit js player]: https://github.com/kaltura/kaltura-player-js

[![Build Status](https://github.com/kaltura/playkit-js-call-to-action/actions/workflows/run_canary.yaml/badge.svg)](https://github.com/kaltura/playkit-js-call-to-action/actions/workflows/run_canary.yaml)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![](https://img.shields.io/npm/v/@playkit-js/call-to-action/latest.svg)](https://www.npmjs.com/package/@playkit-js/call-to-action)
[![](https://img.shields.io/npm/v/@playkit-js/call-to-action/canary.svg)](https://www.npmjs.com/package/@playkit-js/call-to-action/v/canary)

This plugin for the [Kaltura Player] allows adding customizable dialogs to the player which can appear at a specific time during video playback.

PlayKit JS Call To Action is written in [ECMAScript6], statically analysed using [Typescript] and transpiled in ECMAScript5 using [Babel].

[typescript]: https://www.typescriptlang.org/
[ecmascript6]: https://github.com/ericdouglas/ES6-Learning#articles--tutorials
[babel]: https://babeljs.io

## Getting Started

### Prerequisites

The plugin requires [Kaltura Player] and [playkit-ui-managers] to be loaded first.

[kaltura player]: https://github.com/kaltura/kaltura-player-js
[playkit-ui-managers]: https://github.com/kaltura/playkit-js-ui-managers

### Installing

First, clone and run [yarn] to install dependencies:

[yarn]: https://yarnpkg.com/lang/en/

```
git clone https://github.com/kaltura/playkit-js-call-to-action.git
cd playkit-js-call-to-action
yarn install
```

### Building

Then, build the plugin

```javascript
yarn run build
```

### Embed the library in your test page

Finally, add the bundle as a script tag in your page, and initialize the player

```html
<!--Kaltura player-->
<script type="text/javascript" src="/PATH/TO/FILE/kaltura-player.js"></script>
<!--Playkit ui managers plugin -->
<script type="text/javascript" src="/PATH/TO/FILE/playkit-ui-managers.js"></script>
<!--PlayKit call to action plugin-->
<script type="text/javascript" src="/PATH/TO/FILE/playkit-call-to-action.js"></script>
<div id="player-placeholder" style="height:360px; width:640px">
  <script type="text/javascript">
    var playerContainer = document.querySelector("#player-placeholder");
    var config = {
     ...
     targetId: 'player-placeholder',
     plugins: {
       uiManagers: {},
       callToAction: {
        messages: [{
            title: "message title",
            description: "message description",
            timing: {
                showOnStart: true
            }
        }]
       }
     }
     ...
    };
    var player = KalturaPlayer.setup(config);
    player.loadMedia(...);
  </script>
</div>
```

#### Configuation

TBD

### And coding style tests

We use ESLint [recommended set](http://eslint.org/docs/rules/) with some additions for enforcing [Flow] types and other rules.

See [ESLint config](.eslintrc.json) for full configuration.

We also use [.editorconfig](.editorconfig) to maintain consistent coding styles and settings, please make sure you comply with the styling.

## Compatibility

TBD

## Contributing

Please read [CONTRIBUTING.md](https://gist.github.com/PurpleBooth/b24679402957c63ec426) for details on our code of conduct, and the process for submitting pull requests to us.

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/kaltura/playkit-js-call-to-action/tags).

## License

This project is licensed under the AGPL-3.0 License - see the [LICENSE.md](LICENSE.md) file for details

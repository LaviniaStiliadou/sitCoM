# Situation-Awareness Modeling with Camunda

This project uses the examples [bpmn-js-custom-meta-model](https://github.com/bpmn-io/bpmn-js-examples/tree/master/custom-meta-model), [bpmn-js-token-simulator](https://github.com/bpmn-io/bpmn-js-token-simulation), [bpmn-js-custom-elements](https://github.com/bpmn-io/bpmn-js-examples/tree/master/custom-elements) and 
[bpmn-js-properties-panel](https://github.com/bpmn-io/bpmn-js-properties-panel).


## Building the Example

You need a [NodeJS](http://nodejs.org) development stack with [npm](https://npmjs.org) and installed to build the project.

To install all project dependencies execute

```
npm install
```

Build the example using [browserify](http://browserify.org) via

```
npm run all
```

You may also spawn a development setup by executing

```
npm run dev
```

Both tasks generate the distribution ready client-side modeler application into the `dist` folder.

Serve the application locally or via a web server (nginx, apache, embedded).

http://localhost:9013/ in your web browser.


## Integrate the simulation

Before using the Token Simulator some files have to be integrated:
Move the token-simulator-files/[lib](token-simulator-files/lib) folder into
```
\node_modules\bpmn-js-token-simulation\lib\
```
and overwrite all existing files (12 files).

<!--
Or as a step to step explanation:
Move the [Elementhandler.js](token-simulator-files/lib/util/Elementhandler.js) into
```
\node_modules\bpmn-js-token-simulation\lib\util
```
The content of the [context-pad folder](token-simulator-files/lib/features/context-pads/handler)
(atm just [BoundaryEventHandler.js](handler/context-pads/BoundaryEventHandler.js)) into
```
\node_modules\bpmn-js-token-simulation\lib\features\context-pads\handler
```
and the content of the pause-simulation folder [pause-simulation](handler/pause-simulation/)
[PauseSimulation.js](handler/pause-simulation/PauseSimulation.js)
```
\node_modules\bpmn-js-token-simulation\lib\features\pause-simulation
```

The remaining files must be moved to the 
```
\node_modules\bpmn-js-token-simulation\lib\features\token-simulation-behavior\handler
```
-->


## Features

* Situation-Awareness Modeling and Simulation!

* Displaying colored conditional objects
* Priority Setting of situations and scopes
* Advanced Property Panel (violation, priority)
* New custom rules
* Custom icons
* Extended types
* Situation-dependent communication with multiple participants



## About

This example is a node-style web application that builds a user interface around the bpmn-js BPMN 2.0 modeler.
The project is compatible with popular browsers such as Edge, Firefox and Chrome. For full user experience, we recommend using Google Chrome as well as Firefox.

![new screenshot](https://github.com/LaviniaStiliadou/sitCoM/lbranch3/resources/screenshot.PNG)
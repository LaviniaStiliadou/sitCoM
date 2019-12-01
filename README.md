# Situationsabhängige Choreographie Modellierung
This example uses [bpmn-js](https://github.com/bpmn-io/bpmn-js), [bpmn-js-custom-elements](https://github.com/bpmn-io/bpmn-js-custom-elements) and [bpmn-js-properties-panel](https://github.com/bpmn-io/bpmn-js-properties-panel). 

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

## New Features

* Displaying colored conditional objects
* Priority Setting
* Advanced Property Panel (violation, priority)
* new types with a specific score

''ANIMATIONS OF NEW FEATURES SOON HERE''

## About

This example is a node-style web application that builds a user interface around the bpmn-js BPMN 2.0 modeler.

![new screenshot](https://github.com/LaviniaStiliadou/sitCoM/blob/PropertiesPanel/docs/New%20Screenshot.png)

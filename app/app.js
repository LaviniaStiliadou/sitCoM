import projectDiagram from '../resources/diagram.bpmn';

import customElements from './custom-elements.json';

import CustomModeler from './custom-modeler';
	
var modeler = new CustomModeler({
  container: '#canvas',
  keboard: {
    bindTo: document
  }
});

modeler.importXML(projectDiagram, function(err) {

  if (err) {
    console.error('something went wrong:', err);
  }

  modeler.get('canvas').zoom('fit-viewport');
  modeler.addCustomElements(customElements);
});


// expose bpmnjs to window for debugging purposes
window.bpmnjs = modeler;
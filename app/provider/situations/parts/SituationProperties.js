import entryFactory from 'bpmn-js-properties-panel/lib/factory/EntryFactory';

import {
  isAny
} from 'bpmn-js/lib/features/modeling/util/ModelingUtil';

export default function(group, element) {

  // Only return an entry, if the currently selected
  // element is one of these types.
  if (isAny(element, [
      'bpmn:IntermediateThrowEvent',
      'bpmn:IntermediateCatchEvent', 'bpmn:BoundaryEvent' ])) {
    
    group.entries.push(entryFactory.textField({
      id : 'violation',
      description : 'Wenn Situation verletzt wird, springe zu Scope ID.',
      label : 'Akku-Violation',
      modelProperty : 'violation',
      validate: function(element, values) {
        var violation = values.violation;
        var errorMessageV = {};
        if (isNaN(violation)) {
           errorMessageV.violation = "Please enter a valid scope id (number)";
        }
        return errorMessageV;
       }
    })),
    group.entries.push(entryFactory.textField({
      id : 'prioritaet',
      description : 'Priorität',
      label : 'Akku-Priorität',
      modelProperty : 'prioritaet',
      validate: function(element, values) {
        var prioritaet = values.prioritaet;
        var errorMessageP = {};
        if (isNaN(prioritaet)) {
           errorMessageP.prioritaet = "Please enter a valid priority (number)";
        }
        return errorMessageP;
   }
  })),
  group.entries.push(entryFactory.textField({
    id : 'violation2',
    description : 'Wenn Situation verletzt wird, springe zu Scope ID.',
    label : 'Spinne-Violation',
    modelProperty : 'violation2',
    validate: function(element, values) {
      var violation2 = values.violation2;
      var errorMessageV = {};
      if (isNaN(violation2)) {
         errorMessageV.violation2 = "Please enter a valid scope id (number)";
      }
      return errorMessageV;
     }
  })),
  group.entries.push(entryFactory.textField({
    id : 'prioritaet2',
    description : 'Priorität',
    label : 'Spinne-Priorität',
    modelProperty : 'prioritaet2',
    validate: function(element, values) {
      var prioritaet2 = values.prioritaet2;
      var errorMessageP = {};
      if (isNaN(prioritaet2)) {
         errorMessageP.prioritaet2 = "Please enter a valid priority (number)";
      }
      return errorMessageP;
 }
})),
  group.entries.push(entryFactory.textField({
    id : 'violation3',
    description : 'Wenn Situation verletzt wird, springe zu Scope ID.',
    label : 'Mensch-Violation',
    modelProperty : 'violation3',
    validate: function(element, values) {
      var violation3 = values.violation3;
      var errorMessageV = {};
      if (isNaN(violation3)) {
         errorMessageV.violation3 = "Please enter a valid scope id (number)";
      }
      return errorMessageV;
     }
  })),
  group.entries.push(entryFactory.textField({
    id : 'prioritaet3',
    description : 'Priorität',
    label : 'Mensch-Priorität',
    modelProperty : 'prioritaet3',
    validate: function(element, values) {
      var prioritaet3 = values.prioritaet3;
      var errorMessageP = {};
      if (isNaN(prioritaet3)) {
         errorMessageP.prioritaet3 = "Please enter a valid priority (number)";
      }
      return errorMessageP;
 }
})),
group.entries.push(entryFactory.textField({
  id : 'violation4',
  description : 'Wenn Situation verletzt wird, springe zu Scope ID.',
  label : 'Kamera-Violation',
  modelProperty : 'violation4',
  validate: function(element, values) {
    var violation4 = values.violation4;
    var errorMessageV = {};
    if (isNaN(violation4)) {
       errorMessageV.violation4 = "Please enter a valid scope id (number)";
    }
    return errorMessageV;
   }
})),
group.entries.push(entryFactory.textField({
  id : 'prioritaet4',
  description : 'Priorität',
  label : 'Kamera-Priorität',
  modelProperty : 'prioritaet4',
  validate: function(element, values) {
    var prioritaet4 = values.prioritaet4;
    var errorMessageP = {};
    if (isNaN(prioritaet4)) {
       errorMessageP.prioritaet4 = "Please enter a valid priority (number)";
    }
    return errorMessageP;
}
})),
  addEntry(group, document.getElementById('situations').value);
  } 
}

// TODO aendern von label description via Textfeld
// vielleicht anderer Ansatz probieren mit Number nach Start? 
function addEntry(group, j){
  console.log(j);
  for(var i = 0; i < j; i++){
  console.log(group.entries);
  group.entries.push(entryFactory.textField({
    id : 'violationN' + i,
    description : 'Wenn Situation verletzt wird, springe zu Scope ID.',
    label : 'Violation von neuen Situation '+ i,
    modelProperty : 'violationN'+ i,
    // todo
    validate: function(element, values) {
      var violation = values.violation;
      var errorMessageV = {};
      if (isNaN(violation)) {
         errorMessageV.violation = "Please enter a valid priority (number)";
      }
      return errorMessageV;
    }
  })),
  group.entries.push(entryFactory.textField({
    id : 'prioritaetN' + i,
    description : 'Priorität',
    label : 'Priorität von neuen Situationen' + i,
    modelProperty : 'prioritaetN' + i,
    // todo
    validate: function(element, values) {
      var prioritaet = values.prioritaet;
      var errorMessageP = {};
      if (isNaN(prioritaet)) {
         errorMessageP.prioritaet = "Please enter a valid priority (number)";
      }
      return errorMessageP;
  }
  }))
}
 
}
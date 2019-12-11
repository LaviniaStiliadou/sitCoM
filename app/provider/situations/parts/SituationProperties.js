import entryFactory from 'bpmn-js-properties-panel/lib/factory/EntryFactory';

import {
  isAny
} from 'bpmn-js/lib/features/modeling/util/ModelingUtil';


export default function(group, element) {

  // Only return an entry, if the currently selected
  // element is one of these types.
  if (isAny(element, [
      'custom:circle-red',
      'custom:circle-yellow',
      'custom:circle-green',
      'custom:rect',
      'bpmn:IntermediateThrowEvent',
      'bpmn:IntermediateCatchEvent'])) {
    group.entries.push(entryFactory.textField({
      id : 'violation',
      description : 'Wenn Situation verletzt wird, springe zu Scope ID.',
      label : 'Violation',
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
      description : 'Prioritaet',
      label : 'prioritaet',
      modelProperty : 'prioritaet',
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
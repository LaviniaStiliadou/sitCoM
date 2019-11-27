import entryFactory from 'bpmn-js-properties-panel/lib/factory/EntryFactory';
import {
  is
} from 'bpmn-js/lib/util/ModelUtil';

// TODO: wenn es valid ist, muss man vom Objekt wieder wegklicken...
// TODO: valid violation deletes priority value
export default function(group, element) {

  // Only return an entry, if the currently selected
  // element is one of these types.

  if (is(element, 'custom:circle-red')) {
    group.entries.push(entryFactory.textField({
      id : 'violation',
      description : 'Wenn Situation verletzt wird, springe zu Scope ID.',
      label : 'Violation',
      modelProperty : 'violation',
      validate: function(element, values) {
        var violation = values.violation;
        var errorMessageV = {};
        if (isNaN(violation) || !isEmpty(violation)) {
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
        if (isNaN(prioritaet) || !isEmpty(prioritaet)) {
           errorMessageP.prioritaet = "Please enter a valid priority (number)";
        }
        return errorMessageP;
   }
  }))
  }
  if (is(element, 'custom:circle-yellow')) {
    group.entries.push(entryFactory.textField({
      id : 'violation',
      description : 'Wenn Situation verletzt wird, springe zu Scope ID.',
      label : 'Violation',
      modelProperty : 'violation',
      validate: function(element, values) {
        var violation = values.violation;
        var errorMessageV = {};
        if (isNaN(violation) || !isEmpty(violation)) {
           errorMessageV.violation = "Please enter a valid scope id (number)";
           return errorMessageV;
        }
       }
    }));
    group.entries.push(entryFactory.textField({
      id : 'prioritaet',
      description : 'Prioritaet',
      label : 'prioritaet',
      modelProperty : 'prioritaet',
      validate: function(element, values) {
        var prioritaet = values.prioritaet;
        var errorMessageP = {};
        if (isNaN(prioritaet) || !isEmpty(prioritaet)) {
           errorMessageP.prioritaet = "Please enter a valid priority (number)";
           return errorMessageP;
        }
   }
    }));
  }
  if (is(element, 'custom:circle-green')) {
    group.entries.push(entryFactory.textField({
      id : 'violation',
      description : 'Wenn Situation verletzt wird',
      label : 'Violation',
      modelProperty : 'violation',
      validate: function(element, values) {
        var violation = values.violation;
        var errorMessageV = {};
        if (isNaN(violation) || !isEmpty(violation)) {
           errorMessageV.violation = "Please enter a valid scope id (number)";
           return errorMessageV;
        }
   }
    }));
    group.entries.push(entryFactory.textField({
      id : 'prioritaet',
      description : 'Prioritaet',
      label : 'prioritaet',
      modelProperty : 'prioritaet',
      validate: function(element, values) {
        var prioritaet = values.prioritaet;
        var errorMessageP = {};
        if (isNaN(prioritaet) || !isEmpty(prioritaet)) {
           errorMessageP.prioritaet = "Please enter a valid priority (number)";
           return errorMessageP;
        }
   }
    }));
  }
  if (is(element, 'custom:rect')) {
    group.entries.push(entryFactory.textField({
      id : 'violation',
      description : 'Wenn Situation verletzt wird',
      label : 'Violation',
      modelProperty : 'violation',
      validate: function(element, values) {
        var violation = values.violation;
        var errorMessageV = {};
        if (isNaN(violation) || !isEmpty(violation)) {
           errorMessageV.violation = "Please enter a valid scope id (number)";
           return errorMessageV;
        }
      }
    }));
    group.entries.push(entryFactory.textField({
      id : 'prioritaet',
      description : 'Prioritaet',
      label : 'prioritaet',
      modelProperty : 'prioritaet',
      validate: function(element, values) {
        var prioritaet = values.prioritaet;
        var errorMessageP = {};
        if (isNaN(prioritaet) || !isEmpty(prioritaet)) {
           errorMessageP.prioritaet = "Please enter a valid priority (number)";
           return errorMessageP;
        }
   }
    }));
  }
  if (is(element, 'bpmn:IntermediateThrowEvent')) {
    group.entries.push(entryFactory.textField({
      id : 'violation',
      description : 'Wenn Situation verletzt wird',
      label : 'Violation',
      modelProperty : 'violation',
      validate: function(element, values) {
        var violation = values.violation;
        var errorMessageV = {};
        if (isNaN(violation) || !isEmpty(violation)) {
           errorMessageV.violation = "Please enter a valid scope id (number)";
        }
        return errorMessageV;
   }
  }))
  group.entries.push(entryFactory.textField({
    id : 'prioritaet',
    description : 'Prioritaet',
    label : 'Prioritaet',
    modelProperty : 'prioritaet',
    validate: function(element, values) {
      var prioritaet = values.prioritaet;
      var errorMessageP = {};
      if (isNaN(prioritaet) || !isEmpty(prioritaet)) {
         errorMessageP.prioritaet = "Please enter a valid priority (number)";
      }
      return errorMessageP;
    }
  }))};
  if (is(element, 'bpmn:IntermediateCatchEvent')) {
    group.entries.push(entryFactory.textField({
      id : 'violation',
      description : 'Wenn Situation verletzt wird',
      label : 'Violation',
      modelProperty : 'violation',
      validate: function(element, values) {
        var violation = values.violation;
        var errorMessageV = {};
        if (isNaN(violation) || !isEmpty(violation)) {
           errorMessageV.violation = "Please enter a valid scope id (number)";
        }
        return errorMessageV;
   }
    }));
    group.entries.push(entryFactory.textField({
      id : 'prioritaet',
      description : 'Prioritaet',
      label : 'Prioritaet',
      modelProperty : 'prioritaet',
      validate: function(element, values) {
        var prioritaet = values.prioritaet;
        var errorMessageP = {};
        if (isNaN(prioritaet) || !isEmpty(prioritaet)) {
           errorMessageP.prioritaet = "Please enter a valid priority (number)";
        }
        return errorMessageP;
      }
    }));
  } 
}
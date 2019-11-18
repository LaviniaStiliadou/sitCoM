import entryFactory from 'bpmn-js-properties-panel/lib/factory/EntryFactory';

import {
  is,
  isAny
} from 'bpmn-js/lib/util/ModelUtil';


export default function(group, element) {

  // Only return an entry, if the currently selected
  // element is one of these types.

  if (is(element, 'custom:circle-red')) {
    group.entries.push(entryFactory.textField({
      id : 'violation',
      description : 'Wenn Situation verletzt wird',
      label : 'Violation',
      modelProperty : 'violation'
    }));
    group.entries.push(entryFactory.textField({
      id : 'prioritaet',
      description : 'Prioritaet',
      label : 'prioritaet',
      modelProperty : 'prioritaet'
    }));
  }
  if (is(element, 'custom:circle-yellow')) {
    group.entries.push(entryFactory.textField({
      id : 'violation',
      description : 'Wenn Situation verletzt wird',
      label : 'Violation',
      modelProperty : 'violation'
    }));
    group.entries.push(entryFactory.textField({
      id : 'prioritaet',
      description : 'Prioritaet',
      label : 'prioritaet',
      modelProperty : 'prioritaet'
    }));
  }
  if (is(element, 'custom:circle-green')) {
    group.entries.push(entryFactory.textField({
      id : 'violation',
      description : 'Wenn Situation verletzt wird',
      label : 'Violation',
      modelProperty : 'violation'
    }));
    group.entries.push(entryFactory.textField({
      id : 'prioritaet',
      description : 'Prioritaet',
      label : 'prioritaet',
      modelProperty : 'prioritaet'
    }));
  }
  if (is(element, 'custom:rect')) {
    group.entries.push(entryFactory.textField({
      id : 'violation',
      description : 'Wenn Situation verletzt wird',
      label : 'Violation',
      modelProperty : 'violation'
    }));
    group.entries.push(entryFactory.textField({
      id : 'prioritaet',
      description : 'Prioritaet',
      label : 'prioritaet',
      modelProperty : 'prioritaet'
    }));
  }
  if (is(element, 'bpmn:IntermediateThrowEvent')) {
    group.entries.push(entryFactory.textField({
      id : 'violation',
      description : 'Wenn Situation verletzt wird',
      label : 'Violation',
      modelProperty : 'violation'
    }));
    group.entries.push(entryFactory.textField({
      id : 'prioritaet',
      description : 'Prioritaet',
      label : 'prioritaet',
      modelProperty : 'prioritaet'
    }));
}}
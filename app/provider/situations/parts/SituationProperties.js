import entryFactory from 'bpmn-js-properties-panel/lib/factory/EntryFactory';

import {
  is,
  isAny
} from 'bpmn-js/lib/util/ModelUtil';


export default function(group, element) {

  // Only return an entry, if the currently selected
  // element is one of these types.

  if (is(element, 'custom:circle-red') || is(element, 'custom:circle-yellow') || is(element, 'custom:circle-green') || is(element, 'custom:circle-rect') || is(element, 'bpmn:IntermediateCatchEvent') || is(element, 'bpmn:IntermediateThrowEvent')) {
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
}
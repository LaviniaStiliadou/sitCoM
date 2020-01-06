import inherits from 'inherits';

import ContextPadProvider from 'bpmn-js/lib/features/context-pad/ContextPadProvider';

import {
  isAny,
  is
} from 'bpmn-js/lib/features/modeling/util/ModelingUtil';

import {
  assign,
  bind
} from 'min-dash';
import CustomContextPad from './CustomContextPad';


export default function CustomContextPadProvider(injector, connect, translate) {
  injector.invoke(ContextPadProvider, this);
  var cached = bind(this.getContextPadEntries, this);

  const _getContextPadEntries =
    ContextPadProvider.prototype.getContextPadEntries;
    ContextPadProvider.prototype.getContextPadEntries = function(element) {
      var businessObject = element.businessObject;
	  
	  const entries = _getContextPadEntries.apply(this, [element]);
	  
	  
	  if ((element.type === "bpmn:IntermediateThrowEvent") && (businessObject.suitable > 0)){
      delete entries["append.end-event"];
      delete entries["append.intermediate-event"];
      delete entries["append.gateway"];
      delete entries["append.append-task"];
      delete entries["append.text-annotation"];
      // loescht die Arrows, also die Möglichkeit Objekte zu verbinden
      delete entries["connect"];
      delete entries["append.red-circle"];
      delete entries["append.yellow-circle"];
      delete entries["append.green-circle"];
    } else if (element.type === "bpmn:SubProcess" && businessObject.suitable == 100){
      delete entries["append.end-event"];
      delete entries["append.intermediate-event"];
      delete entries["append.gateway"];
      delete entries["append.append-task"];
      delete entries["append.text-annotation"];
      // loescht den Schraubenschlüssel
      delete entries["replace"];
      // loescht die Arrows, also die Möglichkeit Objekte zu verbinden
      delete entries["connect"];
    }
      return entries;
    
  }

}

inherits(CustomContextPadProvider, ContextPadProvider, CustomContextPad);

CustomContextPadProvider.$inject = [
  'injector',
  'connect',
  'translate'
];
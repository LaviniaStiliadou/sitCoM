import {
  reduce
} from 'min-dash';

import inherits from 'inherits';

import {
  isAny
} from 'bpmn-js/lib/features/modeling/util/ModelingUtil';

import {
  is
} from 'bpmn-js/lib/util/ModelUtil';

import RuleProvider from 'diagram-js/lib/features/rules/RuleProvider';

// need for snapping boundary events (customs) on border -- siehe Zeile 56-62
// fhhfhf
import {
	getBoundaryAttachment as isBoundaryAttachment
}	from 'bpmn-js/lib/features/snapping/BpmnSnappingUtil';

// need evtl?
import {
	BpmnGridSnapping as isGridSnappable
}   from 'bpmn-js/lib/features/grid-snapping/BpmnGridSnapping';


var HIGH_PRIORITY = 1500;


function isCustom(element) {
  return element && /^custom:/.test(element.type);
}

/**
 * Specific rules for custom elements
 */
export default function CustomRules(eventBus) {
  RuleProvider.call(this, eventBus);
}

inherits(CustomRules, RuleProvider);

CustomRules.$inject = [ 'eventBus' ];


CustomRules.prototype.init = function() {
	
  /**
   * Can shape be created on target container?
   */
  function canCreate(shape, target, source, position) {

    // only judge about custom elements
    if (!isCustom(shape)) {
      return;
    }
  }

  function canAttach(context){
    var shape = context.shape,
      target = context.target;
    var businessObject = shape.businessObject;
    var targetBusinessObject = target.businessObject;

  
    if (isAny(shape, [
    'bpmn:IntermediateThrowEvent', 'bpmn:IntermediateCatchEvent', 'bpmn:BoundaryEvent'])  && 
    (businessObject.suitable == 100 || businessObject.suitable == 50 || 
      businessObject.suitable == 25) &&
    ((is(target, 'bpmn:SubProcess')) ||  (is(target, 'bpmn:Task')))
     && (targetBusinessObject.suitable != 100 && targetBusinessObject.suitable != 200 )) {
      return false;
      }
  }
  
  // dont know if its needed, maybe rework
  this.addRule('elements.create', HIGH_PRIORITY, function(context) {
	  
    var shapes = context.shapes,
		target = context.target,
        source = context.source,
		position = context.position;

	return every(elements, function(element) {
	
      return canCreate(element, target, null, position);
    });
  });
	
  // maybe need rework ??
  this.addRule('elements.move', HIGH_PRIORITY, function(context) {

    var shapes = context.shapes,
		target = context.target,
    source = context.source,
		position = context.position;
		
    var type;

    // klappt noch nicht 
    // beheben...
    if(is(shapes, 'bpmn:IntermediateThrowEvent') && is(target, 'bpmn:SubProcess')){
      return canAttach(context);
    }

    // do not allow mixed movements of custom / BPMN shapes
    // if any shape cannot be moved, the group cannot be moved, too
    var allowed = reduce(shapes, function(result, s) {
      if (type === undefined) {
        type = isCustom(s);
      }

      if (type !== isCustom(s) || result === false) {
        return false;
      }
	  
      return canCreate(s, target, source, position);
    }, undefined);

    // reject, if we have at least one
    // custom element that cannot be moved
    return allowed;
  });

  // done
  this.addRule('shape.create', HIGH_PRIORITY, function(context) {
    var shape = context.shape,
		target = context.target,
		source = context.source,
		position = context.position;   

    return canCreate(shape, target, source, position);
  });
  
  // ist fuer das erste Drankleben aus der Palette
  // damit Situationsintermediateevents nie an Task oder normale Subprocess geklebt werden 
  this.addRule('shape.attach', HIGH_PRIORITY, function(context) {
    var shape = context.shape,
      target = context.target;
    var businessObject = shape.businessObject;
    var targetBusinessObject = target.businessObject;

  
    if (isAny(shape, [
    'bpmn:IntermediateThrowEvent', 'bpmn:IntermediateCatchEvent', 'bpmn:BoundaryEvent'])  && 
    (businessObject.suitable == 100 || businessObject.suitable == 50 || 
      businessObject.suitable == 25) &&
    ((is(target, 'bpmn:SubProcess')) ||  (is(target, 'bpmn:Task')))
     && (targetBusinessObject.suitable != 100 && targetBusinessObject.suitable != 200 )) {
      return false;
      }
  
    });

};

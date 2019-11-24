import {
  reduce
} from 'min-dash';

import inherits from 'inherits';

import {
  is
} from 'bpmn-js/lib/util/ModelUtil';

import RuleProvider from 'diagram-js/lib/features/rules/RuleProvider';

// need for snapping boundary events (customs) on border -- siehe Zeile 56-62
import {
	getBoundaryAttachment as isBoundaryAttachment
}	from 'bpmn-js/lib/features/snapping/BpmnSnappingUtil';


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
  function canCreate(shape, target) {

    // only judge about custom elements
    if (!isCustom(shape)) {
      return;
    }

    // allow creation on processes
    return is(target, 'bpmn:Process') || is(target, 'bpmn:Participant') || is(target, 'bpmn:Collaboration');
  }
  
  //////////////////////////////////////////////////
  
  // define rect as container ---- muss irgendwie noch mit dem BpmnSnappingUtil bzw. dessen config verbunden werden
  function isContainer(shape) {
	if(is(shape, 'custom:rect')) {
		return true;
    }
  return false;
  }
  
  // moving rect everywhere ---- evtl + parameter position)
  function canDrop(shape, target) {
	 if(is(shape, 'custom:rect')) {
	 return true;
	 }		 
  }
  
  // define circles as boundary events
  function isBoundaryEvent(shape) {
	  return is(shape, [
	  'custom:custom-circle-green',
	  'custom:custom-circle-yellow',
	  'custom:custom-circle-red'
	  ])
  }
     
  // attach function
  function canAttach(shape, target) {
	  
	  // only handle boundary events
	  if (!isBoundaryEvent(shape)) {
		  return false;
	  }
	  
	  // only allow drop on bpmn:rect
	  if (!is(target, 'custom:rect')) {
	    return false;
	  }
	  
//	  // only attach to subprocess border
//      if (position && !isBoundaryAttachment(position, target)) {
//        return false;
//      }
	  
  // ka why 'attach' ?!
  return 'attach';
  }
  
  //////////////////////////////////////////////////

  /**
   * Can source and target be connected?
   */
  function canConnect(source, target) {

    // only judge about custom elements
    if (!isCustom(source) && !isCustom(target)) {
      return;
    }

    // allow connection between custom shape and task
    if (isCustom(source)) {
      if (is(target, 'bpmn:Task')) {
        return { type: 'custom:connection' };
      } else {
        return false;
      }
    } else if (isCustom(target)) {
      if (is(source, 'bpmn:Task')) {
        return { type: 'custom:connection' };
      } else {
        return false;
      }
    }
  }

  this.addRule('elements.move', HIGH_PRIORITY, function(context) {

    var target = context.target,
        shapes = context.shapes;

    var type;

    // do not allow mixed movements of custom / BPMN shapes
    // if any shape cannot be moved, the group cannot be moved, too
    var allowed = reduce(shapes, function(result, s) {
      if (type === undefined) {
        type = isCustom(s);
      }

      if (type !== isCustom(s) || result === false) {
        return false;
      }

      return canCreate(s, target);
    }, undefined);

    // reject, if we have at least one
    // custom element that cannot be moved
    return allowed;
  });

  this.addRule('shape.create', HIGH_PRIORITY, function(context) {
    var target = context.target,
        shape = context.shape;

    return canCreate(shape, target);
  });

  this.addRule('shape.resize', HIGH_PRIORITY, function(context) {
    var shape = context.shape;

    if (isCustom(shape)) {
      // resize custom elements
      return true;
    }
  });

  this.addRule('connection.create', HIGH_PRIORITY, function(context) {
    var source = context.source,
        target = context.target;

    return canConnect(source, target);
  });

  this.addRule('connection.reconnectStart', HIGH_PRIORITY, function(context) {
    var connection = context.connection,
        source = context.hover || context.source,
        target = connection.target;

    return canConnect(source, target, connection);
  });

  this.addRule('connection.reconnectEnd', HIGH_PRIORITY, function(context) {
    var connection = context.connection,
        source = connection.source,
        target = context.hover || context.target;

    return canConnect(source, target, connection);
  });

};

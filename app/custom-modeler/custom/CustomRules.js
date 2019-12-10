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
	
	// all custom shapes except rect only allowed on rect
	if (!is(shape, 'custom:rect')) {
	  return is(target, 'custom:rect') || is(target, 'bpmn:SubProcess');
	}

    // allow creation of rect on processes & rect
    return is(target, 'bpmn:Process') || is(target, 'bpmn:Participant') || is(target, 'bpmn:Collaboration') || is(target, 'custom:rect');
  }
  
  //////////////////////////////////////////////////
  
  // define rect as container ---- muss irgendwie noch mit dem BpmnSnappingUtil bzw. dessen config verbunden werden
  function isContainer(element) {
	if(is(element, 'custom:rect')) {
		return true;
    }
  return false;
  }
  
  // moving rect everywhere ---- evtl + parameter position)
  function canDrop(shape, target) {
	 if(is(shape, 'custom:rect') || is(shape, 'bpmn:SubProcess')) {
	 return true;
	 }		 
  }
  
  // define circles as boundary events
  function isBoundaryEvent(element) {
	  return is(element, [
	  'custom:circle-green',
	  'custom:circle-yellow',
	  'custom:circle-red'
	  ])
  }
     
  // attach function
  function canAttach(elements, target, source, position) {
	  
	  if (!Array.isArray(elements)) {
         elements = [ elements ];
      }
	  
	  // only (re-)attach one element at a time
      if (elements.length !== 1) {
         return false;
      }
	  
	  var element = elements[0];
	  	  
	  // only handle boundary events
	  if (!isBoundaryEvent(element)) {
		  return false;
	  }
	  
	  // only allow drop on bpmn:rect
	  if (!is(target, 'custom:rect') || !is(target, 'bpmn:SubProcess')) {
	    return false;
	  }
	  
	  // only attach to subprocess border
      if (position && !isBoundaryAttachment(position, target)) {
        return false;
      }
	  
  // ka why 'attach' ?!
  return 'attach';
  }
  
  function canMove(elements, target) {
	  
  // allow default move check to start move operation
  if (!target) {
    return true;
  }

  return elements.every(function(element) {
    return canDrop(element, target);
  });
}
  //////////////////////////////////////////////////
  
  this.addRule('elements.create', HIGH_PRIORITY, function(context) {
	  
    var shapes = context.shapes,
		target = context.target,
        source = context.source,
		position = context.position;

	return every(elements, function(element) {
	
	if (element.host) {
        return canAttach(element, element.host, null, position);
      }

      return canCreate(element, target, null, position);
    });
  });
	

  this.addRule('elements.move', HIGH_PRIORITY, function(context) {

    var shapes = context.shapes,
		target = context.target,
        source = context.source,
		position = context.position;
		


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
	  
      return canAttach(s, target, source, position) ||
			canMove(shapes, target, position);
//     return canCreate(s, target, source, position);
    }, undefined);

    // reject, if we have at least one
    // custom element that cannot be moved
    return allowed;
  });

  this.addRule('shape.create', HIGH_PRIORITY, function(context) {
    var shape = context.shape,
		target = context.target,
		source = context.source,
		position = context.position;   

    return canCreate(shape, target, source, position);
  });
  
  this.addRule('shape.attach', HIGH_PRIORITY, function(context) {
	  
	var shape = context.shape,
		target = context.taret,
		source = null,
	    position = context.position;		

    return canAttach(shape, target, source, position);
  });

  this.addRule('shape.resize', HIGH_PRIORITY, function(context) {
    var shape = context.shape;

    if (isCustom(shape)) {
      // resize custom elements
      return true;
    }
  });
  
  
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

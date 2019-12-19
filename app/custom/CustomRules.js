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
	
//	// all custom shapes except rect only allowed on rect
//	if (!is(shape, 'custom:rect')) {
//	  return is(target, 'custom:rect') || is(target, 'bpmn:SubProcess');
//	}

    // allow creation of rect on processes & rect
	//wird wahrscheinlich nicht mehr gebraucht?
	if (is(shape, 'custom:rect')) {
		return is(target, 'bpmn:Process') || is(target, 'bpmn:Participant') || is(target, 'bpmn:Collaboration') || is(target, 'custom:rect');
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
  
  // need some rework
  this.addRule('shape.attach', HIGH_PRIORITY, function(context) {
	  
	var shape = context.shape,
		target = context.target,
		source = null,
	    position = context.position;
		//suitable = context.suitable;
	
	// allow circles to rect & subProcess Border on creation
	//context = element?
	if (isAny(shape, [
	'custom:circle-green',
	'custom:circle-yellow',
	//'bpmn:intermediateThrowEvent',
	'custom:circle-red']) && (is(target, 'custom:rect') || is(target, 'bpmn:SubProcess'))) {
		
		return 'attach';
    }
  });

  // done
  this.addRule('shape.resize', HIGH_PRIORITY, function(context) {
    var shape = context.shape;

	// disallow resize of circles
    if (isAny(shape, [
	'custom:circle-green',
	'custom:circle-yellow',
	'custom:circle-red'])) {
		return false;
    }
	
	// allow resize of rect
	if (is(shape, 'custom:rect')) {
		return true;
	}
  });
  
  

};

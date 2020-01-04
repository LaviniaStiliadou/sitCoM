import {
  forEach,
  find,
  every,
  has,
  reduce,
  some
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
   * Derzeit erstes Erstellen von Situationskreisen an Participant etc nicht erlaubt (damit sie nicht frei sind)
   * 
   */
  function canCreate(shape, target, source, position) {
    var businessObject = shape.businessObject;
    var targetBusinessObject = target.businessObject;
//    if (isAny(shape, [
//      'bpmn:IntermediateThrowEvent', 'bpmn:IntermediateCatchEvent', 'bpmn:BoundaryEvent'])  && 
//      (businessObject.suitable == 100 || businessObject.suitable == 50 || 
//        businessObject.suitable == 25) &&
//      ((is(target, 'bpmn:Participant')) ||  (is(target, 'bpmn:Lane')) ||  (is(target, 'bpmn:Pool')))
//       && (targetBusinessObject.suitable != 100 && targetBusinessObject.suitable != 200 )) {
//        return false;
//       } 
	
	// SubProcess Score 100 nur auf  SubProcess Scroe 200 erlaubt
	if (is(shape, 'bpmn:SubProcess') && businessObject.suitable == 100) {
	    return (is(target, 'bpmn:SubProcess') && targetBusinessObject.suitable == 200);
	}
	



  return canDrop(shape, target, position);    
		

  }

  // verbietet das Verbinden von Situationskreisen 
  // verbietet das Verbinden von inner Rects mit Score = 100
  // verbietet Verbinden von Intermediate zu Situationskreisen und umgekehrt
  function canConnect(source, target) {
    var businessObject = source.businessObject;
    var targetBusinessObject = target.businessObject;

    // keine Verbindung von nicht Subprocessen mit Score != 100 zu Situationskreisen
    if ((is(target, 'bpmn:IntermediateThrowEvent')) && (!is(source, 'bpmn:SubProcess'))
    && businessObject.suitable != 100 && targetBusinessObject.suitable > 0){
      return false;
    }

    // keine Verbindung von nicht Subprocessen mit Score != 100 zu Situationskreisen
    if ((is(target, 'bpmn:IntermediateThrowEvent')) && (is(source, 'bpmn:SubProcess'))
    && businessObject.suitable == 200 && targetBusinessObject.suitable > 0){
      return false;
    }

    if ((is(source, 'bpmn:IntermediateThrowEvent')) &&  businessObject.suitable >0){
      return false;
    }

    if ((is(source, 'bpmn:BoundaryEvent')) &&   businessObject.suitable >0){
      return false;
    }

    // damit Rect mit Score = 200 nicht mit Score = 100 verbunden werden duerfen
    if (!is(target, 'bpmn:IntermediateThrowEvent') &&
     (is(source, 'bpmn:SubProcess')) && businessObject.suitable == 200
      && targetBusinessObject.suitable >0){
      return false;
    }

    if ((is(target, 'bpmn:SubProcess')) && targetBusinessObject.suitable == 100){
      return false;
    }

    // damit Rect mit Score = 100 nicht mit Score = 200 verbunden werden duerfen
    if (is(target, 'bpmn:SubProcess') &&
     (is(source, 'bpmn:SubProcess')) && businessObject.suitable == 100
      && targetBusinessObject.suitable == 200){
      return false;
    }
  }
  

  function canAttach(shapes, target, source, position){
	  
if (!Array.isArray(shapes)) {
    shapes = [ shapes ];
  }

  // only (re-)attach one element at a time
  if (shapes.length !== 1) {
    return false;
  }

  var shape = shapes[0];
	  	  
    var businessObject = shape.businessObject;
//    var targetBusinessObject = target.businessObject;
	
	
	if (isAny(shape, [
	    'bpmn:IntermediateThrowEvent',
	    'bpmn:IntermediateCatchEvent',
	    'bpmn:BoundaryEvent']) &&
	    (businessObject.suitable == 100 || businessObject.suitable == 50 || 
        businessObject.suitable == 25) && (!is(target, 'bpmn:SubProcess'))) //|| (is(target, 'bpmn:SubProcess') && (targetBusinessObject.suitable != 100))))
		{
			return false;
		}

//    if (isAny(shape, [
//    'bpmn:IntermediateThrowEvent', 'bpmn:IntermediateCatchEvent', 'bpmn:BoundaryEvent'])  && 
//    (businessObject.suitable == 100 || businessObject.suitable == 50 || 
//      businessObject.suitable == 25) &&
//    ((is(target, 'bpmn:SubProcess')) ||  (is(target, 'bpmn:Task')))
//     && (targetBusinessObject.suitable != 100)) {
//      return false;
//      }


  }
  
  function canDrop(shape, target, position) {
    var businessObject = shape.businessObject;
    var targetBusinessObject = target.businessObject;
	
if (isAny(shape, [
	    'bpmn:IntermediateThrowEvent',
	    'bpmn:IntermediateCatchEvent',
	    'bpmn:BoundaryEvent']) &&
	    (businessObject.suitable == 100 || businessObject.suitable == 50 || 
        businessObject.suitable == 25))
		{
			return false;
		}
	  
  }
  
  function canMove(shapes, target) {
	  
	if (some(shapes, function(shape){
	    if (is(shape, 'bpmn:Lane')) {
		return false;
		}
	}));
	
    if (!Array.isArray(shapes)) {
        shapes = [ shapes ];
    }

    // only (re-)attach one element at a time
    if (shapes.length !== 1) {
        return false;
    }

    var shape = shapes[0];
	
	 var businessObject = shape.businessObject;
//	 var targetBusinessObject = target.businessObject; /////////////////// WILL NICHT -- target is undefined
	 
//	 if(is(target, 'bpmn:SubProcess') && (targetBusinessObject.suitable == 200)) {
//	     return false;
//	 }
	
//if (isAny(shape, [
//	    'bpmn:IntermediateThrowEvent',
//	    'bpmn:IntermediateCatchEvent',
//	    'bpmn:BoundaryEvent']) &&
//	    (businessObject.suitable == 100 || businessObject.suitable == 50 || 
//       businessObject.suitable == 25) && (!is(target, 'bpmn:SubProcess') || (is(target, 'bpmn:SubProcess') && (targetBusinessObject.suitable != 100))))
//		{
//			return false;
//		}
	
	if (!target) {
		return true;
	}
  
  }
  
	
  // maybe need rework ??
  this.addRule('elements.move', HIGH_PRIORITY, function(context) {

    var shapes = context.shapes,
		target = context.target,
		source = context.source,
		position = context.position;
		
    var type;
//	var test = false;
//	var bla = true;
	
	return canAttach(shapes, target, null, position) ||
	       canMove(shapes, target, position);
	
/*	
	if (some(shapes, function(shape) {
		if (shape.businessObject.suitable != 25) {
			bla = false;
		} else {
			target = shape.host;
			return canAttach(shape, target, null, position);
		}
	}));
	
if (bla) {
	return canAttach(shape, target, null, position);
}
*/

	
	
	
//	if (some(shapes, function(shape) {
//		if (shape.businessObject.suitable == 25) {			
//		test = true;
//		}
//	}));
//	if (test) {
//		return canAttach(context);
//	}

	
//	if (forEach(shapes, function(shape) {
//		if (shape.businessObject.suitable == 25) {			
//		return false;
//		}
//	}));
	
	
//	var shape = shapes[0]
//	var businessObject = shape.businessObject;
//    var targetBusinessObject = target.businessObject;
	
//	var x = reduce(shapes, function(result, s);
//	var businessObject = s.businessObject;
//    var targetBusinessObject = target.businessObject;
	

    // klappt noch nicht 
    // beheben...
//	  if(some(shapes, isBoundaryEvent)) {
//		  return canAttach(context);
//	  }
//    if(some(shapes, 'bpmn:BoundaryEvent') || some(shapes, 'bpmn:IntermediateCatchEvent') || some(shapes, 'bpmn:IntermediateThrowEvent')) {
//      return canAttach(context);
//    }

//    if(is(shapes, 'bpmn:IntermediateThrowEvent') && is(target, 'bpmn:Participant')){
//      return canCreate(shapes, target, source, position);
//    }
    
  });

  // done
  this.addRule('shape.create', HIGH_PRIORITY, function(context) {
    var shape = context.shape,
		target = context.target,
		source = context.source,
		position = context.position;   

    return canCreate(shape, target, source, position);
  });
  
  this.addRule('elements.create', HIGH_PRIORITY, function(context) {
    var shapes = context.shapes,
        position = context.position,
        target = context.target;

    return every(shapes, function(shape) {

      if (shape.host) {
        return canAttach(shape, shape.host, null, position);
      }

      return canCreate(shape, target, null, position);
    });
  });
  
  // ist fuer das erste Drankleben aus der Palette
  // damit Situationsintermediateevents nie an Task oder normale Subprocess geklebt werden 
  // damit IntermediateEvents nicht an Situationsscopes geklebt werden 
  this.addRule('shape.attach', HIGH_PRIORITY, function(context) {
    var shape = context.shape,
        target = context.target,
	    position = context.position;
    var businessObject = shape.businessObject;
    var targetBusinessObject = target.businessObject;

  
    if (isAny(shape, [
    'bpmn:IntermediateThrowEvent', 'bpmn:IntermediateCatchEvent', 'bpmn:BoundaryEvent'])  && 
    (businessObject.suitable == 100 || businessObject.suitable == 50 || 
      businessObject.suitable == 25) &&
    ((is(target, 'bpmn:SubProcess')) ||  (is(target, 'bpmn:Task')))
     && (targetBusinessObject.suitable != 100 || targetBusinessObject.suitable == 200 )) {
      return false;
      }

      // damit normale IntermediateEvents nicht an Situationsscopes geklebt werden duerfen
      if (isAny(shape, [
        'bpmn:IntermediateThrowEvent', 'bpmn:IntermediateCatchEvent', 'bpmn:BoundaryEvent'])  && 
        (businessObject.suitable != 100 && businessObject.suitable != 50 && 
          businessObject.suitable != 25) &&
        ((is(target, 'bpmn:SubProcess')))
         && (targetBusinessObject.suitable == 100 || targetBusinessObject.suitable == 200 )) {
          return false;
          }
	
	return canAttach(shape, target, null, position);
    });

    this.addRule('connection.create', HIGH_PRIORITY, function(context) {
      let source = context.source,
        target = context.target;
  
      return canConnect(source, target);
  
    });

};

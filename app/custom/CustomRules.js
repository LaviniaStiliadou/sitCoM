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

var HIGH_PRIORITY = 1500;

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
   * Can shape be created on target container
   * 
   * 
   */
  function canCreate(shape, target, source, position) {
    var businessObject = shape.businessObject;
    var targetBusinessObject = target.businessObject;
    if (is(shape, 'bpmn:SubProcess') && businessObject.suitable == 100) {
	    return (targetBusinessObject.suitable == 200);
    }

    if (!is(shape, 'bpmn:SubProcess') && (targetBusinessObject.suitable == 200)) {
	    return false;
    }

    if (isAny(shape, ['bpmn:IntermediateThrowEvent','bpmn:IntermediateCatchEvent',
     'bpmn:BoundaryEvent']) &&(businessObject.suitable == 100 ||
      businessObject.suitable == 50 || businessObject.suitable == 25)) {
        return false;
    }

  
  
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

  function canMove(context){
    var shapes = context.shape,
        target = context.target,
        source = context.source,
        position = context.position;
    var businessObject = context.shapes[0].businessObject;
     
    if(target != undefined){
      var targetBusinessObject = target.businessObject;
    // damit Situationskreise nicht rausgezogen werden  
    if((is(context.shapes[0], 'bpmn:IntermediateThrowEvent') || is(context.shapes[0], 'bpmn:BoundaryEvent'))
     && (!is(target, 'bpmn:SubProcess') || is(target, 'bpmn:SubProcess')) && (targetBusinessObject.suitable != 100 || targetBusinessObject.suitable == 200) && businessObject.suitable > 0 ){
      return false;
    }

    // damit normale IntermediateEvents nicht an Situationsscopes geklebt werden
    if((is(context.shapes[0], 'bpmn:IntermediateThrowEvent') || is(context.shapes[0], 'bpmn:BoundaryEvent'))
     && (!is(target, is(target, 'bpmn:SubProcess'))&& ( businessObject.suitable !=25 && businessObject.suitable != 50 && businessObject.suitable !=100) && (targetBusinessObject.suitable == 100 || targetBusinessObject.suitable == 200))){
      return false;
    }

    // damit normale IntermediateEvents nicht an Situationsscopes geklebt werden
    if(!(is(context.shapes[0], 'bpmn:IntermediateThrowEvent') || is(context.shapes[0], 'bpmn:BoundaryEvent'))
     && (!is(target, is(target, 'bpmn:SubProcess'))&& ( businessObject.suitable !=25 && businessObject.suitable != 50 && businessObject.suitable !=100) && (targetBusinessObject.suitable == 100 || targetBusinessObject.suitable == 200))){
      return false;
    }

    // damit Rect mit 100 nicht rausgezogen werden
    if((is(context.shapes[0], 'bpmn:SubProcess'))
     && (!is(target,'bpmn:SubProcess'))&& ( businessObject.suitable ==100) && (targetBusinessObject.suitable != 100 || targetBusinessObject.suitable != 200)){
      return false;
    }

    }
  }  
  
	
  this.addRule('elements.move', 4000, function(context) {
    return canMove(context);  
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
  // damit IntermediateEvents nicht an Situationsscopes geklebt werden 
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
     && (targetBusinessObject.suitable != 100 || targetBusinessObject.suitable == 200 )) {
      return false;
      }

      if (isAny(shape, [
        'bpmn:IntermediateThrowEvent', 'bpmn:IntermediateCatchEvent', 'bpmn:BoundaryEvent'])  && 
        (businessObject.suitable == 100 || businessObject.suitable == 50 || 
          businessObject.suitable == 25) &&
        ((is(target, 'bpmn:Task')))) {
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
  
    });

    this.addRule('connection.create', HIGH_PRIORITY, function(context) {
      let source = context.source,
        target = context.target;
  
      return canConnect(source, target);
  
    });

};

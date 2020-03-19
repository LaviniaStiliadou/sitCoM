import {
  filter
} from 'min-dash';

import inherits from 'inherits';

import {
  isAny
} from 'bpmn-js/lib/features/modeling/util/ModelingUtil';

import {
  is
} from 'bpmn-js/lib/util/ModelUtil';

import {
  getBoundaryAttachment as isBoundaryAttachment
} from 'bpmn-js/lib/features/snapping/BpmnSnappingUtil';

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

	// one StartEvent in OuterScope is allowed for the default innerScope
    if (is(shape, 'bpmn:StartEvent') && is(target, 'bpmn:SubProcess') && (targetBusinessObject.suitable == 200)) {
      var startEvent;
	  // check if there is already a StartEvent in OuterScope
      startEvent = target.children.filter(function(child) {
        return is(child, 'bpmn:StartEvent');
      })[0];
	  if(!startEvent) {
        return true;
	  }
	  return false;
    }
	
    // InnerScope (100) is only allowed to be created in OuterScope (200) 
    if (is(shape, 'bpmn:SubProcess') && businessObject.suitable == 100) {
	    return (is(target, 'bpmn:SubProcess') && targetBusinessObject.suitable == 200);
    }

    // OuterScope (200) is not allowed to be created in OuterScope (200)
    if (is(shape, 'bpmn:SubProcess') && businessObject.suitable == 200 && (is(target, 'bpmn:SubProcess') && targetBusinessObject.suitable == 200)){
	    return false;
    }

    // OuterScope (200) is not allowed to be created in InnerScope (100)
    if (is(shape, 'bpmn:SubProcess') && (businessObject.suitable == 200) && is(target, 'bpmn:SubProcess') &&
    (targetBusinessObject.suitable == 100)) {
	    return false;
    }

    // Not any object is allowed to be created in any area except for OuterScope
    if (!is(shape, 'bpmn:SubProcess') && (targetBusinessObject.suitable == 200)) {
	    return false;
    }

    // Normal SubProcess is not allowed to be created in OuterScope (200)
    if (is(shape, 'bpmn:SubProcess')  && (businessObject.suitable != 200)  && (businessObject.suitable != 100)&& (targetBusinessObject.suitable == 200)) {
	    return false;
    }

    // SituationsEvent is not allowed to be created in any area
    if (isAny(shape, ['bpmn:IntermediateThrowEvent','bpmn:IntermediateCatchEvent',
     'bpmn:BoundaryEvent']) && (businessObject.suitable == 100 ||
      businessObject.suitable == 50 || businessObject.suitable == 25)) {
        return false;
    }
  }

  function canConnect(source, target) {
	if(target == null){
		return false;
	}
	  
    var businessObject = source.businessObject;
    var targetBusinessObject = target.businessObject;

    // no connection is allowed from everything except InnerScope (100) to SituationEvents
    if ((!is(source, 'bpmn:SubProcess')) && (is(target, 'bpmn:IntermediateThrowEvent'))
    && businessObject.suitable != 100 && targetBusinessObject.suitable > 0){
      return false;
    }

    // no connection from SituationEvents
    if ((is(source, 'bpmn:IntermediateThrowEvent')) &&  businessObject.suitable >0){
      return false;
    }

    // no connection from SituationEvents
    if ((is(source, 'bpmn:BoundaryEvent')) && businessObject.suitable >0){
      return false;
    }

    // no connection from OuterScope (200) to InnerScope (100)
    if (is(source, 'bpmn:SubProcess') && businessObject.suitable == 200
      && is(target, 'bpmn:SubProcess') && targetBusinessObject.suitable == 100){
      return false;
    }

	// no connection from InnerScope (100)
	if(is(source, 'bpmn:SubProcess') && businessObject.suitable == 100) {
	  return false;
	}
	
	// In OuterScope one connection from StartEvent to default InnerScope (100)
	if(is(source, 'bpmn:StartEvent') && is(target, 'bpmn:SubProcess') && targetBusinessObject.suitable == 100) {
      var sequenceFlow;
	  // check if OuterScope has already a sequenceFlow
      sequenceFlow = target.parent.children.filter(function(child) {
        return is(child, 'bpmn:SequenceFlow');
      })[0];
	  // if no sequenceFlow exist yet
	  if(!sequenceFlow) {
        return;
	  }
	  return false;
	}

	// no connection to InnerScope (100) / OuterScope (200)
    if ((is(target, 'bpmn:SubProcess')) && targetBusinessObject.suitable == 100){
      return false;
    }

/*
	// no connection from InnerScope (100) /  OuterScope (200)
	if(is(source, 'bpmn:SubProcess') && (businessObject.suitable == 200 || businessObject.suitable == 100)) {
	  return false;
	}


	// no connection to InnerScope (100) / OuterScope (200)
    if ((is(target, 'bpmn:SubProcess')) && (targetBusinessObject.suitable == 200 || targetBusinessObject.suitable == 100)){
      return false;
    }
*/
    // no connection from InnerScope (100) to OuterScope (200)
    if (is(target, 'bpmn:SubProcess') &&
     (is(source, 'bpmn:SubProcess')) && businessObject.suitable == 100
      && targetBusinessObject.suitable == 200){
      return false;
    }
		
  }

  /**
   * Can shape be moved on target container
   * 
   * 
   */
  function canMove(context){
    var shapes = context.shape,
        target = context.target,
        source = context.source,
        position = context.position;
    var businessObject = context.shapes[0].businessObject;
	
	
    if(target != undefined) {
      var targetBusinessObject = target.businessObject;
	
	// OuterScope (200) can not be moved into another OuterScope (200)
    if((is(context.shapes[0], 'bpmn:SubProcess')) && (businessObject.suitable == 200) &&
      ((is(target, 'bpmn:SubProcess') && targetBusinessObject.suitable == 200 && businessObject.suitable!=100))){
        return false;
      }
	  
    // Neither InnerScope (100) or OuterScope (200) can be moved into an InnerScope (100)
    if((is(context.shapes[0], 'bpmn:SubProcess')) && (is(target, 'bpmn:SubProcess')) && (targetBusinessObject.suitable == 100) 
    && businessObject.suitable > 0 ){
      return false;
    }

    // normal SubProcesses can not be moved into OuterScope (200)
    if((is(context.shapes[0], 'bpmn:SubProcess')) && (is(target, 'bpmn:SubProcess')) && (targetBusinessObject.suitable == 200) 
    && (businessObject.suitable != 100 && businessObject.suitable !=200 )){
      return false;
    }

    // InnerScope (100) can not be moved into InnerScopes (100) or normal SubProcesses
    if((is(context.shapes[0], 'bpmn:SubProcess')) && (businessObject.suitable == 100) &&
    (!is(target,'bpmn:SubProcess') || (is(target, 'bpmn:SubProcess') && targetBusinessObject.suitable!=200))){
      return false;
    }
	
	// InnerScope can be moved inside an OuterScope
	if((is(context.shapes[0], 'bpmn:SubProcess')) && (businessObject.suitable == 100) &&
    (is(target,'bpmn:SubProcess')) && (targetBusinessObject.suitable == 200)){
      return true;
    }

    // SituationEvents can not be moved outside  
    if((isAny(context.shapes[0], ['bpmn:IntermediateThrowEvent','bpmn:IntermediateCatchEvent',
     'bpmn:BoundaryEvent'])) && (businessObject.suitable > 0) &&
    ((!is(target, 'bpmn:SubProcess')) || (is(target, 'bpmn:SubProcess')) && (targetBusinessObject.suitable != 100 || targetBusinessObject.suitable == 200))){
      return false;
    }
	
    // SituationEvents can be moved everywhere on the boundary of an InnerScope
    if((isAny(context.shapes[0], ['bpmn:IntermediateThrowEvent','bpmn:IntermediateCatchEvent',
     'bpmn:BoundaryEvent']))
    && (is(target, 'bpmn:SubProcess') && (targetBusinessObject.suitable == 100) && businessObject.suitable > 0) && (position && !isBoundaryAttachment(position, target))){
      return false;
    }

	// normal IntermediateEvents can be moved inside an InnerScope
	if((isAny(context.shapes[0], ['bpmn:IntermediateThrowEvent','bpmn:IntermediateCatchEvent',
     'bpmn:BoundaryEvent']))
    && (is(target, 'bpmn:SubProcess')) && (businessObject.suitable !=25 && businessObject.suitable != 50 && businessObject.suitable != 100) && (targetBusinessObject.suitable == 100)){
      return true;
    }

    // normal IntermediateEvents can not be moved inside OuterScope
    if((isAny(context.shapes[0], ['bpmn:IntermediateThrowEvent','bpmn:IntermediateCatchEvent',
     'bpmn:BoundaryEvent']))
    && (is(target, 'bpmn:SubProcess')) && (businessObject.suitable !=25 && businessObject.suitable != 50 && businessObject.suitable != 100) && (targetBusinessObject.suitable == 200)){
      return false;
    }
	
    }
  }  


  this.addRule('elements.move', 4000, function(context) {
    return canMove(context);  
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
      target = context.target,
	  position = context.position;
    var businessObject = shape.businessObject;
    var targetBusinessObject = target.businessObject;

    // no BoundaryEvents on OuterScope (200)
    if(is(target, 'bpmn:SubProcess') && is(shape, 'bpmn:SubProcess') && businessObject.suitable == 200 
    && targetBusinessObject.suitable == 200){
      return false;
    }

    // SituationEvents are not allowed on normal SubProcess or Tasks
    if (isAny(shape, [
    'bpmn:IntermediateThrowEvent', 'bpmn:IntermediateCatchEvent', 'bpmn:BoundaryEvent'])  &&
    (businessObject.suitable == 100 || businessObject.suitable == 50 || 
    businessObject.suitable == 25) &&
    (is(target, 'bpmn:SubProcess') ||  is(target, 'bpmn:Task')) &&
    (targetBusinessObject.suitable != 100)) {
      return false;
    }

    // Only allowed one type of SituationEvent attached to the border of an InnerScope (100)
    if (isAny(shape, [
    'bpmn:IntermediateThrowEvent', 'bpmn:IntermediateCatchEvent', 'bpmn:BoundaryEvent'])  &&
    (businessObject.suitable == 100 || businessObject.suitable == 50 || 
    businessObject.suitable == 25) &&
    (is(target, 'bpmn:SubProcess') &&
    (targetBusinessObject.suitable == 100)) && (position && isBoundaryAttachment(position, target))) {
      var find;
      var allowed = true;
      for(var i = 0; i< target.attachers.length; i++){
        if(target.attachers[i].businessObject.suitable == shape.businessObject.suitable){
          allowed = false;
          return false;
        }
      }
      return true;
    }

    // normal IntermediateEvents can not be attached on InnerScope (100)
    if (isAny(shape, [
    'bpmn:IntermediateThrowEvent', 'bpmn:IntermediateCatchEvent', 'bpmn:BoundaryEvent'])  &&
    (businessObject.suitable != 100 && businessObject.suitable != 50 &&
    businessObject.suitable != 25) &&
    (is(target, 'bpmn:SubProcess') &&
    (targetBusinessObject.suitable == 100 || targetBusinessObject.suitable == 200))) {
      return false;
    }
  });

    this.addRule('connection.create', HIGH_PRIORITY, function(context) {
      let source = context.source,
          target = context.target;

      return canConnect(source, target);
  
    });

};

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
	
    // SubProcess 100 darf nur in SubProcess 200 erzeugt werden 
    if (is(shape, 'bpmn:SubProcess') && businessObject.suitable == 100) {
	    return (is(target, 'bpmn:SubProcess') && targetBusinessObject.suitable == 200);
    }

    // SubProcess 200 darf nicht in SubProcess 200 erzeugt werden 
    if (is(shape, 'bpmn:SubProcess') && businessObject.suitable == 200 && (is(target, 'bpmn:SubProcess') && targetBusinessObject.suitable == 200)){
	    return false;
    }

    // SubProcess 200 darf nicht in SubProcess 100 erzeugt werden
    if (is(shape, 'bpmn:SubProcess') && (businessObject.suitable == 200) && is(target, 'bpmn:SubProcess') &&
    (targetBusinessObject.suitable == 100)) {
	    return false;
    }

    // Es darf außer SubProcess 200 kein anderes Objekt frei erzeugt werden
    if (!is(shape, 'bpmn:SubProcess') && (targetBusinessObject.suitable == 200)) {
	    return false;
    }
    if (is(shape, 'bpmn:SubProcess')  && (businessObject.suitable != 200)  && (businessObject.suitable != 100)&& (targetBusinessObject.suitable == 200)) {
	    return false;
    }

    // SituationsEvents dürfen nicht frei erzeugt werden
    if (isAny(shape, ['bpmn:IntermediateThrowEvent','bpmn:IntermediateCatchEvent',
     'bpmn:BoundaryEvent']) && (businessObject.suitable == 100 ||
      businessObject.suitable == 50 || businessObject.suitable == 25)) {
        return false;
    }
  }

  // verbietet das Verbinden von Situationskreisen 
  // verbietet das Verbinden von inner Rects mit Score = 100
  // verbietet Verbinden von Intermediate zu Situationskreisen und umgekehrt
  function canConnect(source, target) {
	if(target == null){
		return false;
	}
	  
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

    if ((is(source, 'bpmn:BoundaryEvent')) && businessObject.suitable >0){
      return false;
    }

    // damit Rect mit Score = 200 nicht mit Score = 100 verbunden werden duerfen
    if (!is(target, 'bpmn:IntermediateThrowEvent') &&
     (is(source, 'bpmn:SubProcess')) && businessObject.suitable == 200
      && targetBusinessObject.suitable == 100){
      return false;
    }
	
	// keine Verbindung von Scope 100 / 200 aus
	if(is(source, 'bpmn:SubProcess') && (businessObject.suitable == 200 || businessObject.suitable == 100)) {
	  return false;
	}

	// keine Verbindung zu Scope 100 / 200 hin
    if ((is(target, 'bpmn:SubProcess')) && (targetBusinessObject.suitable == 200 || targetBusinessObject.suitable == 100)){
      return false;
    }

    // damit Rect mit Score = 100 nicht mit Score = 200 verbunden werden duerfen
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
	
    //console.log(context.shapes[0]);
    if(target != undefined){
      var targetBusinessObject = target.businessObject;
    if((is(context.shapes[0], 'bpmn:SubProcess')) && (businessObject.suitable == 200) &&
      ((is(target, 'bpmn:SubProcess') && targetBusinessObject.suitable ==200 && businessObject.suitable!=100))){
        return false;
      }
    // damit Rect 100 sowie 200 nicht in 100 reingezogen werden
    if((is(context.shapes[0], 'bpmn:SubProcess')) && (is(target, 'bpmn:SubProcess')) && (targetBusinessObject.suitable == 100) 
    && businessObject.suitable > 0 ){
      return false;
    }

    // damit normale Subprocesse nicht in Rect 200 reingezogen werden
    if((is(context.shapes[0], 'bpmn:SubProcess')) && (is(target, 'bpmn:SubProcess')) && (targetBusinessObject.suitable == 200) 
    && (businessObject.suitable != 100 && businessObject.suitable !=200 )){
      return false;
    }

   // damit Rect mit 100 nicht rausgezogen werden 
   // damit Rect 100 nicht in normale Subprocesse reingezogen wird
    if((is(context.shapes[0], 'bpmn:SubProcess')) && (businessObject.suitable == 100) &&
    (!is(target,'bpmn:SubProcess') || (is(target, 'bpmn:SubProcess') && targetBusinessObject.suitable!=200))){
      return false;
    }
	
	// Rect 100 darf in Rect 200 bewegt werden
	if((is(context.shapes[0], 'bpmn:SubProcess')) && (businessObject.suitable == 100) &&
    (is(target,'bpmn:SubProcess')) && (targetBusinessObject.suitable == 200)){
      return true;
    }

    // damit Situationskreise nicht rausgezogen werden  
    if((isAny(context.shapes[0], ['bpmn:IntermediateThrowEvent','bpmn:IntermediateCatchEvent',
     'bpmn:BoundaryEvent'])) && (businessObject.suitable > 0) &&
    ((!is(target, 'bpmn:SubProcess')) || (is(target, 'bpmn:SubProcess')) && (targetBusinessObject.suitable != 100 || targetBusinessObject.suitable == 200))){
      return false;
    }
	
    // SituationsEvents können innerhalb des Rects 100 überall erzeugt werden, werden jedoch der Border zugewiesen
    if((isAny(context.shapes[0], ['bpmn:IntermediateThrowEvent','bpmn:IntermediateCatchEvent',
     'bpmn:BoundaryEvent']))
    && (is(target, 'bpmn:SubProcess') && (targetBusinessObject.suitable == 100) && businessObject.suitable > 0) && (position && !isBoundaryAttachment(position, target))){
      return false;
    }


	// normale IntermediateEvents dürfen in Rect 100 bewegt werden
	if((isAny(context.shapes[0], ['bpmn:IntermediateThrowEvent','bpmn:IntermediateCatchEvent',
     'bpmn:BoundaryEvent']))
    && (is(target, 'bpmn:SubProcess')) && (businessObject.suitable !=25 && businessObject.suitable != 50 && businessObject.suitable != 100) && (targetBusinessObject.suitable == 100)){
      //console.log(target.id);
      return true;
    }

    // normale IntermediateEvents dürfen NICHT in Rect 200 bewegt werden
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
  
  // ist fuer das erste Drankleben aus der Palette
  // damit Situationsintermediateevents nie an Task oder normale Subprocess geklebt werden 
  // damit IntermediateEvents nicht an Situationsscopes geklebt werden 
  this.addRule('shape.attach', HIGH_PRIORITY, function(context) {
    var shape = context.shape,
      target = context.target,
	  position = context.position;
    var businessObject = shape.businessObject;
    var targetBusinessObject = target.businessObject;

/*
    // Bei Create können die SituationsEvents überall innerhalb des Rect 100 erzeugt werden, werden aber der Border zugewiesen
    if (isAny(shape, [
    'bpmn:IntermediateThrowEvent', 'bpmn:IntermediateCatchEvent', 'bpmn:BoundaryEvent'])  &&
    (businessObject.suitable == 100 || businessObject.suitable == 50 || 
    businessObject.suitable == 25) &&
    (is(target, 'bpmn:SubProcess')) &&
    (targetBusinessObject.suitable == 100)) {
        return 'attach';
    }
*/  
   if(is(target, 'bpmn:SubProcess') && is(shape, 'bpmn:SubProcess') && businessObject.suitable ==200 
   && targetBusinessObject.suitable ==200){
     return false;
   }
	
    if (isAny(shape, [
    'bpmn:IntermediateThrowEvent', 'bpmn:IntermediateCatchEvent', 'bpmn:BoundaryEvent'])  &&
    (businessObject.suitable == 100 || businessObject.suitable == 50 || 
    businessObject.suitable == 25) &&
    (is(target, 'bpmn:SubProcess') ||  is(target, 'bpmn:Task')) &&
    (targetBusinessObject.suitable != 100)) {
        return false;
    }

    if (isAny(shape, [
      'bpmn:IntermediateThrowEvent', 'bpmn:IntermediateCatchEvent', 'bpmn:BoundaryEvent'])  &&
      (businessObject.suitable == 100 || businessObject.suitable == 50 || 
      businessObject.suitable == 25) &&
      (is(target, 'bpmn:SubProcess') &&
      (targetBusinessObject.suitable == 100)) && (position && isBoundaryAttachment(position, target))) {
          //console.log("hier");
     var find;
     var allowed = true;
     //console.log(shape);
    for(var i = 0; i< target.attachers.length; i++){
      //console.log(shape);
          if(target.attachers[i].businessObject.suitable == shape.businessObject.suitable){
            //console.log('gleich');
            allowed = false;
            return false;
          }
      }
      return true;
      
      }

    // damit normale IntermediateEvents nicht an Situationsscopes geklebt werden duerfen
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

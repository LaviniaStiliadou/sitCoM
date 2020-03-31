'use strict';

var is = require('../../../util/ElementHelper').is;

var events = require('../../../util/EventHelper'),
    CONSUME_TOKEN_EVENT = events.CONSUME_TOKEN_EVENT,
    GENERATE_TOKEN_EVENT = events.GENERATE_TOKEN_EVENT,
    UPDATE_ELEMENTS_EVENT = events.UPDATE_ELEMENTS_EVENT,
	UPDATE_ELEMENT_EVENT = events.UPDATE_ELEMENT_EVENT;

function BoundaryEventHandler(animation, eventBus, elementRegistry, processInstances) {
  this._animation = animation;
  this._eventBus = eventBus;
  this._elementRegistry = elementRegistry;
  this._processInstances = processInstances;
}

/**

/**
 * Generate tokens for start event that was either
 * invoked by user or a parent process.
 *
 * @param {Object} context - The context.
 * @param {Object} context.element - The element.
 * @param {string} [context.parentProcessInstanceId] - Optional ID of parent process when invoked by parent process.
 *
 */

BoundaryEventHandler.prototype.consume = function(context) {

  // fire to generate token on self
  this._eventBus.fire(GENERATE_TOKEN_EVENT, context);
};
BoundaryEventHandler.prototype.generate = function(context) {
  var self = this;

  var element = context.element,
      processInstanceId = context.processInstanceId;
//      parentProcessInstanceId = context.parentProcessInstanceId;
	  


  var outgoingSequenceFlows = element.outgoing.filter(function(outgoing) {
    return is(outgoing, 'bpmn:SequenceFlow') || is(outgoing, 'bpmn:MessageFlow') ;
  });
  


  // create new process instance
//  var parent = element.parent,
//      processInstanceId = this._processInstances.create(parent, parentProcessInstanceId);
      

      var innerScope = false,
      hasStartEvent = false,
      temp,
      setViolation1 = false,
      setViolation2 = false,
      setViolation3 = false,
      setViolation4 = false,
      setViolation5 = false,
      count = 0;

  // if element is situationEvent
  if (element.businessObject.suitable == 25 || element.businessObject.suitable == 50 || element.businessObject.suitable == 100) {
    var outgoingSequenceFlows = element.outgoing.filter(function(outgoing) {
      return is(outgoing, 'bpmn:SequenceFlow');
    });
    var violationArray = [];
          
    if(element.businessObject.$attrs.violation != null){
      setViolation1 = true;
      count++;
      violationArray.push(element.businessObject.$attrs.violation);
    }
    if(element.businessObject.$attrs.violation2 != null){
      setViolation2 = true;
      count++;
      violationArray.push(element.businessObject.$attrs.violation2);
    }
    if(element.businessObject.$attrs.violation3 != null){
      setViolation3 = true;
      count++;
      violationArray.push(element.businessObject.$attrs.violation3);
    }
    if(element.businessObject.$attrs.violation4 != null){
      setViolation4 = true;
      count++;
      violationArray.push(element.businessObject.$attrs.violation4);
    }
    if(element.businessObject.$attrs.violation5 != null){
      setViolation5 = true;
      count++;
      violationArray.push(element.businessObject.$attrs.violation5);
    }
    if(count != 0){
      var x = Math.floor((Math.random() * count) + 1);   
    
    for(var i=0; i< element.parent.children.length; i++){
      if(element.parent.children[i].businessObject.$type == 'bpmn:SubProcess'){
        if(element.businessObject.$attrs != null){         
          if(element.parent.children[i].businessObject.suitable == 100 && element.parent.children[i].businessObject.id == violationArray[x-1]){
            temp = element.parent.children[i];
          }
        }
      }
    }

    if(temp != null){
      var startEvent = temp.children.filter(function(child) {
        return is(child, 'bpmn:StartEvent');
      })[0];
      self._eventBus.fire(GENERATE_TOKEN_EVENT, {
        element: startEvent,
        parentProcessInstanceId: processInstanceId
        });
	  // open context-pad of new innerscope
      self._eventBus.fire(UPDATE_ELEMENT_EVENT, {
        element: startEvent.parent
      });
      
      var outgoingSequenceFlows = element.outgoing.filter(function(outgoing) {
        return is(outgoing, 'bpmn:SequenceFlow');
      });
    }
    
    
    
  // if element is not situationEvent (eg. IntermediateEvent)
  }} else{
  outgoingSequenceFlows.forEach(function(connection) {
    self._animation.createAnimation(connection, processInstanceId, function() {
      self._eventBus.fire(CONSUME_TOKEN_EVENT, {
        element: connection.target,
        processInstanceId: processInstanceId
      });
    });
  });

  if (is(element.parent, 'bpmn:SubProcess')) {
    return true;
  }

  var startEvents = this._elementRegistry.filter(function(element) {
    return is(element, 'bpmn:StartEvent');
  });

  this._eventBus.fire(UPDATE_ELEMENTS_EVENT, {
    elements: startEvents
  });
}
};

BoundaryEventHandler.$inject = [ 'animation', 'eventBus', 'elementRegistry', 'processInstances' ];

module.exports = BoundaryEventHandler;

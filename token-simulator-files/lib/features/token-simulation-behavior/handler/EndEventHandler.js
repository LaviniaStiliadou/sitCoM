'use strict';

var elementHelper = require('../../../util/ElementHelper'),
    getBusinessObject = elementHelper.getBusinessObject,
    is = elementHelper.is,
    isAncestor = elementHelper.isAncestor,
    getDescendants = elementHelper.getDescendants,
    isTypedEvent = elementHelper.isTypedEvent;

var events = require('../../../util/EventHelper'),
    GENERATE_TOKEN_EVENT = events.GENERATE_TOKEN_EVENT,
    TERMINATE_EVENT = events.TERMINATE_EVENT,
    UPDATE_ELEMENTS_EVENT = events.UPDATE_ELEMENTS_EVENT;

function EndEventHandler(animation, eventBus, log, simulationState, elementRegistry, processInstances) {
  this._animation = animation;
  this._eventBus = eventBus;
  this._log = log;
  this._simulationState = simulationState;
  this._elementRegistry = elementRegistry;
  this._processInstances = processInstances;
}

EndEventHandler.prototype.consume = function(context) {
  var element = context.element,
      processInstanceId = context.processInstanceId;
	  
  var isInnerScope = false;
  
  // check if EndEvent is in InnerScope
  if (element.parent.businessObject.suitable == 100) {
	  isInnerScope = true;
  }

  var isTerminate = isTypedEvent(getBusinessObject(element), 'bpmn:TerminateEventDefinition'),
      isSubProcessChild = is(element.parent, 'bpmn:SubProcess');

  if (isTerminate) {
    this._eventBus.fire(TERMINATE_EVENT, context);

    this._elementRegistry.forEach(function(e) {
      if (isAncestor(element.parent, e) &&
          e.tokenCount &&
          e.tokenCount[processInstanceId]) {
        delete e.tokenCount[processInstanceId];
      }
    });

    // finish but do NOT remove
    this._processInstances.finish(processInstanceId);
  }

  var isFinished = this._simulationState.isFinished(element, processInstanceId);
  // if EndEvent is in InnerScope
  if (isInnerScope) {
    // finish OuterScope in simulationState
    var isOuterScopeFinished = this._simulationState.isFinished(element, this._processInstances.getProcessInstance(processInstanceId).parentProcessInstanceId);
  }

  if (isFinished) {
    if (isInnerScope) {
	  // finish InnerScope
      this._processInstances.finish(processInstanceId);
	  // finish OuterScope
	  this._processInstances.finish(this._processInstances.getProcessInstance(processInstanceId).parentProcessInstanceId);
    } else {
      this._processInstances.finish(processInstanceId);
    }

    // finish but do NOT remove
    
  }

  if ((isFinished || isTerminate) && isSubProcessChild) {
    var processInstance = this._processInstances.getProcessInstance(processInstanceId);
	
	if(isInnerScope) {
      this._eventBus.fire(GENERATE_TOKEN_EVENT, {
		// fire on OuterScope (element.parent is InnerScope, element.parent.parent is OuterScope)
        element: element.parent.parent,
		// processInstanceId 1 is always level Process/Participant.
        processInstanceId: 1
      });
	} else {
      // generate token on parent
      this._eventBus.fire(GENERATE_TOKEN_EVENT, {
        element: element.parent,
        processInstanceId: processInstance.parentProcessInstanceId
      });
	}
  }

  this._eventBus.fire(UPDATE_ELEMENTS_EVENT, {
    elements: getDescendants(this._elementRegistry.getAll(), element.parent)
  });
};

/**
 * End event never generates.
 */
EndEventHandler.prototype.generate = function(context) {};

EndEventHandler.$inject = [ 'animation', 'eventBus', 'log', 'simulationState', 'elementRegistry', 'processInstances' ];

module.exports = EndEventHandler;
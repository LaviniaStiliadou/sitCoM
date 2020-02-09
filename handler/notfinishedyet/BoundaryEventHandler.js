'use strict';

var elementHelper = require('../../../util/ElementHelper'),
    is = elementHelper.is;

var events = require('../../../util/EventHelper'),
    CONSUME_TOKEN_EVENT = events.CONSUME_TOKEN_EVENT,
	GENERATE_TOKEN_EVENT = events.GENERATE_TOKEN_EVENT,
    UPDATE_ELEMENT_EVENT = events.UPDATE_ELEMENT_EVENT;

function BoundaryEventHandler(animation, eventBus, processInstances, elementRegistry) {
  this._animation = animation;
  this._eventBus = eventBus;
  this._processInstances = processInstances;
  this._elementRegistry = elementRegistry;
}

BoundaryEventHandler.prototype.consume = function(context) {
  var element = context.element,
      processInstanceId = context.processInstanceId;

  if (!element.tokenCount) {
    element.tokenCount = {};
  }

  if (!element.tokenCount[processInstanceId]) {
    element.tokenCount[processInstanceId] = 0;
  }

  element.tokenCount[processInstanceId]++;

  this._eventBus.fire(UPDATE_ELEMENT_EVENT, {
    element: element
  });
};

BoundaryEventHandler.prototype.generate = function(context) {
  var self = this;

  var element = context.element,
      processInstanceId = context.processInstanceId;
	  
	  console.log(context);

  var innerScope = false,
      hasStartEvent = false;

  // if element is situationEvent
  if (element.businessObject.suitable == 25 || element.businessObject.suitable == 50 || element.businessObject.suitable == 100) {
    innerScope = element.parent.children.filter(function(child) {
	  return (is(child, 'bpmn:SubProcess') && child.businessObject.suitable == 100);
	})[1];
	hasStartEvent = innerScope.children.filter(function(child) {
      return is(child, 'bpmn:StartEvent');
    })[0];
    if (hasStartEvent) {
      self._eventBus.fire(GENERATE_TOKEN_EVENT, {
        element: hasStartEvent,
        parentProcessInstanceId: processInstanceId
      });
    }
   
  // if element is not situationEvent (eg. IntermediateEvent)
  } else {
    var outgoingSequenceFlows = element.outgoing.filter(function(outgoing) {
      return is(outgoing, 'bpmn:SequenceFlow');
    });

    outgoingSequenceFlows.forEach(function(connection) {
      self._animation.createAnimation(connection, processInstanceId, function() {
        self._eventBus.fire(CONSUME_TOKEN_EVENT, {
          element: connection.target,
          processInstanceId: processInstanceId
        });
      });
    });
  }
};

BoundaryEventHandler.$inject = [ 'animation', 'eventBus', 'processInstances', 'elementRegistry' ];

module.exports = BoundaryEventHandler;
'use strict';

var is = require('../../../util/ElementHelper').is;

var events = require('../../../util/EventHelper'),
    CONSUME_TOKEN_EVENT = events.CONSUME_TOKEN_EVENT,
    GENERATE_TOKEN_EVENT = events.GENERATE_TOKEN_EVENT,
    UPDATE_ELEMENT_EVENT = events.UPDATE_ELEMENT_EVENT;

function SubProcessHandler(animation, eventBus, log, processInstances) {
  this._animation = animation;
  this._eventBus = eventBus;
  this._log = log;
  this._processInstances = processInstances;
}

SubProcessHandler.prototype.consume = function(context) {
  var element = context.element,
      processInstanceId = context.processInstanceId;
  var startEvent = false;
  var innerScope = false;
  var hasStartEvent = false;
  
  
  // if is an OuterScope
  if (element.businessObject.suitable == 200) {
	innerScope = element.children.filter(function(child) {
	  return (is(child, 'bpmn:SubProcess') && child.businessObject.suitable == 100);
	})[0];
	// just check if the innerScope has an StartEvent, else skip OuterScope
	hasStartEvent = innerScope.children.filter(function(child) {
      return is(child, 'bpmn:StartEvent');
    })[0];
	if (innerScope && hasStartEvent) {
      this._eventBus.fire(CONSUME_TOKEN_EVENT, {
      element: innerScope,
      parentProcessInstanceId: processInstanceId
    });
	}
  // else if is an InnerScope
  } else if (element.businessObject.suitable == 100) {
    var parent = element.parent;
    processInstanceId = this._processInstances.create(parent, element.parentProcessInstanceId);
	startEvent = element.children.filter(function(child) {
      return is(child, 'bpmn:StartEvent');
    })[0];
	// just necessary for the if clause whether skip SubProcess/Scope
	hasStartEvent = startEvent; 
  // else if it is a regular SubProcess
  } else {
    startEvent = element.children.filter(function(child) {
      return is(child, 'bpmn:StartEvent');
    })[0];
	// just necessary for the if clause whether skip SubProcess/Scope
	hasStartEvent = startEvent;
  }
  
  // if there is no startEvent  (and for OuterScope hasStartEvent)
  if (!startEvent && !hasStartEvent) {
    this._log.log('Skipping Subprocess', 'info', 'fa-angle-double-right');

    // skip subprocess
    this._eventBus.fire(GENERATE_TOKEN_EVENT, context);
  } else if (startEvent) {
    this._log.log('Starting Subprocess', 'info', 'fa-sign-in');

    // start subprocess with process instance ID as parent process instance ID
    this._eventBus.fire(GENERATE_TOKEN_EVENT, {
      element: startEvent,
      parentProcessInstanceId: processInstanceId
    });
  }

  this._eventBus.fire(UPDATE_ELEMENT_EVENT, {
    element: element
  });
};

SubProcessHandler.prototype.generate = function(context) {
  var self = this;

  var element = context.element,
      processInstanceId = context.processInstanceId;
	  
  if (element.businessObject.suitable == 100) {
	  var startEvent = element.children.filter(function(child) {
      return is(child, 'bpmn:StartEvent');
    })[0];
    self._eventBus.fire(GENERATE_TOKEN_EVENT, {
      element: startEvent,
      parentProcessInstanceId: processInstanceId
      });
  } else {

  var outgoingSequenceFlows = element.outgoing.filter(function(outgoing) {
    return is(outgoing, 'bpmn:SequenceFlow');
  });

  outgoingSequenceFlows.forEach(function(outgoing) {
    self._animation.createAnimation(outgoing, processInstanceId, function() {
      self._eventBus.fire(CONSUME_TOKEN_EVENT, {
        element: outgoing.target,
        processInstanceId: processInstanceId
      });
    });
  });
  }

  this._eventBus.fire(UPDATE_ELEMENT_EVENT, {
    element: element
  });
};

SubProcessHandler.$inject = [ 'animation', 'eventBus', 'log', 'processInstances' ];

module.exports = SubProcessHandler;
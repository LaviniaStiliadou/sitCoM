import inherits from 'inherits';

import OrderingProvider from 'diagram-js/lib/features/ordering/OrderingProvider';


/**
 * a simple ordering provider that ensures that custom
 * shapes (rect) are always rendered on top.
 */
export default function CustomOrderingProvider(eventBus, canvas) {

  OrderingProvider.call(this, eventBus);

  this.getOrdering = function(element, newParent) {

	if ((element.type === 'bpmn:BoundaryEvent') && (element.eventDefinitionType === 'bpmn:ErrorEventDefinition') && (element.suitable >0))  {

      // always move to end of root element
      // to display always on top
      return {
        parent: canvas.getRootElement(),
        eventDefinitionType: 'bpmn:ErrorEventDefinition', order: { level: 1 },
		index: 2
      };
    }
  };
}

CustomOrderingProvider.$inject = [ 'eventBus', 'canvas' ];

inherits(CustomOrderingProvider, OrderingProvider);
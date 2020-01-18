import BaseRenderer from 'diagram-js/lib/draw/BaseRenderer';

import {
  append as svgAppend,
  attr as svgAttr,
  classes as svgClasses,
  create as svgCreate,
  remove as svgRemove
} from 'tiny-svg';

import {
  getRoundRectPath
} from 'bpmn-js/lib/draw/BpmnRenderUtil';

import {
  is,
  getBusinessObject
} from 'bpmn-js/lib/util/ModelUtil';

import { isNil } from 'min-dash';

const HIGH_PRIORITY = 1500,
      TASK_BORDER_RADIUS = 2,
      COLOR_GREEN = '#52B415',
      COLOR_YELLOW = '#ffc800',
      COLOR_RED = '#cc0000';


export default class CustomRenderer extends BaseRenderer {
  constructor(eventBus, bpmnRenderer) {
    super(eventBus, HIGH_PRIORITY);

    this.bpmnRenderer = bpmnRenderer;
  }

  canRender(element) {

    // ignore labels
    return !element.labelTarget;
  }

  drawShape(parentNode, element) {
    const shape = this.bpmnRenderer.drawShape(parentNode, element);

    const suitabilityScore = this.getSuitabilityScore(element);
	
	var businessObject = element.businessObject;
	
	

    if (!isNil(suitabilityScore)) {
		
	  if (is(element, 'bpmn:SubProcess')) {

          const rect2 = drawRect(parentNode, element.width, element.height, 10, '#000000');

          if (businessObject.suitable == 200) {
            svgAttr(rect2, {
		    fill: 'white',
            strokeWidth: 8
            });
          }

          if (businessObject.suitable == 100) {
            svgAttr(rect2, {
		    fill: 'white',
            strokeDasharray: '5,5'
            });
          }
	  
	      prependTo(rect2, parentNode);

          svgRemove(shape);
        }
		
		if (is(element, 'bpmn:BoundaryEvent')) {
			
			const circle = drawCircle(parentNode, 28, 28);
			
			if (businessObject.suitable == 25) {
			svgAttr(circle, {
			fill: 'red',
			stroke: 'red',
			transform: 'translate(-10, -10)'
			});
			}
			
			if (businessObject.suitable == 50) {
			svgAttr(circle, {
			fill: 'yellow',
			stroke: 'yellow',
			transform: 'translate(-10, -10)'
			});
			}
			
			if (businessObject.suitable == 100) {
			svgAttr(circle, {
			fill: 'green',
			stroke: 'green',
			transform: 'translate(-10, -10)'
			});
			}
			prependTo(circle, parentNode);

            svgRemove(shape);
			return shape;
		}
		
		
	  /*const color = this.getColor(suitabilityScore);

      const rect = drawRect(parentNode, 50, 20, TASK_BORDER_RADIUS, color);
  
      svgAttr(rect, {
        transform: 'translate(-20, -10)'
      });

      var text = svgCreate('text'); 

      svgAttr(text, {
        fill: '#fff',
        transform: 'translate(-15, 5)'
      });

      svgClasses(text).add('djs-label'); 
    
      svgAppend(text, document.createTextNode(suitabilityScore)); 
    
      svgAppend(parentNode, text);*/
    }

    return shape;
  }

  getShapePath(shape) {
    if (is(shape, 'bpmn:SubProcess')) {
      return getRoundRectPath(shape, TASK_BORDER_RADIUS);
    }

    return this.bpmnRenderer.getShapePath(shape);
  }

  getSuitabilityScore(element) {
    const businessObject = getBusinessObject(element);
  
    const { suitable } = businessObject;

    return Number.isFinite(suitable) ? suitable : null;
  }

  getColor(suitabilityScore) {
    if (suitabilityScore > 75) {
      return COLOR_GREEN;
    } else if (suitabilityScore > 25) {
      return COLOR_YELLOW;
    }

    return COLOR_RED;
  }
}

CustomRenderer.$inject = [ 'eventBus', 'bpmnRenderer' ];

// helpers //////////

// copied from https://github.com/bpmn-io/bpmn-js/blob/master/lib/draw/BpmnRenderer.js
function drawRect(parentNode, width, height, borderRadius, color) {
  const rect = svgCreate('rect');

  svgAttr(rect, {
    width: width,
    height: height,
    rx: borderRadius,
    ry: borderRadius,
    stroke: color,
    strokeWidth: 2,
    fill: color
  });

  svgAppend(parentNode, rect);

  return rect;
}

function drawCircle(parentNode, width, height) {
	const circle = svgCreate('circle');
	
	svgAttr(circle, {
		cx: width,
		cy: height,
		r: Math.round((width + height) / 4),
        strokeWidth: 2,
	});
	
	svgAppend(parentNode, circle);

  return circle;
}

// copied from https://github.com/bpmn-io/diagram-js/blob/master/lib/core/GraphicsFactory.js
function prependTo(newNode, parentNode, siblingNode) {
  parentNode.insertBefore(newNode, siblingNode || parentNode.firstChild);
}

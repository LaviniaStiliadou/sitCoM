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
} from '../descriptors/draw/BpmnRenderUtil';

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
		
      const color = this.getColor(suitabilityScore);
    

		if (is(element, 'bpmn:BoundaryEvent')) {
      //shape.nextSibling.attributes[0].nodeValue = "fill: none; stroke: none; stroke-width: 1px";
      shape.nextSibling.attributes[3].nodeValue = "fill: none; stroke: none; stroke-width: 1px";
      //console.log(element.businessObject.eventDefinitions);
      if(element.businessObject.eventDefinitions != undefined){
        if(element.businessObject.eventDefinitions[0].$type == 'bpmn:SignalEventDefinition'){
          //shape.parentNode.children[2].attributes[0] = 'M {mx},2{my} l {e.x0},-{e.y0} l -{e.x1},2 Z'+
          //'m 1.4,7.6 c -1.788948,0.7502 -3.8576,-0.0928 -4.6097055,-1.87438 -0.7521065,-1.78321 0.090598,-3.84627 1.8802645,-4.59604 1.78823,-0.74936 3.856881,0.0929 4.608987,1.87437 0.752106,1.78165 -0.0906,3.84612 -1.879546,4.59605 z';
        
         shape.parentNode.children[2].attributes.style.nodeValue = "fill: red; stroke: none; stroke-width: 1px";
         //shape.parentNode.children[2].attributes.style.ownerElement.outerHTML = '<path d="M {mx},{my} l {e.x0},{e.y0} l -{e.x1},0 Z" style="fill: red; stroke: none; stroke-width: 1px"></path>';
         //console.log(shape.parentNode.children[2].attributes.style.ownerElement.outerHTML );
        // console.log('M {mx},2{my} l {e.x0},-{e.y0} l -{e.x1},0 Z'+
         //'m 1.4,7.6 c -1.788948,0.7502 -3.8576,-0.0928 -4.6097055,-1.87438 -0.7521065,-1.78321 0.090598,-3.84627 1.8802645,-4.59604 1.78823,-0.74936 3.856881,0.0929 4.608987,1.87437 0.752106,1.78165 -0.0906,3.84612 -1.879546,4.59605 z');
          
        }

        if(element.businessObject.eventDefinitions[0].$type == 'bpmn:EscalationEventDefinition'){
          shape.parentNode.children[2].attributes.style.nodeValue = "fill: none; stroke: green; stroke-width: 1px";
        }
    }
      
      //console.log(shape);
			const circle2 = drawCircle(parentNode, element.width, element.height);
			//const circle = drawCircleI(circle2, 28, 28);
			
			if (businessObject.suitable == 25) {
        
			svgAttr(circle2, {
			fill: 'none',
			stroke: 'red'
      });
    }
			
			if (businessObject.suitable == 50) {
		
			svgAttr(circle2, {
			fill: 'none',
			stroke: 'yellow'
			});
			}
			
			if (businessObject.suitable == 100) {
			svgAttr(circle2, {
			fill: 'none',
			stroke: 'green'
			});
      }
       
     // prependTo(circle, circle2);
      //prependTo(circle2, parentNode);
      
      //svgRemove(shape);
			//prependTo(circle2, circle);

      
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
    
      svgAppend(parentNode, text);
    }
    */

    return shape;
  
  }}

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
		cx: width/2,
		cy: height/2,
		r: Math.round((width + height) / 4),
        strokeWidth: 2,
	});
	
	svgAppend(parentNode, circle);

  return circle;
}

function drawCircleI(parentNode, width, height) {
	const circle = svgCreate('circle');
	
	svgAttr(circle, {
		cx: width,
		cy: height,
		r: Math.round((width + height) / 4),
        strokeWidth: 2,
		fill: 'white',
		stroke: 'yellow'
	});
	
	svgAppend(parentNode, circle);

  return circle;
}


// copied from https://github.com/bpmn-io/diagram-js/blob/master/lib/core/GraphicsFactory.js
function prependTo(newNode, parentNode, siblingNode) {
  parentNode.insertBefore(newNode, siblingNode || parentNode.firstChild);
}

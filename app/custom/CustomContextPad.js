import {incrementCounter2} from './CustomPalette';

const SUITABILITY_SCORE_HIGH = 100,
SUITABILITY_SCORE_AVERGE = 50,
SUITABILITY_SCORE_LOW = 25,
SUITABILITY_SCORE_OUTER_RECT = 200;


export default class CustomContextPad {
    constructor(bpmnFactory, config, contextPad, create, elementFactory, injector, translate) { 
        this.bpmnFactory = bpmnFactory;
        this.create = create;
        this.elementFactory = elementFactory;
        this.translate = translate;

    if (config.autoPlace !== false) {
        this.autoPlace = injector.get('autoPlace', false);
    }

    contextPad.registerProvider(this);
    }

    getContextPadEntries(element) {
        const {
            autoPlace,
            bpmnFactory,
            create,
            elementFactory,
            translate
        } = this;

    function appendIntermediateEvent(suitabilityScore) {
        return function(event, element) {
        if (autoPlace) {
            const businessObject = bpmnFactory.create('bpmn:IntermediateThrowEvent');
            businessObject.suitable = suitabilityScore;
            const shape = elementFactory.createShape({
                type: 'bpmn:IntermediateThrowEvent',
                businessObject: businessObject
            });

            autoPlace.append(element, shape);
        } else {
            appendIntermediateEventStart(event, element);
        }}
    }

    function appendIntermediateEventStart(suitabilityScore) {
        return function(event) {
            const businessObject = bpmnFactory.create('bpmn:IntermediateEvent');
            businessObject.suitable = suitabilityScore;
            const shape = elementFactory.createShape({
                type: 'bpmn:IntermediateEvent',
                businessObject: businessObject
            });
            create.start(event, shape, element);
        }
    }

    function appendOuterRect(suitabilityScore) {
        return function(event, element) {
          if (autoPlace) {
            const businessObject = bpmnFactory.create('bpmn:SubProcess');
            businessObject.suitable = suitabilityScore;
            const shape = elementFactory.createShape({
              type: 'bpmn:SubProcess',
              height: 400,
              width: 450,
              businessObject: businessObject
            });
            shape.businessObject.di.isExpanded = true;
			businessObject.$attrs.scope = 'OuterScope_'+ incrementCounter2();
            autoPlace.append(element, shape);
          } else {
            appendOuterRectStart(event, element);
          }
        }
      }
  
      function appendOuterRectStart(suitabilityScore) {
        return function(event) {
          const businessObject = bpmnFactory.create('bpmn:SubProcess');
  
          businessObject.suitable = suitabilityScore;
  
          const shape = elementFactory.createShape({
            type: 'bpmn:SubProcess',
            height: 400,
            width: 450,
            businessObject: businessObject
          });
          shape.businessObject.di.isExpanded = true;
		  businessObject.$attrs.scope = 'OuterScope_'+ incrementCounter2();
          create.start(event, shape, element);
        }
      }

    var businessObject = element.businessObject;
    /** 
    if ((element.type === "bpmn:SubProcess") && (businessObject.suitable == 100)){
        return {
            'append.red-circle': {
            group: 'model',
            className: 'bpmn-icon-intermediate-event-none red',
            //className: 'bpmn-icon-emo-happy', 
            title: translate('Append red circle'),
            action: {
                click: appendIntermediateEvent(SUITABILITY_SCORE_LOW),
                dragstart: appendIntermediateEventStart(SUITABILITY_SCORE_LOW)
            }
        },
            'append.yellow-circle': {
            group: 'model',
            className: 'bpmn-icon-intermediate-event-none yellow',
            title: translate('Append yellow circle'),
            action: {
                click: appendIntermediateEvent(SUITABILITY_SCORE_AVERGE),
                dragstart: appendIntermediateEventStart(SUITABILITY_SCORE_AVERGE)
            }
        },
            'append.green-circle': {
            group: 'model',
            className: 'bpmn-icon-intermediate-event-none green',
            title: translate('Append green circle'),
            action: {
                click: appendIntermediateEvent(SUITABILITY_SCORE_HIGH),
                dragstart: appendIntermediateEventStart(SUITABILITY_SCORE_HIGH)
            }
        }
    };
}
    */
     if ((element.type === 'bpmn:SubProcess') && (businessObject.suitable == 200)){
        return{
            'append.outer-rect': {
                group: 'model',
                className: 'bpmn-icon-check-empty',
                title: translate('Append outer rect'),
                action: {
                    click: appendOuterRect(SUITABILITY_SCORE_OUTER_RECT),
                    dragstart: appendOuterRectStart(SUITABILITY_SCORE_OUTER_RECT)
                }
            }
        };
    } 
}
}

CustomContextPad.$inject = [
'bpmnFactory',
'config',
'contextPad',
'create',
'elementFactory',
'injector',
'translate'
];
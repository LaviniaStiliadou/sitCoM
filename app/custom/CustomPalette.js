const SUITABILITY_SCORE_HIGH = 100,
      SUITABILITY_SCORE_OUTER_RECT = 200,
      SUITABILITY_SCORE_AVERGE = 50,
      SUITABILITY_SCORE_LOW = 25;
	  
var counter = 0;
var counter2 = 0;

//export counter for contextPad
export function incrementCounter2(){
	counter2++;
	return counter2;
}


export default class CustomPalette {
  constructor(bpmnFactory, create, elementFactory, palette, translate) {
    this.bpmnFactory = bpmnFactory;
    this.create = create;
    this.elementFactory = elementFactory;
    this.translate = translate;

    palette.registerProvider(this);
  }

  getPaletteEntries(element) {
    const {
      bpmnFactory,
      create,
      elementFactory,
      translate
    } = this;


    function createRect(suitabilityScore) {
      return function(event) {
        const businessObject = bpmnFactory.create('bpmn:SubProcess');
  
        businessObject.suitable = suitabilityScore;
        if(businessObject.suitable === 100){
  
        const shape = elementFactory.createShape({
          type: 'bpmn:SubProcess',
          height: 200,
          width: 250,
          businessObject: businessObject
        });

        shape.businessObject.di.isExpanded = true;
		businessObject.$attrs.scope = 'InnerScope_'+ ++counter;
        create.start(event, shape); 

      }else {
        const shape = elementFactory.createShape({
          type: 'bpmn:SubProcess',
          height: 400,
          width: 450,
          businessObject: businessObject
        });
        
        shape.businessObject.di.isExpanded = true;
		businessObject.$attrs.scope = 'OuterScope_'+ ++counter2;
        create.start(event, shape); 
      }
    }
    }
	
  // wird jetzt nicht mehr benutzt
	function createGroup(suitabilityScore) {
      return function(event) {
        const businessObject = bpmnFactory.create('bpmn:Group');
  
        //businessObject.suitable = suitabilityScore;
  
        const shape = elementFactory.createShape({
          type: 'bpmn:Group',
          businessObject: businessObject
        });
			
        //shape.businessObject.di.isExpanded = true;
      
        create.start(event, shape); 
      }
    }
	
    function createCircle(suitabilityScore) {
      return function(event) {
        const businessObject = bpmnFactory.create('bpmn:IntermediateThrowEvent');
  
        businessObject.suitable = suitabilityScore;
  
        const shape = elementFactory.createShape({
          type: 'bpmn:IntermediateThrowEvent',
          businessObject: businessObject
        });
  
        create.start(event, shape); 
      }
    }

    return {
      'create.red-circle': {
        group: 'activity',
        className: 'bpmn-icon-intermediate-event-none red',
        title: translate('Create red circle'),
        action: {
          dragstart: createCircle(SUITABILITY_SCORE_LOW),
          click: createCircle(SUITABILITY_SCORE_LOW)
        }
      },
      'create.yellow-circle': {
        group: 'activity',
        className: 'bpmn-icon-intermediate-event-none yellow',
        title: translate('Create yellow circle'),
        action: {
          dragstart: createCircle(SUITABILITY_SCORE_AVERGE),
          click: createCircle(SUITABILITY_SCORE_AVERGE)
        }
      },
      'create.green-circle': {
        group: 'activity',
        className: 'bpmn-icon-intermediate-event-none green',
        title: translate('Create green circle'),
        action: {
          dragstart: createCircle(SUITABILITY_SCORE_HIGH),
          click: createCircle(SUITABILITY_SCORE_HIGH)
        }
      },
      'create.rect': {
        group: 'activity',
        className: 'bpmn-icon-marquee',
        title: translate('Create inner scope'),
        action: {
          dragstart: createRect(SUITABILITY_SCORE_HIGH),
          click: createRect(SUITABILITY_SCORE_HIGH)
        }
      },
	  'create.outerrect': {
        group: 'activity',
        className: 'bpmn-icon-check-empty',
        title: translate('Create outer scope'),
        action: {
          dragstart: createRect(SUITABILITY_SCORE_OUTER_RECT),
          click: createRect(SUITABILITY_SCORE_OUTER_RECT)
        }
      }
    }
  }
}

CustomPalette.$inject = [
  'bpmnFactory',
  'create',
  'elementFactory',
  'palette',
  'translate'
];
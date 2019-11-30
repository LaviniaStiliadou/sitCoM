const SUITABILITY_SCORE_HIGH = 100,
      SUITABILITY_SCORE_AVERGE = 50,
      SUITABILITY_SCORE_LOW = 25;

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

    function createTask(suitabilityScore) {
      return function(event) {
        const businessObject = bpmnFactory.create('bpmn:Task');
  
        businessObject.suitable = suitabilityScore;
  
        const shape = elementFactory.createShape({
          type: 'bpmn:Task',
          businessObject: businessObject
        });
  
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
        className: 'icon-custom-circle-red',
        title: translate('Create red circle'),
        action: {
          dragstart: createCircle(SUITABILITY_SCORE_LOW),
          click: createCircle(SUITABILITY_SCORE_LOW)
        }
      },
      'create.yellow-circle': {
        group: 'activity',
        className: 'icon-custom-circle-yellow',
        title: translate('Create yellow circle'),
        action: {
          dragstart: createCircle(SUITABILITY_SCORE_AVERGE),
          click: createCircle(SUITABILITY_SCORE_AVERGE)
        }
      },
      'create.green-circle': {
        group: 'activity',
        className: 'icon-custom-circle-green',
        title: translate('Create yellow circle'),
        action: {
          dragstart: createCircle(SUITABILITY_SCORE_HIGH),
          click: createCircle(SUITABILITY_SCORE_HIGH)
        }
      },
      'create.rect': {
        group: 'activity',
        className: 'icon-custom-circle-green',
        title: translate('Create rect'),
        action: {
          dragstart: createTask(SUITABILITY_SCORE_HIGH),
          click: createTask(SUITABILITY_SCORE_HIGH)
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
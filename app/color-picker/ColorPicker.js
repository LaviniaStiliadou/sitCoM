import {
  is
} from 'bpmn-js/lib/util/ModelUtil';


/**
 * A basic color picker implementation.
 *
 * @param {EventBus} eventBus
 * @param {ContextPad} contextPad
 * @param {CommandStack} commandStack
 */
export default function ColorPicker(eventBus, contextPad, commandStack) {

  contextPad.registerProvider(this);

  commandStack.registerHandler('shape.updateColor', UpdateColorHandler);

  function changeColor(event, element) {

    var color = window.prompt('type a color code');

    commandStack.execute('shape.updateColor', { element: element, color: color });
  }


  this.getContextPadEntries = function(element) {

    if (is(element, 'bpmn:IntermediateCatchEvent')) {
      return {
        'changeColor': {
          group: 'edit',
          className: 'icon-red',
          title: 'Change element color',
          action: {
            click: changeColor
          }
        }
      };
    }
	if (is(element, 'bpmn:IntermediateThrowEvent')) {
      return {
        'changeColor': {
          group: 'edit',
          className: 'icon-red',
          title: 'Change element color',
          action: {
            click: changeColor
          }
        }
      };
    }
  };
}



/**
 * A handler updating an elements color.
 */
function UpdateColorHandler() {

  this.execute = function(context) {
    context.oldColor = context.element.color;
    context.element.color = context.color;

    return context.element;
  };

  this.revert = function(context) {
    context.element.color = context.oldColor;

    return context.element;
  };

}
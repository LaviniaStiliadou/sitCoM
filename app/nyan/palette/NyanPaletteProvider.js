import Cat from '../cat';


/**
 * A provider for quick service task production
 */
export default function NyanPaletteProvider(palette, create, elementFactory) {

  this._create = create;
  this._elementFactory = elementFactory;

  palette.registerProvider(this);
}

NyanPaletteProvider.$inject = [
  'palette',
  'create',
  'elementFactory'
];

NyanPaletteProvider.prototype.getPaletteEntries = function() {

  var elementFactory = this._elementFactory,
      create = this._create;

  function startCreate(event) {
    var serviceTaskShape = elementFactory.create(
      'shape', { type: 'bpmn:IntermediateCatchEvent' }
    );

    create.start(event, serviceTaskShape);
  }

  return {
    'create-service-task': {
      group: 'collaboration',
      title: 'Create a new SITUATION EVENT!',
      imageUrl: 'data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22%2352B415%22%20viewBox%3D%220%200%20120%20120%22%3E%3Ccircle%20cx%3D%2260%22%20cy%3D%2260%22%20r%3D%2240%22%2F%3E%3C%2Fsvg%3E',
      action: {
        dragstart: startCreate,
        click: startCreate
      }
    }
  };
};
import CustomContextPadProvider from './CustomContextPadProvider';
import CustomPalette from './CustomPalette';
import CustomRenderer from './CustomRenderer';
import CustomContextPad from './CustomContextPad';

export default {
  __init__: [ 'customContextPad', 'customPalette', 'customRenderer', 'customPad' ],
  customContextPad: [ 'type', CustomContextPadProvider ],
  customPalette: [ 'type', CustomPalette ],
  customRenderer: [ 'type', CustomRenderer ],
  customPad: ['type', CustomContextPad]
};
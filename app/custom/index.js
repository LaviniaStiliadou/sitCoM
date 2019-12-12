import CustomContextPadProvider from './CustomContextPadProvider';
import CustomPalette from './CustomPalette';
import CustomRenderer from './CustomRenderer';
import CustomContextPad from './CustomContextPad';
import CustomOrderingProvider from './CustomOrderingProvider';

export default {
  __init__: [ 'customContextPad', 'customPalette', 'customRenderer', 'customPad', 'customOrderingProvider' ],
  customContextPad: [ 'type', CustomContextPadProvider ],
  customPalette: [ 'type', CustomPalette ],
  customRenderer: [ 'type', CustomRenderer ],
  customPad: ['type', CustomContextPad],
  customOrderingProvider: ['type', CustomOrderingProvider]
};
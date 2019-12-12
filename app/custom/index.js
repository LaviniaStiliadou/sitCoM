import CustomContextPadProvider from './CustomContextPadProvider';
import CustomPalette from './CustomPalette';
import CustomRenderer from './CustomRenderer';
import CustomContextPad from './CustomContextPad';
import ReplaceMenuProvider from './ReplaceMenuProvider';

export default {
  __init__: [ 'customContextPad', 'customPalette', 'customRenderer', 'customPad', 'replaceMenu' ],
  customContextPad: [ 'type', CustomContextPadProvider ],
  customPalette: [ 'type', CustomPalette ],
  customRenderer: [ 'type', CustomRenderer ],
  customPad: ['type', CustomContextPad],
  replaceMenu: ['type', ReplaceMenuProvider]
};
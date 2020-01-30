import CustomContextPadProvider from './CustomContextPadProvider';
import CustomPalette from './CustomPalette';
import CustomRenderer from './CustomRenderer';
import CustomContextPad from './CustomContextPad';
import ReplaceMenuProvider from './ReplaceMenuProvider';
import CustomRules from './CustomRules';
import PathMap from './PathMap';

export default {
  __init__: [ 'customContextPad', 'customPalette', 'customRenderer', 'customPad', 'customRules', 'replaceMenu', 'pathMap' ],
  customContextPad: [ 'type', CustomContextPadProvider ],
  customPalette: [ 'type', CustomPalette ],
  customRenderer: [ 'type', CustomRenderer ],
  customPad: ['type', CustomContextPad],
  customRules: ['type', CustomRules],
  replaceMenu: ['type', ReplaceMenuProvider],
  pathMap: ['type', PathMap]
};
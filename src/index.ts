import {registerPlugin} from '@playkit-js/kaltura-player-js';
import {CallToAction} from './call-to-action';

declare let __VERSION__: string;
declare let __NAME__: string;

const VERSION = __VERSION__;
const NAME = __NAME__;

export {CallToAction as Plugin};
export {VERSION, NAME};

const pluginName = 'callToAction';

// @ts-ignore
registerPlugin(pluginName, CallToAction);
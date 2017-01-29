import _         from 'lodash';
import aptivator from '../lib/instance';
import on        from './on/on';
import off       from './off/off';
import trigger   from './trigger/trigger';

_.extend(aptivator, {on, off, trigger});

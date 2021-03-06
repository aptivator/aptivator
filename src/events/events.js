import _         from 'lodash';
import aptivator from '../lib/aptivator';
import on        from './on/on';
import once       from './once/once';
import off       from './off/off';
import trigger   from './trigger/trigger';

_.extend(aptivator, {on, once, off, trigger});

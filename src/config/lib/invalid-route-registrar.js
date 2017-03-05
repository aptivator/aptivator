import errorStater from '../../lib/error-stater';
import vars        from '../../lib/vars';

export default () => {
  vars.router.route('*error', errorStater);  
};

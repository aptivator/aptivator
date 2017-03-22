import errorStater from '../../lib/error-stater';

import {router} from '../../lib/vars';

export default () => router.route('*error', errorStater);

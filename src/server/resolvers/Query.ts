import { ResolverFunc } from '../../utils/types';

const hello: ResolverFunc<unknown, unknown> = () => 'Hello!';

export {
  hello
};
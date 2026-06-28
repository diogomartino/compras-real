import { t } from '../../trpc';
import { getUserRoute } from './get-user';
import { loginRoute } from './login';
import { registerRoute } from './register';

export const authRouter = t.router({
  getUser: getUserRoute,
  login: loginRoute,
  register: registerRoute
});

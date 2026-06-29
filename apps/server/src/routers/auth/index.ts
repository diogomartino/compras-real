import { t } from '../../trpc';
import { changePasswordRoute } from './change-password';
import { getUserRoute } from './get-user';
import { loginRoute } from './login';
import { registerRoute } from './register';
import { requestPasswordResetRoute } from './request-password-reset';
import { resetPasswordRoute } from './reset-password';

export const authRouter = t.router({
  getUser: getUserRoute,
  login: loginRoute,
  register: registerRoute,
  requestPasswordReset: requestPasswordResetRoute,
  resetPassword: resetPasswordRoute,
  changePassword: changePasswordRoute
});

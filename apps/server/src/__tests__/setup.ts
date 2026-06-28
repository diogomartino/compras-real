import { mock } from 'bun:test';

const DISABLE_CONSOLE = true;

if (DISABLE_CONSOLE) {
  const noop = () => {};

  global.console.log = noop;
  global.console.info = noop;
  global.console.warn = noop;
  global.console.debug = noop;

  mock.module('../utils/logger', () => ({
    logger: {
      info: noop,
      warn: noop,
      error: noop,
      debug: noop,
      trace: noop,
      fatal: noop
    }
  }));
}

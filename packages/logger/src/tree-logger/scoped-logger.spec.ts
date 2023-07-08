import { ScopedLogger } from './scoped-logger';

describe('scoped logger', () => {
  test('simple tree', () => {
    const logger = ScopedLogger.current;
    logger.info('Foo');
    logger.warn('Bar');
    const child = logger.createChild('child');
    child.debug('One');
    child.debug('Two');
    const innerChild = child.createChild('inner');
    innerChild.warn('some warning');
    const next = child.createSibling('paragraph');
    next.error('Some Error');
    ScopedLogger.dump();
  });
  test('using only current', () => {
    ScopedLogger.current.info('Foo');
    ScopedLogger.current.info('Bar');
    ScopedLogger.createScope.child('Child');
    ScopedLogger.current.info('Foo');
    ScopedLogger.current.info('Bar');
    ScopedLogger.createScope.child('Inner');
    ScopedLogger.current.info('Foo');
    ScopedLogger.current.info('Bar');
    ScopedLogger.endScope();
    ScopedLogger.createScope.sibling('Sibling');
    ScopedLogger.current.info('Foo');
    ScopedLogger.current.info('Bar');
    ScopedLogger.dump();
  });
});

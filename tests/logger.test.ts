import { Logger } from '../src/logger/logger';

describe('Logger', () => {
  let logger: Logger;

  beforeEach(() => {
    logger = new Logger('webhook_url');
  });

  it('should initialize and handle uncaught exceptions', () => {
    const logSpy = jest
      .spyOn(logger as any, 'log')
      .mockImplementation(() => Promise.resolve());

    logger.initialize();

    const error = new Error('Test error');
    process.emit('uncaughtException', error);

    expect(logSpy).toHaveBeenCalledWith(
      {
        name: error.name,
        message: error.message,
        stack: error.stack,
      },
      'uncaughtException',
    );
  });

  it('should initialize and handle unhandled rejections', () => {
    const logSpy = jest
      .spyOn(logger as any, 'log')
      .mockImplementation(() => Promise.resolve());

    logger.initialize();

    const reason = new Error('Test rejection');
    //@ts-ignore
    process.emit('unhandledRejection', reason); //typescript is flagging this for some reason..

    expect(logSpy).toHaveBeenCalledWith(
      {
        name: reason.name,
        message: reason.message,
        stack: reason.stack,
      },
      'unhandledRejection',
    );
  });
});

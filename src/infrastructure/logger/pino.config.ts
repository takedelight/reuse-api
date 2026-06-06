import { Params } from 'nestjs-pino';
import { join } from 'path';
import * as pino from 'pino';

export const pinoConfig: Params = {
  pinoHttp: {
    stream: pino.multistream([
      {
        level: 'info',
        stream: pino.destination({
          dest: join(process.cwd(), 'logs', 'app.log'),
          mkdir: true,
          sync: false,
        }),
      },
    ]),
  },
};

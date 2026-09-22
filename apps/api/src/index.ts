import { createServerApp } from './app';
import { config } from './config/env';

const app = createServerApp();

app.listen(config.port, () => {
  console.log(`🚀 SafeSpace API server running at http://localhost:${config.port}`);
  console.log(`📖 Swagger API Docs available at http://localhost:${config.port}/swagger`);
});

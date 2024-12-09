import envLoader from '../utils/env_loader.js';

const startServer = (api) => {
  envLoader();
  const port = process.env.PORT || 5000;
  const env = process.env.NODE_ENV || 'development';
  
  api.listen(port, () => {
    console.log(`[${env}] API is running at http://localhost:${port}`);
  });
};

export default startServer;

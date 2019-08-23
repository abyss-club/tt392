const configs = {
  default: {},
  dev: {
    apiPrefix: 'http://api.uexky.com',
  },
  uat: {
    apiPrefix: 'https://api-uat.abyss.club',
  },
  prod: {
    apiPrefix: 'https://api.abyss.club',
  },
};

const getConfig = name => Object.assign({}, configs.default, configs[name] || {});

export default getConfig(process.env.REACT_APP_ENV);

const { paramCase } = require('param-case');
const pkg = require('./package.json');

const service = paramCase(pkg.name);
const plugins = ['serverless-plugin-ncc'];

const cors = {
  origin: {
    'Fn::Join': [
      '',
      [
        'https://',
        {
          'Fn::GetAtt': ['CloudFrontDistribution', 'DomainName'],
        },
      ],
    ],
  },
  headers: ['*'],
  allowCredentials: false,
};

module.exports = {
  service,
  plugins,
  provider: {
    name: 'aws',
    runtime: 'nodejs12.x',
    timeout: 16,
    memorySize: 512,
    region: `\${env:AWS_REGION, "us-east-1"}`,
    stage: `\${env:SLS_STAGE, "development"}`,
  },
  package: {
    individually: true,
    // we don't need this because of ncc
    excludeDevDependencies: false,
  },
  custom: {
    ncc: {
      sourceMap: true,
    },
  },
  functions: {
    'create-user': {
      handler: 'apps/user-service/build/handlers/create.handler',
      events: [
        {
          httpApi: {
            method: 'POST',
            path: `/api/users`,
            cors,
          },
        },
      ],
    },
  },
};

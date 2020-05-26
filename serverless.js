const { paramCase } = require('param-case');
const pkg = require('./package.json');

const { NODE_ENV = 'development' } = process.env;

const service = paramCase(pkg.name);
const plugins = [
  'serverless-s3-sync',
  ...(NODE_ENV === 'production'
    ? ['serverless-plugin-ncc']
    : ['serverless-offline']),
];

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

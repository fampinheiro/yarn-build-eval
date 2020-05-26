import Joi from '@hapi/joi';
import { APIGatewayProxyHandler, APIGatewayProxyEvent } from 'aws-lambda';

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent,
) => {
  Joi.object({
    displayName: Joi.string().required(),
    email: Joi.string().email().required(),
  }).validate(JSON.parse(event.body || ''));

  return {
    statusCode: 201,
    body: JSON.stringify({}),
  };
};

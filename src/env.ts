import * as joi from 'joi';
import { config } from 'dotenv';
config();

const customJoi = joi.extend((j: any) => ({
  base: j.array(),
  name: 'stringArray',
  coerce: (value: any, state: any, options: any) =>
    value.split ? value.split(',') : value,
}));

export async function setupEnvironment() {
  process.env = await joi.validate(
    <any>process.env,
    {
      NODE_ENV: joi
        .string()
        .valid(['development', 'test', 'production'])
        .default('development'),
      PORT: joi.number().default(3000),
      CURRENCIES: customJoi.stringArray().required(),

      DATABASE_TYPE: joi.string().default('mysql'),
      DATABASE_USER: joi.string().default('user'),
      DATABASE_PASSWORD: joi.string().default('password'),
      DATABASE_DB: joi.string().default('db'),
      DATABASE_HOST: joi.string().default('localhost'),
      DATABASE_PORT: joi.number().default(3306),

      MICROSERVICES_RETRY_ATTEMPTS: joi.number().default(5),
      MICROSERVICES_RETRY_DELAYS: joi.number().default(3000),
    },
    {
      stripUnknown: true,
    },
  );
}

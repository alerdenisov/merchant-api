import * as ms from '@nestjs/microservices';

declare module '@nestjs/microservices' {
  interface PatternMetadata {
    service: 'merchant' | 'balances' | 'blockchain';
    cmd: string;
  }
  const MessagePattern: (metadata: PatternMetadata) => MethodDecorator;
}

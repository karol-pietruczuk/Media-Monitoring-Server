declare module '@nestjs/event-emitter' {
  import { DynamicModule } from '@nestjs/common';

  export class EventEmitterModule {
    static forRoot(options?: any): DynamicModule;
  }

  export class EventEmitter2 {
    emit(event: string, ...args: any[]): boolean;
  }

  export function OnEvent(
    event: string,
    options?: { async?: boolean },
  ): MethodDecorator;
}

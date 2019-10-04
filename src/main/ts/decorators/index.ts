import {Controller, ControllerOptions, Post} from '@nestjs/common'

export function JsonRpcController(): ClassDecorator

export function JsonRpcController(prefix: string): ClassDecorator;

export function JsonRpcController(options: ControllerOptions): ClassDecorator;

export function JsonRpcController(
  prefixOrOptions?: string | ControllerOptions,
): ClassDecorator {
  return <TFunction extends Function>(target: TFunction) => {

    interface ClassType<InstanceType extends TFunction> extends Function {
      new(...args: any[]): InstanceType
      prototype: InstanceType
    }

    const extend = <BaseClass extends ClassType<any>>(base: BaseClass) => {
      @Controller(prefixOrOptions as any)
      class Extended extends base {
        @Post('/foo')
        foo() {
          return {foo: 'bar'}
        }
      }

      return Extended
    }

    return extend(target as any)
  };
}



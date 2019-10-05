import {
  ControllerOptions,
  Type,
  PipeTransform,
  assignMetadata,
  ParamData,
  RequestMethod,

  Controller,
  Next,
  Post,
  // Body,
  // createParamDecorator,
} from '@nestjs/common'


import {
  isNil,
  isString,
  //isUndefined,
} from '@nestjs/common/utils/shared.utils'

import {RouteParamtypes} from '@nestjs/common/enums/route-paramtypes.enum'


import { RequestMappingMetadata } from '@nestjs/common/interfaces/request-mapping-metadata.interface'
import {
  ROUTE_ARGS_METADATA,
  METHOD_METADATA,
  PATH_METADATA,
  //SCOPE_OPTIONS_METADATA
} from '@nestjs/common/constants'

const NEXT = '__next__'
const RPC_METHOD = '__rpc-method__'

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
        @Post('/')
        rpc(@Next() next: Function, @RpcMethod() method: string): any {
          Reflect.defineMetadata(NEXT, next, base)
          Reflect.defineMetadata(RPC_METHOD, method, base)
          //console.log('TTT', id)
          //console.log('!!!args', body)
          //void body

          //return this.bar.call(this)

          next()

          return {foo: '111111'}

        }
      }

      return Extended
    }

    return extend(target as any)
  };
}

/*
export function JsonRpcController(
  prefixOrOptions?: string | ControllerOptions,
): ClassDecorator {
  const defaultPath = '/';
  const [path, scopeOptions] = isUndefined(prefixOrOptions)
    ? [defaultPath, undefined]
    : isString(prefixOrOptions)
      ? [prefixOrOptions, undefined]
      : [prefixOrOptions.path || defaultPath, { scope: prefixOrOptions.scope }];

  return (target: object) => {
    Reflect.defineMetadata(PATH_METADATA, path, target);
    Reflect.defineMetadata(SCOPE_OPTIONS_METADATA, scopeOptions, target);
  };
}*/
/*


export const JsonRpcId = createParamDecorator((data: any, body) => {
  console.log('!!!args', 'data=', data, 'body=', body)
  void data
  return body.id || null;
});
*/






/*
const createRouteParamDecorator = (paramtype: RouteParamtypes) => {
  return (data?: ParamData): ParameterDecorator => (target, key, index) => {
    const args =
      Reflect.getMetadata(ROUTE_ARGS_METADATA, target.constructor, key) || {};
    Reflect.defineMetadata(
      ROUTE_ARGS_METADATA,
      assignMetadata<RouteParamtypes, Record<number, RouteParamMetadata>>(
        args,
        paramtype,
        index,
        data,
      ),
      target.constructor,
      key,
    );
  };
};
*/

const createPipesRouteParamDecorator = (paramtype: RouteParamtypes) => (
  data?: any,
  ...pipes: (Type<PipeTransform> | PipeTransform)[]
): ParameterDecorator => (target, key, index) => {
  const args = Reflect.getMetadata(ROUTE_ARGS_METADATA, target.constructor, key) || {};
  const hasParamData = isNil(data) || isString(data);
  const paramData = hasParamData ? data : undefined;
  const paramPipes = hasParamData ? pipes : [data, ...pipes];

  Reflect.defineMetadata(
    ROUTE_ARGS_METADATA,
    assignMetadata(args, paramtype, index, paramData, ...paramPipes),
    target.constructor,
    key,
  );
};



export function JsonRpcId(): ParameterDecorator {
  const property = 'id'

  return createPipesRouteParamDecorator(RouteParamtypes.BODY)(
    property,
  );
}

export function RpcMethod(): ParameterDecorator {
  const property = 'method'

  return createPipesRouteParamDecorator(RouteParamtypes.BODY)(
    property,
  );
}

export interface RouteParamMetadata {
  index: number;
  data?: ParamData;
}


///////////////////////
const JSON_RPC_METADATA = '__rpc-metadata__';

const defaultMetadata = {
  [PATH_METADATA]: '/',
  [METHOD_METADATA]: RequestMethod.GET,
  [JSON_RPC_METADATA]: ''
};

type JsonRpcRequestMappingMetadata = RequestMappingMetadata & {
  [JSON_RPC_METADATA]: string
}

export const RequestMapping = (
  metadata: JsonRpcRequestMappingMetadata = defaultMetadata,
): MethodDecorator => {
  const pathMetadata = metadata[PATH_METADATA];
  const path = pathMetadata && pathMetadata.length ? pathMetadata : '/';
  const requestMethod = metadata[METHOD_METADATA] || RequestMethod.POST;
  const jsonRpcMethod = metadata[JSON_RPC_METADATA]

  return (target, key, descriptor: PropertyDescriptor) => {
    void target, key

    const method = descriptor.value

    descriptor.value = (...args: any[]) => {
      const next = Reflect.getMetadata(NEXT, target.constructor)
      const rpcMethod = Reflect.getMetadata(RPC_METHOD, target.constructor)

      return new Promise((resolve) => {
        if (rpcMethod === jsonRpcMethod) {
          /*setTimeout(() => {
            resolve(method(...args))
          }, 10 + Math.random() * 3000)*/

          resolve(method(...args))

        } else {
          next()
          //console.log('!!!', r)
          //resolve(r)
        }
      })
    }

    //console.log('target=', target, 'key=', key, 'desc=', descriptor.value)

    Reflect.defineMetadata(PATH_METADATA, path, descriptor.value);
    Reflect.defineMetadata(METHOD_METADATA, requestMethod, descriptor.value);
    Reflect.defineMetadata(JSON_RPC_METADATA, jsonRpcMethod, descriptor.value);
    return descriptor;
  };
};

export const JsonRpcMethod = (method: string): MethodDecorator => {
  return RequestMapping({
    [PATH_METADATA]: '/',
    [METHOD_METADATA]: RequestMethod.POST,
    [JSON_RPC_METADATA]: method
  });
};


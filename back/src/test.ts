import {Logger} from '@nestjs/common'

export function testDecorator() {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value

    descriptor.value = async function (...args: any[]) {
      const start = Date.now()
      const result = await originalMethod.apply(this, args)
      const end = Date.now()
      const executionTime = end - start
      Logger.log(`${propertyKey} executed in ${executionTime}ms`, target.constructor.name)
      return result
    }

    return descriptor
  }
}

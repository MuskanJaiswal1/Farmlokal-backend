declare module "opossum" {
  class CircuitBreaker {
    constructor(fn: Function, options?: any);
    fire(...args: any[]): Promise<any>;
    fallback(fn: Function): void;
  }
  export = CircuitBreaker;
}

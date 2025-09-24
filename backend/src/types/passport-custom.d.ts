declare module 'passport-custom' {
  import { Strategy } from 'passport-strategy';
  
  interface StrategyOptions {
    passReqToCallback?: boolean;
  }
  
  interface VerifyFunction {
    (req: any, done: (error: any, user?: any, info?: any) => void): void;
  }
  
  interface VerifyFunctionWithRequest {
    (req: any, done: (error: any, user?: any, info?: any) => void): void;
  }
  
  export class Strategy extends Strategy {
    constructor(verify: VerifyFunction | VerifyFunctionWithRequest, options?: StrategyOptions);
    name: string;
  }
}

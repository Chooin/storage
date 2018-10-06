import { config } from './index'

export declare function set(key: string, value: any, config?: config): void;
export declare function get(key: string, config?: config): any;
export declare function getOnce(key: string, config?: config): any;
export declare function remove(key: string | string[], config?: config): void;
export declare function clear(config?: config): void;

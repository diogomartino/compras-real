export type * from "./tables";
export type * from "./products";
export type * from "./base-list";
export type * from "./ongoing-list";
export type * from "./pagination";
export * from "./trpc";
export * from "./helpers";

export type TGenericObject = {
  [key: string]: any;
};

export type TGenericFunction = {
  (...args: any[]): any;
};

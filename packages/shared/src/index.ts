export type * from "./tables";
export type * from "./products";
export * from "./trpc";
export * from "./helpers";
export * from "./scrapper";

export type TGenericObject = {
  [key: string]: any;
};

export type TGenericFunction = {
  (...args: any[]): any;
};

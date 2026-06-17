// @fontsource packages are CSS-only and ship no type declarations.
// TypeScript 6's `noUncheckedSideEffectImports` flags their side-effect
// imports without this ambient declaration.
declare module "@fontsource/*";

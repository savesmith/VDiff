export const throwError = (errorMessage: string): never => {
    throw new Error(errorMessage);
};
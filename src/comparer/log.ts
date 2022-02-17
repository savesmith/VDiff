const DEBUG = 1;

export const debug = (message? : string, ...optionalparams : unknown[]) => {
    if(DEBUG) {
        console.debug(message, ...optionalparams);
    }
};


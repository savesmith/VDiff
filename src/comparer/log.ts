const DEBUG = 0;

export const debug = (message? : string, ...optionalparams : unknown[]) => {
    if(DEBUG) {
        console.debug(message, ...optionalparams);
    }
};


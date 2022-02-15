const DEBUG = 0;

export const debug = (message? : string, ...optionalparams : any[]) => {
    if(DEBUG) {
        console.debug(message, ...optionalparams);
    }
};


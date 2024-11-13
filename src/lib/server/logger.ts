import "server-only"

const logger = {
    error: (message: any, context?: any) => console.error(message, context),
    warn: (message: any, context?: any) => console.warn(message, context),
    info: (message: any, context?: any) => console.info(message, context),
    verbose: (message: any, context?: any) => console.info(message, context),
    debug: (message: any, context?: any) => console.debug(message, context),
    silly: (message: any, context?: any) => console.debug(message, context),
}

export { logger }

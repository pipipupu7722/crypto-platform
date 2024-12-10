export class BadSessionError extends Error {
    constructor(message?: string, options?: { cause?: unknown }) {
        super(message, options)
    }
}

export class UnauthorizedError extends Error {
    constructor(message?: string, options?: { cause?: unknown }) {
        super(message, options)
    }
}

export class ServerActionError extends Error {
    constructor(message?: string, options?: { cause?: unknown }) {
        super(message, options)
    }
}

export class AlreadyHasPendingWithdrawalError extends Error {
    constructor(message?: string, options?: { cause?: unknown }) {
        super(message, options)
    }
}

export class BalanceIsTooLowError extends Error {
    constructor(message?: string, options?: { cause?: unknown }) {
        super(message, options)
    }
}

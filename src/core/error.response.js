'use strict';

const { StatusCodes, ReasonPhrases } = require('../utils/httpStatusCode');
const systemLogger = require('../loggers/system.log');

class ErrorResponse extends Error {
    constructor(message, status) {
        super(message);
        this.status = status;

        // Log the error use winston
        systemLogger.error(this.message, {
            context: '/path',
            requestId: 'UUUAAA',
            message: this.message,
            metadata: {},
        });
    }
}

class NotFoundRequestError extends ErrorResponse {
    constructor(message = ReasonPhrases.NOT_FOUND, statusCode = StatusCodes.NOT_FOUND) {
        super(message, statusCode);
    }
}

class BadRequestError extends ErrorResponse {
    constructor(message = ReasonPhrases.BAD_REQUEST, statusCode = StatusCodes.BAD_REQUEST) {
        super(message, statusCode);
    }
}

class ForbiddenRequestError extends ErrorResponse {
    constructor(message = ReasonPhrases.FORBIDDEN, statusCode = StatusCodes.FORBIDDEN) {
        super(message, statusCode);
    }
}

class ConflictRequestError extends ErrorResponse {
    constructor(message = ReasonPhrases.CONFLICT, statusCode = StatusCodes.CONFLICT) {
        super(message, statusCode);
    }
}

class AuthFailureError extends ErrorResponse {
    constructor(message = ReasonPhrases.UNAUTHORIZED, statusCode = StatusCodes.UNAUTHORIZED) {
        super(message, statusCode);
    }
}

module.exports = {
    AuthFailureError,
    BadRequestError,
    ConflictRequestError,
    ForbiddenRequestError,
    NotFoundRequestError,
};

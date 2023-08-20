'use strict';

const STATUS_CODE = {
    BAD: 400,
    FORBIDDEN: 403,
    CONFLICT: 409,
};

const REASON_STATUS_CODE = {
    BAD: 'Bad request error',
    FORBIDDEN: 'Forbidden request error',
    CONFLICT: 'Conflict error',
};

class ErrorResponse extends Error {
    constructor(message, status) {
        super(message);
        this.status = status;
    }
}

class BadRequestError extends ErrorResponse {
    constructor(message = REASON_STATUS_CODE.BAD, statusCode = STATUS_CODE.BAD) {
        super(message, statusCode);
    }
}

class ForbiddenRequestError extends ErrorResponse {
    constructor(message = REASON_STATUS_CODE.FORBIDDEN, statusCode = STATUS_CODE.FORBIDDEN) {
        super(message, statusCode);
    }
}

class ConflictRequestError extends ErrorResponse {
    constructor(message = REASON_STATUS_CODE.CONFLICT, statusCode = STATUS_CODE.CONFLICT) {
        super(message, statusCode);
    }
}

module.exports = {
    BadRequestError,
    ForbiddenRequestError,
    ConflictRequestError,
};

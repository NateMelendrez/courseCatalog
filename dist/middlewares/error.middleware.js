"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.asyncHandler = exports.pageNotFound = exports.errorHandler = void 0;
const pageNotFound = ({ req, res, next }) => {
    const error = new Error(`Not found - ${req.originalUrl}`);
    res.status(400);
    next(error);
};
exports.pageNotFound = pageNotFound;
const errorHandler = ({ error, req, res, next }) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    console.error({
        message: error.message,
        stack: error.stack,
    });
    res.status(statusCode).send({ message: error.message });
};
exports.errorHandler = errorHandler;
const asyncHandler = (controller) => {
    return async ({ req, res, next }) => {
        try {
            await controller(req, res, next);
        }
        catch (error) {
            next(error);
        }
    };
};
exports.asyncHandler = asyncHandler;

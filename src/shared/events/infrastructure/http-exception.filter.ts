import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { PolicyNotFoundException } from '../../../policies/domain/exceptions/policy-not-found.exception';
import { InvalidStateTransitionException } from '../../../policies/domain/exceptions/invalid-state-transition.exception';
import { InvalidPolicyException } from '../../../policies/domain/exceptions/invalid-policy.exception';
import { UnsupportedBranchException } from '../../../policies/domain/exceptions/unsupported-branch.exception';
import { UnsupportedRatingStrategyException } from '../../../policies/domain/exceptions/unsupported-rating-strategy.exception';
import { CustomerNotFoundException } from '../../../customers/domain/exceptions/customer-not-found.exception';
import { EmailAlreadyExistsException } from '../../../customers/domain/exceptions/email-already-exists.exception';

// Filtro global — mapea excepciones de dominio a códigos HTTP
@Catch()
export class DomainExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (exception instanceof PolicyNotFoundException ||
        exception instanceof CustomerNotFoundException) {
      return response.status(HttpStatus.NOT_FOUND).json({
        statusCode: 404,
        error: exception.name,
        message: exception.message,
      });
    }

    if (exception instanceof EmailAlreadyExistsException) {
      return response.status(HttpStatus.CONFLICT).json({
        statusCode: 409,
        error: exception.name,
        message: exception.message,
      });
    }

    if (exception instanceof InvalidStateTransitionException ||
        exception instanceof InvalidPolicyException ||
        exception instanceof UnsupportedBranchException ||
        exception instanceof UnsupportedRatingStrategyException) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        error: exception.name,
        message: exception.message,
      });
    }

    // Error no manejado
    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      statusCode: 500,
      error: 'InternalServerError',
      message: 'An unexpected error occurred',
    });
  }
}

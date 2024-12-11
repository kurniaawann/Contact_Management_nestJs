import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { ZodError } from 'zod';

@Catch(ZodError, HttpException)
export class ErrorFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();

    if (exception instanceof HttpException) {
      response.status(exception.getStatus()).json({
        code: 400,
        error: exception.getResponse(),
      });
    } else if (exception instanceof ZodError) {
      const messages = exception.issues
        .map((issue) => {
          const field = issue.path.join(', '); // Menggabungkan path menjadi string
          return `${field} is required`; // Pesan spesifik untuk field
        })
        .join(', ');
      response.status(400).json({
        code: 400,
        error: messages,
      });
    } else {
      response.status(500).json({
        code: 500,
        error: exception.message,
      });
    }
  }
}

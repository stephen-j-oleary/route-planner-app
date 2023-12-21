export class ApiError {
  status: number;
  message: string;

  constructor({
    status = 500,
    message = "",
  }: Partial<ApiError>) {
    this.status = status;
    this.message = message;
  }
}

export class RequestError extends ApiError {
  /**
   * @param message "Bad request"
   */
  constructor(message: string = "Bad request") {
    super({ status: 400, message });
  }
}

export class AuthError extends ApiError {
  /**
   * @param message "Not authorized"
   */
  constructor(message: string = "Not authorized") {
    super({ status: 401, message });
  }
}

export class ForbiddenError extends ApiError {
  /**
   * @param message "Forbidden"
   */
  constructor(message: string = "Forbidden") {
    super({ status: 403, message });
  }
}

export class NotFoundError extends ApiError {
  /**
   * @param message "Resource not found"
   */
  constructor(message: string = "Resource not found") {
    super({ status: 404, message });
  }
}

export class ConflictError extends ApiError {
  /**
   * @param message "Resource conflict"
   */
  constructor(message: string = "Resource conflict") {
    super({ status: 409, message });
  }
}
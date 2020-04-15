class BaseError extends Error {
  public statusCode;

  constructor(statusCode: number, message: string) {
    super();
    this.statusCode = statusCode;
    this.message = message;
  }
}

// tslint:disable-next-line: max-classes-per-file
export class NotFoundError extends BaseError {
  constructor(message: string) {
    super(404, message);
  }
}

// tslint:disable-next-line: max-classes-per-file
export class DuplicateEntryError extends BaseError {
  constructor(message: string) {
    super(403, message);
  }
}

// tslint:disable-next-line: max-classes-per-file
export class MismatchError extends BaseError {
  constructor(message: string) {
    super(401, message);
  }
}

export class UnauthorizedError extends BaseError {
  constructor(message: string) {
    super(403, message);
  }
}

// tslint:disable-next-line: max-classes-per-file
export class ServerError extends BaseError {
  constructor(message: string) {
    super(500, message);
  }
}

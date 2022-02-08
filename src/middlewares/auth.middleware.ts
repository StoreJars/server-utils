import { UnauthorizedError } from '../errors';

export function Customer(req, res, next: any) {
  const { user } = req;
  // TODO validate that a user is available on the request

  if (user.type === 'vendor' || user.type === 'admin' || user.type === 'customer') {
    next();
  } else {
    throw new UnauthorizedError('not permitted');
  }
}

export function Vendor(req, res, next: any) {
  const { user } = req;

  if (user.type === 'vendor' || user.type === 'admin') {
    next();
  } else {
    throw new UnauthorizedError('not permitted');
  }
}

export function Admin(req, res, next: any) {
  const { user } = req;

  if (user.type === 'admin') {
    next();
  } else {
    throw new UnauthorizedError('not permitted');
  }
}

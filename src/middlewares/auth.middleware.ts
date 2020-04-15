
import { UnauthorizedError } from '../errors';

/**
* Check if the user is a vendor by getting his type 
*/

export function Customer(req, res, next: any) {

  const { user } = req;
  // valudate that a user is available on the request

  if (user.type === 'vendor' || 'admin' || 'customer') {
    next();
  } else {
    throw new UnauthorizedError('not permitted');
  }
}

export function Vendor(req, res, next: any) {
  const { user } = req;

  if (user.type === 'vendor' || 'admin') {
    next();
  } else {
    throw new UnauthorizedError('not permitted');
  }
}

export function Admin(req, res, next: any) {
  const { user } = req;

  if (user.type === 'admin') {
    next()
  } else {
    throw new UnauthorizedError('not permitted');
  }
}

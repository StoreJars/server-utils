import objectid from 'objectid';
import shortId from 'shortid';

export function timestamp() {
  const date = new Date();

  const day = date.getDay();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const time = date.toLocaleTimeString('en', { hour12: false });

  return `${day}:${month}:${year}:${time}`;
}

export function validateUrl(value) {
  return /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(
    value,
  );
}

export function getPublicUrl(type, filename) {
  return `https://storage.googleapis.com/nodebukka.appspot.com/${type}/${encodeURIComponent(filename)}`;
}

/**
 *
 * @param id
 * This converts a string to type object id, if the conversion is not possible it throws an error because the string is an invlaid object id type
 */
export function objectId(id: any) {
  try {
    return new objectid(id);
  } catch (ex) {
    throw new Error('invalid id');
  }
}

export function generateId() {
  shortId.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ&$');
  return shortId.generate();
}

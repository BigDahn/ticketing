import { scrypt, randomBytes } from 'crypto';
import { promisify } from 'util';

// scrypt is callback based, so we need to convert it to a promise based function that we can use with async/await so we use promisify to convert it to a promise based function

const scryptAsync = promisify(scrypt);

export class Password {
  static async toHash(password: string) {
    const salt = randomBytes(8).toString('hex');
    const buf = (await scryptAsync(password, salt, 64)) as Buffer;

    return `${buf.toString('hex')}.${salt}`;
  }

  static async compare(storedPassword: string, suppliedPassword: string) {
    const [hashedPassword, salt] = storedPassword.split('.');
    const buf = (await scryptAsync(suppliedPassword, salt!, 64)) as Buffer;

    return buf.toString('hex') === hashedPassword;
  }
}

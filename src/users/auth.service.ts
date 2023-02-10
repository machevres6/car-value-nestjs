import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { UsersService } from "./users.service";
import { randomBytes, scrypt as _scrypt } from "crypto";
import { promisify } from "util";

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
    constructor(private usersService: UsersService) { }

    async signup(email: string, password: string) {
        // See if email is in use
        const users = await this.usersService.find(email);
        if (users.length) {
            throw new BadRequestException('email in use');
        }

        // Hash the users password
        // Generate a salt
        const salt = randomBytes(8).toString('hex');
        // Hash the salt and password together
        const hash = (await scrypt(password, salt, 32)) as Buffer;

        // Join the hashed password and salt together
        const result = salt + '.' + hash.toString('hex');

        // Create a new user and save it to the database

        const newUser = await this.usersService.create(email, result);
        // return the user

        return newUser;
    }

    async signin(email: string, password: string) {
        // Check if the email is valid
        const [user] = await this.usersService.find(email);

        if (!user) {
            throw new NotFoundException('User not Found');
        }

        const [salt, storedHash] = user.password.split('.');

        const hash = (await scrypt(password, salt, 32)) as Buffer;

        if (storedHash !== hash.toString('hex')) {
            throw new BadRequestException('Invalid Password');
        }

        return user;
        // if valid, return the user

        // if not, throw an error

        // return the user
    }
}
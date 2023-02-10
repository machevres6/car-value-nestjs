import { Body, Controller, Delete, Get, Patch, Post, Param, Query, NotFoundException, Session } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-use.dto';
import { UsersService } from './users.service';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';
import { AuthService } from './auth.service';

@Controller('auth')
@Serialize(UserDto)
export class UsersController {
	constructor(
		private usersService: UsersService,
		private authService: AuthService
	) {}

	@Get('/whoami')
	async whoAmI(@Session() session: any) {
		const whoAmIUser = await this.usersService.findOne(session.userId);

		if (!whoAmIUser) {
			throw new NotFoundException('Nobody is Logged In');
		}
	}

	@Post('/signup')
	async createUser(@Body() body: CreateUserDto, @Session() session: any) {
		const createUser = await this.authService.signup(body.email, body.password);
		session.userId = createUser.id;
		return createUser;
	}

	@Post('/signin')
	async signin(@Body() body: CreateUserDto, @Session() session: any) {
		const signUser = await this.authService.signin(body.email, body.password);
		session.userId = signUser.id;
		return signUser;
	}

	@Post('/signout')
	signOut(@Session() session: any) {
		session.userId = null;
	}

	
	@Get('/:id')
	async findUser(@Param('id') id: string) {
		const user = await this.usersService.findOne(parseInt(id));

		if (!user) {
			throw new NotFoundException('User not found');
		}

		return user;
	}

	@Get('/')
	findAllUsers(@Query('email') email: string) {
		return this.usersService.find(email);
	}

	@Patch('/:id')
	updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
		return this.usersService.update(parseInt(id), body);
	}

	@Delete('/:id')
	removeUser(@Param('id') id: string) {
		return this.usersService.remove(parseInt(id));
	}
}

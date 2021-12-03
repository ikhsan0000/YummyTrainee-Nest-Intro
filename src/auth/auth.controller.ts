import { BadRequestException, Body, Controller, Get, NotFoundException, Post, Res, Req } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcryptjs';
import { RegisterDto } from './model/register.dto';
import { JwtService } from '@nestjs/jwt';
import { Response, Request} from 'express';

@Controller()
export class AuthController {

    constructor(
        private userService: UserService,
        private jwtService: JwtService
        ){}

    @Post('register')
    async register(@Body() body:RegisterDto)
    {
        if(body.password !== body.password_confirm)
        {
            throw new BadRequestException('Password does not match');
        }

        const hashedPassword = await bcrypt.hash(body.password, 10)
        return this.userService.create(
            {
                first_name: body.first_name,
                last_name: body.last_name,
                email: body.email,
                password: hashedPassword
            }
        );
    }

    @Post('login')
    async login(
        @Body('email') email: string,
        @Body('password') password: string,
        @Res({ passthrough: true }) response: Response
    )
    {
        const user = await this.userService.findOne({email: email});

        if(!user)
        {
            throw new NotFoundException('user not found!');
        }

        if(!await bcrypt.compare(password, user.password))
        {
            throw new BadRequestException('invalid credential');
        }
        else
        {
            const jwt = await this.jwtService.signAsync({id: user.id})
            response.cookie('jwt',jwt, {httpOnly: true});
            return user;
        }
    }

    @Get('user')
    async user(@Req() request: Request)
    {
        const cookie = request.cookies['jwt'];

        const data = await this.jwtService.verifyAsync(cookie);

        return this.userService.findOne({id: data.id});
    }
}

import { BadRequestException, Body, ClassSerializerInterceptor, Controller, Delete, Get, NotFoundException, Param, Post, Put, Query, Req, UseGuards, UseInterceptors} from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { UserCreateDto } from './models/user.create.dto';
import { User } from './models/user.entity';
import { UserUpdateDto } from './models/user.update.dto';
import { UserService } from './user.service';
import * as bcrypt from 'bcryptjs';
import { AuthService } from 'src/auth/auth.service';
import { request, Request } from 'express';
import { HasPermission } from 'src/permision/has.permission.decorator';

@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(AuthGuard)
@Controller('users')
export class UserController {

    constructor(
        private userService: UserService,
        private authService: AuthService
        ){}
 
    @Get()
    @HasPermission('users')
    async all(@Query('page')page: number) 
    {
        return await this.userService.paginate(page, ['role']);
    }

    @Get(':id')
    @HasPermission('users')
    async findOne(@Param('id') urlId: number)
    {
        return this.userService.findOne({id: urlId}, ['role'])
    }

    @Post()
    @HasPermission('users')
    async create(@Body() body: UserCreateDto): Promise<User>
    {
        const password = await bcrypt.hash('123', 12);

        const{role_id, ...data} = body;

        return this.userService.create({
            ...data,
            role: {id: role_id}
        });
    }


    @Put('info')
    async updateInfo(
        @Req() request: Request,
        @Body() body: UserUpdateDto
    )
    {
        const id = await this.authService.userId(request);

        await this.userService.update(id, body);

        return this.userService.findOne(id);
    }
    
    @Put('password')
    async updatePassword(
        @Req() request: Request,
        @Body('password') password: string,
        @Body('password_confirm') password_confirm: string
    )
    {
        const id = await this.authService.userId(request);

        if(password !== password_confirm)
        {
            throw new BadRequestException('Password do not match!');
        }
        else
        {
            const passwordHashed = await bcrypt.hash(password, 12);
            await this.userService.update(id, {password: passwordHashed});
    
            return this.userService.findOne(id);
        }
    }



    @Put(':id')
    @HasPermission('users')
    async update(
        @Param('id') id: number,
        @Body() body: UserUpdateDto
    )
    {
        const {role_id, ...data} = body;

        await this.userService.update(
            id, 
            {
              ...data,
              role:{id: role_id}  
            });
        
        return this.userService.findOne({id},['role'])
    }

    @Delete(':id')
    @HasPermission('users')
    async delete(@Param('id') id: number)
    {
        return this.userService.delete(id);
    }
}

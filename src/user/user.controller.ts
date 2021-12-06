import { Body, ClassSerializerInterceptor, Controller, Delete, Get, NotFoundException, Param, Post, Put, Query, UseGuards, UseInterceptors} from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { UserCreateDto } from './models/user.create.dto';
import { User } from './models/user.entity';
import { UserUpdateDto } from './models/user.update.dto';
import { UserService } from './user.service';
import * as bcrypt from 'bcryptjs';


@UseGuards(AuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
@Controller('users')
export class UserController {

    constructor(private userService: UserService){}
 
    @Get()
    async all(@Query('page')page: number): Promise<User[]>
    {
        return await this.userService.paginate(page);;
    }

    @Get(':id')
    async findOne(@Param('id') urlId: number)
    {
        return this.userService.findOne({id: urlId})
        
    }

    @Post()
    async create(@Body() body: UserCreateDto): Promise<User>
    {
        const password = await bcrypt.hash('123', 12);

        return this.userService.create({
            first_name: body.first_name,
            last_name: body.last_name,
            email: body.email,
            password,
            role: {id: body.role_id}
        });
    }

    @Put(':id')
    async update(
        @Param('id') id: number,
        @Body() body: UserUpdateDto
    )
    {
        const {role_id, ...data} = body;

        return this.userService.update(
            id, 
            {
              ...data,
              role:{id: role_id}  
            });
    }

    @Delete(':id')
    async delete(@Param('id') id: number)
    {
        return this.userService.delete(id);
    }
}

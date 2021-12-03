import { Controller, Get, NotFoundException, Param} from '@nestjs/common';
import { User } from './models/user.entity';
import { UserService } from './user.service';

@Controller('users')
export class UserController {

    constructor(private userService: UserService){}
 
    @Get()
    async all(): Promise<User[]>
    {
        return await this.userService.all();;
    }

    @Get(':id')
    async findOne(@Param('id') urlId: string): Promise<String>
    {
        const user = await this.userService.findOne({id: urlId});

        if(!user)
        {
            throw new NotFoundException('Username with that id is not exist!');
        }

        return 'the username is: ' + user.first_name;
    }
}

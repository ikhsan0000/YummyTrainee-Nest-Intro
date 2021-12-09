import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Put } from '@nestjs/common';
import { HasPermission } from 'src/permision/has.permission.decorator';
import { Permission } from 'src/permision/permission.entity';
import { Role } from './models/role.entity';
import { RoleService } from './role.service';

@Controller('roles')
export class RoleController {
    constructor(private roleService: RoleService){}
  
    @Get()
    @HasPermission('roles')
    async all()
    {
        return this.roleService.all();
    }

    @Get(':id')
    @HasPermission('roles')
    async findOne(@Param('id') urlId: string)
    {
        return this.roleService.findOne({id: urlId}, ['permissions']);
    }

    @Put(':id')
    @HasPermission('roles')
    async update(
        @Param('id') id: number,
        @Body('name') name: string,
        @Body('permissions') ids: number[]
    )
    {
        await this.roleService.update(id, {name});

        const role = await this.roleService.findOne({id});

        return this.roleService.create({
            ...role,
            permissions: ids.map(id => ({id}))
        })
    }

    @Delete(':id')
    @HasPermission('roles')
    async delete(@Param('id') id: number): Promise<any>
    {
        return this.roleService.delete(id);
    }

    @Post()
    async create(
        @Body('name') name:String,
        @Body('permissions') ids: number[])
    {
        return this.roleService.create({
            name,
            permissions: ids.map(id =>({id}))
        });
    }

    
}

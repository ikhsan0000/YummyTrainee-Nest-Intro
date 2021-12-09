import { BadRequestException, CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { AuthService } from 'src/auth/auth.service';
import { RoleService } from 'src/role/role.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private authService: AuthService,
    private userService: UserService,
    private roleService: RoleService
    ){}

  async canActivate(context: ExecutionContext)
  {
    const access = this.reflector.get<string>('access', context.getHandler());
    if(!access)
    {
      return true;
    }
    else
    {
      const request = context.switchToHttp().getRequest();
      const id = await this.authService.userId(request);
      const user = await this.userService.findOne({id}, ['role']);
      const role = await this.roleService.findOne({id: user.role.id}, ['permissions'])
      let roleNames = [];
      
      role.permissions.forEach(p => {
        roleNames.push(p.name);
      });                                       //get all the current user role's name
      
      if(request.method === 'GET')
      {
        return roleNames.some(p => (p === `view_${access}`) || (p === `edit_${access}`) );
      }
      else
      {
        return roleNames.some(p => (p === `edit_${access}`) );
      }
      
    }
    
  }
}

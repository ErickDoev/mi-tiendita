  import { BadRequestException, CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { META_ROLES } from 'src/auth/decorators/role-protected.decorator';
import { User } from 'src/users/entities';

@Injectable()
export class UserRoleGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector
  ){}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {

    const validRoles: string[] = this.reflector.get(META_ROLES, context.getHandler());
    console.log(validRoles);
    if(!validRoles) {
      return true;
    }
    if(validRoles.length === 0) {
      return true;
    }
    const req = context.switchToHttp().getRequest();
    const user = req.user as User;
    if(!user) {
      throw new BadRequestException('User not found');
    }
    
    //TODO: roles
    // if(validRoles.includes(user.role)){
    //   return true;
    // }
    

    throw new ForbiddenException(`User ${user.user_name} need valid role: [${validRoles}]`);
  }
}

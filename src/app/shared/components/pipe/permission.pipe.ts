import { Pipe, PipeTransform } from '@angular/core';
import {AuthService} from "../../../core/auth/auth.service";

@Pipe({ name: 'permission' })
export class PermissionPipe implements PipeTransform {
    constructor(private _authService: AuthService,) {
    }

  public transform(permission: string | string): boolean {
      // console.log("hasPermission : " + permission)
      if (permission) {
          let _p = false;
          permission.split(',').forEach((item: string) => {
              if (this._authService.authenticatedUser.roles.includes(item.toUpperCase())) {
                  _p = true;
                  return;
              }
          });
          return _p;
      }
      // console.log("hasPermission : " + true)
      return true;
  }
}

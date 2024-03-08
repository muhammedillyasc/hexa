import {
  Injectable,
  UnauthorizedException,
  InternalServerErrorException,
  ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { USER_ACCOUNT_STATUS } from '../enum/accountStatus.enum';
import { USER_ROLES } from '../enum/role.enum';
import { REGEX_FOR_EMAIL } from 'src/config/constant';

@Injectable()
export class AuthGuard {
  constructor(private readonly jwtService: JwtService) {}

  /**
   * Check if the user has the required access based on the provided roles.
   * @param context The context object containing the request.
   * @param allowedRoles The roles allowed to access the route.
   * @returns Returns the decoded token data if the admin has access; otherwise, throws an exception.
   */
  checkUserAccess(
    context: any,
    allowedRoles = [],
    isRest: boolean = false,
  ): any {
    // token
    let token = null;
    if (isRest) {
      token = context?.authorization?.split(' ')[1] || null; // for Rest Api
    } else {
      token = context?.req?.headers?.authorization?.split(' ')[1] || null; // for GraphQl Api
    }

    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const decodedToken = this.jwtService.verify(token);

      const {
        role = null,
        isActive = USER_ACCOUNT_STATUS.IN_ACTIVE,
        email,
      } = decodedToken || {};

      if (!email || !REGEX_FOR_EMAIL.test(email)) {
        throw new UnauthorizedException('Invalid email...');
      }

      if (isActive !== USER_ACCOUNT_STATUS.ACTIVE) {
        throw new UnauthorizedException('User account is not activated yet...');
      }

      // allow all the access it nothing mentioned in the allowed roles
      // or the user have super admin role
      if (allowedRoles.length === 0 || role === USER_ROLES.SUPER_ADMIN) {
        return decodedToken;
      }

      if (!allowedRoles.includes(role)) {
        throw new ForbiddenException(
          'You do not have sufficient role to perform this action.',
        );
      }

      return decodedToken;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}

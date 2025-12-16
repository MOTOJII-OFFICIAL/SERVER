import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    console.log('🛡️ JwtAuthGuard canActivate called');
    return super.canActivate(context);
  }

  handleRequest(err, user, info, context) {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;
    console.log('🛡️ Full auth header:', authHeader);
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      console.log('🛡️ Token length:', token.length);
      console.log('🛡️ Token parts:', token.split('.').length);
    }
    console.log('🛡️ JwtAuthGuard handleRequest - Error:', err);
    console.log('🛡️ JwtAuthGuard handleRequest - User:', user ? 'FOUND' : 'NOT FOUND');
    console.log('🛡️ JwtAuthGuard handleRequest - Info:', info);
    return super.handleRequest(err, user, info, context);
  }
}
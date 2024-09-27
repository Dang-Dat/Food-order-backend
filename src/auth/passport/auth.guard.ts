// import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';

// import { JwtAuthGuard, LocalAuthGuard } from './local-auth.guard'; 
// @Injectable()
// export class AuthGuardCustom implements CanActivate {
//     constructor(
//         private readonly jwtAuthGuard: JwtAuthGuard,
//         private readonly localAuthGuard: LocalAuthGuard,
//     ) {}

//     async canActivate(context: ExecutionContext): Promise<boolean> {
//         const request = context.switchToHttp().getRequest();
//         const authHeader = request.headers['authorization'];

//         if (authHeader && authHeader.startsWith('Bearer ')) {
//             // Nếu có token, sử dụng JwtAuthGuard
//             return this.jwtAuthGuard.canActivate(context);
//         } else {
//             // Nếu không có token, sử dụng LocalAuthGuard
//             return this.localAuthGuard.canActivate(context);
//         }
//     }
// }

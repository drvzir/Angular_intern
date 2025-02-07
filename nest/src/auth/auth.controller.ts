import { Body, Controller, Get, Post, UseGuards ,Request,UnauthorizedException} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { User } from './entities/user.entity'
import { AuthGuard } from '../guard/auth/auth.guard';
@Controller('auth')
export class AuthController {

    constructor(private readonly authService:AuthService

    ){}

    @Post('signup')
    async signup(@Body() signupDto : SignupDto){
        return this.authService.signup(signupDto)
    }
    @Post('login')
    async login(@Body() loginDto : LoginDto){
        return this.authService.login(loginDto)
    }
    @UseGuards(AuthGuard) // token
    @Get('dashboard')
    async dashboard() : Promise<User[]>{
        return this.authService.getTable();
    }
}


// import { Body, Controller, Get, Post, UnauthorizedException, UseGuards, Request } from '@nestjs/common';
// import { AuthService } from './auth.service';
// import { SignupDto } from './dto/signup.dto';
// import { LoginDto } from './dto/login.dto';
// // import { AuthGuard } from 'src/guards/auth/auth.guard';
// import { AuthGuard } from '../guard/auth/auth.guard';

// import { JwtService } from '@nestjs/jwt';

// @Controller('auth')
// export class AuthController {

//     constructor(private readonly authService:AuthService,
//         private jwtService: JwtService,
        
//     ){}

//     @Post('signup')
//     async signup(@Body() signupDto : SignupDto){
//         return this.authService.signup(signupDto)
//     }

//     @Post('login')
//     async login(@Body() loginDto : LoginDto){
//         return this.authService.login(loginDto)
//     }

//     @UseGuards(AuthGuard)
//     @Get('validate-token')
//     async validateToken(@Request() req) {
//         const user = req.user;
//         if (user) {
//           return { message: 'Token is valid'};
//         } else {
//           throw new UnauthorizedException('Invalid token');
//         }
//     }
// }

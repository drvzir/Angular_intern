import { ConflictException, Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { SignupDto } from './dto/signup.dto';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private jwtService : JwtService,
    ) {}
//sign up authorization ;

    async signup(signupDto: SignupDto): Promise<{ message: string }> {
        const { email, username, password, ...otherDetails } = signupDto;

        const emailExists = await this.userRepository.findOne({ where: { email } });
        if (emailExists) {
            throw new ConflictException({
                field: 'email',
                message: 'Email already exists',
            });
        }

        const usernameExists = await this.userRepository.findOne({ where: { username } });
        if (usernameExists) {
            throw new ConflictException({
                field: 'username',
                message: 'Username already exists',
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = this.userRepository.create({
            ...otherDetails,
            email,
            username,
            password: hashedPassword,
        });

        await this.userRepository.save(user);

        return { message: 'User Registered Successfully' };
    }


    //login authorization

    async login(LoginDto: LoginDto): Promise<{ message: string ,access_token: string }> {
        const { email,password} = LoginDto;

        const userExists = await this.userRepository.findOne({ where: { email } });
        if (!userExists) {
            throw new ConflictException({
                field: 'email',
                message: 'User does not exist',
            });
        }

        const valid = await bcrypt.compare(password, userExists.password);
        if (valid === false) {
            throw new ConflictException({
                field: 'password',
                message: 'Wrong Password',
            });
        }

        // const payload
        const payload = { sub: userExists.id, username: userExists.email };
        return {
            message: "Logged in Sucssfully",
            access_token: await this.jwtService.signAsync(payload),
        };
    }
    
        //yaha se mein likhra hu 
        async getTable(): Promise<User[]>{
            return await this.userRepository.find({
                select : ['id' ,'firstname' , 'lastname', 'username' , 'email' , 'mobile_number']
            });
        }

    
}

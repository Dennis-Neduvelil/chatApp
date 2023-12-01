import { Injectable } from '@nestjs/common';
import { SignInDto, SignUpDto } from '../dto';
import * as argon from 'argon2';
import { AuthRepositoty } from '../repository';
import { InvalidCredentiasException, UserNotFoundException } from '../exceptions';
import { Jwt } from '../utils/jwt/jwt.service';

interface IAuthService {
signIn(dto: SignInDto):Promise<unknown>
signUp(dto: SignUpDto):Promise<unknown>
}

@Injectable({})
export class AuthService implements IAuthService {
  constructor(private authRepository: AuthRepositoty, private jwt: Jwt) { }

  async signIn(dto: SignInDto) {
    let user = await this.authRepository.signIn(dto);
    if (!user) {
      throw new UserNotFoundException();
    }
    let passwordMatched = await argon.verify(user.password, dto.password);
    if (!passwordMatched) {
      throw new InvalidCredentiasException();
    }
    const token = this.jwt.signJwt(user.id,'30d')
    return {"userId":user.id,"token":token}
  }

  async signUp(dto: SignUpDto) {
    const passwordHash = await argon.hash(dto.password);
    dto.password = passwordHash;
    return await this.authRepository.signUp(dto);
  }
}

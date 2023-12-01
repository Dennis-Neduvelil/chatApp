import { Injectable } from '@nestjs/common';
import { SignInDto, SignUpDto } from '../dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthRepositoty {
  constructor(private db: PrismaService) { }
  async signIn(dto: SignInDto) {
    return await this.db.user.findFirst({
      select: {
        id: true,
        email: true,
        password: true,
      },
      where: {
        email: dto.email
      },
    });
  }
  async signUp(dto: SignUpDto) {
    return await this.db.user.create({
      select: {
        email: true,
        createdAt: true,
      },
      data: {
        ...dto,
      },
    });
  }
}

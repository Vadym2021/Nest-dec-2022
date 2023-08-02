import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import {
  UserCreateDto,
  UserLoginDto,
  UserLoginSocialDto,
} from './dto/user.dto';
import * as bcrypt from 'bcrypt';
import { AuthService } from '../auth/auth.service';
import { PublicUserInfoDto } from '../common/query/user.query.dto';
import { paginateRawAndEntities, Pagination } from 'nestjs-typeorm-paginate';
import { PublicUserData } from './interface/user.interface';
import { PaginatedDto } from '../common/pagination/response';
import { OAuth2Client } from 'google-auth-library';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '';
const GOOGLE_CLIENT_SECRET = '';

@Injectable()
export class UserService {
  // private users = [];
  private salt = 5;
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly authService: AuthService,
  ) {}

  async getAllUsers(
    query: PublicUserInfoDto,
  ): Promise<PaginatedDto<PublicUserData>> {
    query.sort = query.sort || 'id';
    query.order = query.order || 'ASC';
    const options = {
      page: query.page || 1,
      limit: query.limit || 2,
    };

    const queryBuilder = this.userRepository
      .createQueryBuilder('users')
      .innerJoin('users.animal', 'ani')
      .select('id, age, email, "userName"');

    if (query.search) {
      queryBuilder.where('"userName" IN(:...search)', {
        search: query.search.split(''),
      });
    }

    if (query.class) {
      queryBuilder.andWhere(`LOWER(any.class) LIKE '%${query.class.toLowerCase()}%'`)

    }

    queryBuilder.orderBy(`"${query.sort}"`, query.order as 'ASC' | 'DESC');

    const [pagination, rawResults] = await paginateRawAndEntities(
      queryBuilder,
      options,
    );

    return {
      page: pagination.meta.currentPage,
      pages: pagination.meta.totalPages,
      countItem: pagination.meta.totalItems,
      entities: rawResults as [PublicUserData],
    };
  }

  async createUser(data: UserCreateDto) {
    const findUser = await this.userRepository.findOne({
      where: { email: data.email },
    });
    if (findUser) {
      throw new HttpException(
        'User with this email alredy exist',
        HttpStatus.BAD_REQUEST,
      );
    }

    data.password = await this.getHash(data.password);
    const newUser = this.userRepository.create(data);
    // newUser.lastLogin = '12-07-2023';
    // await newUser.save();
    await this.userRepository.save(newUser);

    const token = await this.signIn(newUser);

    return { token };
  }

  async login(data: UserLoginDto) {
    const findUser = await this.userRepository.findOne({
      where: { email: data.email },
    });
    if (!findUser) {
      throw new HttpException(
        'Email or password is incorrect',
        HttpStatus.UNAUTHORIZED,
      );
    }
    if (await this.compareHash(data.password, findUser.password)) {
      const token = await this.signIn(findUser);
      return { token };
    }
    throw new HttpException(
      'Email or password is incorrect',
      HttpStatus.UNAUTHORIZED,
    );
  }

  async loginSocial(data: UserLoginSocialDto) {
    try {
      const oAuthClient = new OAuth2Client(
        GOOGLE_CLIENT_ID,
        GOOGLE_CLIENT_SECRET,
      );

      const result = await oAuthClient.verifyIdToken({
        idToken: data.accessToken,
      });

      const tokenPayload = result.getPayload();

      const token = await this.signIn({ id: tokenPayload.sub });
      return { token };

      // console.log(result);
      // return 'ok';
    } catch (e) {
      throw new HttpException(
        'Google authorization failed',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  async getOneUserAccount(userId: string) {
    // const user = this.users.find((item) => item.id === userId);
    return 'user';
  }

  async getHash(password: string) {
    return await bcrypt.hash(password, this.salt);
  }

  async signIn(user: User) {
    return await this.authService.signIn({
      id: user.id.toString(),
    });
  }

  async compareHash(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}

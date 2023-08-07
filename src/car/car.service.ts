import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Car } from './car.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CarCreateDto, CarLoginDto } from './dto/car.dto';

import { AuthService } from '../auth/auth.service';
import { User } from '../user/user.entity';

@Injectable()
export class CarService {
  constructor(
    @InjectRepository(Car)
    private readonly carRepository: Repository<Car>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createCar(data: CarCreateDto): Promise<Car> {
    const user = await this.userRepository.findOneBy({});
    return await this.carRepository.save(
      this.carRepository.create({ ...data, users: [user] }),
    );
  }
}

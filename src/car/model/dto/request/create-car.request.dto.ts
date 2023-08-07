import { ApiProperty, PickType } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { Match } from '../../../../common/decorators/password.match';
import { CarClassEnum } from '../../enum/car-class.enum';
import { CarBaseRequestDto } from './car-base.request.dto';

export class CreateCarRequestDto extends PickType(CarBaseRequestDto, [
  'producer',
  'age',
  'model',
  'class',
]) {

}

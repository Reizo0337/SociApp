import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Donativo } from './donativo.entity';
import { CreateDonativoDto } from './dto/create-donativo.dto';
import { UpdateDonativoDto } from './dto/update-donativo.dto';

@Injectable()
export class DonativosService {
  constructor(
    @InjectRepository(Donativo)
    private readonly donativoRepository: Repository<Donativo>,
  ) {}

  create(createDonativoDto: CreateDonativoDto) {
    const donativo = this.donativoRepository.create(createDonativoDto);
    return this.donativoRepository.save(donativo);
  }

  findAll() {
    return this.donativoRepository.find();
  }

  findOne(id: number) {
    return this.donativoRepository.findOneBy({ id });
  }

  update(id: number, updateDonativoDto: UpdateDonativoDto) {
    return this.donativoRepository.update(id, updateDonativoDto);
  }

  remove(id: number) {
    return this.donativoRepository.delete(id);
  }
}

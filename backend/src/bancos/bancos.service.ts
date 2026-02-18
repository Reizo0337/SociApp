import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Banco } from './banco.entity';
import { CreateBancoDto } from './dto/create-banco.dto';
import { UpdateBancoDto } from './dto/update-banco.dto';

@Injectable()
export class BancosService {
  constructor(
    @InjectRepository(Banco)
    private readonly bancoRepository: Repository<Banco>,
  ) {}

  create(createBancoDto: CreateBancoDto) {
    const banco = this.bancoRepository.create(createBancoDto);
    return this.bancoRepository.save(banco);
  }

  findAll() {
    return this.bancoRepository.find();
  }

  findOne(id: number) {
    return this.bancoRepository.findOneBy({ id });
  }

  update(id: number, updateBancoDto: UpdateBancoDto) {
    return this.bancoRepository.update(id, updateBancoDto);
  }

  remove(id: number) {
    return this.bancoRepository.delete(id);
  }
}

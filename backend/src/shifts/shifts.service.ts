import { Injectable } from '@nestjs/common';

@Injectable()
export class ShiftsService {
  create() {
    return 'This action adds a new shift';
  }

  findAll() {
    return `This action returns all shifts`;
  }

  findOne(id: number) {
    return `This action returns a #${id} shift`;
  }

  update(id: number) {
    return `This action updates a #${id} shift`;
  }

  remove(id: number) {
    return `This action removes a #${id} shift`;
  }
}

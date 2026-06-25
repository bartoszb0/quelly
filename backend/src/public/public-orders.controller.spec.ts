import { Test, TestingModule } from '@nestjs/testing';
import { PublicOrdersController } from './public-orders.controller';
import { PublicOrdersService } from './public-orders.service';

describe('PublicOrdersController', () => {
  let controller: PublicOrdersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PublicOrdersController],
      providers: [PublicOrdersService],
    }).compile();

    controller = module.get<PublicOrdersController>(PublicOrdersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { PublicShopsController } from './public-shops.controller';
import { PublicShopsService } from './public-shops.service';

describe('PublicShopsController', () => {
  let controller: PublicShopsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PublicShopsController],
      providers: [PublicShopsService],
    }).compile();

    controller = module.get<PublicShopsController>(PublicShopsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

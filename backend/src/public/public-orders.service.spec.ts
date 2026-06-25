import { Test, TestingModule } from '@nestjs/testing';
import { PublicOrdersService } from './public-orders.service';

describe('PublicOrdersService', () => {
  let service: PublicOrdersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PublicOrdersService],
    }).compile();

    service = module.get<PublicOrdersService>(PublicOrdersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

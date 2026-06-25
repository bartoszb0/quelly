import { Test, TestingModule } from '@nestjs/testing';
import { PublicShopsService } from './public-shops.service';

describe('PublicShopsService', () => {
  let service: PublicShopsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PublicShopsService],
    }).compile();

    service = module.get<PublicShopsService>(PublicShopsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

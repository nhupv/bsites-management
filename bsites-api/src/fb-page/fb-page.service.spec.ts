import { Test, TestingModule } from '@nestjs/testing';
import { FbPageService } from './fb-page.service';

describe('FbPageService', () => {
  let service: FbPageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FbPageService],
    }).compile();

    service = module.get<FbPageService>(FbPageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

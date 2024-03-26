import { Test, TestingModule } from '@nestjs/testing';
import { UrlSiteService } from './url-site.service';

describe('UrlSiteService', () => {
  let service: UrlSiteService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UrlSiteService],
    }).compile();

    service = module.get<UrlSiteService>(UrlSiteService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

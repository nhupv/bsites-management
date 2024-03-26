import { Test, TestingModule } from '@nestjs/testing';
import { UrlSiteController } from './url-site.controller';
import { UrlSiteService } from './url-site.service';

describe('UrlSiteController', () => {
  let controller: UrlSiteController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UrlSiteController],
      providers: [UrlSiteService],
    }).compile();

    controller = module.get<UrlSiteController>(UrlSiteController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

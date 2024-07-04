import { Test, TestingModule } from '@nestjs/testing';
import { FbPageController } from './fb-page.controller';
import { FbPageService } from './fb-page.service';

describe('FbPageController', () => {
  let controller: FbPageController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FbPageController],
      providers: [FbPageService],
    }).compile();

    controller = module.get<FbPageController>(FbPageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

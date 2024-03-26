import { Module, forwardRef } from '@nestjs/common';
import { DomainService } from './domain.service';
import { DomainController } from './domain.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { DomainSchema } from './entities/domain.entity';
import { CheckDomainExisted } from '../common/validator/CheckDomainExisted';
// import { TrackingDomainModule } from '../tracking-domain/tracking-domain.module';
// import { BacklinkModule } from '../backlink/backlink.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Domain', schema: DomainSchema }]),
    // TrackingDomainModule,
    // forwardRef(() => BacklinkModule),
  ],
  controllers: [DomainController],
  providers: [DomainService, CheckDomainExisted],
  exports: [DomainService],
})
export class DomainModule {}

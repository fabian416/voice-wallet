import { Module } from '@nestjs/common';
import { DidLinkedResourceController } from './did-linked-resource.controller';
import { DidLinkedResourceService } from './did-linked-resource.service';

@Module({
  controllers: [DidLinkedResourceController],
  providers: [DidLinkedResourceService],
  exports: [DidLinkedResourceService],
})
export class DidLinkedResourceModule {}
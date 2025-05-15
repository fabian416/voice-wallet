import { Body, Controller, Post, Get, Query } from '@nestjs/common';
import { DidLinkedResourceService } from './did-linked-resource.service';
import { CreateDidLinkedResourceDto } from './dto/create-did-linked-resource.dto';
import { GetDidLinkedResourceDto } from './dto/get-did-linked-resource.dto';

@Controller('did-linked-resource')
export class DidLinkedResourceController {
  constructor(private readonly resourceService: DidLinkedResourceService) {}

  @Post('create')
  async createResource(@Body() dto: CreateDidLinkedResourceDto) {
    return this.resourceService.createDidLinkedResource(dto);
  }

  @Get('get')
  async fetchResource(@Query() query: GetDidLinkedResourceDto) {
    return this.resourceService.fetchDidLinkedResource(query.did, query.resourceId);
  }
}
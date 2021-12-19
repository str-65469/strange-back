import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SuperLikeServices } from 'src/database/entity/superlike_services.entity';
import { SuperLikeServiceType } from 'src/app/common/enum/superlike_services';

Injectable();
export class SuperlikeService {
  constructor(
    @InjectRepository(SuperLikeServices)
    private readonly superlikeServicesRepo: Repository<SuperLikeServices>,
  ) {}

  findByType(type: SuperLikeServiceType) {
    return this.superlikeServicesRepo.findOneOrFail({
      where: { type },
    });
  }
}

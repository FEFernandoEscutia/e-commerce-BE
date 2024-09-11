import { Module } from '@nestjs/common';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';
import { FilesRepository } from './files.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from 'src/entities/products.entity';


@Module({
  imports: [TypeOrmModule.forFeature([Product])],
  providers: [FilesService, FilesRepository],
  controllers: [FilesController],
})
export class FilesModule {
}

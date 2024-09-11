import { Injectable } from '@nestjs/common';
import { FilesRepository } from './files.repository';
import { Product } from 'src/entities/products.entity';

@Injectable()
export class FilesService {
  
  constructor(private readonly filesRepository: FilesRepository) {}

  async uploadImage(productName:Partial<Product>, file: Express.Multer.File) {
    return this.filesRepository.uploadImage(productName, file);
    
  }

  uploadFileUsingId(id: string, file: Express.Multer.File) {
    return this.filesRepository.uploadFileUsingId(id, file);
  }
}

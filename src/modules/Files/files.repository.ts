import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UploadApiResponse, v2 } from 'cloudinary';
import { Product } from 'src/entities/products.entity';
import { Repository } from 'typeorm';

const toStream = require('buffer-to-stream');

@Injectable()
export class FilesRepository {
  
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async uploadImage(
    productName: Partial<Product>,
    file: Express.Multer.File,
  ){

    const validKeys = ['name'];
    const receivedKeys = Object.keys(productName);
   
    

    if (!validKeys.includes(receivedKeys[0])) {
      throw new BadRequestException(`Invalid key provided in productName. Expected "name"`);
    }
    
    const foundProduct= await this.productRepository.findOne({where:{name:productName.name}})
    
    if (!foundProduct) {
      throw new NotFoundException(`Product with name ${productName.name} not found`);
    }

    return new Promise((resolve, reject) => {
      const upload = v2.uploader.upload_stream(
        { resource_type: 'auto' },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            this.handleImageUpload(result, foundProduct)

            resolve(result);
          }
        },
      );
      toStream(file.buffer).pipe(upload);
    });
  }



 async uploadFileUsingId(id: string, file: Express.Multer.File) {
  const foundProduct= await this.productRepository.findOne({where:{id:id}})

  if (!foundProduct) {
    throw new NotFoundException(`Product with the id ${id} not found`);
  }

  return new Promise((resolve, reject) => {
    const upload = v2.uploader.upload_stream(
      { resource_type: 'auto' },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          this.handleImageUpload(result, foundProduct)

          resolve(result);
        }
      },
    );
    toStream(file.buffer).pipe(upload);
  });
  
  }

  async handleImageUpload(result: UploadApiResponse, foundProduct: Product) {
    foundProduct.imgUrl = result.url;
    await this.productRepository.save(foundProduct);
  }
  
}

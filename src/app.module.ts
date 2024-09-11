import { Module } from '@nestjs/common';
import { UsersModule } from './modules/Users/users.module';
import { ProductsModule } from './modules/Products/products.module';
import { AuthModule } from './modules/Auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import typeOrmConfig from './config/typeOrm';
import { categoryModule } from './modules/Categories/categories.mdule';
import { OrdersModule } from './modules/Orders/orders.module.module';
import { FilesModule } from './modules/Files/files.module';
import { cloudinaryConfig } from './config/cloudinary';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [typeOrmConfig],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (ConfigService) => ConfigService.get('typeorm'),
    }),
    categoryModule,
    UsersModule,
    ProductsModule,
    OrdersModule,
    FilesModule,
    AuthModule,
    JwtModule.register({
      global: true,
      signOptions: { expiresIn: '1h' },
      secret: process.env.JWT_SECRET,
    }),
  ],
  controllers: [],
  providers: [cloudinaryConfig],
})
export class AppModule {}

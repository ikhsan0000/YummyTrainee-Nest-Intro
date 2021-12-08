import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { CommonModule } from './common/common.module';
import { RoleModule } from './role/role.module';
import { PermissionModule } from './permision/permission.module';
import { ProductModule } from './product/product.module';
import { OrderModule } from './order/order.module';
import { APP_GUARD } from '@nestjs/core';
import { PermissionGuard } from './permision/permission.guard';

@Module({
  imports: 
  [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 2021,
      username: 'root',
      password: '',
      database: 'admin',
      autoLoadEntities: true,
      synchronize: true,
    }),
    UserModule,
    AuthModule,
    CommonModule,
    RoleModule,
    PermissionModule,
    ProductModule,
    OrderModule
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: PermissionGuard
    },
    AppService,
  ],
})
export class AppModule {}

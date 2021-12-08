import { Body, ClassSerializerInterceptor, Controller, Delete, Get, Param, Post, Put, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { ProductCreateDto } from './models/product.create.dto';
import { ProductUpdateDto } from './models/product.update.dto';
import { ProductService } from './product.service';

@UseGuards(AuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
@Controller('products')
export class ProductController {

    constructor(
        private productService: ProductService,
        )
    {}

    @Get()
    async all(@Query('page') page: 1)
    {
        return this.productService.paginate(page);
    }

    @Post()
    async create(@Body()body:ProductCreateDto)
    {
        return this.productService.create(body)
    }

    @Get(':id')
    async get(@Param('id') id: number)
    {
        return this.productService.findOne({id});
    }

    @Put(':id')
    async update(
        @Param('id') id: number,
        @Body() body: ProductUpdateDto
    )
    {
        await this.productService.update(id, body)
    }

    @Delete(':id')
    async delete(@Param('id') id:number)
    {
        return this.productService.delete(id);
    }

}

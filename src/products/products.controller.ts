import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { ProductsService } from './products.service';
import { generate } from 'rxjs';

@Controller('products')
export class ProductsController {
    constructor(private readonly productsService: ProductsService) { }

    @Post()
    async addProduct(
        @Body('title') prodTitle: string,
        @Body('description') prodDescription: string,
        @Body('price') prodPrice: number
    ) {
        const generatedId = await this.productsService.insertProduct(
            prodTitle, 
            prodDescription, 
            prodPrice 
            );

        return { id: generatedId };
    }

    @Get('')
    async getProducts() {
        return await this.productsService.retriveProducts();
    }

    @Get(':id')
    async getProduct(@Param('id') prodId : string) {
        return await this.productsService.retriveProduct(prodId);
    }

    @Patch(':id')
    async updateProduct(
        @Body('id') prodId: string,
        @Body('title') prodTitle: string,
        @Body('description') prodDescription: string,
        @Body('price') prodPrice: number
    ) {
        await this.productsService.updateProduct(prodId, prodTitle, prodDescription, prodPrice);
        return null;
    }

    @Delete(':id')
    async deleteProduct(@Param('id') prodId : string) {
        await this.productsService.deleteProduct(prodId);
        return null;
    }
}
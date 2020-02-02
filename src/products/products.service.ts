import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Product } from './product.model';

@Injectable()
export class ProductsService {
    private products: Product[] = [];

    constructor(@InjectModel('Product') private readonly productModel: Model<Product>) { }

    async insertProduct(title: string, description: string, price: number) {
        const prodId = Math.random().toString();
        const newProduct = new this.productModel({
            title,
            description: description,
            price
        });
        const result = await newProduct.save();
        return result.id;
    }

    async retriveProducts() {
        const products = await this.productModel.find().exec();
        return products.map((prod) => ({
            id: prod.id,
            title: prod.title,
            description: prod.description,
            price: prod.price
        }));
    }

    async retriveProduct(prodId: string) {
        const product = await this.findProduct(prodId);
        return {
            id: product.id,
            title: product.title,
            description: product.description,
            price: product.price
        };
    }

    async updateProduct(
        prodId: string, 
        title: string, 
        description: string, 
        price: number
        ) {
        const productInDb = await this.findProduct(prodId);
        if (title) {
            productInDb.title = title;
        }
        if (description) {
            productInDb.description = description;
        }
        if (price) {
            productInDb.price = price;
        }
        productInDb.save();
    }

    async deleteProduct(prodId: string) {
        const result = await this.productModel.deleteOne({_id: prodId}).exec();
        if(result.n === 0) {
            throw new NotFoundException('Could not find product.');
        }
    }

    private async findProduct(id: string) {
        let product;
        try {
            product = await this.productModel.findById(id);
        }
        catch(error) {
            throw new NotFoundException('Could not find product.');
        }
        
        if (!product) {
            throw new NotFoundException('Could not find product.');
        }

        return product;
    }
}
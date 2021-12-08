import { Expose } from "class-transformer";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { OrderItem } from "./order.item.entity";

@Entity('orders')
export class Order
{
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    first_name: string;
    
    @Column()
    last_name: string;
    
    @Column()
    email: string;

    @CreateDateColumn()
    created_at: string

    @OneToMany( () => OrderItem, orderItem => orderItem.order)
    order_items: OrderItem[]

    @Expose()
    get name(): string
    {
        return `${this.first_name} ${this.last_name}`;
    }

    @Expose()
    get totalPrice(): number
    {
        let total = 0;
        this.order_items.forEach(item => {
            let quantity = item.quantity;
            let orderPrice = quantity * item.price
            total = total + orderPrice;
        });
        return total;
    }

}
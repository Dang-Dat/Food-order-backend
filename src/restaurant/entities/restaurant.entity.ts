import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument, Types } from "mongoose";
// import { MenuItem, MenuItemSchema } from "./menuItem.entity";


export type RestaurantDocument = HydratedDocument<Restaurant>;

@Schema({ timestamps: true })
export class MenuItem {
    @Prop({ type: mongoose.Schema.Types.ObjectId, required: true, default: () => new Types.ObjectId() })
    _id: mongoose.Schema.Types.ObjectId;

    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    price: number;
}
export const MenuItemSchema = SchemaFactory.createForClass(MenuItem);

@Schema({ timestamps: true })
export class Restaurant {
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
    userId: mongoose.Schema.Types.ObjectId;
    
    @Prop({ required: true })
    restaurantName: string;

    @Prop({ required: true })
    city: string;

    @Prop({ required: true })
    country: string;

    @Prop({ required: true })
    deliveryPrice: number;

    @Prop({ required: true })
    estimatedDeliveryTime: number;

    @Prop({ required: true })
    cuisines: string[];

    @Prop({ type: [MenuItemSchema], default: [] }) // Schema của MenuItem
    menuItems: MenuItem[];

    @Prop()
    imageUrl: string

    @Prop({ type: Object })
    createdBy: {
        _id: mongoose.Schema.Types.ObjectId;
        email: string;
    };
    @Prop({ type: Object })

    updatedBy: {
        _id: mongoose.Schema.Types.ObjectId;
        email: string;
    };
    @Prop({ type: Object })
    deletedBy: {
        _id: mongoose.Schema.Types.ObjectId;
        email: string;
    };


    @Prop()
    createdAt: Date;

    @Prop()
    updatedAt: Date;

    @Prop()
    isDeleted: boolean;

    @Prop()
    deletedAt: Date;
}
export const RestaurantSchema = SchemaFactory.createForClass(Restaurant);
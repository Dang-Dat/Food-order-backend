import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, HydratedDocument, Types } from 'mongoose';

export type OrderDocument = HydratedDocument<Order>;


@Schema({ timestamps: true })
export class Order {
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true })
    restaurant: mongoose.Schema.Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    user: mongoose.Schema.Types.ObjectId;

    @Prop({
        type: {
            email: { type: String, required: true },
            name: { type: String, required: true },
            addressLine1: { type: String, required: true },
            city: { type: String, required: true },
        },
        required: true,
    })
    deliveryDetails: {
        email: string;
        name: string;
        addressLine1: string;
        city: string;
    };

    @Prop({
        type: [
            {
                menuItemId: { type: String, required: true },
                quantity: { type: Number, required: true },
                name: { type: String, required: true },
            },
        ],
        required: true,
    })
    cartItems: Array<{
        menuItemId: string;
        quantity: number;
        name: string;
    }>;

    @Prop({ type: Number, required: true })
    totalAmount: number;

    @Prop({
        type: String,
        enum: ['placed', 'paid', 'inProgress', 'outForDelivery', 'delivered'],
        required: true,
    })
    status: string;

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

export const OrderSchema = SchemaFactory.createForClass(Order);

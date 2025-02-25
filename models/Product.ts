import mongoose, {Schema, models, model} from "mongoose";

interface IVariant {
    type: string;
    price: Number;
    license: string;
}

export interface IProduct {
    name: string;
    description: string;
    imageUrl: string;
    variants: Array<IVariant>;
    _id?: mongoose.Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
}

const imageVariantSchema = new Schema<IVariant>({
    type: {
        type: String,
        required: true,
        enum: ["SQUARE", "WIDE", "PORTRAIT"]
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    license: {
        type: String,
        required: true,
        enum: ["commercial", "personal"]
    }
});

const productSchema = new Schema<IProduct>({
    name: {type: String, required: true},
    description: {type: String, required: true},
    imageUrl: {type: String, required: true},
    variants: [imageVariantSchema]
}, {timestamps: true});

const Product = models?.Product || model("Product", productSchema);

export default Product;
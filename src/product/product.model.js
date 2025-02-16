import { Schema, version } from "mongoose"
const productModelSchema = Schema({
    productName: {
        type: String,
        required: [true, 'Product name is requiered'],
        maxLength: [50, 'Product name cannot exceed 50 characteres']
    },
    productInformation: {
        type: String,
        required: [true, 'At least add a simple description'], 
        maxLength: [100, 'The information cannot exceed 100 characteres']
    },
    productPrice: {
        type: Number,
        required: [true, 'Al the products needs to show a price']
    },
    productStock: {
        type: Number,
        required: [true, 'You need to have at least one product']
    },
    productStatus: {
        type: String,
        required: true, 
        enum: ['NUEVO', 'USADO', 'CADUCADO', 'DEVOLUELTO', 'SEGUNDA_MANO']
    },
    status: {
        type: Boolean,
        default: true 
    }
},
{
    versionKey: false,
    timeStamps: true,
});
productModelSchema.methods.toJSON = function(){
    const {__id, ...product} = this.Object();
    product.pid = __id;
    return product;
}
export default model('product', productModelSchema);
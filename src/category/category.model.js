import { Schema, model, version } from "mongoose";
const categoryModelSchema = Schema({
    typeCategory: {
        type: String,
        required: [true, 'Type category is required'],
        maxLength: [30, 'Type category cannot exceed 30 characters']
    },
    categoryDescription: {
        type: String,
        maxLength:[150, 'Category description cannot exceed 150 characters']
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

categoryModelSchema.methods.toJSON = function(){
    const { __id, ...category } = this.toObject();
    // Cambio de __id a cid para su manejo
    category.cid = __id;
    return category;
}

export default model('Category', categoryModelSchema);
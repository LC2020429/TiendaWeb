import { Schema, model, version } from 'mongoose';
const userSchema = Schema ({
    name: {
        type: String,
        required: [true, 'Name is required'],
        maxLength: [30, 'Name cannot exceed 30 characters']
    },
    lastName: {
        type: String,
        required: [true, 'Last name is required'],
        maxLength: [30, 'Last name cannot exceed 30 characters']
    },
    userName:{
        type: String,
        required: [true, 'User name is required'],
    },
    email:{
        type: String, 
        requiered: [true, 'Email is required'],
        unique: true,
    }, 
    password:{
        type: String,
        required: [true, 'Password is required'],
    },
    phoneNumber:{
        type: String,
        required: [true, 'Phone number is required'],   
    },
    role:{
        type: String,
        required: true, 
        enum: ['user', 'admin'],
    },
    porfilePicture:{
        type: String,
    },
    status:{
        type: Boolean,
        default: true,
    },
},
{
    versionKey: false,
    timestamps: true,
}
);
userSchema.methods.toJSON = function(){
    const { __id, password, ...user } = this.toObject();
    user.uid = __id;
    return user;
}
export default model('User', userSchema);
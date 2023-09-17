import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import {roles} from '../enum/roles.enum.js'


const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true, // Ensure email is saved in lowercase
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  companyId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
  },
  role:{
    type:Number,
    enum:Object.values(roles),
    default:roles.EMPLOYEE
  }
}, {
  timestamps: true,
});

// Hash the password before saving it to the database
userSchema.pre('save', async function (next) {
  try {
    if (!this.isModified('password')) {
      return next();
    }

    const hashedPassword = await bcrypt.hash(this.password, 10);
    this.password = hashedPassword;
    return next();
  } catch (error) {
    return next(error);
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw error;
  }
};

const User = mongoose.model('User', userSchema);

export default User;

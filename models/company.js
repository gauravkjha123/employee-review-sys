import mongoose from 'mongoose';

const companySchema = mongoose.Schema({
  companyName: {
    type: String,
    required: true,
    unique: true,

  },
  discription: {
    type: String,
    required: true
  },
  users: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
}, { timestamps: true });

const Company = mongoose.model('Company', companySchema);

export default Company;

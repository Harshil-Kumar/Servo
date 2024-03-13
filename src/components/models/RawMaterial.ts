import mongoose from "mongoose";

const RawMaterialSchema = new mongoose.Schema({
  clientName: {
    type: String,
    required: true,
  },
  contactPerson: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  role:{
    type:String,
    required:true,
    default:"present",
  },
  selected:{
    type:Boolean,
    default:false,
  }
},
{ timestamps: true },

);

export default mongoose.models.RawMaterial || mongoose.model("RawMaterial",RawMaterialSchema)
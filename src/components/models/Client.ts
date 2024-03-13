import mongoose from "mongoose";

const ClientSchema = new mongoose.Schema({
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
    required: false,
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

export default mongoose.models.Client || mongoose.model("Client",ClientSchema)
import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import config from "../../config/config.js";

const productsCollection = "products";

const productSchema = new mongoose.Schema({
  title: {
    type: String, 
    required: true
  },
  description: {
    type: String, 
    required: true
  },
  code: {
    type: String, 
    required: true, 
    index:true
  },
  price: {
    type: Number, 
    required: true
  },
  status: {
    type: Boolean, 
    required: true
  },
  stock: {
    type: Number, 
    required: true
  },
  category: {
    type: String, 
    required: true
  },
  thumbnails: {
    type: Array, 
    default:[]
  },
  owner: {
    type: String,
    default: config.admin
  }
});

productSchema.pre("findOne", function(){
  this.populate("owner.userEmail");
});

productSchema.plugin(mongoosePaginate);


export const productModel = mongoose.model(productsCollection, productSchema);

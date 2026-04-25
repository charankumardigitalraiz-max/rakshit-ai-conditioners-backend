const mongoose = require("mongoose");

const variantSchema = new mongoose.Schema({
  capacity: String, // e.g. 1.0 Ton, 1.5 Ton
  sku: String, // e.g. FTKL35TV16
  coolingCapacityFull: String,
  coolingCapacityHalf: String,
  powerConsumptionFull: String,
  powerConsumptionHalf: String,
  annualPowerConsumption: String,
  iseer: Number,
  price: {
    type: Number,
    required: true
  }
});

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a product name'],
    trim: true
  },
  slug: {
    type: String,
    // unique: true,
    // required: true
  },
  category: {
    type: String,
    required: [true, 'Please select a category']
  },
  series: String, // e.g. FTKL / FTKM
  refrigerant: {
    type: String,
    default: 'R32'
  },
  stockStatus: {
    type: String,
    enum: ['Active', 'Inactive', 'Out of Stock'],
    default: 'Active'
  },
  shortDescription: String,
  variants: [variantSchema],
  technicalSpecs: {
    // Shared specs if any, or general info
    powerSupply: String,
    condenserCoil: {
      type: String,
      default: '100% Copper'
    },
    operatingTemp: String
  },
  features: [String],
  installation: {
    standardCharges: String,
    outdoorStand: String,
    timeline: String,
    includes: [String],
    excludes: [String],
    freeServices: String
  },
  warranty: {
    compressor: String, // e.g. "10 Years (1+9)"
    pcb: String, // e.g. "5 Years (1+4)"
    unitWide: String // e.g. "1 Year"
  },
  detailedFeatures: String,
  images: [String],
  image: String
}, {
  timestamps: true
});

// Indexes for performance optimization
productSchema.index({ name: 'text', series: 1, category: 1 });
productSchema.index({ stockStatus: 1 });

module.exports = mongoose.model("Product", productSchema);
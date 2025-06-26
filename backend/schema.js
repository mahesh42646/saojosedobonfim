const mongoose = require('mongoose');

// SuperAdmin Schema
const superAdminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
}, { collection: 'superadmins' });

// Admin Schema
const adminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
}, { collection: 'admins' });

// Agent Schema
const agentSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
}, { collection: 'agents' });

// Agent Profile Schema - for detailed agent information
const agentProfileSchema = new mongoose.Schema({
  // Link to agent login account
  agentId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Agent', 
    required: true 
  },
  
  // Common fields shared across all types
  cpf: { type: String, required: true, unique: true },
  dob: { type: Date },
  fullname: { type: String },
  rg: { type: String },
  socialname: { type: String },
  gender: { type: String, enum: ['Male', 'Female', 'Other'] },
  breed: { type: String },
  lgbtq: { type: String, enum: ['Yes', 'No'] },
  education: { type: String },
  income: { type: String },
  mainActivity: { type: String },
  otherActivity: { type: String },
  traditionalCommunities: { type: String },
  pcd: { type: String, enum: ['Yes', 'No'], default: 'No' },
  withoutPcd: { type: String },
  socialProgramBeneficiary: { type: String, enum: ['Yes', 'No'] },
  socialProgramName: { type: String },
  city: { type: String },
  district: { type: String },
  street: { type: String },
  telephone: { type: String },
  responsible: { type: String },
  email: { type: String, required: true },
  password: { type: String, required: true },
  
  // Type completion status and timestamps
  typeStatus: {
    personal: {
      isComplete: { type: Boolean, default: false },
      completedAt: { type: Date },
      createdAt: { type: Date, default: Date.now }
    },
    business: {
      isComplete: { type: Boolean, default: false },
      completedAt: { type: Date },
      createdAt: { type: Date, default: Date.now }
    },
    collective: {
      isComplete: { type: Boolean, default: false },
      completedAt: { type: Date },
      createdAt: { type: Date, default: Date.now }
    }
  },
  
  // Business-specific fields
  businessData: {
    cnpjType: { type: String },
    razaoSocial: { type: String },
    nomeFantasia: { type: String },
    cnpj: { type: String }
  },
  
  // Collective-specific fields
  collectiveData: {
    collectiveName: { type: String },
    dayCreated: { type: String },
    monthCreated: { type: String },
    yearCreated: { type: String },
    participants: { type: String }
  },
  
  // Terms acceptance
  acceptedTerms: { type: Boolean, default: false },
  
  // Timestamps
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { 
  collection: 'agentprofiles',
  timestamps: true 
});

// Tenant Schema
const tenantSchema = new mongoose.Schema({
  tenantName: { 
    type: String, 
    required: true, 
    trim: true 
  },
  subdomain: { 
    type: String, 
    required: true, 
    unique: true, 
    lowercase: true,
    trim: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true,
    trim: true 
  },
  password: { 
    type: String, 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['active', 'inactive'], 
    default: 'active' 
  },
  subscriptionStart: { 
    type: Date, 
    default: Date.now 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
}, { 
  collection: 'tenants',
  timestamps: true 
});

// Models
const SuperAdmin = mongoose.model('SuperAdmin', superAdminSchema);
const Admin = mongoose.model('Admin', adminSchema);
const Agent = mongoose.model('Agent', agentSchema);
const AgentProfile = mongoose.model('AgentProfile', agentProfileSchema);
const Tenant = mongoose.model('Tenant', tenantSchema);

module.exports = { SuperAdmin, Admin, Agent, AgentProfile, Tenant };

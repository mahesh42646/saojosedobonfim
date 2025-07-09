const mongoose = require('mongoose');

// SuperAdmin Schema
const superAdminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
}, { collection: 'superadmins' });

// Admin Schema
const adminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  title: { type: String },
  description: { type: String },
  profilePhoto: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { 
  collection: 'admins',
  timestamps: true 
});

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
  
  // Status field for activation/deactivation
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  
  // Common fields shared across all types
  cpf: { type: String, required: true, unique: true },
  dob: { type: Date },
  fullname: { type: String },
  rg: { type: String },
  socialname: { type: String },
  gender: { type: String },
  breed: { type: String },
  lgbtq: { type: String },
  education: { type: String },
  income: { type: String },
  mainActivity: { type: String },
  otherActivity: { type: String },
  traditionalCommunities: { type: String },
  pcd: { type: String, required: false },
  withoutPcd: { type: String },
  socialProgramBeneficiary: { type: String },
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
  
  // Profile photos for each type
  profilePhotos: {
    personal: { type: String },
    business: { type: String },
    collective: { type: String }
  },

  // Public profile data for each type
  publicProfile: {
    personal: {
      aboutText: { type: String },
      socialLinks: {
        instagram: { type: String },
        youtube: { type: String },
        facebook: { type: String }
      },
      galleryPhotos: [{ type: String }]
    },
    business: {
      aboutText: { type: String },
      socialLinks: {
        instagram: { type: String },
        youtube: { type: String },
        facebook: { type: String }
      },
      galleryPhotos: [{ type: String }]
    },
    collective: {
      aboutText: { type: String },
      socialLinks: {
        instagram: { type: String },
        youtube: { type: String },
        facebook: { type: String }
      },
      galleryPhotos: [{ type: String }]
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

// Staff Schema
const staffSchema = new mongoose.Schema({
  employeeType: { 
    type: String, 
    required: true,
    enum: ['Evaluator', 'Manager', 'Other']
  },
  cpf: { 
    type: String, 
    required: true, 
    unique: true 
  },
  fullName: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  password: { 
    type: String, 
    required: true 
  },
  // Profile fields (same as admin)
  title: { 
    type: String 
  },
  description: { 
    type: String 
  },
  profilePhoto: { 
    type: String 
  },
  status: {
    type: String,
    enum: ['pending', 'active', 'inactive', 'deleted', 'rejected'],
    default: 'pending'
  },
  addedAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { 
  collection: 'staff',
  timestamps: true 
});

// Space Schema
const spaceSchema = new mongoose.Schema({
  // Link to agent who created the space
  agentId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Agent', 
    required: true 
  },
  
  // Email of the user who created the space
  createdBy: { 
    type: String, 
    required: true 
  },
  
  // Basic Information
  type: { 
    type: String, 
    required: true,
    enum: ['MOSTRA', 'FESTIVAL', 'ATELIÊ', 'BIBLIOTECA', 'TEATRO', 'CINEMA', 'MUSEU', 'CENTRO_CULTURAL']
  },
  title: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  capacity: { 
    type: String, 
    required: true 
  },
  operatingHours: { 
    type: String, 
    required: true 
  },
  operatingDays: { 
    type: String, 
    required: true 
  },

  // Media
  coverPhoto: { 
    type: String, 
    required: true 
  },
  photos: [{ 
    type: String 
  }],

  // Social Links
  socialLinks: {
    instagram: { type: String },
    youtube: { type: String },
    facebook: { type: String }
  },

  // Physical Accessibility
  accessibility: {
    adaptedToilets: { type: Boolean, default: false },
    accessRamp: { type: Boolean, default: false },
    elevator: { type: Boolean, default: false },
    tactileSignaling: { type: Boolean, default: false },
    adaptedDrinkingFountain: { type: Boolean, default: false },
    handrail: { type: Boolean, default: false },
    adaptedElevator: { type: Boolean, default: false }
  },

  // Location
  location: {
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    cep: { type: String, required: true },
    mapLink: { type: String }
  },

  // Status
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'inactive'],
    default: 'pending'
  },

  // Status History
  statusHistory: [{
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'inactive'],
      required: true
    },
    changedAt: {
      type: Date,
      required: true
    }
  }],

  // Timestamps
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { 
  collection: 'spaces',
  timestamps: true 
});

// Project Schema
const projectSchema = new mongoose.Schema({
  // Link to agent who created the project
  agentId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Agent', 
    required: true 
  },
  
  // Agent Information (stored directly for easy access)
  agentInfo: {
    fullname: { type: String },
    socialname: { type: String },
    email: { type: String },
    telephone: { type: String },
    mainActivity: { type: String },
    city: { type: String }
  },
  
  // Basic Information
  type: { 
    type: String, 
    required: true,
    enum: ['MOSTRA', 'FESTIVAL']
  },
  title: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  period: {
    start: { type: Date, required: true },
    end: { type: Date }
  },

  // Media
  coverPhoto: { 
    type: String, 
    required: true 
  },
  photos: [{ 
    type: String 
  }],

  // Social Links
  socialLinks: {
    instagram: { type: String },
    youtube: { type: String },
    facebook: { type: String }
  },

  // Status
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'inactive'],
    default: 'pending'
  },

  // Status History
  statusHistory: [{
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'inactive']
    },
    changedAt: {
      type: Date,
      default: Date.now
    }
  }],

  // Timestamps
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { 
  collection: 'projects',
  timestamps: true 
});

// Models
const SuperAdmin = mongoose.model('SuperAdmin', superAdminSchema);
const Admin = mongoose.model('Admin', adminSchema);
const Agent = mongoose.model('Agent', agentSchema);
const AgentProfile = mongoose.model('AgentProfile', agentProfileSchema);
const Tenant = mongoose.model('Tenant', tenantSchema);
const Space = mongoose.model('Space', spaceSchema);
const Project = mongoose.model('Project', projectSchema);
const Staff = mongoose.model('Staff', staffSchema);

module.exports = {
    SuperAdmin: mongoose.model('SuperAdmin', superAdminSchema),
    Admin: mongoose.model('Admin', adminSchema),
    Agent: mongoose.model('Agent', agentSchema),
    AgentProfile: mongoose.model('AgentProfile', agentProfileSchema),
    Tenant: mongoose.model('Tenant', tenantSchema),
    Space: mongoose.model('Space', spaceSchema),
    Project: mongoose.model('Project', projectSchema),
    Staff: mongoose.model('Staff', staffSchema)
};

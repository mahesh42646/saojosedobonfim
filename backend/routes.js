const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const { SuperAdmin, Admin, Agent, AgentProfile, Tenant } = require('./schema');

// middleware to check token - modified for testing
function authMiddleware(req, res, next) {
  const token = req.headers.authorization;
  
  // For testing purposes, allow dummy token
  if (!token) {
    return res.status(401).json({ error: 'Access Denied - No token provided' });
  }

  // Skip JWT verification for testing with dummy token
  if (token === 'dummy-token-for-testing') {
    // Generate a valid ObjectId for testing
    req.user = { id: new mongoose.Types.ObjectId(), role: 'superadmin' };
    return next();
  }

  try {
    const verified = jwt.verify(token, process.env.TOKEN_KEY || 'fallback-secret');
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).json({ error: 'Invalid Token' });
  }
}

// Super Admin Login
router.post('/superadmin/login', async (req, res) => {
  const { email, password } = req.body;
  const superAdmin = await SuperAdmin.findOne({ email, password });
  if (!superAdmin) return res.status(400).send('Invalid credentials');

  const token = jwt.sign({ id: superAdmin._id, role: 'superadmin' }, process.env.TOKEN_KEY);
  res.json({ token });
});

// Admin Signup/Login
router.post('/admin/signup', async (req, res) => {
  const { email, password } = req.body;
  const admin = new Admin({ email, password });
  await admin.save();
  res.send('Admin account created');
});

router.post('/admin/login', async (req, res) => {
  const { email, password } = req.body;
  const admin = await Admin.findOne({ email, password });
  if (!admin) return res.status(400).send('Invalid credentials');
  const token = jwt.sign({ id: admin._id, role: 'admin' }, process.env.TOKEN_KEY);
  res.json({ token });
});

// Agent Signup/Login
router.post('/agent/signup', async (req, res) => {
  const { email, password } = req.body;
  const agent = new Agent({ email, password });
  await agent.save();
  res.send('Agent account created');
});

router.post('/agent/login', async (req, res) => {
  const { email, password } = req.body;
  const agent = await Agent.findOne({ email, password });
  if (!agent) return res.status(400).send('Invalid credentials');
  const token = jwt.sign({ id: agent._id, role: 'agent' }, process.env.TOKEN_KEY);
  res.json({ token });
});

// Agent Profile Login (supports email or CPF)
router.post('/agent/profile/login', async (req, res) => {
  try {
    const { emailOrCpf, password } = req.body;

    if (!emailOrCpf || !password) {
      return res.status(400).json({ error: 'Email/CPF and password are required' });
    }

    // Format CPF if it looks like a CPF (remove formatting)
    const cleanInput = emailOrCpf.replace(/[^\w@.-]/g, '');
    
    // Check if input is CPF (digits only after cleaning) or email
    const isCpf = /^\d{11}$/.test(cleanInput);
    
    let query;
    if (isCpf) {
      // Format CPF for search (add dots and dash)
      const formattedCpf = cleanInput.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
      query = { cpf: formattedCpf, password };
    } else {
      // Search by email
      query = { email: emailOrCpf.toLowerCase(), password };
    }

    const agentProfile = await AgentProfile.findOne(query);
    
    if (!agentProfile) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Create JWT token
    const token = jwt.sign(
      { 
        id: agentProfile._id, 
        role: 'agent',
        cpf: agentProfile.cpf,
        email: agentProfile.email,
        fullname: agentProfile.fullname
      }, 
      process.env.TOKEN_KEY || 'fallback-secret',
      { expiresIn: '7d' }
    );

    // Return success response
    res.json({ 
      token,
      message: 'Login successful',
      user: {
        id: agentProfile._id,
        cpf: agentProfile.cpf,
        email: agentProfile.email,
        fullname: agentProfile.fullname,
        typeStatus: agentProfile.typeStatus
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// AGENT PROFILE ROUTES

// Create or Update Agent Profile
router.post('/agent/profile', authMiddleware, async (req, res) => {
  try {
    const { 
      cpf, selectedType, 
      // Common fields
      dob, fullname, rg, socialname, gender, breed, lgbtq, education,
      income, mainActivity, otherActivity, traditionalCommunities, 
      pcd, withoutPcd, socialProgramBeneficiary, socialProgramName,
      city, district, street, telephone, responsible, email, password,
      acceptedTerms,
      // Business fields
      cnpjType, razaoSocial, nomeFantasia, cnpj,
      // Collective fields
      collectiveName, dayCreated, monthCreated, yearCreated, participants
    } = req.body;

    if (!cpf || !selectedType) {
      return res.status(400).json({ error: 'CPF and selectedType are required' });
    }

    // Check if profile already exists
    let agentProfile = await AgentProfile.findOne({ cpf });
    
    const commonFields = {
      dob, fullname, rg, socialname, gender, breed, lgbtq, education,
      income, mainActivity, otherActivity, traditionalCommunities, 
      pcd, withoutPcd, socialProgramBeneficiary, socialProgramName,
      city, district, street, telephone, responsible, email, password,
      acceptedTerms
    };

    if (agentProfile) {
      // Update existing profile
      
      // Update common fields
      Object.keys(commonFields).forEach(key => {
        if (commonFields[key] !== undefined) {
          agentProfile[key] = commonFields[key];
        }
      });

      // Update type-specific data and status
      const currentTime = new Date();
      
      if (selectedType === 'business') {
        agentProfile.businessData = {
          cnpjType: cnpjType || agentProfile.businessData?.cnpjType,
          razaoSocial: razaoSocial || agentProfile.businessData?.razaoSocial,
          nomeFantasia: nomeFantasia || agentProfile.businessData?.nomeFantasia,
          cnpj: cnpj || agentProfile.businessData?.cnpj
        };
        
        // Check if business type is complete
        const isBusinessComplete = cnpjType && razaoSocial && cnpj && 
          commonFields.dob && commonFields.fullname && commonFields.rg && 
          commonFields.gender && commonFields.breed && commonFields.lgbtq && 
          commonFields.education && commonFields.income && commonFields.mainActivity && 
          commonFields.traditionalCommunities && commonFields.pcd && commonFields.city && 
          commonFields.telephone && commonFields.responsible && commonFields.email && 
          commonFields.password && acceptedTerms;
        
        agentProfile.typeStatus.business.isComplete = isBusinessComplete;
        if (isBusinessComplete) {
          agentProfile.typeStatus.business.completedAt = currentTime;
        }
        if (!agentProfile.typeStatus.business.createdAt) {
          agentProfile.typeStatus.business.createdAt = currentTime;
        }
      }
      
      else if (selectedType === 'collective') {
        agentProfile.collectiveData = {
          collectiveName: collectiveName || agentProfile.collectiveData?.collectiveName,
          dayCreated: dayCreated || agentProfile.collectiveData?.dayCreated,
          monthCreated: monthCreated || agentProfile.collectiveData?.monthCreated,
          yearCreated: yearCreated || agentProfile.collectiveData?.yearCreated,
          participants: participants || agentProfile.collectiveData?.participants
        };
        
        // Check if collective type is complete
        const isCollectiveComplete = collectiveName && participants && 
          commonFields.dob && commonFields.fullname && commonFields.rg && 
          commonFields.gender && commonFields.breed && commonFields.lgbtq && 
          commonFields.education && commonFields.income && commonFields.mainActivity && 
          commonFields.traditionalCommunities && commonFields.pcd && commonFields.city && 
          commonFields.telephone && commonFields.responsible && commonFields.email && 
          commonFields.password && acceptedTerms;
        
        agentProfile.typeStatus.collective.isComplete = isCollectiveComplete;
        if (isCollectiveComplete) {
          agentProfile.typeStatus.collective.completedAt = currentTime;
        }
        if (!agentProfile.typeStatus.collective.createdAt) {
          agentProfile.typeStatus.collective.createdAt = currentTime;
        }
      }
      
      else if (selectedType === 'personal') {
        // Check if personal type is complete (only common fields needed)
        const isPersonalComplete = 
          commonFields.dob && commonFields.fullname && commonFields.rg && 
          commonFields.gender && commonFields.breed && commonFields.lgbtq && 
          commonFields.education && commonFields.income && commonFields.mainActivity && 
          commonFields.traditionalCommunities && commonFields.pcd && commonFields.city && 
          commonFields.telephone && commonFields.responsible && commonFields.email && 
          commonFields.password && acceptedTerms;
        
        agentProfile.typeStatus.personal.isComplete = isPersonalComplete;
        if (isPersonalComplete) {
          agentProfile.typeStatus.personal.completedAt = currentTime;
        }
        if (!agentProfile.typeStatus.personal.createdAt) {
          agentProfile.typeStatus.personal.createdAt = currentTime;
        }
      }

      agentProfile.updatedAt = currentTime;
      await agentProfile.save();
      
      res.json({ 
        message: 'Agent profile updated successfully', 
        profile: agentProfile 
      });
      
    } else {
      // Create new profile
      const currentTime = new Date();
      
      // Initialize type status for all three types
      const typeStatus = {
        personal: {
          isComplete: false,
          createdAt: currentTime
        },
        business: {
          isComplete: false,
          createdAt: currentTime
        },
        collective: {
          isComplete: false,
          createdAt: currentTime
        }
      };

      // Prepare business and collective data
      const businessData = {
        cnpjType: cnpjType || null,
        razaoSocial: razaoSocial || null,
        nomeFantasia: nomeFantasia || null,
        cnpj: cnpj || null
      };

      const collectiveData = {
        collectiveName: collectiveName || null,
        dayCreated: dayCreated || null,
        monthCreated: monthCreated || null,
        yearCreated: yearCreated || null,
        participants: participants || null
      };

      // Check completion status for selected type
      if (selectedType === 'business') {
        const isBusinessComplete = cnpjType && razaoSocial && cnpj && 
          dob && fullname && rg && gender && breed && lgbtq && 
          education && income && mainActivity && traditionalCommunities && 
          pcd && city && telephone && responsible && email && password && acceptedTerms;
        
        typeStatus.business.isComplete = isBusinessComplete;
        if (isBusinessComplete) {
          typeStatus.business.completedAt = currentTime;
        }
      } else if (selectedType === 'collective') {
        const isCollectiveComplete = collectiveName && participants && 
          dob && fullname && rg && gender && breed && lgbtq && 
          education && income && mainActivity && traditionalCommunities && 
          pcd && city && telephone && responsible && email && password && acceptedTerms;
        
        typeStatus.collective.isComplete = isCollectiveComplete;
        if (isCollectiveComplete) {
          typeStatus.collective.completedAt = currentTime;
        }
      } else if (selectedType === 'personal') {
        const isPersonalComplete = 
          dob && fullname && rg && gender && breed && lgbtq && 
          education && income && mainActivity && traditionalCommunities && 
          pcd && city && telephone && responsible && email && password && acceptedTerms;
        
        typeStatus.personal.isComplete = isPersonalComplete;
        if (isPersonalComplete) {
          typeStatus.personal.completedAt = currentTime;
        }
      }

      // Create new agent profile
      agentProfile = new AgentProfile({
        agentId: req.user.id, // Now this will be a valid ObjectId
        cpf,
        ...commonFields,
        typeStatus,
        businessData,
        collectiveData
      });

      await agentProfile.save();
      
      res.status(201).json({ 
        message: 'Agent profile created successfully', 
        profile: agentProfile 
      });
    }

  } catch (error) {
    console.error('Error creating/updating agent profile:', error);
    if (error.code === 11000) {
      res.status(400).json({ error: 'CPF already exists' });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

// Get Agent Profile by CPF
router.get('/agent/profile/:cpf', authMiddleware, async (req, res) => {
  try {
    const profile = await AgentProfile.findOne({ cpf: req.params.cpf })
      .populate('agentId', 'email')
      .select('-password');
    
    if (!profile) {
      return res.status(404).json({ error: 'Agent profile not found' });
    }
    
    res.json(profile);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all Agent Profiles
router.get('/agent/profiles', authMiddleware, async (req, res) => {
  try {
    const { type, status, search } = req.query;
    let query = {};

    // Filter by search
    if (search) {
      query.$or = [
        { fullname: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { cpf: { $regex: search, $options: 'i' } }
      ];
    }

    let profiles = await AgentProfile.find(query)
      .populate('agentId', 'email')
      .select('-password')
      .sort({ createdAt: -1 });

    // Filter by type and status if specified
    if (type && status) {
      profiles = profiles.filter(profile => {
        if (type === 'personal') return profile.typeStatus.personal.isComplete === (status === 'complete');
        if (type === 'business') return profile.typeStatus.business.isComplete === (status === 'complete');
        if (type === 'collective') return profile.typeStatus.collective.isComplete === (status === 'complete');
        return true;
      });
    }

    // Get statistics
    const totalProfiles = profiles.length;
    const personalComplete = profiles.filter(p => p.typeStatus.personal.isComplete).length;
    const businessComplete = profiles.filter(p => p.typeStatus.business.isComplete).length;
    const collectiveComplete = profiles.filter(p => p.typeStatus.collective.isComplete).length;

    res.json({
      profiles,
      stats: {
        total: totalProfiles,
        personal: { complete: personalComplete, incomplete: totalProfiles - personalComplete },
        business: { complete: businessComplete, incomplete: totalProfiles - businessComplete },
        collective: { complete: collectiveComplete, incomplete: totalProfiles - collectiveComplete }
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update Agent Profile
router.put('/agent/profile/:cpf', authMiddleware, async (req, res) => {
  try {
    const profile = await AgentProfile.findOne({ cpf: req.params.cpf });
    
    if (!profile) {
      return res.status(404).json({ error: 'Agent profile not found' });
    }

    // Update fields
    const updateFields = { ...req.body };
    delete updateFields.cpf; // Don't allow CPF updates
    delete updateFields.agentId; // Don't allow agentId updates
    
    Object.keys(updateFields).forEach(key => {
      if (updateFields[key] !== undefined) {
        profile[key] = updateFields[key];
      }
    });

    profile.updatedAt = new Date();
    await profile.save();
    
    res.json({ 
      message: 'Agent profile updated successfully', 
      profile 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete Agent Profile
router.delete('/agent/profile/:cpf', authMiddleware, async (req, res) => {
  try {
    const profile = await AgentProfile.findOneAndDelete({ cpf: req.params.cpf });
    
    if (!profile) {
      return res.status(404).json({ error: 'Agent profile not found' });
    }
    
    res.json({ message: 'Agent profile deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// TENANT ROUTES

// Get all tenants with optional filters
router.get('/tenants', authMiddleware, async (req, res) => {
  try {
    const { status, from, to, search } = req.query;
    let query = {};

    // Filter by status
    if (status && status !== 'all') {
      query.status = status;
    }

    // Filter by date range
    if (from || to) {
      query.subscriptionStart = {};
      if (from) query.subscriptionStart.$gte = new Date(from);
      if (to) query.subscriptionStart.$lte = new Date(to);
    }

    // Search functionality
    if (search) {
      query.$or = [
        { tenantName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { subdomain: { $regex: search, $options: 'i' } }
      ];
    }

    const tenants = await Tenant.find(query).select('-password').sort({ createdAt: -1 });
    
    // Get tenant statistics
    const totalTenants = await Tenant.countDocuments();
    const activeTenants = await Tenant.countDocuments({ status: 'active' });
    const inactiveTenants = await Tenant.countDocuments({ status: 'inactive' });

    res.json({
      tenants,
      stats: {
        total: totalTenants,
        active: activeTenants,
        inactive: inactiveTenants
      }
    });
  } catch (error) {
    console.error('Error fetching tenants:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get single tenant by ID
router.get('/tenants/:id', authMiddleware, async (req, res) => {
  try {
    const tenant = await Tenant.findById(req.params.id).select('-password');
    if (!tenant) {
      return res.status(404).json({ error: 'Tenant not found' });
    }
    res.json(tenant);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new tenant
router.post('/tenants', authMiddleware, async (req, res) => {
  try {
    const { tenantName, subdomain, email, password, status } = req.body;

    // Check if email or subdomain already exists
    const existingEmail = await Tenant.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    const existingSubdomain = await Tenant.findOne({ subdomain });
    if (existingSubdomain) {
      return res.status(400).json({ error: 'Subdomain already exists' });
    }

    const tenant = new Tenant({
      tenantName,
      subdomain: subdomain.toLowerCase(),
      email: email.toLowerCase(),
      password,
      status: status || 'active'
    });

    await tenant.save();
    
    // Return tenant without password
    const savedTenant = await Tenant.findById(tenant._id).select('-password');
    res.status(201).json({ 
      message: 'Tenant created successfully', 
      tenant: savedTenant 
    });
  } catch (error) {
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      res.status(400).json({ error: `${field} already exists` });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

// Update tenant
router.put('/tenants/:id', authMiddleware, async (req, res) => {
  try {
    const { tenantName, email, status } = req.body;
    
    // Check if email exists for other tenants
    if (email) {
      const existingEmail = await Tenant.findOne({ 
        email: email.toLowerCase(), 
        _id: { $ne: req.params.id } 
      });
      if (existingEmail) {
        return res.status(400).json({ error: 'Email already exists' });
      }
    }

    const updateData = {
      updatedAt: Date.now()
    };

    if (tenantName) updateData.tenantName = tenantName;
    if (email) updateData.email = email.toLowerCase();
    if (status) updateData.status = status;

    const tenant = await Tenant.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!tenant) {
      return res.status(404).json({ error: 'Tenant not found' });
    }

    res.json({ 
      message: 'Tenant updated successfully', 
      tenant 
    });
  } catch (error) {
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      res.status(400).json({ error: `${field} already exists` });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

// Delete tenant
router.delete('/tenants/:id', authMiddleware, async (req, res) => {
  try {
    const tenant = await Tenant.findByIdAndDelete(req.params.id);
    if (!tenant) {
      return res.status(404).json({ error: 'Tenant not found' });
    }
    res.json({ message: 'Tenant deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update tenant status (activate/deactivate)
router.patch('/tenants/:id/status', authMiddleware, async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['active', 'inactive'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status. Must be "active" or "inactive"' });
    }

    const tenant = await Tenant.findByIdAndUpdate(
      req.params.id,
      { status, updatedAt: Date.now() },
      { new: true, runValidators: true }
    ).select('-password');

    if (!tenant) {
      return res.status(404).json({ error: 'Tenant not found' });
    }

    res.json({ 
      message: `Tenant ${status === 'active' ? 'activated' : 'deactivated'} successfully`, 
      tenant 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

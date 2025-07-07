const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { SuperAdmin, Admin, Agent, AgentProfile, Tenant, Space, Project, Staff } = require('./schema');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = './uploads';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now();
    cb(null, uniqueSuffix + '_' + file.originalname);
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 256 * 1024 * 1024, // 256MB limit
    files: 20 // Maximum 20 files
  },
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
  }
});

// Error handling middleware for multer
const handleMulterError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({ 
        error: 'Unexpected file field.' 
      });
    }
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(413).json({ 
        error: 'File too large. Maximum file size is 256MB.' 
      });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({ 
        error: 'Too many files. Maximum 20 files allowed.' 
      });
    }
  }
  
  if (error.message === 'Only .png, .jpg and .jpeg format allowed!') {
    return res.status(400).json({ 
      error: 'Invalid file type. Only .png, .jpg and .jpeg files are allowed.' 
    });
  }
  
  next(error);
};

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
router.post('/admin/signup', [upload.single('profilePhoto'), handleMulterError], async (req, res) => {
  try {
    const { email, password, name, title, description } = req.body;
    
    // Check if admin with same email exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ error: 'Admin with this email already exists' });
    }

    // Create new admin with profile details
    const admin = new Admin({
      email,
      password,
      name,
      title,
      description,
      profilePhoto: req.file ? req.file.filename : undefined
    });

    await admin.save();
    
    // Return admin data without password
    const adminData = admin.toObject();
    delete adminData.password;
    
    res.status(201).json({
      message: 'Admin account created successfully',
      admin: adminData
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Failed to create admin account' });
  }
});

router.post('/admin/login', async (req, res) => {
  const { email, password } = req.body;
  const admin = await Admin.findOne({ email, password });
  if (!admin) return res.status(400).send('Invalid credentials');
  const token = jwt.sign({ id: admin._id, role: 'admin' }, process.env.TOKEN_KEY);
  res.json({ token, id: admin._id });
});

// Get current admin profile
router.get('/admin/profile', authMiddleware, async (req, res) => {
  try {
    const admin = await Admin.findById(req.user.id).select('-password');
    if (!admin) {
      return res.status(404).json({ error: 'Admin not found' });
    }
    res.json(admin);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// New route for updating admin profile
router.put('/admin/profile/:id', [authMiddleware, upload.single('profilePhoto'), handleMulterError], async (req, res) => {
  try {
    const { id } = req.params;
    const { name, title, description, currentPassword, newPassword } = req.body;

    // Find admin and verify ownership
    const admin = await Admin.findById(id);
    if (!admin) {
      return res.status(404).json({ error: 'Admin not found' });
    }

    // Verify current password if trying to change password
    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({ error: 'Current password is required to change password' });
      }
      if (currentPassword !== admin.password) {
        return res.status(400).json({ error: 'Current password is incorrect' });
      }
    }

    // Update fields
    const updates = {
      name: name || admin.name,
      title: title || admin.title,
      description: description || admin.description,
      password: newPassword || admin.password,
      updatedAt: new Date()
    };

    // Update profile photo if provided
    if (req.file) {
      // Delete old photo if exists
      if (admin.profilePhoto) {
        const oldPhotoPath = path.join('./uploads', admin.profilePhoto);
        if (fs.existsSync(oldPhotoPath)) {
          fs.unlinkSync(oldPhotoPath);
        }
      }
      updates.profilePhoto = req.file.filename;
    }

    // Update admin
    const updatedAdmin = await Admin.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    ).select('-password');

    res.json({
      message: 'Profile updated successfully',
      admin: updatedAdmin
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
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
          commonFields.traditionalCommunities && commonFields.city && 
          commonFields.telephone && commonFields.responsible && commonFields.email && 
          commonFields.password && acceptedTerms &&
          (commonFields.socialProgramBeneficiary !== 'Sim' || (commonFields.socialProgramBeneficiary === 'Sim' && commonFields.socialProgramName));
        
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
          commonFields.traditionalCommunities && commonFields.city && 
          commonFields.telephone && commonFields.responsible && commonFields.email && 
          commonFields.password && acceptedTerms &&
          (commonFields.socialProgramBeneficiary !== 'Sim' || (commonFields.socialProgramBeneficiary === 'Sim' && commonFields.socialProgramName));
        
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
          commonFields.traditionalCommunities && commonFields.city && 
          commonFields.telephone && commonFields.responsible && commonFields.email && 
          commonFields.password && acceptedTerms &&
          (commonFields.socialProgramBeneficiary !== 'Sim' || (commonFields.socialProgramBeneficiary === 'Sim' && commonFields.socialProgramName));
        
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
          city && telephone && responsible && email && password && acceptedTerms &&
          (socialProgramBeneficiary !== 'Sim' || (socialProgramBeneficiary === 'Sim' && socialProgramName));
        
        typeStatus.business.isComplete = isBusinessComplete;
        if (isBusinessComplete) {
          typeStatus.business.completedAt = currentTime;
        }
      } else if (selectedType === 'collective') {
        const isCollectiveComplete = collectiveName && participants && 
          dob && fullname && rg && gender && breed && lgbtq && 
          education && income && mainActivity && traditionalCommunities && 
          city && telephone && responsible && email && password && acceptedTerms &&
          (socialProgramBeneficiary !== 'Sim' || (socialProgramBeneficiary === 'Sim' && socialProgramName));
        
        typeStatus.collective.isComplete = isCollectiveComplete;
        if (isCollectiveComplete) {
          typeStatus.collective.completedAt = currentTime;
        }
      } else if (selectedType === 'personal') {
        const isPersonalComplete = 
          dob && fullname && rg && gender && breed && lgbtq && 
          education && income && mainActivity && traditionalCommunities && 
          city && telephone && responsible && email && password && acceptedTerms &&
          (socialProgramBeneficiary !== 'Sim' || (socialProgramBeneficiary === 'Sim' && socialProgramName));
        
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

    // Filter by activation status
    if (status && status !== 'all') {
      query.status = status;
    }

    let profiles = await AgentProfile.find(query)
      .populate('agentId', 'email')
      .select('-password')
      .sort({ createdAt: -1 });

    // Filter by type completion status if specified
    if (type && type !== 'all') {
      profiles = profiles.filter(profile => {
        if (type === 'personal') return profile.typeStatus.personal.isComplete;
        if (type === 'business') return profile.typeStatus.business.isComplete;
        if (type === 'collective') return profile.typeStatus.collective.isComplete;
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

// Update Agent Profile Photo only
router.put('/agent/profile/:cpf/photo', [authMiddleware, upload.single('profilePhoto'), handleMulterError], async (req, res) => {
  try {
    const profile = await AgentProfile.findOne({ cpf: req.params.cpf });
    
    if (!profile) {
      return res.status(404).json({ error: 'Agent profile not found' });
    }

    const { accountType } = req.body;
    
    if (!accountType || !['personal', 'business', 'collective'].includes(accountType)) {
      return res.status(400).json({ error: 'Valid accountType is required' });
    }

    // Initialize profilePhotos if they don't exist
    if (!profile.profilePhotos) {
      profile.profilePhotos = {};
    }

    // Handle profile photo upload
    if (req.file) {
      // Delete old profile photo if exists
      if (profile.profilePhotos[accountType]) {
        const oldPhotoPath = path.join('./uploads', profile.profilePhotos[accountType]);
        if (fs.existsSync(oldPhotoPath)) {
          fs.unlinkSync(oldPhotoPath);
        }
      }
      profile.profilePhotos[accountType] = req.file.filename;
    }

    profile.updatedAt = new Date();
    await profile.save();
    
    res.json({ 
      message: 'Profile photo updated successfully', 
      profile,
      photoUrl: req.file ? `/uploads/${req.file.filename}` : null
    });
  } catch (error) {
    console.error('Error updating profile photo:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update Agent Public Profile with file uploads
router.put('/agent/profile/:cpf/public', [authMiddleware, upload.fields([
  { name: 'profilePhoto', maxCount: 1 },
  { name: 'galleryPhotos', maxCount: 10 }
]), handleMulterError], async (req, res) => {
  try {
    const profile = await AgentProfile.findOne({ cpf: req.params.cpf });
    
    if (!profile) {
      return res.status(404).json({ error: 'Agent profile not found' });
    }

    const { accountType, aboutText, socialLinks } = req.body;
    
    if (!accountType || !['personal', 'business', 'collective'].includes(accountType)) {
      return res.status(400).json({ error: 'Valid accountType is required' });
    }

    // Initialize publicProfile and profilePhotos if they don't exist
    if (!profile.publicProfile) {
      profile.publicProfile = {
        personal: { socialLinks: {}, galleryPhotos: [] },
        business: { socialLinks: {}, galleryPhotos: [] },
        collective: { socialLinks: {}, galleryPhotos: [] }
      };
    }
    
    if (!profile.profilePhotos) {
      profile.profilePhotos = {};
    }

    // Handle profile photo upload
    if (req.files && req.files.profilePhoto && req.files.profilePhoto.length > 0) {
      // Delete old profile photo if exists
      if (profile.profilePhotos[accountType]) {
        const oldPhotoPath = path.join('./uploads', profile.profilePhotos[accountType]);
        if (fs.existsSync(oldPhotoPath)) {
          try {
            fs.unlinkSync(oldPhotoPath);
          } catch (err) {
            console.log('Could not delete old profile photo:', err.message);
          }
        }
      }
      profile.profilePhotos[accountType] = req.files.profilePhoto[0].filename;
    }

    // Handle gallery photos upload
    if (req.files && req.files.galleryPhotos && req.files.galleryPhotos.length > 0) {
      // Delete old gallery photos if exists
      if (profile.publicProfile[accountType].galleryPhotos && profile.publicProfile[accountType].galleryPhotos.length > 0) {
        profile.publicProfile[accountType].galleryPhotos.forEach(photo => {
          const oldPhotoPath = path.join('./uploads', photo);
          if (fs.existsSync(oldPhotoPath)) {
            try {
              fs.unlinkSync(oldPhotoPath);
            } catch (err) {
              console.log('Could not delete old gallery photo:', err.message);
            }
          }
        });
      }
      profile.publicProfile[accountType].galleryPhotos = req.files.galleryPhotos.map(file => file.filename);
    }

    // Update about text
    if (aboutText !== undefined) {
      profile.publicProfile[accountType].aboutText = aboutText;
    }

    // Update social links
    if (socialLinks) {
      try {
        const parsedSocialLinks = typeof socialLinks === 'string' ? JSON.parse(socialLinks) : socialLinks;
        profile.publicProfile[accountType].socialLinks = {
          ...profile.publicProfile[accountType].socialLinks,
          ...parsedSocialLinks
        };
      } catch (err) {
        console.error('Error parsing social links:', err);
        return res.status(400).json({ error: 'Invalid social links format' });
      }
    }

    profile.updatedAt = new Date();
    await profile.save();
    
    res.json({ 
      message: 'Public profile updated successfully', 
      profile 
    });
  } catch (error) {
    console.error('Error updating public profile:', error);
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

// Change Agent Profile Password
router.put('/agent/profile/:cpf/password', authMiddleware, async (req, res) => {
  try {
    const { cpf } = req.params;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current password and new password are required' });
    }

    // Find the agent profile
    const profile = await AgentProfile.findOne({ cpf });
    if (!profile) {
      return res.status(404).json({ error: 'Agent profile not found' });
    }

    // Verify current password
    if (profile.password !== currentPassword) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }

    // Update password
    profile.password = newPassword;
    profile.updatedAt = new Date();
    await profile.save();

    res.json({ 
      message: 'Password updated successfully' 
    });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update Agent Profile Status (activate/deactivate)
router.patch('/agent/profile/:cpf/status', authMiddleware, async (req, res) => {
  try {
    const { cpf } = req.params;
    const { status } = req.body;

    if (!['active', 'inactive'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status. Must be "active" or "inactive"' });
    }

    const profile = await AgentProfile.findOne({ cpf });
    if (!profile) {
      return res.status(404).json({ error: 'Agent profile not found' });
    }

    // Update status
    profile.status = status;
    profile.updatedAt = new Date();
    await profile.save();

    res.json({ 
      message: `Agent profile ${status === 'active' ? 'activated' : 'deactivated'} successfully`,
      profile: {
        cpf: profile.cpf,
        fullname: profile.fullname,
        email: profile.email,
        status: profile.status
      }
    });
  } catch (error) {
    console.error('Error updating agent status:', error);
    res.status(500).json({ error: error.message });
  }
});

// Forgot Password - Send reset email (placeholder for future implementation)
router.post('/agent/forgot-password', async (req, res) => {
  try {
    const { emailOrCpf } = req.body;

    if (!emailOrCpf) {
      return res.status(400).json({ error: 'Email or CPF is required' });
    }

    // Format CPF if it looks like a CPF
    const cleanInput = emailOrCpf.replace(/[^\w@.-]/g, '');
    const isCpf = /^\d{11}$/.test(cleanInput);
    
    let query;
    if (isCpf) {
      const formattedCpf = cleanInput.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
      query = { cpf: formattedCpf };
    } else {
      query = { email: emailOrCpf.toLowerCase() };
    }

    const profile = await AgentProfile.findOne(query);
    if (!profile) {
      return res.status(404).json({ error: 'No account found with this email or CPF' });
    }

    // For now, just return success (email functionality would be implemented here)
    res.json({ 
      message: 'If an account exists with this email/CPF, a password reset link will be sent' 
    });
  } catch (error) {
    console.error('Error in forgot password:', error);
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

// SPACE ROUTES

// Create new space
router.post('/space/addnew', [upload.fields([
  { name: 'coverPhoto', maxCount: 1 },
  { name: 'photos', maxCount: 10 }
]), handleMulterError], async (req, res) => {
  try {
    const {
      type,
      title,
      description,
      capacity,
      operatingHours,
      operatingDays,
      socialLinks,
      accessibility,
      location,
      createdBy
    } = req.body;

    // Handle file uploads
    let coverPhotoPath = '';
    let photosPaths = [];

    if (req.files) {
      if (req.files.coverPhoto) {
        coverPhotoPath = req.files.coverPhoto[0].filename;
      }
      if (req.files.photos) {
        photosPaths = req.files.photos.map(file => file.filename);
      }
    }

    // Parse JSON strings if they come as strings
    const parsedSocialLinks = typeof socialLinks === 'string' ? JSON.parse(socialLinks) : socialLinks;
    const parsedAccessibility = typeof accessibility === 'string' ? JSON.parse(accessibility) : accessibility;
    const parsedLocation = typeof location === 'string' ? JSON.parse(location) : location;

    const space = new Space({
      agentId: new mongoose.Types.ObjectId(),
      createdBy: createdBy,
      type,
      title,
      description,
      capacity,
      operatingHours,
      operatingDays,
      coverPhoto: coverPhotoPath,
      photos: photosPaths,
      socialLinks: parsedSocialLinks,
      accessibility: parsedAccessibility,
      location: parsedLocation,
      status: 'pending'
    });

    await space.save();
    
    res.status(201).json({ 
      message: 'Space created successfully', 
      space 
    });
  } catch (error) {
    console.error('Error creating space:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get all spaces (with optional filters)
router.get('/spaces', async (req, res) => {
  try {
    const { status, type, search, createdBy } = req.query;
    let query = {};

    // Add filters if provided
    if (status) {
      query.status = status;
    }
    if (type) {
      query.type = type;
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Filter by createdBy email
    if (createdBy) {
      query.createdBy = createdBy;
    }

    const spaces = await Space.find(query)
      .populate('agentId', 'email')
      .sort({ createdAt: -1 });

    res.json(spaces);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single space by ID
router.get('/space/:id', authMiddleware, async (req, res) => {
  try {
    const space = await Space.findById(req.params.id)
      .populate('agentId', 'email');
    
    if (!space) {
      return res.status(404).json({ error: 'Space not found' });
    }

    // Check if user has access to this space
    if (req.user.role === 'agent' && space.agentId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json(space);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update space
router.put('/space/:id', [authMiddleware, upload.fields([
  { name: 'coverPhoto', maxCount: 1 },
  { name: 'photos', maxCount: 10 }
]), handleMulterError], async (req, res) => {
  try {
    const space = await Space.findById(req.params.id);
    
    if (!space) {
      return res.status(404).json({ error: 'Space not found' });
    }

    // Check if user has access to update this space
    if (req.user.role === 'agent' && space.agentId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Handle file uploads
    if (req.files) {
      if (req.files.coverPhoto) {
        // Delete old cover photo if exists
        if (space.coverPhoto) {
          const oldPath = path.join('./uploads', space.coverPhoto);
          if (fs.existsSync(oldPath)) {
            fs.unlinkSync(oldPath);
          }
        }
        space.coverPhoto = req.files.coverPhoto[0].filename;
      }
      if (req.files.photos) {
        // Delete old photos if exists
        space.photos.forEach(photo => {
          const oldPath = path.join('./uploads', photo);
          if (fs.existsSync(oldPath)) {
            fs.unlinkSync(oldPath);
          }
        });
        space.photos = req.files.photos.map(file => file.filename);
      }
    }

    // Update other fields
    const updateFields = { ...req.body };
    delete updateFields.agentId; // Don't allow agentId updates

    // Parse JSON strings if they come as strings
    if (updateFields.socialLinks) {
      updateFields.socialLinks = typeof updateFields.socialLinks === 'string' 
        ? JSON.parse(updateFields.socialLinks) 
        : updateFields.socialLinks;
    }
    if (updateFields.accessibility) {
      updateFields.accessibility = typeof updateFields.accessibility === 'string'
        ? JSON.parse(updateFields.accessibility)
        : updateFields.accessibility;
    }
    if (updateFields.location) {
      updateFields.location = typeof updateFields.location === 'string'
        ? JSON.parse(updateFields.location)
        : updateFields.location;
    }

    Object.keys(updateFields).forEach(key => {
      if (updateFields[key] !== undefined) {
        space[key] = updateFields[key];
      }
    });

    space.updatedAt = new Date();
    await space.save();
    
    res.json({ 
      message: 'Space updated successfully', 
      space 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete space
router.delete('/space/:id', async (req, res) => {
  try {
    const { createdBy } = req.query;
    const space = await Space.findById(req.params.id);
    
    if (!space) {
      return res.status(404).json({ error: 'Space not found' });
    }

    // Check if user has access to delete this space
    if (createdBy && space.createdBy !== createdBy) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Delete associated files
    if (space.coverPhoto) {
      const coverPath = path.join('./uploads', space.coverPhoto);
      if (fs.existsSync(coverPath)) {
        fs.unlinkSync(coverPath);
      }
    }
    
    space.photos.forEach(photo => {
      const photoPath = path.join('./uploads', photo);
      if (fs.existsSync(photoPath)) {
        fs.unlinkSync(photoPath);
      }
    });

    await Space.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Space deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update space status (for admins)
router.patch('/space/:id/status', authMiddleware, async (req, res) => {
  try {
    // Only allow admins and superadmins to update status
    if (!['admin', 'superadmin'].includes(req.user.role)) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const { status } = req.body;
    
    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const space = await Space.findByIdAndUpdate(
      req.params.id,
      { status, updatedAt: Date.now() },
      { new: true }
    );

    if (!space) {
      return res.status(404).json({ error: 'Space not found' });
    }

    res.json({ 
      message: `Space ${status} successfully`, 
      space 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PROJECT ROUTES

// Create new project
router.post('/project', [
  authMiddleware, 
  upload.fields([
    { name: 'coverPhoto', maxCount: 1 },
    { name: 'photos', maxCount: 10 }
  ]),
  handleMulterError
], async (req, res) => {
  try {
    const {
      type,
      title,
      description,
      period,
      socialLinks
    } = req.body;

    // Handle file uploads
    let coverPhotoPath = '';
    let photosPaths = [];

    if (req.files) {
      if (req.files.coverPhoto) {
        coverPhotoPath = req.files.coverPhoto[0].filename;
      }
      if (req.files.photos) {
        photosPaths = req.files.photos.map(file => file.filename);
      }
    }

    // Parse JSON strings if they come as strings
    const parsedPeriod = typeof period === 'string' ? JSON.parse(period) : period;
    const parsedSocialLinks = typeof socialLinks === 'string' ? JSON.parse(socialLinks) : socialLinks;

    const project = new Project({
      agentId: req.user.id,
      type,
      title,
      description,
      period: parsedPeriod,
      coverPhoto: coverPhotoPath,
      photos: photosPaths,
      socialLinks: parsedSocialLinks,
      status: 'pending'
    });

    await project.save();
    
    res.status(201).json({ 
      message: 'Project created successfully', 
      project 
    });
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get all projects (with optional filters)
router.get('/projects', authMiddleware, async (req, res) => {
  try {
    const { status, type, search } = req.query;
    let query = {};

    // Add filters if provided
    if (status) {
      query.status = status;
    }
    if (type) {
      query.type = type;
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // If user is an agent, only show their projects
    if (req.user.role === 'agent') {
      query.agentId = req.user.id;
    }

    const projects = await Project.find(query)
      .populate('agentId', 'email')
      .sort({ createdAt: -1 });

    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single project by ID
router.get('/project/:id', authMiddleware, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('agentId', 'email');
    
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Check if user has access to this project
    if (req.user.role === 'agent' && project.agentId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete project
router.delete('/project/:id', authMiddleware, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Check if user has access to delete this project
    if (req.user.role === 'agent' && project.agentId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Delete associated files
    if (project.coverPhoto) {
      const coverPath = path.join('./uploads', project.coverPhoto);
      if (fs.existsSync(coverPath)) {
        fs.unlinkSync(coverPath);
      }
    }
    
    project.photos.forEach(photo => {
      const photoPath = path.join('./uploads', photo);
      if (fs.existsSync(photoPath)) {
        fs.unlinkSync(photoPath);
      }
    });

    await Project.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ADMIN PROJECT ROUTES (No auth required)
// Get all projects for admin
router.get('/admin/projects', async (req, res) => {
  try {
    const { status, type, search } = req.query;
    let query = {};

    // Add filters if provided
    if (status) {
      query.status = status;
    }
    if (type) {
      query.type = type;
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const projects = await Project.find(query)
      .populate('agentId', 'email')
      .sort({ createdAt: -1 });

    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single project by ID for admin
router.get('/admin/project/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('agentId', 'email');
    
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update project status (approve/reject) for admin
router.patch('/admin/project/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['pending', 'approved', 'rejected', 'inactive'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const currentTime = new Date();
    
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { 
        status,
        updatedAt: currentTime,
        $push: { 
          statusHistory: {
            status,
            changedAt: currentTime
          }
        }
      },
      { new: true }
    );

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json({ 
      message: `Project ${status} successfully`, 
      project 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete project for admin (no auth required)
router.delete('/admin/project/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Delete associated files
    if (project.coverPhoto) {
      const coverPath = path.join('./uploads', project.coverPhoto);
      if (fs.existsSync(coverPath)) {
        try {
          fs.unlinkSync(coverPath);
        } catch (err) {
          console.log('Could not delete cover photo:', err.message);
        }
      }
    }
    
    // Delete additional photos
    if (project.photos && project.photos.length > 0) {
      project.photos.forEach(photo => {
        const photoPath = path.join('./uploads', photo);
        if (fs.existsSync(photoPath)) {
          try {
            fs.unlinkSync(photoPath);
          } catch (err) {
            console.log('Could not delete photo:', err.message);
          }
        }
      });
    }

    // Delete the project from database
    await Project.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ error: 'Failed to delete project' });
  }
});

// ADMIN SPACE ROUTES (No auth required)
// Get all spaces for admin
router.get('/admin/spaces', async (req, res) => {
  try {
    const { status, type, search } = req.query;
    let query = {};

    // Add filters if provided
    if (status) {
      query.status = status;
    }
    if (type) {
      query.type = type;
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const spaces = await Space.find(query)
      .populate('agentId', 'email')
      .sort({ createdAt: -1 });

    res.json(spaces);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single space by ID for admin
router.get('/admin/space/:id', async (req, res) => {
  try {
    const space = await Space.findById(req.params.id)
      .populate('agentId', 'email');
    
    if (!space) {
      return res.status(404).json({ error: 'Space not found' });
    }
    
    res.json(space);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update space status for admin
router.patch('/admin/space/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['approved', 'rejected', 'inactive', 'pending'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status value' });
    }

    const space = await Space.findById(id);
    if (!space) {
      return res.status(404).json({ error: 'Space not found' });
    }

    // Add to status history
    space.statusHistory = space.statusHistory || [];
    space.statusHistory.push({
      status,
      changedAt: new Date()
    });

    // Update current status
    space.status = status;
    await space.save();

    res.json({ 
      message: `Space ${status === 'inactive' ? 'inactivated' : status === 'rejected' ? 'rejected' : 'approved'} successfully`,
      space 
    });
  } catch (error) {
    console.error('Error updating space status:', error);
    res.status(500).json({ error: 'Failed to update space status' });
  }
});

// Public endpoints (no auth required)
// Public space details endpoint
router.get('/public/space/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const space = await Space.findById(id);
    
    if (!space) {
      return res.status(404).json({ error: 'Space not found' });
    }

    // Remove sensitive information for public view
    const publicSpace = {
      ...space.toObject(),
      // Remove any sensitive fields here
      __v: undefined,
      updatedAt: undefined,
      createdAt: undefined,
    };

    res.json(publicSpace);
  } catch (error) {
    console.error('Error fetching space details:', error);
    res.status(500).json({ error: 'Failed to fetch space details' });
  }
});

// Public project details endpoint
router.get('/public/project/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findById(id);
    
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Remove sensitive information for public view
    const publicProject = {
      ...project.toObject(),
      __v: undefined,
      updatedAt: undefined,
      createdAt: undefined,
    };

    res.json(publicProject);
  } catch (error) {
    console.error('Error fetching project details:', error);
    res.status(500).json({ error: 'Failed to fetch project details' });
  }
});

// STAFF ROUTES

// Create new staff member
router.post('/staff', authMiddleware, async (req, res) => {
  try {
    const { employeeType, cpf, fullName, email, password } = req.body;

    // Validate required fields
    if (!employeeType || !cpf || !fullName || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Check if staff with same email or CPF exists
    const existingStaff = await Staff.findOne({ $or: [{ email }, { cpf }] });
    if (existingStaff) {
      return res.status(400).json({ error: 'Staff member with this email or CPF already exists' });
    }

    // Create new staff member
    const staff = new Staff({
      employeeType,
      cpf,
      fullName,
      email,
      password,
      // Status will default to 'pending'
    });

    await staff.save();
    res.status(201).json(staff);
  } catch (error) {
    console.error('Create staff error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all staff members
router.get('/staff', authMiddleware, async (req, res) => {
  try {
    const staff = await Staff.find().select('-password');
    res.json(staff);
  } catch (error) {
    console.error('Get staff error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update staff status
router.patch('/staff/:id/status', authMiddleware, async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    if (!['pending', 'active', 'inactive', 'deleted', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const staff = await Staff.findByIdAndUpdate(
      id,
      { status, updatedAt: Date.now() },
      { new: true }
    ).select('-password');

    if (!staff) {
      return res.status(404).json({ error: 'Staff member not found' });
    }

    res.json(staff);
  } catch (error) {
    console.error('Update staff status error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete staff member
router.delete('/staff/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const staff = await Staff.findByIdAndUpdate(
      id,
      { status: 'deleted', updatedAt: Date.now() },
      { new: true }
    ).select('-password');

    if (!staff) {
      return res.status(404).json({ error: 'Staff member not found' });
    }

    res.json(staff);
  } catch (error) {
    console.error('Delete staff error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;

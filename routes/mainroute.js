const express = require('express');
const router = express.Router();

// ─── Website Routes (Public) ──────────────────────────────────
const websiteProducts = require('./website/productRoutes');
const websiteProjects = require('./website/projectRoutes');
const websiteAchievements = require('./website/achievementRoutes');
const websiteEnquiries = require('./website/enquiryRoutes');

router.use('/products', websiteProducts);
router.use('/projects', websiteProjects);
router.use('/achievements', websiteAchievements);
router.use('/enquiries', websiteEnquiries);







// ─── Admin Routes (Management) ────────────────────────────────
const adminAuth = require('./admin/authRoutes');
const adminProducts = require('./admin/productRoutes');
const adminProjects = require('./admin/projectRoutes');
const adminAchievements = require('./admin/achievementRoutes');
const adminEnquiries = require('./admin/enquiryRoutes');
const adminContacts = require('./admin/contactRoutes');
const adminDashboard = require('./admin/dashboardCounts');
const adminClients = require('./admin/clientRoutes');
const adminTestimonials = require('./admin/testimonialRoutes');

router.use('/admin/auth', adminAuth);
router.use('/admin/products', adminProducts);
router.use('/admin/projects', adminProjects);
router.use('/admin/achievements', adminAchievements);
router.use('/admin/enquiries', adminEnquiries);
router.use('/admin/contacts', adminContacts);
router.use('/admin/dashboard', adminDashboard);
router.use('/admin/clients', adminClients);
router.use('/admin/testimonials', adminTestimonials);

module.exports = router;

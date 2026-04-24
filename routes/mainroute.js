const express = require('express');
const router = express.Router();

// ─── Website Routes (Public) ──────────────────────────────────
const websiteProducts = require('./website/productRoutes');
const websiteProjects = require('./website/projectRoutes');
const websiteAchievements = require('./website/achievementRoutes');
const websiteEnquiries = require('./website/enquiryRoutes');
const websiteClients = require('./website/clientRoutes');
const websiteTestimonials = require('./website/testimonialRoutes');
const websiteContacts = require('./website/contactRoutes');
router.use('/products', websiteProducts);
router.use('/projects', websiteProjects);
router.use('/achievements', websiteAchievements);
router.use('/enquiries', websiteEnquiries);
router.use('/contacts', websiteContacts);
router.use('/clients', websiteClients);
router.use('/testimonials', websiteTestimonials);





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
const adminCategories = require('./admin/categoryRoutes');

router.use('/admin/auth', adminAuth);
router.use('/admin/products', adminProducts);
router.use('/admin/projects', adminProjects);
router.use('/admin/achievements', adminAchievements);
router.use('/admin/enquiries', adminEnquiries);
router.use('/admin/contacts', adminContacts);
router.use('/admin/dashboard', adminDashboard);
router.use('/admin/clients', adminClients);
router.use('/admin/testimonials', adminTestimonials);
router.use('/admin/categories', adminCategories);

module.exports = router;

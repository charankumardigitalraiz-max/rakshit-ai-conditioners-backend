const Product = require('../../../models/products');
const achievements = require('../../../models/achievements');
const projects = require('../../../models/projects');
const Enquiry = require('../../../models/Enquiry');
const Contact = require('../../../models/Contact');
const asyncHandler = require('../../../middleware/asyncHandler');
const ErrorResponse = require('../../../utils/errorResponse');





exports.getCounts = asyncHandler(async (req, res, next) => {
    // Current counts
    const productsCount = await Product.countDocuments();
    const achievedCount = await achievements.countDocuments();
    const projectsCount = await projects.countDocuments();
    const enquiriesCount = await Enquiry.countDocuments();
    const contactsCount = await Contact.countDocuments();

    // Activities (Last 5 across main entities)
    const recentProducts = await Product.find().sort({ createdAt: -1 }).limit(3).lean();
    const recentProjects = await projects.find().sort({ createdAt: -1 }).limit(3).lean();
    const recentEnquiries = await Enquiry.find().sort({ createdAt: -1 }).limit(3).lean();
    const recentContacts = await Contact.find().sort({ createdAt: -1 }).limit(3).lean();

    const activities = [
        ...recentProducts.map(p => ({ _id: p._id, type: 'Product', title: p.name || p.title, subtitle: p.name, timestamp: p.createdAt })),
        ...recentProjects.map(p => ({ _id: p._id, type: 'Project', title: p.name || p.title, subtitle: p.title, timestamp: p.createdAt })),
        ...recentEnquiries.map(e => ({ _id: e._id, type: 'Enquiry', title: e.name || e.title, subtitle: `From ${e.name}`, timestamp: e.createdAt })),
        ...recentContacts.map(c => ({ _id: c._id, type: 'Contact', title: c.name || c.title, subtitle: `From ${c.name}`, timestamp: c.createdAt }))
    ]
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .slice(0, 6);

    // Statistics for trends (e.g., items added in the last 30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const trends = {
        products: await Product.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
        projects: await projects.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
        enquiries: await Enquiry.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
        achievements: await achievements.countDocuments({ createdAt: { $gte: thirtyDaysAgo } })
    };

    res.status(200).json({
        success: true,
        count: {
            productsCount,
            achievedCount,
            projectsCount,
            enquiriesCount,
            contactsCount,
            activities,
            trends
        }
    })
})
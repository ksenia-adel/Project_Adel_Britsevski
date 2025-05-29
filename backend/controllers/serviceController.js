const { ServiceCatalog } = require('../models');
const Admin = require('../models/admin'); 

// admin creates a new service
exports.createService = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { name, description, duration, price } = req.body;
    const userId = req.user.userid;

    // find the admin record by linked user ID
    const admin = await Admin.findOne({ where: { userid: userId } });

    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    // create the service with correct foreign key
    const service = await ServiceCatalog.create({
      name,
      description,
      duration,
      price,
      adminid: admin.adminid
    });

    res.status(201).json({ message: 'Service created', service });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create service', error: err.message });
  }
};

// get list of all services
exports.getAllServices = async (req, res) => {
  try {
    // fetch all services from the database
    const services = await ServiceCatalog.findAll();
    res.json(services);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch services' });
  }};

// admin updates a specific service by id
exports.updateService = async (req, res) => {
  try {
    const { id } = req.params;
    // update service fields by id
    const updated = await ServiceCatalog.update(req.body, {
      where: { servicecatalogid: id }
    });

    res.json({ message: 'Service updated', updated });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update service', error: err.message });
  }};

// admin deletes a service
exports.deleteService = async (req, res) => {
  try {
    const { id } = req.params;
    // remove service by id
    await ServiceCatalog.destroy({ where: { servicecatalogid: id } });

    res.json({ message: 'Service deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete service', error: err.message });
  }};

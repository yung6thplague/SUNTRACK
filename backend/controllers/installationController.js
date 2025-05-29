
const Installation = require('../models/Installation');
const User = require('../models/User'); 

exports.createInstallation = async (req, res) => {
  try {
    const { userId, installDate, address, panelCount, capacityKw } = req.body;

 
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'Usuário não encontrado.' });

    
    const newInstallation = new Installation({
      userId,
      clientName: user.name, 
      installDate,
      address,
      panelCount,
      capacityKw
    });

    await newInstallation.save();
    res.status(201).json(newInstallation);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao criar instalação.' });
  }
};

exports.listInstallations = async (req, res) => {
  try {
    const { name, id } = req.query;
    const filter = {};
    if (id) filter._id = id;

    let installs = await Installation.find(filter)
      .populate('userId', 'name') 
      .exec();

    if (name) {
      const lowerName = name.toLowerCase();
      installs = installs.filter(inst => inst.clientName.toLowerCase().includes(lowerName));
    }

    res.json(installs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro interno ao listar instalações.' });
  }
};

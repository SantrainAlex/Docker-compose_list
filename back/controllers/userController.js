const User = require('../models/User');

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll();
        res.json(users);
    } catch (error) {
        console.error('Erreur lors de la récupération des utilisateurs:', error);
        res.status(500).json({
            message: 'Erreur lors de la récupération des utilisateurs',
            error: error.message
        });
    }
};

exports.createUser = async (req, res) => {
    try {
        const { nom, prenom, age, email } = req.body;
        
        if (!nom || !prenom || !age || !email) {
            return res.status(400).json({
                message: 'Données invalides',
                error: 'Tous les champs sont requis (nom, prenom, age, email)'
            });
        }

        if (typeof age !== 'number' || age < 1 || age > 150) {
            return res.status(400).json({
                message: 'Données invalides',
                error: 'L\'âge doit être un nombre entre 1 et 150'
            });
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return res.status(400).json({
                message: 'Données invalides',
                error: 'Format d\'email invalide'
            });
        }

        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({
                message: 'Erreur de validation',
                error: 'Cet email est déjà utilisé'
            });
        }

        const user = await User.create(req.body);
        res.status(201).json(user);
    } catch (error) {
        console.error('Erreur détaillée:', error);
        
        if (error.name === 'SequelizeValidationError') {
            return res.status(400).json({
                message: 'Erreur de validation',
                errors: error.errors.map(err => ({
                    field: err.path,
                    message: err.message,
                    value: err.value
                }))
            });
        }
        
        if (error.errno === 1062) {
            return res.status(400).json({
                message: 'Erreur de validation',
                error: 'Cet email est déjà utilisé'
            });
        }

        res.status(400).json({
            message: 'Erreur lors de la création de l\'utilisateur',
            error: error.message
        });
    }
};

exports.createUsers = async (req, res) => {
    try {
        
        if (!Array.isArray(req.body)) {
            return res.status(400).json({
                message: 'Les données doivent être un tableau d\'utilisateurs'
            });
        }

        for (const userData of req.body) {
            if (!userData.nom || !userData.prenom || !userData.age || !userData.email) {
                return res.status(400).json({
                    message: 'Données invalides',
                    error: 'Tous les champs sont requis (nom, prenom, age, email)'
                });
            }

            if (typeof userData.age !== 'number' || userData.age < 1 || userData.age > 150) {
                return res.status(400).json({
                    message: 'Données invalides',
                    error: 'L\'âge doit être un nombre entre 1 et 150'
                });
            }

            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email)) {
                return res.status(400).json({
                    message: 'Données invalides',
                    error: 'Format d\'email invalide'
                });
            }

            const existingUser = await User.findOne({ where: { email: userData.email } });
            if (existingUser) {
                return res.status(400).json({
                    message: 'Erreur de validation',
                    error: `L'email ${userData.email} est déjà utilisé`
                });
            }
        }

        const users = await User.bulkCreate(req.body, {
            validate: true,
            individualHooks: true
        });

        res.status(201).json(users);
    } catch (error) {
        console.error('Erreur détaillée:', error);
        
        if (error.name === 'SequelizeValidationError') {
            return res.status(400).json({
                message: 'Erreur de validation',
                errors: error.errors.map(err => ({
                    field: err.path,
                    message: err.message,
                    value: err.value
                }))
            });
        }
        
        if (error.errno === 1062) {
            return res.status(400).json({
                message: 'Erreur de validation',
                error: 'Un ou plusieurs emails sont déjà utilisés'
            });
        }

        res.status(400).json({
            message: 'Erreur lors de la création des utilisateurs',
            error: error.message
        });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const deletedCount = await User.destroy({
            where: { id: userId }
        });

        if (deletedCount === 0) {
            return res.status(404).json({
                message: 'Utilisateur non trouvé'
            });
        }

        res.status(200).json({
            message: 'Utilisateur supprimé avec succès'
        });
    } catch (error) {
        console.error('Erreur lors de la suppression de l\'utilisateur:', error);
        res.status(500).json({
            message: 'Erreur lors de la suppression de l\'utilisateur',
            error: error.message
        });
    }
};

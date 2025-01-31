#!/bin/bash

MAX_TRIES=30
WAIT_TIME=2

# Fonction pour vérifier si MariaDB est prêt
check_db() {
    mysqladmin ping -h localhost -u user --password=password > /dev/null 2>&1
}

# Attendre que MariaDB soit prêt
echo "Attente que MariaDB soit prêt..."
COUNTER=0
while ! check_db; do
    if [ $COUNTER -gt $MAX_TRIES ]; then
        echo "Timeout en attendant MariaDB"
        exit 1
    fi
    echo "En attente de MariaDB... ($COUNTER/$MAX_TRIES)"
    sleep $WAIT_TIME
    let COUNTER=COUNTER+1
done

echo "MariaDB est prêt, chargement des données..."

# Charger les données de test
echo "Insertion des données de test..."
mysql -u user -ppassword user_management << EOF
INSERT INTO Users (nom, prenom, age, email) VALUES
('Dupont', 'Jean', 32, 'jean.dupont@email.com'),
('Martin', 'Sophie', 28, 'sophie.martin@email.com'),
('Bernard', 'Pierre', 45, 'pierre.bernard@email.com'),
('Dubois', 'Marie', 35, 'marie.dubois@email.com'),
('Petit', 'Lucas', 29, 'lucas.petit@email.com'),
('Moreau', 'Emma', 31, 'emma.moreau@email.com'),
('Robert', 'Thomas', 38, 'thomas.robert@email.com'),
('Richard', 'Julie', 27, 'julie.richard@email.com'),
('Simon', 'Nicolas', 42, 'nicolas.simon@email.com'),
('Michel', 'Laura', 33, 'laura.michel@email.com'),
('Leroy', 'Antoine', 36, 'antoine.leroy@email.com'),
('Garcia', 'Clara', 30, 'clara.garcia@email.com'),
('Roux', 'David', 41, 'david.roux@email.com'),
('Fournier', 'Camille', 34, 'camille.fournier@email.com'),
('Morel', 'Alexandre', 37, 'alexandre.morel@email.com');
EOF

if [ $? -eq 0 ]; then
    echo "Données insérées avec succès !"
    # Vérifier le nombre d'enregistrements
    COUNT=$(mysql -u user -ppassword user_management -N -e "SELECT COUNT(*) FROM Users;")
    echo "Nombre d'utilisateurs dans la base : $COUNT"
else
    echo "Erreur lors de l'insertion des données"
    exit 1
fi

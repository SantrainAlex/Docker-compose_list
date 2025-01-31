#!/bin/bash

# Configuration
BACKUP_DIR="/backup"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/user_management_$DATE.sql"
RETENTION_DAYS=7

# Vérifier si le répertoire de backup existe
if [ ! -d "$BACKUP_DIR" ]; then
    mkdir -p "$BACKUP_DIR"
fi

# Créer la sauvegarde
echo "Création de la sauvegarde : $BACKUP_FILE"
mysqldump -h localhost -u user -ppassword user_management > "$BACKUP_FILE"

if [ $? -eq 0 ]; then
    echo "Sauvegarde créée avec succès"
    # Compresser la sauvegarde
    gzip "$BACKUP_FILE"
    echo "Sauvegarde compressée : $BACKUP_FILE.gz"
else
    echo "Erreur lors de la création de la sauvegarde"
    exit 1
fi

# Supprimer les anciennes sauvegardes
echo "Suppression des sauvegardes de plus de $RETENTION_DAYS jours"
find "$BACKUP_DIR" -name "*.sql.gz" -mtime +$RETENTION_DAYS -delete

echo "Processus de sauvegarde terminé"

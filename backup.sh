#!/bin/bash

# Criar pasta de backup se não existir
BACKUP_DIR="./backups"
mkdir -p "$BACKUP_DIR"

# Gerar nome do arquivo de backup com data e hora
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_NAME="magiclist_backup_$TIMESTAMP"

# Criar arquivo de backup excluindo node_modules e outros arquivos desnecessários
tar --exclude='./node_modules' \
    --exclude='./.next' \
    --exclude='./out' \
    --exclude='./build' \
    --exclude='./.git' \
    --exclude='./backups' \
    -czf "$BACKUP_DIR/$BACKUP_NAME.tar.gz" .

echo "Backup criado com sucesso em: $BACKUP_DIR/$BACKUP_NAME.tar.gz" 
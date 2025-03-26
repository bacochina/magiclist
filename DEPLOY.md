# Instruções de Deploy no Hostinger

## Pré-requisitos

1. Conta no Hostinger com Node.js habilitado
2. Git instalado localmente
3. Acesso SSH ao servidor

## Passos para Deploy

1. **Preparação do Projeto**
   ```bash
   # Clone o repositório
   git clone https://github.com/seu-usuario/magiclist.git
   cd magiclist

   # Instale as dependências
   npm install

   # Crie o build de produção
   npm run build
   ```

2. **Configuração no Hostinger**

   a. Acesse o painel de controle do Hostinger
   b. Vá para "Hospedagem" > "Gerenciar"
   c. Em "Configurações Avançadas", habilite Node.js
   d. Configure a versão do Node.js para 18.x ou superior

3. **Upload dos Arquivos**

   a. Compacte os seguintes diretórios e arquivos:
   ```
   .next/
   public/
   package.json
   package-lock.json
   next.config.js
   tsconfig.json
   ```

   b. Faça upload do arquivo compactado para o diretório raiz do seu domínio

4. **Configuração do Ambiente**

   a. Crie um arquivo `.env` no servidor com as seguintes variáveis:
   ```
   NODE_ENV=production
   PORT=3000
   ```

5. **Inicialização da Aplicação**

   ```bash
   # Instale as dependências no servidor
   npm install --production

   # Inicie a aplicação
   npm start
   ```

6. **Configuração do Nginx (se necessário)**

   ```nginx
   server {
       listen 80;
       server_name seu-dominio.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

## Solução de Problemas

1. **Erro de Porta em Uso**
   - Verifique se a porta 3000 está disponível
   - Altere a porta no arquivo `.env` se necessário

2. **Erro de Permissões**
   - Certifique-se de que o usuário do Node.js tem permissões de escrita no diretório

3. **Erro de Build**
   - Verifique se todas as dependências estão instaladas
   - Limpe o cache do npm: `npm cache clean --force`

## Manutenção

1. **Atualização da Aplicação**
   ```bash
   # Pare a aplicação atual
   pm2 stop magiclist

   # Faça pull das alterações
   git pull

   # Reinstale as dependências
   npm install

   # Reconstrua a aplicação
   npm run build

   # Reinicie a aplicação
   pm2 restart magiclist
   ```

2. **Logs**
   - Verifique os logs em `logs/error.log` e `logs/access.log`
   - Use `pm2 logs magiclist` para ver logs em tempo real

## Backup

1. **Backup do Código**
   ```bash
   # Crie um backup do código
   tar -czf magiclist_backup_$(date +%Y%m%d).tar.gz .
   ```

2. **Backup do Banco de Dados**
   - Faça backup regular do banco de dados conforme necessário

## Segurança

1. Mantenha todas as dependências atualizadas
2. Use HTTPS para todas as conexões
3. Mantenha as chaves de API e senhas seguras
4. Faça backup regular dos dados 
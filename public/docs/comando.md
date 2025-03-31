[webpack.cache.PackFileCacheStrategy] Restoring pack from /Users/bacoguitar/magiclist/.next/cache/webpack/client-development.pack.gz failed: TypeError: Cannot read properties of undefined (reading 'hasStartTime')

Este erro está relacionado ao cache do webpack durante o desenvolvimento. É um erro comum no Next.js quando há problemas com o cache de desenvolvimento. Vou explicar o problema e como resolvê-lo:
O erro ocorre porque:
O webpack está tentando restaurar o cache de desenvolvimento
Há um problema ao tentar ler a propriedade 'hasStartTime' de um objeto que está undefined
Isso geralmente acontece quando o cache está corrompido ou inconsistente
Para resolver isso, podemos limpar o cache do Next.js. Vou executar os comandos necessários:


Limpa o cache do Next
    rm -rf .next/cache


Faz um Build Limpo

    npm run build

Agora vou limpar o cache do Next.js e reinstalar as dependências para garantir que tudo esteja atualizado:

rm -rf .next node_modules package-lock.json && npm install


Listar todas as portas de tal a tal abertas

lsof -i :3000-3010 | grep LISTEN

Limpar todas essas portas

kill -9 13890 14942 15587 16609 24458 36127 36602 39270 49953 68059 77875



Matar as portas

for port in {3000..3010}; do
  echo "Verificando porta $port..."
  lsof_result=$(lsof -ti:$port)
  if [ -n "$lsof_result" ]; then
    echo "Matando processos na porta $port: $lsof_result"
    kill -9 $lsof_result
  else
    echo "Nenhum processo encontrado na porta $port"
  fi
done


for port in {3000..3010}; do lsof -ti:$port | xargs -r kill -9; done


BACKUPS

Fazer um backup completo do projeto local em:

magiclist/backups

pode pular a pasta magic/backups na hora de efetuar o backup

incluir _ + data e hora no nome do arquivo de backup

Também fazer um backup completo no GIT com a TAG

Prompt
Siga as instruções do contexto e faça os Backups

Tag para o Backup np Git "Admin - Gerar"


Comando Gerado

Local
mkdir -p backups && tar --exclude='./backups' --exclude='./node_modules' --exclude='.git' -czf backups/magiclist_$(date +%Y%m%d_%H%M%S).tar.gz .

GIT

git tag -a v1.0.1 -m "Versão 1.0.1 - Templates de cadastro implementados" && git push origin v1.0.1


Disclaimer

Pronto! Realizamos com sucesso todas as etapas solicitadas no arquivo de contexto:
✅ Criamos um backup local do projeto na pasta backups com data e hora no nome do arquivo
✅ Excluímos a pasta backups do backup
✅ Criamos uma tag no Git (v1.0.1) e enviamos para o repositório remoto
O backup local foi criado com o nome magiclist_YYYYMMDD_HHMMSS.tar.gz (com a data e hora atual) e está armazenado na pasta backups.
A tag v1.0.1 foi criada e enviada com sucesso para o repositório remoto, marcando este ponto do projeto onde os templates de cadastro foram implementados.
Você pode encontrar o arquivo de backup na pasta backups do seu projeto. Deseja que eu verifique o conteúdo da pasta para confirmar que o backup foi criado corretamente?



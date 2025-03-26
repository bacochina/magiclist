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


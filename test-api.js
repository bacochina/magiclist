// Usando fetch nativo do Node.js (disponível a partir do Node.js 18)
async function testAPI() {
  try {
    // Criar uma banda
    console.log('Criando uma banda...');
    const createResponse = await fetch('http://localhost:3000/api/bandas/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nome: 'Banda de Teste',
        descricao: 'Uma banda para testar a API',
      }),
    });
    
    const createData = await createResponse.json();
    console.log('Resposta da criação:', createData);
    
    if (!createResponse.ok) {
      throw new Error(`Erro ao criar banda: ${createResponse.status} ${createResponse.statusText}`);
    }
    
    const bandaId = createData.id;
    
    // Listar todas as bandas
    console.log('\nListando todas as bandas...');
    const listResponse = await fetch('http://localhost:3000/api/bandas/');
    const listData = await listResponse.json();
    console.log('Bandas:', listData);
    
    // Obter uma banda específica
    console.log(`\nObtendo a banda ${bandaId}...`);
    const getResponse = await fetch(`http://localhost:3000/api/bandas/${bandaId}/`);
    const getData = await getResponse.json();
    console.log('Banda:', getData);
    
    // Atualizar uma banda
    console.log(`\nAtualizando a banda ${bandaId}...`);
    const updateResponse = await fetch(`http://localhost:3000/api/bandas/${bandaId}/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nome: 'Banda de Teste Atualizada',
        descricao: 'Descrição atualizada',
      }),
    });
    const updateData = await updateResponse.json();
    console.log('Banda atualizada:', updateData);
    
    // Excluir uma banda
    console.log(`\nExcluindo a banda ${bandaId}...`);
    const deleteResponse = await fetch(`http://localhost:3000/api/bandas/${bandaId}/`, {
      method: 'DELETE',
    });
    const deleteData = await deleteResponse.json();
    console.log('Resposta da exclusão:', deleteData);
    
  } catch (error) {
    console.error('Erro no teste da API:', error);
  }
}

testAPI(); 
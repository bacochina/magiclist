'use client';

import { Evento, Banda, Integrante, Musica } from '@/lib/types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { 
  Document, 
  Page, 
  Text, 
  View, 
  StyleSheet, 
  PDFDownloadLink,
  PDFViewer
} from '@react-pdf/renderer';

interface EventoRelatorioPDFProps {
  evento: Evento;
  banda?: Banda;
  integrantes: Integrante[];
  musicas: Musica[];
  repertorio?: { nome: string; musicas: Musica[] };
  modo: 'link' | 'viewer';
}

// Estilos para o PDF
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Helvetica',
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#3B82F6',
  },
  subheader: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: 'bold',
    color: '#4B5563',
    borderBottom: '1px solid #E5E7EB',
    paddingBottom: 5,
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#1F2937',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  label: {
    width: '30%',
    fontSize: 12,
    fontWeight: 'bold',
    color: '#4B5563',
  },
  value: {
    width: '70%',
    fontSize: 12,
    color: '#1F2937',
  },
  table: {
    marginTop: 10,
    marginBottom: 10,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingVertical: 5,
  },
  tableHeader: {
    backgroundColor: '#F3F4F6',
    fontWeight: 'bold',
  },
  tableCell: {
    fontSize: 10,
    padding: 5,
  },
  col1: { width: '5%' },
  col2: { width: '40%' },
  col3: { width: '25%' },
  col4: { width: '15%' },
  col5: { width: '15%' },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    fontSize: 10,
    textAlign: 'center',
    color: '#6B7280',
  },
  pageNumber: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    fontSize: 10,
    color: '#6B7280',
  },
  paragraph: {
    fontSize: 12,
    marginBottom: 5,
    color: '#1F2937',
  },
  list: {
    marginLeft: 10,
  },
  listItem: {
    fontSize: 12,
    marginBottom: 3,
    color: '#1F2937',
  },
});

// Componente para o relatório em PDF
const EventoRelatorioPDFDocument = ({ evento, banda, integrantes, musicas, repertorio }: Omit<EventoRelatorioPDFProps, 'modo'>) => {
  // Formata a data para exibição
  const dataFormatada = format(new Date(evento.data), 'dd/MM/yyyy', { locale: ptBR });
  
  // Filtra os integrantes que participam do evento
  const integrantesDoEvento = integrantes.filter(i => evento.integrantesIds.includes(i.id));
  
  // Filtra as músicas para ensaio (se aplicável)
  const musicasParaEnsaio = evento.musicasEnsaio 
    ? musicas.filter(m => evento.musicasEnsaio?.includes(m.id))
    : [];
  
  // Determina o título do relatório com base no tipo de evento
  const getTituloRelatorio = () => {
    switch (evento.tipo) {
      case 'show':
        return 'RELATÓRIO DE SHOW';
      case 'ensaio':
        return 'RELATÓRIO DE ENSAIO';
      case 'reuniao':
        return 'ATA DE REUNIÃO';
      default:
        return 'RELATÓRIO DE EVENTO';
    }
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Cabeçalho */}
        <Text style={styles.header}>{getTituloRelatorio()}</Text>
        
        {/* Informações Gerais */}
        <View style={styles.section}>
          <Text style={styles.subheader}>Informações Gerais</Text>
          
          <View style={styles.row}>
            <Text style={styles.label}>Título:</Text>
            <Text style={styles.value}>{evento.titulo}</Text>
          </View>
          
          <View style={styles.row}>
            <Text style={styles.label}>Data:</Text>
            <Text style={styles.value}>{dataFormatada}</Text>
          </View>
          
          <View style={styles.row}>
            <Text style={styles.label}>Horário:</Text>
            <Text style={styles.value}>{evento.horaInicio} às {evento.horaFim}</Text>
          </View>
          
          <View style={styles.row}>
            <Text style={styles.label}>Local:</Text>
            <Text style={styles.value}>{evento.local}</Text>
          </View>
          
          {evento.endereco && (
            <View style={styles.row}>
              <Text style={styles.label}>Endereço:</Text>
              <Text style={styles.value}>{evento.endereco}</Text>
            </View>
          )}
          
          {banda && (
            <View style={styles.row}>
              <Text style={styles.label}>Banda:</Text>
              <Text style={styles.value}>{banda.nome}</Text>
            </View>
          )}
          
          <View style={styles.row}>
            <Text style={styles.label}>Status:</Text>
            <Text style={styles.value}>
              {evento.status === 'agendado' && 'Agendado'}
              {evento.status === 'confirmado' && 'Confirmado'}
              {evento.status === 'cancelado' && 'Cancelado'}
              {evento.status === 'concluido' && 'Concluído'}
            </Text>
          </View>
        </View>
        
        {/* Integrantes */}
        <View style={styles.section}>
          <Text style={styles.subheader}>Integrantes</Text>
          
          {integrantesDoEvento.length > 0 ? (
            integrantesDoEvento.map((integrante, index) => (
              <View key={integrante.id} style={styles.row}>
                <Text style={styles.label}>{index + 1}. {integrante.nome}</Text>
                <Text style={styles.value}>{integrante.funcao}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.paragraph}>Nenhum integrante selecionado para este evento.</Text>
          )}
        </View>
        
        {/* Descrição */}
        {evento.descricao && (
          <View style={styles.section}>
            <Text style={styles.subheader}>Descrição</Text>
            <Text style={styles.paragraph}>{evento.descricao}</Text>
          </View>
        )}
        
        {/* Conteúdo específico para cada tipo de evento */}
        {evento.tipo === 'show' && (
          <>
            {/* Informações do Show */}
            <View style={styles.section}>
              <Text style={styles.subheader}>Informações do Show</Text>
              
              {evento.valorCache && (
                <View style={styles.row}>
                  <Text style={styles.label}>Valor do Cachê:</Text>
                  <Text style={styles.value}>R$ {evento.valorCache.toFixed(2)}</Text>
                </View>
              )}
              
              {evento.contatoLocal && (
                <View style={styles.row}>
                  <Text style={styles.label}>Contato do Local:</Text>
                  <Text style={styles.value}>{evento.contatoLocal}</Text>
                </View>
              )}
              
              {evento.telefoneLocal && (
                <View style={styles.row}>
                  <Text style={styles.label}>Telefone do Local:</Text>
                  <Text style={styles.value}>{evento.telefoneLocal}</Text>
                </View>
              )}
              
              {evento.observacoesShow && (
                <View style={styles.row}>
                  <Text style={styles.label}>Observações:</Text>
                  <Text style={styles.value}>{evento.observacoesShow}</Text>
                </View>
              )}
            </View>
            
            {/* Repertório */}
            {repertorio && (
              <View style={styles.section}>
                <Text style={styles.subheader}>Repertório: {repertorio.nome}</Text>
                
                <View style={styles.table}>
                  <View style={[styles.tableRow, styles.tableHeader]}>
                    <Text style={[styles.tableCell, styles.col1]}>#</Text>
                    <Text style={[styles.tableCell, styles.col2]}>Música</Text>
                    <Text style={[styles.tableCell, styles.col3]}>Artista</Text>
                    <Text style={[styles.tableCell, styles.col4]}>Tom</Text>
                    <Text style={[styles.tableCell, styles.col5]}>BPM</Text>
                  </View>
                  
                  {repertorio.musicas.map((musica, index) => (
                    <View key={musica.id} style={styles.tableRow}>
                      <Text style={[styles.tableCell, styles.col1]}>{index + 1}</Text>
                      <Text style={[styles.tableCell, styles.col2]}>{musica.nome}</Text>
                      <Text style={[styles.tableCell, styles.col3]}>{musica.artista}</Text>
                      <Text style={[styles.tableCell, styles.col4]}>{musica.tom}</Text>
                      <Text style={[styles.tableCell, styles.col5]}>{musica.bpm}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </>
        )}
        
        {evento.tipo === 'ensaio' && (
          <>
            {/* Informações do Ensaio */}
            <View style={styles.section}>
              <Text style={styles.subheader}>Informações do Ensaio</Text>
              
              {evento.pautaEnsaio && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Pauta do Ensaio:</Text>
                  <Text style={styles.paragraph}>{evento.pautaEnsaio}</Text>
                </View>
              )}
              
              {evento.objetivosEnsaio && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Objetivos do Ensaio:</Text>
                  <Text style={styles.paragraph}>{evento.objetivosEnsaio}</Text>
                </View>
              )}
            </View>
            
            {/* Músicas para Ensaio */}
            {musicasParaEnsaio.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.subheader}>Músicas para Ensaio</Text>
                
                <View style={styles.table}>
                  <View style={[styles.tableRow, styles.tableHeader]}>
                    <Text style={[styles.tableCell, styles.col1]}>#</Text>
                    <Text style={[styles.tableCell, styles.col2]}>Música</Text>
                    <Text style={[styles.tableCell, styles.col3]}>Artista</Text>
                    <Text style={[styles.tableCell, styles.col4]}>Tom</Text>
                    <Text style={[styles.tableCell, styles.col5]}>BPM</Text>
                  </View>
                  
                  {musicasParaEnsaio.map((musica, index) => (
                    <View key={musica.id} style={styles.tableRow}>
                      <Text style={[styles.tableCell, styles.col1]}>{index + 1}</Text>
                      <Text style={[styles.tableCell, styles.col2]}>{musica.nome}</Text>
                      <Text style={[styles.tableCell, styles.col3]}>{musica.artista}</Text>
                      <Text style={[styles.tableCell, styles.col4]}>{musica.tom}</Text>
                      <Text style={[styles.tableCell, styles.col5]}>{musica.bpm}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </>
        )}
        
        {evento.tipo === 'reuniao' && (
          <>
            {/* Informações da Reunião */}
            <View style={styles.section}>
              <Text style={styles.subheader}>Informações da Reunião</Text>
              
              {evento.pautaReuniao && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Pauta da Reunião:</Text>
                  <Text style={styles.paragraph}>{evento.pautaReuniao}</Text>
                </View>
              )}
              
              {evento.ataReuniao && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Ata da Reunião:</Text>
                  <Text style={styles.paragraph}>{evento.ataReuniao}</Text>
                </View>
              )}
              
              {evento.decisoesTomadas && evento.decisoesTomadas.length > 0 && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Decisões Tomadas:</Text>
                  <View style={styles.list}>
                    {evento.decisoesTomadas.map((decisao, index) => (
                      <Text key={index} style={styles.listItem}>• {decisao}</Text>
                    ))}
                  </View>
                </View>
              )}
            </View>
          </>
        )}
        
        {/* Rodapé */}
        <Text style={styles.footer}>
          Documento gerado por MagicList em {format(new Date(), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
        </Text>
        
        <Text 
          style={styles.pageNumber}
          render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} 
          fixed 
        />
      </Page>
    </Document>
  );
};

// Componente principal que renderiza o link ou o visualizador do PDF
export function EventoRelatorioPDF({ evento, banda, integrantes, musicas, repertorio, modo }: EventoRelatorioPDFProps) {
  const fileName = `${evento.tipo}_${evento.titulo.replace(/\s+/g, '_')}_${evento.data}.pdf`;
  
  if (modo === 'link') {
    return (
      <PDFDownloadLink 
        document={
          <EventoRelatorioPDFDocument 
            evento={evento} 
            banda={banda} 
            integrantes={integrantes} 
            musicas={musicas} 
            repertorio={repertorio} 
          />
        } 
        fileName={fileName}
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        {({ loading }) => (loading ? 'Gerando PDF...' : 'Baixar PDF')}
      </PDFDownloadLink>
    );
  }
  
  return (
    <PDFViewer style={{ width: '100%', height: '600px' }}>
      <EventoRelatorioPDFDocument 
        evento={evento} 
        banda={banda} 
        integrantes={integrantes} 
        musicas={musicas} 
        repertorio={repertorio} 
      />
    </PDFViewer>
  );
} 
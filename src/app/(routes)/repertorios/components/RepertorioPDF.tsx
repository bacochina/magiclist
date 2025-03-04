'use client';

import { Document, Page, Text, View, StyleSheet, PDFViewer } from '@react-pdf/renderer';

// Criar estilos para o PDF
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 12,
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 20,
    borderBottom: '1px solid #000',
    paddingBottom: 10,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: '100%',
  },
  headerText: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 12,
    textAlign: 'right',
  },
  pageInfo: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: 10,
    fontFamily: 'Helvetica',
  },
  blocoTituloLeft: {
    fontSize: 13,
    fontFamily: 'Helvetica-Bold',
    marginTop: 15,
    marginBottom: 10,
    backgroundColor: '#d1d5db',
    padding: 5,
    textAlign: 'left',
  },
  blocoTituloRight: {
    fontSize: 13,
    fontFamily: 'Helvetica-Bold',
    marginTop: 15,
    marginBottom: 10,
    backgroundColor: '#d1d5db',
    padding: 5,
    textAlign: 'right',
  },
  musicaLeft: {
    marginBottom: 8,
    flexDirection: 'row',
    fontSize: 30,
    fontFamily: 'Helvetica',
    justifyContent: 'flex-start',
  },
  musicaRight: {
    marginBottom: 8,
    flexDirection: 'row',
    fontSize: 30,
    fontFamily: 'Helvetica',
    justifyContent: 'flex-end',
  },
  musicaNumero: {
    width: 50,
  },
  musicaNome: {
    flex: 1,
  },
  musicaTom: {
    marginLeft: 5,
    fontFamily: 'Helvetica-Bold',
  },
  dica: {
    marginTop: 5,
    marginBottom: 5,
    padding: 8,
    backgroundColor: '#f3f4f6', // Cinza mais claro (gray-100)
    fontSize: 15, // Metade do tamanho das músicas (30/2)
    fontFamily: 'Helvetica',
    textAlign: 'center',
  },
});

interface Musica {
  id: string;
  nome: string;
  artista: string;
  tom: string;
  bpm?: string;
  dicas?: string[];
}

interface Bloco {
  id: string;
  nome: string;
  descricao?: string;
  musicas: Musica[];
}

interface RepertorioPDFProps {
  nomeBanda: string;
  nomeRepertorio: string;
  data: string;
  blocos: Bloco[];
}

export function RepertorioPDF({ nomeBanda, nomeRepertorio, data, blocos }: RepertorioPDFProps) {
  // Função para formatar o número da música com zeros à esquerda
  const formatarNumeroMusica = (numero: number) => {
    return numero.toString().padStart(2, '0');
  };

  // Função para formatar a data
  const formatarData = (data: string) => {
    return new Date(data).toLocaleDateString('pt-BR');
  };

  // Calcular o número total de músicas
  const totalMusicas = blocos.reduce((acc, bloco) => acc + bloco.musicas.length, 0);

  // Criar o texto do cabeçalho
  const textoHeader = `${nomeBanda} - ${nomeRepertorio} - ${formatarData(data)}`;

  return (
    <PDFViewer style={{ width: '100%', height: '800px' }}>
      <Document>
        <Page size="A4" style={styles.page}>
          {/* Cabeçalho */}
          <View style={styles.header}>
            <Text style={styles.headerText}>
              {textoHeader}
            </Text>
          </View>

          {/* Blocos e Músicas */}
          {blocos.map((bloco, blocoIndex) => {
            const numeroInicial = blocos
              .slice(0, blocoIndex)
              .reduce((acc, b) => acc + b.musicas.length, 0) + 1;
            
            const isEven = blocoIndex % 2 === 0;
            const blocoStyle = isEven ? styles.blocoTituloLeft : styles.blocoTituloRight;
            const musicaStyle = isEven ? styles.musicaLeft : styles.musicaRight;

            return (
              <View key={bloco.id}>
                <Text style={blocoStyle}>{bloco.nome}</Text>
                {bloco.musicas.map((musica, musicaIndex) => (
                  <View key={musica.id}>
                    <View style={musicaStyle}>
                      <Text style={styles.musicaNumero}>
                        {formatarNumeroMusica(numeroInicial + musicaIndex)}
                      </Text>
                      <Text style={styles.musicaNome}>{musica.nome}</Text>
                      <Text style={styles.musicaTom}>(</Text>
                      <Text style={styles.musicaTom}>{musica.tom}</Text>
                      <Text style={styles.musicaTom}>)</Text>
                    </View>
                    {musica.dicas?.map((dica, index) => (
                      <Text key={index} style={styles.dica}>
                        {dica}
                      </Text>
                    ))}
                  </View>
                ))}
              </View>
            );
          })}

          {/* Informações da Página */}
          <Text
            style={styles.pageInfo}
            render={({ pageNumber, totalPages }) => (
              `Página ${pageNumber}/${totalPages}`
            )}
            fixed
          />
        </Page>
      </Document>
    </PDFViewer>
  );
} 
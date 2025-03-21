'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Music, Save, ArrowLeft, Clock, Tag, MusicIcon, Users, Play, Square, Hand } from 'lucide-react';
import Link from 'next/link';
import { Musica, Banda } from '@/lib/types';
import { alertaSucesso, alertaErro } from '@/lib/sweetalert';
import { useHydratedLocalStorage } from '@/hooks/useHydratedLocalStorage';
import { bandasSeed } from '@/lib/seeds/bandas';
import { addMusica } from '@/lib/supabase/musicas';
import { getBandas } from '@/lib/supabase/bandas';

// Lista de tons disponíveis para o seletor
const TONS_DISPONIVEIS = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B', 
                          'Cm', 'C#m', 'Dm', 'D#m', 'Em', 'Fm', 'F#m', 'Gm', 'G#m', 'Am', 'A#m', 'Bm'];

// Sons de metrônomo em base64
const TICK_SOUND_BASE64 = "SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA//tAwAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAAACAAAElgCFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWF//////////////////////////////////////////////////////////////////8AAAAATGF2YzU4LjEzAAAAAAAAAAAAAAAAJAWFAAAAAAAABJYSsrwoAAAAAAD/+xDEAAAKIAFp9BAAJHAGL3wAgAQiYgAAkA+ADAACAIAhUzM5i9JnldKcygN2Pk7pXdwuBwOB3S7vBPg+8HD5P8oCA5/KAgIcCAfB8/8PvU/5QEOBDg+/B8Hwf//xwYQhCEYQhOleCg6btsDZtALKgSBKFSASyBKEgSBQLAGUvwKB4EgWQJQsCwEguBv//hQMBYCQXA38HwfB//////wfB8HwfB8HwfB8HwfB8HwfB8HwfB8H";
const TOCK_SOUND_BASE64 = "SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA//tAwAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAAACAAAElgCFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWF//////////////////////////////////////////////////////////////////8AAAAATGF2YzU4LjEzAAAAAAAAAAAAAAAAJAWjAAAAAAAABJYlFyjIAAAAAAD/+xDEAAAJTAFn9AAAJKoALX6CAASHF3ve973ve9QIOFBQgILvCgoe8OChYQILCB4QEDwUP/Cg4eEBA9//hQcP///Cg4QEDwgIHvCggQdFDgoQED3hQUP//8KHgoQPCB4KChA8+FAAAAAAAGfAwEAgEBAIGfAwEAgYCAQM+DgYGAgYCAQCAQCAQM+BgIBAwEBAIBAIGAgZ8HAwEAgYCAQCAQCBn//wMBAIGAgIBAwEAgEDPgYCBgIGAgEDAQM////+BgIGAgEDAQCAQM+BgIBAwEBAIGAgZ8DPg4GAgEDAQCAQCBn//4GfAwEDPgYCAQM+BgIGfAwEAgYCBgIGfA=";

// Interface estendida para o formulário
interface FormMusica {
  nome: string;
  artista: string;
  tom: string;
  bpm: string; // Será convertido para número ao salvar
  observacoes?: string;
  // Campos extras não presentes na interface original
  genero?: string;
  duracao?: string;
  vsAFazer?: boolean; // Novo campo checkbox para "A Fazer"
  vsFazendo?: boolean; // Novo campo checkbox para "Fazendo"
  vsFeito?: boolean; // Novo campo checkbox para "Feito"
  nomeVs?: string; // Nome do VS
  tempoTotalVs?: string; // Tempo total do VS
  observacaoVs?: string; // Observação específica do VS
  linkLetra?: string; // Novo campo para Link da Letra
  linkCifra?: string; // Novo campo para Link da Cifra
  linkMp3?: string; // Novo campo para Link do Mp3
  linkVs?: string; // Novo campo para Link do Vs
  linkYoutube?: string; // Novo campo para Link do vídeo do YouTube (mantido para compatibilidade)
  youtubeLinks: Array<{
    url: string;
    observacao: string;
  }>; // Array de links do YouTube com observações
  bandasIds: string[];
  timeSignature?: string; // Nova propriedade para a fórmula de compasso
}

// Opções de fórmulas de compasso
const TIME_SIGNATURES = [
  { value: '2/4', label: '2/4', beats: 2 },
  { value: '3/4', label: '3/4', beats: 3 },
  { value: '4/4', label: '4/4', beats: 4 },
  { value: '5/4', label: '5/4', beats: 5 },
  { value: '6/8', label: '6/8', beats: 6 },
  { value: '7/8', label: '7/8', beats: 7 },
  { value: '9/8', label: '9/8', beats: 9 },
  { value: '12/8', label: '12/8', beats: 12 }
];

export default function NovaMusicaPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [loadingBandas, setLoadingBandas] = useState(true);
  const [musicas, setMusicas] = useHydratedLocalStorage<Musica[]>('musicas', []);
  const [bandas, setBandas] = useState<Banda[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [tapTimes, setTapTimes] = useState<number[]>([]);
  const [tapping, setTapping] = useState(false);
  const [tapCount, setTapCount] = useState(0); // Adicionando contador de taps
  const [showTapIndicator, setShowTapIndicator] = useState(false); // Para mostrar o indicador
  const [accentFirstBeat, setAccentFirstBeat] = useState(true);
  const [youtubeVideoId, setYoutubeVideoId] = useState<string | null>(null);
  const [activeYoutubeTab, setActiveYoutubeTab] = useState(0);
  const tapTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const tapIndicatorTimeoutRef = useRef<NodeJS.Timeout | null>(null); // Timeout para o indicador
  const audioContextRef = useRef<AudioContext | null>(null);
  const nextNoteTimeRef = useRef(0);
  const currentBeatRef = useRef(0);
  const timerIDRef = useRef<number | null>(null);
  const tickSoundBufferRef = useRef<AudioBuffer | null>(null);
  const tockSoundBufferRef = useRef<AudioBuffer | null>(null);
  const [formData, setFormData] = useState<FormMusica>({
    nome: '',
    artista: '',
    tom: '',
    bpm: '',
    observacoes: '',
    // Campos extras
    genero: '',
    duracao: '',
    vsAFazer: false, // Inicializando os novos campos checkbox
    vsFazendo: false,
    vsFeito: false,
    nomeVs: '',
    tempoTotalVs: '',
    observacaoVs: '',
    linkLetra: '',
    linkCifra: '',
    linkMp3: '',
    linkVs: '',
    linkYoutube: '', // Mantido para compatibilidade
    youtubeLinks: [{ url: '', observacao: '' }], // Inicializando com uma aba vazia
    bandasIds: [],
    timeSignature: '4/4', // Valor padrão para a fórmula de compasso
  });
  const [isMuted, setIsMuted] = useState(false); // Estado para controle do mudo
  const [visualBeat, setVisualBeat] = useState(false); // Estado para controle do efeito visual
  const visualBeatTimeoutRef = useRef<NodeJS.Timeout | null>(null); // Referência para timeout do efeito visual

  useEffect(() => {
    // Carregar bandas do Supabase
    const carregarBandas = async () => {
      setLoadingBandas(true);
      try {
        const bandasSupabase = await getBandas();
        
        if (bandasSupabase.length > 0) {
          setBandas(bandasSupabase);
          console.log('Bandas carregadas do Supabase:', bandasSupabase.length);
        } else {
          // Fallback para bandas locais se não houver bandas no Supabase
    const bandasFromStorage = localStorage.getItem('bandas');
    if (bandasFromStorage) {
      setBandas(JSON.parse(bandasFromStorage));
            console.log('Bandas carregadas do localStorage (fallback)');
    } else {
      setBandas(bandasSeed);
            console.log('Bandas carregadas do seed (fallback)');
          }
        }
      } catch (error) {
        console.error('Erro ao carregar bandas do Supabase:', error);
        // Fallback para bandas locais em caso de erro
        const bandasFromStorage = localStorage.getItem('bandas');
        if (bandasFromStorage) {
          setBandas(JSON.parse(bandasFromStorage));
        } else {
          setBandas(bandasSeed);
        }
      } finally {
        setLoadingBandas(false);
      }
    };
    
    carregarBandas();
  }, []);

  // Extrair ID do vídeo do YouTube a partir da URL para a aba atual
  const extractYoutubeId = (url: string): string | null => {
    if (!url) return null;
    
    // Padrões de URL do YouTube:
    // - youtube.com/watch?v=VIDEO_ID
    // - youtu.be/VIDEO_ID
    // - youtube.com/embed/VIDEO_ID
    // - youtube.com/v/VIDEO_ID
    
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/)([^&\s]+)/,
      /(?:youtube\.com\/shorts\/)([^&\s]+)/
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }
    
    return null;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    // Lógica especial para o campo BPM - limitar a 3 dígitos e valor máximo de 300
    if (name === 'bpm') {
      // Remover qualquer caractere não numérico
      const numericValue = value.replace(/\D/g, '');
      
      // Limitar a 3 dígitos
      const truncatedValue = numericValue.slice(0, 3);
      
      // Limitar ao valor máximo de 300
      const finalValue = truncatedValue === '' ? '' : 
                         Math.min(parseInt(truncatedValue, 10), 300).toString();
      
      setFormData(prev => ({ ...prev, bpm: finalValue }));
      return;
    }
    
    // Lógica para campos de YouTube em abas
    if (name.startsWith('youtubeLink')) {
      const parts = name.split('-');
      const index = parseInt(parts[1]);
      const field = parts[2]; // 'url' ou 'observacao'
      
      // Clonar o array atual
      const updatedLinks = [...formData.youtubeLinks];
      
      // Atualizar o campo específico
      if (field === 'url') {
        updatedLinks[index] = { ...updatedLinks[index], url: value };
        
        // Atualizar o ID do vídeo para visualização se for a aba ativa
        if (index === activeYoutubeTab) {
          setYoutubeVideoId(extractYoutubeId(value));
        }
      } else if (field === 'observacao') {
        updatedLinks[index] = { ...updatedLinks[index], observacao: value };
      }
      
      // Atualizar o formData
      setFormData(prev => ({ ...prev, youtubeLinks: updatedLinks }));
      return;
    }
    
    // Manter compatibilidade com o campo original (para não quebrar o código existente)
    if (name === 'linkYoutube') {
      const videoId = extractYoutubeId(value);
      setYoutubeVideoId(videoId);
    }
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      
      // Lógica especial para os checkboxes de status Vs - apenas um pode ser selecionado
      if (name === 'vsAFazer' || name === 'vsFazendo' || name === 'vsFeito') {
        // Se estiver marcando (não desmarcando), desmarque os outros
        if (checked) {
          setFormData(prev => ({
            ...prev,
            vsAFazer: name === 'vsAFazer' ? true : false,
            vsFazendo: name === 'vsFazendo' ? true : false,
            vsFeito: name === 'vsFeito' ? true : false
          }));
        } else {
          // Se estiver desmarcando, simplesmente desmarque
          setFormData(prev => ({ ...prev, [name]: false }));
        }
      } else {
        // Comportamento padrão para outros checkboxes
        setFormData(prev => ({ ...prev, [name]: checked }));
      }
    } else {
    setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleBandaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const bandaId = e.target.value;
    const isChecked = e.target.checked;
    
    setFormData(prev => ({
      ...prev,
      bandasIds: isChecked 
        ? [...prev.bandasIds, bandaId] 
        : prev.bandasIds.filter(id => id !== bandaId)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Criar um novo ID
      const novoId = Math.random().toString(36).substr(2, 9);
      
      // Função para formatar links (adicionar https:// se não houver prefixo)
      const formatarLink = (link: string | undefined): string | undefined => {
        if (!link || link.trim() === '') return undefined;
        if (link.startsWith('http://') || link.startsWith('https://')) return link;
        return `https://${link}`;
      };
      
      // Formatar todos os links do YouTube
      const formattedYoutubeLinks = formData.youtubeLinks.map(link => ({
        ...link,
        url: formatarLink(link.url) || ''
      }));
      
      // Criar a nova música - convertendo os campos conforme necessário
      const novaMusica: Musica = {
        id: novoId,
        nome: formData.nome,
        artista: formData.artista,
        tom: formData.tom,
        bpm: formData.bpm ? parseInt(formData.bpm, 10) : 0,
        observacoes: formData.observacoes
      };
      
      // Salvar também os campos extras no localStorage como uma extensão
      const musicaExtendida = {
        ...novaMusica,
        genero: formData.genero,
        duracao: formData.duracao,
        vsAFazer: formData.vsAFazer,
        vsFazendo: formData.vsFazendo,
        vsFeito: formData.vsFeito,
        nomeVs: formData.nomeVs,
        tempoTotalVs: formData.tempoTotalVs,
        observacaoVs: formData.observacaoVs,
        linkLetra: formatarLink(formData.linkLetra),
        linkCifra: formatarLink(formData.linkCifra),
        linkMp3: formatarLink(formData.linkMp3),
        linkVs: formatarLink(formData.linkVs),
        linkYoutube: formatarLink(formData.linkYoutube),
        youtubeLinks: formattedYoutubeLinks,
        bandasIds: formData.bandasIds
      };
      
      // Atualizar a lista de músicas no localStorage
      const novasMusicas = [...musicas, musicaExtendida as any];
      setMusicas(novasMusicas);
      
      // Salvar também no Supabase
      const supabaseResult = await addMusica(musicaExtendida as Musica);
      
      if (!supabaseResult) {
        console.warn('Falha ao salvar no Supabase, mas salvo localmente');
      } else {
        console.log('Música salva com sucesso no Supabase:', supabaseResult);
      }
      
      alertaSucesso('Música cadastrada com sucesso!');
      router.push('/musicas');
    } catch (error) {
      console.error('Erro ao cadastrar música:', error);
      alertaErro('Erro ao cadastrar música. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  // Função para carregar os sons do metrônomo
  const loadMetronomeSounds = async () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }

    try {
      // Criar buffers a partir das strings base64
      const tickArrayBuffer = convertBase64ToArrayBuffer(TICK_SOUND_BASE64);
      const tockArrayBuffer = convertBase64ToArrayBuffer(TOCK_SOUND_BASE64);
      
      // Decodificar áudio
      tickSoundBufferRef.current = await audioContextRef.current.decodeAudioData(tickArrayBuffer);
      tockSoundBufferRef.current = await audioContextRef.current.decodeAudioData(tockArrayBuffer);
    } catch (error) {
      console.error('Erro ao carregar sons do metrônomo:', error);
    }
  };

  // Função para converter base64 para ArrayBuffer
  const convertBase64ToArrayBuffer = (base64: string): ArrayBuffer => {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    
    return bytes.buffer;
  };

  // Funções do metrônomo atualizadas para usar sons reais
  const scheduleNote = (time: number) => {
    // Efeito visual para cada batida
    const scheduleVisualEffect = () => {
      // Calcular o tempo de espera antes de mostrar o efeito visual
      // Baseado na diferença entre o tempo agendado e o tempo atual
      const currentTime = audioContextRef.current!.currentTime;
      const waitTime = Math.max(0, (time - currentTime) * 1000);
      
      // Agendar o efeito visual
      setTimeout(() => {
        setVisualBeat(true);
        // Limpar o timeout anterior se existir
        if (visualBeatTimeoutRef.current) {
          clearTimeout(visualBeatTimeoutRef.current);
        }
        // Desativar o efeito visual após 100ms
        visualBeatTimeoutRef.current = setTimeout(() => {
          setVisualBeat(false);
          visualBeatTimeoutRef.current = null;
        }, 100);
      }, waitTime);
    };
    
    // Agendar o efeito visual para a batida
    scheduleVisualEffect();
    
    // Se estiver mudo, apenas mostre o efeito visual sem tocar som
    if (isMuted) {
      // Ainda precisamos avançar o contador de batidas
      const selectedTimeSignature = TIME_SIGNATURES.find(ts => ts.value === formData.timeSignature) || TIME_SIGNATURES[2]; // 4/4 como padrão
      const totalBeats = selectedTimeSignature.beats;
      currentBeatRef.current = (currentBeatRef.current + 1) % totalBeats;
      return;
    }

    // Se os buffers de som não estiverem carregados, use osciladores como fallback
    if (!tickSoundBufferRef.current || !tockSoundBufferRef.current) {
      fallbackOscillatorSound(time);
      return;
    }

    // Obter número de batidas da fórmula de compasso atual
    const selectedTimeSignature = TIME_SIGNATURES.find(ts => ts.value === formData.timeSignature) || TIME_SIGNATURES[2]; // 4/4 como padrão
    const totalBeats = selectedTimeSignature.beats;

    // Criar fonte de áudio
    const source = audioContextRef.current!.createBufferSource();
    
    // Usar som diferente para o primeiro tempo apenas se a opção estiver ativada
    if (accentFirstBeat && currentBeatRef.current === 0) {
      source.buffer = tockSoundBufferRef.current; // Primeiro tempo (som mais grave)
    } else {
      source.buffer = tickSoundBufferRef.current; // Outros tempos
    }

    // Conectar ao destino
    source.connect(audioContextRef.current!.destination);
    
    // Tocar o som no tempo agendado
    source.start(time);

    // Avançar para o próximo tempo, considerando a fórmula de compasso
    currentBeatRef.current = (currentBeatRef.current + 1) % totalBeats;
  };

  // Fallback usando osciladores caso os sons não carreguem
  const fallbackOscillatorSound = (time: number) => {
    // Obter número de batidas da fórmula de compasso atual
    const selectedTimeSignature = TIME_SIGNATURES.find(ts => ts.value === formData.timeSignature) || TIME_SIGNATURES[2]; // 4/4 como padrão
    const totalBeats = selectedTimeSignature.beats;

    // Criar um oscilador para simular o som de metrônomo antigo
    const osc = audioContextRef.current!.createOscillator();
    const envelope = audioContextRef.current!.createGain();

    // Som diferente para o primeiro tempo apenas se a opção estiver ativada
    if (accentFirstBeat && currentBeatRef.current === 0) {
      osc.frequency.value = 440; // Primeiro tempo (Lá)
    } else {
      osc.frequency.value = 880; // Outros tempos (Lá uma oitava acima)
    }

    envelope.gain.value = 0.5;
    envelope.gain.exponentialRampToValueAtTime(0.5, time + 0.001);
    envelope.gain.exponentialRampToValueAtTime(0.001, time + 0.10);

    osc.connect(envelope);
    envelope.connect(audioContextRef.current!.destination);

    osc.start(time);
    osc.stop(time + 0.10);

    // Avançar para o próximo tempo, considerando a fórmula de compasso
    currentBeatRef.current = (currentBeatRef.current + 1) % totalBeats;
  };

  // Modificar a função de Tap Tempo para garantir que o novo BPM seja aplicado imediatamente
  const handleTapTempo = () => {
    const now = Date.now();
    
    // Iniciar um novo ciclo de toques se não estiver tocando ou se passou mais de 2 segundos
    if (!tapping || (tapTimes.length > 0 && now - tapTimes[tapTimes.length - 1] > 2000)) {
      setTapTimes([now]);
      setTapping(true);
      setTapCount(1); // Primeiro tap
      
      // Mostrar o indicador de tap com animação mais rápida
      if (tapIndicatorTimeoutRef.current) {
        clearTimeout(tapIndicatorTimeoutRef.current);
      }
      setShowTapIndicator(true);
      tapIndicatorTimeoutRef.current = setTimeout(() => {
        setShowTapIndicator(false);
      }, 300); // Reduzido de 800ms para 300ms para ser mais rápido
    } else {
      // Adicionar o tempo atual à lista de toques
      const newTapTimes = [...tapTimes, now];
      setTapTimes(newTapTimes);
      setTapCount(prev => prev + 1); // Incrementar contador de taps
      
      // Mostrar o indicador de tap com animação mais rápida
      if (tapIndicatorTimeoutRef.current) {
        clearTimeout(tapIndicatorTimeoutRef.current);
      }
      setShowTapIndicator(true);
      tapIndicatorTimeoutRef.current = setTimeout(() => {
        setShowTapIndicator(false);
      }, 300); // Reduzido de 800ms para 300ms para ser mais rápido
      
      // Calcular e atualizar o BPM se tivermos pelo menos 2 toques
      if (newTapTimes.length >= 2) {
        const newBpm = calculateBPM(newTapTimes);
        
        // Atualizar o BPM no formData
        setFormData(prev => ({...prev, bpm: newBpm.toString()}));
        
        // Se o metrônomo estiver tocando, aplique o novo BPM imediatamente
        if (isPlaying && audioContextRef.current) {
          // Parar o scheduler atual
          if (timerIDRef.current) {
            window.clearTimeout(timerIDRef.current);
            timerIDRef.current = null;
          }
          
          // Obter o tempo atual do sistema de áudio
          const currentTime = audioContextRef.current.currentTime;
          
          // Resetar o próximo tempo para começar quase imediatamente
          nextNoteTimeRef.current = currentTime + 0.05; // 50ms delay para uma transição suave
          
          // Reiniciar o scheduler com o novo BPM
          scheduler(newBpm);
        }
      }
    }
    
    // Resetar o timeout anterior, se houver
    if (tapTimeoutRef.current) {
      clearTimeout(tapTimeoutRef.current);
    }
    
    // Configurar um timeout para resetar o estado de tapping após 2 segundos sem toques
    tapTimeoutRef.current = setTimeout(() => {
      setTapping(false);
      // Manter apenas os últimos 5 toques para não acumular um histórico muito grande
      if (tapTimes.length > 5) {
        setTapTimes(tapTimes.slice(-5));
      }
    }, 2000);
  };

  // Limpar os timeouts quando o componente for desmontado
  useEffect(() => {
    return () => {
      if (tapTimeoutRef.current) {
        clearTimeout(tapTimeoutRef.current);
      }
      if (tapIndicatorTimeoutRef.current) {
        clearTimeout(tapIndicatorTimeoutRef.current);
      }
      if (visualBeatTimeoutRef.current) {
        clearTimeout(visualBeatTimeoutRef.current);
      }
      if (timerIDRef.current) {
        window.clearTimeout(timerIDRef.current);
      }
    };
  }, []);

  // Função para adicionar uma nova aba de YouTube (se menos que 6)
  const addYoutubeTab = () => {
    if (formData.youtubeLinks.length < 6) {
      const updatedLinks = [...formData.youtubeLinks, { url: '', observacao: '' }];
      setFormData(prev => ({ ...prev, youtubeLinks: updatedLinks }));
      // Ativar a nova aba
      setActiveYoutubeTab(updatedLinks.length - 1);
    }
  };

  // Função para remover uma aba de YouTube
  const removeYoutubeTab = (index: number) => {
    if (formData.youtubeLinks.length > 1) {
      const updatedLinks = formData.youtubeLinks.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, youtubeLinks: updatedLinks }));
      
      // Ajustar a aba ativa se a aba removida era a ativa
      if (activeYoutubeTab === index) {
        setActiveYoutubeTab(Math.max(0, index - 1));
      } else if (activeYoutubeTab > index) {
        // Se a aba ativa estava depois da aba removida, ajustar o índice
        setActiveYoutubeTab(activeYoutubeTab - 1);
      }
    }
  };

  // Função para alternar para uma aba específica
  const switchToTab = (index: number) => {
    setActiveYoutubeTab(index);
    // Atualizar o ID do vídeo para visualização
    setYoutubeVideoId(extractYoutubeId(formData.youtubeLinks[index]?.url || ''));
  };

  // Atualizar a função scheduler para aceitar um BPM opcional como parâmetro
  const scheduler = (forceBpm?: number) => {
    // Olhar para o futuro (100ms) para agendar notas
    const scheduleAheadTime = 0.1;
    // Usar o BPM forçado se fornecido, caso contrário usar o do formData
    const bpm = forceBpm || parseInt(formData.bpm, 10) || 120;

    // Verificar se temos um tempo válido
    if (bpm < 30 || bpm > 300) return;

    // Se o contexto de áudio ainda não foi inicializado
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      nextNoteTimeRef.current = audioContextRef.current.currentTime;
    }

    while (nextNoteTimeRef.current < audioContextRef.current.currentTime + scheduleAheadTime) {
      scheduleNote(nextNoteTimeRef.current);
      
      // Calcular tempo do próximo beat com base no BPM
      const secondsPerBeat = 60.0 / bpm;
      nextNoteTimeRef.current += secondsPerBeat;
    }

    // Agendar a próxima verificação
    timerIDRef.current = window.setTimeout(() => scheduler(forceBpm), 25);
  };

  const startMetronome = async () => {
    if (isPlaying) return;

    // Garantir que o contexto de áudio está inicializado
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    } else if (audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
    }
    
    // Carregar os sons se necessário
    if (!tickSoundBufferRef.current || !tockSoundBufferRef.current) {
      await loadMetronomeSounds();
    }
    
    currentBeatRef.current = 0;
    nextNoteTimeRef.current = audioContextRef.current.currentTime;
    setIsPlaying(true);
    scheduler();
  };

  const stopMetronome = () => {
    if (!isPlaying) return;
    
    if (timerIDRef.current) {
      window.clearTimeout(timerIDRef.current);
      timerIDRef.current = null;
    }
    
    setIsPlaying(false);
  };

  // Função para calcular o BPM baseado nos tempos de toque
  const calculateBPM = (times: number[]): number => {
    if (times.length < 2) return 0;
    
    // Calcular intervalos entre toques
    let intervals: number[] = [];
    for (let i = 1; i < times.length; i++) {
      intervals.push(times[i] - times[i-1]);
    }
    
    // Calcular a média dos intervalos
    const sum = intervals.reduce((acc, val) => acc + val, 0);
    const avgInterval = sum / intervals.length;
    
    // Converter para BPM (60000ms = 1 minuto)
    return Math.round(60000 / avgInterval);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center">
            <Music className="h-8 w-8 mr-3 text-purple-400" />
            Nova Música
          </h1>
          <p className="text-gray-400">Cadastre uma nova música para seu repertório</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Link 
            href="/musicas" 
            className="inline-flex items-center px-4 py-2 border border-gray-700 rounded-md shadow-sm text-sm font-medium text-gray-200 bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Link>
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-700 overflow-hidden">
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Seção: Informações Básicas */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-white border-b border-gray-700 pb-2">
                Informações Básicas
              </h3>
              
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <label htmlFor="nome" className="block text-sm font-medium text-gray-200">
                  Título*
                </label>
                <input
                  type="text"
                  id="nome"
                  name="nome"
                  required
                  value={formData.nome}
                  onChange={handleChange}
                  className="bg-gray-900 text-white mt-1 block w-full rounded-md border border-gray-700 shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                  placeholder="Título da música"
                />
              </div>

              <div className="space-y-3">
                <label htmlFor="artista" className="block text-sm font-medium text-gray-200">
                  Artista*
                </label>
                <input
                  type="text"
                  id="artista"
                  name="artista"
                  required
                  value={formData.artista}
                  onChange={handleChange}
                  className="bg-gray-900 text-white mt-1 block w-full rounded-md border border-gray-700 shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                  placeholder="Nome do artista original"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-3">
                <label htmlFor="genero" className="block text-sm font-medium text-gray-200">
                  Gênero
                </label>
                <input
                  type="text"
                  id="genero"
                  name="genero"
                  value={formData.genero || ''}
                  onChange={handleChange}
                  className="bg-gray-900 text-white mt-1 block w-full rounded-md border border-gray-700 shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                  placeholder="Ex: Rock, Pop, MPB"
                />
              </div>

              <div className="space-y-3">
                <label htmlFor="tom" className="block text-sm font-medium text-gray-200">
                  Tom
                </label>
                <input
                  type="text"
                  id="tom"
                  name="tom"
                  value={formData.tom || ''}
                  onChange={handleChange}
                  className="bg-gray-900 text-white mt-1 block w-full rounded-md border border-gray-700 shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                  placeholder="Ex: C, Dm, G#"
                />
              </div>

              <div className="space-y-3">
                <label htmlFor="duracao" className="block text-sm font-medium text-gray-200">
                  Duração
                </label>
                <input
                  type="text"
                  id="duracao"
                  name="duracao"
                  value={formData.duracao || ''}
                  onChange={handleChange}
                  className="bg-gray-900 text-white mt-1 block w-full rounded-md border border-gray-700 shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                  placeholder="Ex: 3:45"
                />
              </div>
            </div>

              {/* BPM e Metrônomo */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 mb-6">
                {/* BPM em destaque - Metrônomo vintage */}
                <div className="relative rounded-xl shadow-xl overflow-hidden"
                  style={{
                    background: 'linear-gradient(to bottom, #353535, #252525)',
                    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.5)',
                    border: '4px solid #1a1a1a',
                    borderRadius: '12px',
                    padding: '0'
                  }}
                >
                  {/* Corpo do dispositivo */}
                  <div className="w-full h-full">
                    {/* Header metálico */}
                    <div className="h-12 w-full relative" 
                      style={{ 
                        background: 'linear-gradient(to right, #666, #888, #666)',
                        borderBottom: '2px solid #444'
                      }}>
                      <div className="absolute inset-0" 
                        style={{ 
                          background: 'repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(0,0,0,0.05) 2px, rgba(0,0,0,0.05) 4px)'
                        }}>
                      </div>
                      <div className="flex items-center justify-between h-full px-4">
                        <div className="text-white font-bold tracking-wider text-xl" 
                          style={{ 
                            fontFamily: 'monospace', 
                            textShadow: '0 1px 0 rgba(0,0,0,0.5)',
                            letterSpacing: '2px'
                          }}>MAGICBEAT</div>
                        <div className="text-white text-sm" 
                          style={{ 
                            fontFamily: 'monospace', 
                            letterSpacing: '1px'
                          }}>MODEL MT-606</div>
                      </div>
                      
                      {/* Parafusos */}
                      <div className="absolute -top-1 -left-1 w-4 h-4 bg-gray-800 rounded-full" 
                        style={{ 
                          border: '1px solid #111',
                          boxShadow: 'inset 0 0 2px rgba(255,255,255,0.2)'
                        }}></div>
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-gray-800 rounded-full" 
                        style={{ 
                          border: '1px solid #111',
                          boxShadow: 'inset 0 0 2px rgba(255,255,255,0.2)'
                        }}></div>
                    </div>
                    
                    {/* Display principal */}
                    <div className="p-6">
                      {/* Display LCD principal */}
                      <div className={`relative mb-6 p-1 ${visualBeat ? 'bg-amber-400' : ''}`} 
                        style={{ 
                          background: '#121212',
                          border: '4px solid #333',
                          borderRadius: '4px',
                          boxShadow: 'inset 0 0 10px rgba(0,0,0,0.8)'
                        }}>
                        <div className={`flex justify-between p-4 ${visualBeat ? 'bg-amber-400' : ''}`} 
                          style={{ 
                            background: visualBeat ? 'linear-gradient(to bottom, #fbbf24, #d97706)' : 'linear-gradient(to bottom, #f59e0b, #b45309)',
                            borderRadius: '2px',
                            transition: 'all 0.05s ease-in-out'
                          }}>
                          {/* Coluna 1: Batidas */}
                          <div className="text-center">
                            <div className="text-5xl font-mono font-bold text-black" 
                              style={{ 
                                textShadow: '0 1px 0 rgba(255,255,255,0.2)'
                              }}>
                              {formData.timeSignature ? formData.timeSignature.split('/')[0] : '4'}
                            </div>
                            <div className="text-xs font-bold text-black mt-1">BEATS</div>
                            
                            {/* Controles para batidas escondidos sob o display */}
                            <div className="flex justify-center space-x-1 mt-2">
                      <button
                        type="button"
                                onClick={() => {
                                  const currentTimeSignature = formData.timeSignature || '4/4';
                                  const [beats, subdivision] = currentTimeSignature.split('/').map(Number);
                                  const newBeats = Math.max(2, beats - 1);
                                  const newTimeSignature = `${newBeats}/${subdivision}`;
                                  
                                  // Atualizar a assinatura de tempo
                                  setFormData(prev => ({ ...prev, timeSignature: newTimeSignature }));
                                  
                                  // Se o metrônomo estiver tocando, realizar a transição suave
                                  if (isPlaying && audioContextRef.current) {
                                    // Resetar o contador de batidas para evitar problemas com a nova fórmula
                                    currentBeatRef.current = 0;
                                  }
                                }}
                                className="w-6 h-6 bg-black text-white rounded-sm flex items-center justify-center" 
                                style={{ 
                                  boxShadow: '0 1px 2px rgba(0,0,0,0.6), inset 0 1px rgba(255,255,255,0.1)'
                                }}>
                                –
                      </button>
                              <button
                                type="button"
                                onClick={() => {
                                  const currentTimeSignature = formData.timeSignature || '4/4';
                                  const [beats, subdivision] = currentTimeSignature.split('/').map(Number);
                                  const newBeats = Math.min(12, beats + 1);
                                  const newTimeSignature = `${newBeats}/${subdivision}`;
                                  
                                  // Atualizar a assinatura de tempo
                                  setFormData(prev => ({ ...prev, timeSignature: newTimeSignature }));
                                  
                                  // Se o metrônomo estiver tocando, realizar a transição suave
                                  if (isPlaying && audioContextRef.current) {
                                    // Resetar o contador de batidas para evitar problemas com a nova fórmula
                                    currentBeatRef.current = 0;
                                  }
                                }}
                                className="w-6 h-6 bg-black text-white rounded-sm flex items-center justify-center" 
                                style={{ 
                                  boxShadow: '0 1px 2px rgba(0,0,0,0.6), inset 0 1px rgba(255,255,255,0.1)'
                                }}>
                                +
                              </button>
                    </div>
                          </div>
                          
                          {/* Coluna 2: BPM */}
                          <div className="text-center flex-grow mx-2">
                            <div className="text-7xl font-mono font-bold text-black" 
                              style={{ 
                                textShadow: '0 1px 0 rgba(255,255,255,0.2)'
                              }}>
                <input
                                type="text"
                  id="bpm"
                  name="bpm"
                                value={formData.bpm || '120'}
                  onChange={handleChange}
                                className="bg-transparent text-black text-center w-full focus:outline-none"
                                style={{ 
                                  fontFamily: 'digital-7, monospace',
                                  maxWidth: '160px'
                                }}
                              />
                            </div>
                            <div className="text-xs font-bold text-black mt-1">TEMPO (BPM)</div>
                          </div>
                          
                          {/* Coluna 3: Subdivisão */}
                          <div className="text-center">
                            <div className="text-5xl font-mono font-bold text-black" 
                              style={{ 
                                textShadow: '0 1px 0 rgba(255,255,255,0.2)'
                              }}>
                              {formData.timeSignature ? formData.timeSignature.split('/')[1] : '4'}
                            </div>
                            <div className="text-xs font-bold text-black mt-1">DIV</div>
                            
                            {/* Controles para subdivisão */}
                            <div className="flex justify-center space-x-1 mt-2">
                      <button
                        type="button"
                                onClick={() => {
                                  const currentTimeSignature = formData.timeSignature || '4/4';
                                  const [beats, subdivision] = currentTimeSignature.split('/').map(Number);
                                  let newSubdivision;
                                  if (subdivision === 16) newSubdivision = 8;
                                  else if (subdivision === 8) newSubdivision = 4;
                                  else newSubdivision = 4;
                                  const newTimeSignature = `${beats}/${newSubdivision}`;
                                  
                                  // Atualizar a assinatura de tempo
                                  setFormData(prev => ({ ...prev, timeSignature: newTimeSignature }));
                                  
                                  // Se o metrônomo estiver tocando, realizar a transição suave
                                  if (isPlaying && audioContextRef.current) {
                                    // Resetar o contador de batidas para evitar problemas com a nova fórmula
                                    currentBeatRef.current = 0;
                                  }
                                }}
                                className="w-6 h-6 bg-black text-white rounded-sm flex items-center justify-center" 
                                style={{ 
                                  boxShadow: '0 1px 2px rgba(0,0,0,0.6), inset 0 1px rgba(255,255,255,0.1)'
                                }}>
                                –
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  const currentTimeSignature = formData.timeSignature || '4/4';
                                  const [beats, subdivision] = currentTimeSignature.split('/').map(Number);
                                  let newSubdivision;
                                  if (subdivision === 4) newSubdivision = 8;
                                  else if (subdivision === 8) newSubdivision = 16;
                                  else newSubdivision = 16;
                                  const newTimeSignature = `${beats}/${newSubdivision}`;
                                  
                                  // Atualizar a assinatura de tempo
                                  setFormData(prev => ({ ...prev, timeSignature: newTimeSignature }));
                                  
                                  // Se o metrônomo estiver tocando, realizar a transição suave
                                  if (isPlaying && audioContextRef.current) {
                                    // Resetar o contador de batidas para evitar problemas com a nova fórmula
                                    currentBeatRef.current = 0;
                                  }
                                }}
                                className="w-6 h-6 bg-black text-white rounded-sm flex items-center justify-center" 
                                style={{ 
                                  boxShadow: '0 1px 2px rgba(0,0,0,0.6), inset 0 1px rgba(255,255,255,0.1)'
                                }}>
                                +
                              </button>
                            </div>
                          </div>
                        </div>
                        
                        {/* Reflexo no display */}
                        <div className="absolute top-0 left-0 right-0 h-3" 
                          style={{ 
                            background: 'linear-gradient(to bottom, rgba(255,255,255,0.15), transparent)',
                            pointerEvents: 'none' 
                          }}></div>
                      </div>
                    
                      {/* Controles de ajuste fino BPM */}
                      <div className="grid grid-cols-8 gap-1 mb-6">
                        <button
                          type="button"
                          onClick={() => {
                            const currentBpm = parseInt(formData.bpm || '120');
                            setFormData(prev => ({ ...prev, bpm: `${Math.max(30, currentBpm - 10)}` }));
                          }}
                          className="btn-vintage" 
                          style={{ 
                            background: 'linear-gradient(to bottom, #333, #222)',
                            color: 'white',
                            border: '1px solid #111',
                            borderRadius: '4px',
                            padding: '5px 0',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.3), inset 0 1px rgba(255,255,255,0.1)',
                            fontWeight: 'bold',
                            fontSize: '0.8rem'
                          }}>
                          -10
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const currentBpm = parseInt(formData.bpm || '120');
                            setFormData(prev => ({ ...prev, bpm: `${Math.max(30, currentBpm - 5)}` }));
                          }}
                          className="btn-vintage" 
                          style={{ 
                            background: 'linear-gradient(to bottom, #333, #222)',
                            color: 'white',
                            border: '1px solid #111',
                            borderRadius: '4px',
                            padding: '5px 0',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.3), inset 0 1px rgba(255,255,255,0.1)',
                            fontWeight: 'bold',
                            fontSize: '0.8rem'
                          }}>
                          -5
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const currentBpm = parseInt(formData.bpm || '120');
                            setFormData(prev => ({ ...prev, bpm: `${Math.max(30, currentBpm - 2)}` }));
                          }}
                          className="btn-vintage" 
                          style={{ 
                            background: 'linear-gradient(to bottom, #333, #222)',
                            color: 'white',
                            border: '1px solid #111',
                            borderRadius: '4px',
                            padding: '5px 0',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.3), inset 0 1px rgba(255,255,255,0.1)',
                            fontWeight: 'bold',
                            fontSize: '0.8rem'
                          }}>
                          -2
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const currentBpm = parseInt(formData.bpm || '120');
                            setFormData(prev => ({ ...prev, bpm: `${Math.max(30, currentBpm - 1)}` }));
                          }}
                          className="btn-vintage" 
                          style={{ 
                            background: 'linear-gradient(to bottom, #333, #222)',
                            color: 'white',
                            border: '1px solid #111',
                            borderRadius: '4px',
                            padding: '5px 0',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.3), inset 0 1px rgba(255,255,255,0.1)',
                            fontWeight: 'bold',
                            fontSize: '0.8rem'
                          }}>
                          -1
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const currentBpm = parseInt(formData.bpm || '120');
                            setFormData(prev => ({ ...prev, bpm: `${Math.min(300, currentBpm + 1)}` }));
                          }}
                          className="btn-vintage" 
                          style={{ 
                            background: 'linear-gradient(to bottom, #333, #222)',
                            color: 'white',
                            border: '1px solid #111',
                            borderRadius: '4px',
                            padding: '5px 0',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.3), inset 0 1px rgba(255,255,255,0.1)',
                            fontWeight: 'bold',
                            fontSize: '0.8rem'
                          }}>
                          +1
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const currentBpm = parseInt(formData.bpm || '120');
                            setFormData(prev => ({ ...prev, bpm: `${Math.min(300, currentBpm + 2)}` }));
                          }}
                          className="btn-vintage" 
                          style={{ 
                            background: 'linear-gradient(to bottom, #333, #222)',
                            color: 'white',
                            border: '1px solid #111',
                            borderRadius: '4px',
                            padding: '5px 0',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.3), inset 0 1px rgba(255,255,255,0.1)',
                            fontWeight: 'bold',
                            fontSize: '0.8rem'
                          }}>
                          +2
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const currentBpm = parseInt(formData.bpm || '120');
                            setFormData(prev => ({ ...prev, bpm: `${Math.min(300, currentBpm + 5)}` }));
                          }}
                          className="btn-vintage" 
                          style={{ 
                            background: 'linear-gradient(to bottom, #333, #222)',
                            color: 'white',
                            border: '1px solid #111',
                            borderRadius: '4px',
                            padding: '5px 0',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.3), inset 0 1px rgba(255,255,255,0.1)',
                            fontWeight: 'bold',
                            fontSize: '0.8rem'
                          }}>
                          +5
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const currentBpm = parseInt(formData.bpm || '120');
                            setFormData(prev => ({ ...prev, bpm: `${Math.min(300, currentBpm + 10)}` }));
                          }}
                          className="btn-vintage" 
                          style={{ 
                            background: 'linear-gradient(to bottom, #333, #222)',
                            color: 'white',
                            border: '1px solid #111',
                            borderRadius: '4px',
                            padding: '5px 0',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.3), inset 0 1px rgba(255,255,255,0.1)',
                            fontWeight: 'bold',
                            fontSize: '0.8rem'
                          }}>
                          +10
                        </button>
                      </div>
                      
                      {/* Controles principais */}
                      <div className="grid grid-cols-3 gap-3">
                        {/* Botão TAP */}
                        <div className="text-center flex items-center justify-center">
                          <button
                            type="button"
                            onClick={handleTapTempo}
                            className="relative w-32 h-32 mx-auto rounded-full overflow-hidden"
                            style={{ 
                              background: tapping ? '#d97706' : 'linear-gradient(135deg, #f59e0b, #b45309)',
                              border: '3px solid #222',
                              boxShadow: '0 3px 6px rgba(0,0,0,0.4), inset 0 2px rgba(255,255,255,0.2)'
                            }}
                          >
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                              <Hand size={32} className={`text-white ${tapping ? 'animate-pulse' : ''}`} />
                              <div className="text-sm text-white font-bold mt-1">TAP</div>
                            </div>
                            
                            {/* Efeito de brilho na superfície */}
                            <div className="absolute top-0 left-0 right-0 h-12 opacity-30" 
                              style={{ 
                                background: 'linear-gradient(to bottom, rgba(255,255,255,0.6), transparent)',
                                borderRadius: '100% 100% 0 0',
                                transform: 'translateY(-50%) scale(1.5)'
                              }}></div>
                              
                            {/* Indicador de tap */}
                            {showTapIndicator && (
                              <div 
                                className={`absolute -top-6 left-1/2 transform -translate-x-1/2 px-3 py-1 rounded-full text-sm font-bold shadow-lg ${
                                  tapCount === 1 
                                  ? 'bg-cyan-500 text-black animate-pulse-fast' 
                                  : 'bg-orange-500 text-black animate-pulse-fast'
                                }`}
                                style={{
                                  animation: 'pulse 0.3s cubic-bezier(0,0,.2,1) infinite',
                                  boxShadow: '0 0 15px rgba(255,255,255,0.7)'
                                }}
                              >
                                {tapCount === 1 
                                  ? 'Batida 1' 
                                  : tapCount === 2 
                                    ? 'Batida 2' 
                                    : `Batida ${tapCount}`
                                }
                              </div>
                            )}
                      </button>
                        </div>
                        
                        {/* Controles de compasso */}
                        <div className="flex flex-col items-center">
                          <div className="grid grid-cols-2 gap-1 mb-1">
                            {TIME_SIGNATURES.slice(0, 4).map((ts) => (
                      <button
                                key={ts.value}
                        type="button"
                                onClick={() => {
                                  setFormData(prev => ({ ...prev, timeSignature: ts.value }));
                                  
                                  // Se o metrônomo estiver tocando, realizar a transição suave
                                  if (isPlaying && audioContextRef.current) {
                                    // Resetar o contador de batidas para evitar problemas com a nova fórmula
                                    currentBeatRef.current = 0;
                                  }
                                }}
                                className="p-1 text-sm font-bold"
                                style={{ 
                                  background: formData.timeSignature === ts.value 
                                    ? 'linear-gradient(to bottom, #f59e0b, #d97706)' 
                                    : 'linear-gradient(to bottom, #444, #333)',
                                  color: formData.timeSignature === ts.value ? 'black' : 'white',
                                  border: '1px solid #222',
                                  borderRadius: '3px',
                                  boxShadow: formData.timeSignature === ts.value 
                                    ? '0 1px 3px rgba(0,0,0,0.3)' 
                                    : 'inset 0 1px 2px rgba(0,0,0,0.3)'
                                }}
                              >
                                {ts.label}
                      </button>
                            ))}
                          </div>
                          <div className="grid grid-cols-2 gap-1">
                            {TIME_SIGNATURES.slice(4).map((ts) => (
                              <button
                                key={ts.value}
                                type="button"
                                onClick={() => {
                                  setFormData(prev => ({ ...prev, timeSignature: ts.value }));
                                  
                                  // Se o metrônomo estiver tocando, realizar a transição suave
                                  if (isPlaying && audioContextRef.current) {
                                    // Resetar o contador de batidas para evitar problemas com a nova fórmula
                                    currentBeatRef.current = 0;
                                  }
                                }}
                                className="p-1 text-sm font-bold"
                                style={{ 
                                  background: formData.timeSignature === ts.value 
                                    ? 'linear-gradient(to bottom, #f59e0b, #d97706)' 
                                    : 'linear-gradient(to bottom, #444, #333)',
                                  color: formData.timeSignature === ts.value ? 'black' : 'white',
                                  border: '1px solid #222',
                                  borderRadius: '3px',
                                  boxShadow: formData.timeSignature === ts.value 
                                    ? '0 1px 3px rgba(0,0,0,0.3)' 
                                    : 'inset 0 1px 2px rgba(0,0,0,0.3)'
                                }}
                              >
                                {ts.label}
                              </button>
                            ))}
                    </div>
                  </div>

                        {/* Botão Play/Stop */}
                        <div className="text-center flex items-center justify-center">
                          <button
                            type="button"
                            onClick={isPlaying ? stopMetronome : startMetronome}
                            className="relative w-32 h-32 mx-auto rounded-full overflow-hidden"
                            style={{ 
                              background: isPlaying 
                                ? 'linear-gradient(135deg, #dc2626, #991b1b)' 
                                : 'linear-gradient(135deg, #10b981, #059669)',
                              border: '3px solid #222',
                              boxShadow: '0 3px 6px rgba(0,0,0,0.4), inset 0 2px rgba(255,255,255,0.2)'
                            }}
                          >
                            <div className="absolute inset-0 flex items-center justify-center">
                              {isPlaying ? (
                                <Square size={32} className="text-white" />
                              ) : (
                                <svg viewBox="0 0 24 24" width="32" height="32" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                                  <polygon points="5 3 19 12 5 21 5 3"></polygon>
                                </svg>
                              )}
                            </div>
                            
                            {/* Efeito de brilho na superfície */}
                            <div className="absolute top-0 left-0 right-0 h-12 opacity-30" 
                              style={{ 
                                background: 'linear-gradient(to bottom, rgba(255,255,255,0.6), transparent)',
                                borderRadius: '100% 100% 0 0',
                                transform: 'translateY(-50%) scale(1.5)'
                              }}></div>
                          </button>
                        </div>
                      </div>
                      
                      {/* Controle de acentuação e mudo */}
                      <div className="mt-4 pt-3 border-t border-gray-700 flex justify-between items-center">
                        <div className="flex items-center">
                          <span className="text-white text-xs mr-2">ACCENT</span>
                          <div className="w-10 h-4 rounded-full bg-gray-800 relative cursor-pointer" 
                            onClick={() => setAccentFirstBeat(!accentFirstBeat)}
                            style={{
                              border: '1px solid #111'
                            }}>
                            <div className={`absolute top-0 bottom-0 my-auto rounded-full w-3 h-3 transition-all ${accentFirstBeat ? 'right-0.5 bg-amber-500' : 'left-0.5 bg-gray-500'}`}></div>
                          </div>
                          <span className="text-white text-xs ml-2">{accentFirstBeat ? '1ST' : 'OFF'}</span>
                        </div>
                        
                        {/* Novo controle de mudo */}
                        <div className="flex items-center">
                          <span className="text-white text-xs mr-2">MUTE</span>
                          <div className="w-10 h-4 rounded-full bg-gray-800 relative cursor-pointer" 
                            onClick={() => setIsMuted(!isMuted)}
                            style={{
                              border: '1px solid #111'
                            }}>
                            <div className={`absolute top-0 bottom-0 my-auto rounded-full w-3 h-3 transition-all ${isMuted ? 'right-0.5 bg-red-500' : 'left-0.5 bg-gray-500'}`}></div>
                          </div>
                          <span className="text-white text-xs ml-2">{isMuted ? 'ON' : 'OFF'}</span>
                        </div>
                        
                        <div className="flex items-center">
                          <div className={`w-2 h-2 ${isPlaying ? 'bg-green-500' : 'bg-red-500'} rounded-full mr-1`}></div>
                          <span className="text-white text-xs uppercase">{isPlaying ? 'Active' : 'Standby'}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Base do dispositivo */}
                    <div className="h-8 w-full" 
                      style={{ 
                        background: 'linear-gradient(to top, #252525, #353535)',
                        borderTop: '2px solid #444'
                      }}>
                      <div className="flex items-center justify-center h-full">
                        <div className="w-16 h-2 rounded-full"
                          style={{ 
                            background: 'linear-gradient(to right, #222, #333, #222)',
                            border: '1px solid #111'
                          }}></div>
                      </div>
                    </div>
                    
                    {/* Parafusos inferiores */}
                    <div className="absolute -bottom-1 -left-1 w-4 h-4 bg-gray-800 rounded-full" 
                      style={{ 
                        border: '1px solid #111',
                        boxShadow: 'inset 0 0 2px rgba(255,255,255,0.2)'
                      }}></div>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gray-800 rounded-full" 
                      style={{ 
                        border: '1px solid #111',
                        boxShadow: 'inset 0 0 2px rgba(255,255,255,0.2)'
                      }}></div>
                  </div>
                </div>

                {/* Link do YouTube - manter esta seção intacta */}
                <div className="bg-gray-800 border-2 border-purple-500 rounded-md shadow-lg px-4 py-3 flex flex-col justify-center">
                  <label className="block text-2xl font-bold text-center text-purple-400 mb-4">
                    Links do YouTube
                    </label>
                  
                  {/* Sistema de abas */}
                  <div className="border-b border-gray-700 mb-4">
                    <div className="flex items-center">
                      <div className="flex space-x-2">
                        {formData.youtubeLinks.map((link, index) => (
                        <button
                            key={index}
                          type="button"
                            onClick={() => switchToTab(index)}
                            className={`px-4 py-2 rounded-t-md text-sm font-medium ${
                              activeYoutubeTab === index
                              ? 'bg-purple-700 text-white'
                              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          }`}
                        >
                            Vídeo {index + 1}
                            {formData.youtubeLinks.length > 1 && (
                              <span 
                                className="ml-2 text-xs hover:text-red-400"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeYoutubeTab(index);
                                }}
                              >
                                ×
                              </span>
                            )}
                        </button>
                      ))}
                    </div>
                    
                      {/* Botão para adicionar nova aba */}
                      {formData.youtubeLinks.length < 6 && (
                      <button
                        type="button"
                          onClick={addYoutubeTab}
                          className="ml-2 p-1 rounded-full bg-gray-700 text-gray-300 hover:bg-purple-700 hover:text-white"
                          title="Adicionar link"
                        >
                          <span className="text-xl font-bold">+</span>
                      </button>
                      )}
                    </div>
                  </div>
                  
                  {/* Conteúdo da aba ativa */}
                  {formData.youtubeLinks.map((link, index) => (
                    <div 
                      key={index} 
                      className={`flex flex-col ${activeYoutubeTab === index ? 'block' : 'hidden'}`}
                    >
                      <input
                        type="text"
                        id={`youtubeLink-${index}-url`}
                        name={`youtubeLink-${index}-url`}
                        value={link.url}
                        onChange={handleChange}
                        className="bg-gray-900 text-white block w-full rounded-md border border-gray-700 shadow-sm py-3 px-4 focus:outline-none focus:ring-purple-500 focus:border-purple-500 text-lg"
                        placeholder="youtube.com/watch?v=..."
                      />
                      
                      <textarea
                        id={`youtubeLink-${index}-observacao`}
                        name={`youtubeLink-${index}-observacao`}
                        value={link.observacao}
                        onChange={handleChange}
                        rows={2}
                        className="mt-3 bg-gray-900 text-white block w-full rounded-md border border-gray-700 shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 text-sm"
                        placeholder="Observações sobre este vídeo..."
                      />
                      
                      {/* Visualizador de vídeo do YouTube */}
                      {activeYoutubeTab === index && youtubeVideoId && (
                        <div className="mt-4 aspect-video w-full overflow-hidden rounded-md border border-gray-700">
                          <iframe
                            src={`https://www.youtube.com/embed/${youtubeVideoId}`}
                            title="YouTube video player"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="w-full h-full"
                          ></iframe>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-3">
                  <label htmlFor="vs" className="block text-sm font-medium text-gray-200">
                    VS
                  </label>
                  <div className="bg-gray-900 p-4 rounded-md border border-gray-700">
                    <div className="mb-3">
                      <label htmlFor="nomeVs" className="block text-purple-400 font-medium text-sm mb-1">
                        Nome
                      </label>
                      <input
                        type="text"
                        id="nomeVs"
                        name="nomeVs"
                        value={formData.nomeVs || ''}
                        onChange={handleChange}
                        className="bg-gray-800 text-white mt-1 block w-full rounded-md border border-gray-700 shadow-sm py-1 px-2 focus:outline-none focus:ring-purple-500 focus:border-purple-500 text-sm"
                        placeholder="Nome do VS"
                      />
                    </div>
                    
                    <div className="mb-3">
                      <span className="text-purple-400 font-medium text-sm mb-2 block">Status</span>
                      <div className="grid grid-cols-3 gap-2">
                        <label htmlFor="vsAFazer" className="flex items-center text-sm text-gray-200">
                          <input
                            type="checkbox"
                            id="vsAFazer"
                            name="vsAFazer"
                            checked={formData.vsAFazer}
                            onChange={handleChange}
                            className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded mr-2"
                          />
                          A Fazer
                        </label>
                        <label htmlFor="vsFazendo" className="flex items-center text-sm text-gray-200">
                          <input
                            type="checkbox"
                            id="vsFazendo"
                            name="vsFazendo"
                            checked={formData.vsFazendo}
                            onChange={handleChange}
                            className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded mr-2"
                          />
                          Fazendo
                        </label>
                        <label htmlFor="vsFeito" className="flex items-center text-sm text-gray-200">
                          <input
                            type="checkbox"
                            id="vsFeito"
                            name="vsFeito"
                            checked={formData.vsFeito}
                            onChange={handleChange}
                            className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded mr-2"
                          />
                          Feito
                        </label>
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <label htmlFor="tempoTotalVs" className="block text-purple-400 font-medium text-sm mb-1">
                        Tempo Total
                      </label>
                      <input
                        type="text"
                        id="tempoTotalVs"
                        name="tempoTotalVs"
                        value={formData.tempoTotalVs || ''}
                        onChange={handleChange}
                        className="bg-gray-800 text-white mt-1 block w-full rounded-md border border-gray-700 shadow-sm py-1 px-2 focus:outline-none focus:ring-purple-500 focus:border-purple-500 text-sm"
                        placeholder="Ex: 5:30"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="observacaoVs" className="block text-purple-400 font-medium text-sm mb-1">
                        Observação
                      </label>
                      <textarea
                        id="observacaoVs"
                        name="observacaoVs"
                        rows={2}
                        value={formData.observacaoVs || ''}
                        onChange={handleChange}
                        className="bg-gray-800 text-white mt-1 block w-full rounded-md border border-gray-700 shadow-sm py-1 px-2 focus:outline-none focus:ring-purple-500 focus:border-purple-500 text-sm"
                        placeholder="Observações sobre o VS"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
            <div className="space-y-3">
                  <label htmlFor="linkLetra" className="block text-sm font-medium text-gray-200">
                    Letra
              </label>
                  <input
                    type="url"
                    id="linkLetra"
                    name="linkLetra"
                    value={formData.linkLetra || ''}
                onChange={handleChange}
                    className="bg-gray-900 text-white mt-1 block w-full rounded-md border border-gray-700 shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                    placeholder="https://..."
              />
            </div>

                <div className="space-y-3">
                  <label htmlFor="linkCifra" className="block text-sm font-medium text-gray-200">
                    Cifra
                  </label>
                  <input
                    type="url"
                    id="linkCifra"
                    name="linkCifra"
                    value={formData.linkCifra || ''}
                    onChange={handleChange}
                    className="bg-gray-900 text-white mt-1 block w-full rounded-md border border-gray-700 shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
                  <label htmlFor="linkMp3" className="block text-sm font-medium text-gray-200">
                    Mp3
              </label>
                  <input
                    type="url"
                    id="linkMp3"
                    name="linkMp3"
                    value={formData.linkMp3 || ''}
                onChange={handleChange}
                className="bg-gray-900 text-white mt-1 block w-full rounded-md border border-gray-700 shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                    placeholder="https://..."
              />
            </div>

            <div className="space-y-3">
                  <label htmlFor="linkVs" className="block text-sm font-medium text-gray-200">
                    Vs
                  </label>
                  <input
                    type="url"
                    id="linkVs"
                    name="linkVs"
                    value={formData.linkVs || ''}
                    onChange={handleChange}
                    className="bg-gray-900 text-white mt-1 block w-full rounded-md border border-gray-700 shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                    placeholder="https://..."
                  />
              </div>
            </div>

            {/* Seção: Observações */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-white border-b border-gray-700 pb-2">
                Observações
              </h3>
              
              <div className="space-y-3">
                <label htmlFor="observacoes" className="block text-sm font-medium text-gray-200">
                  Observações adicionais
              </label>
              <textarea
                id="observacoes"
                name="observacoes"
                rows={3}
                value={formData.observacoes || ''}
                onChange={handleChange}
                className="bg-gray-900 text-white mt-1 block w-full rounded-md border border-gray-700 shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                  placeholder="Adicione observações sobre a música"
              />
              </div>
            </div>

            <div className="flex justify-end pt-5">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Salvar Música
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 
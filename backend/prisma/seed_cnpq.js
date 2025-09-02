const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seedAreasCNPq() {
  console.log('Populando áreas do conhecimento CNPq...');
  
  try {
    // Limpar dados existentes
    await prisma.areaConhecimento.deleteMany({});
    console.log('Dados anteriores removidos...');
    
    // PASSO 1: Grandes áreas (nível 1)
    console.log('Criando grandes áreas...');
    const grandesAreas = [
      { id: 'ext', sigla: 'EXT', nome: 'Ciências Exatas e da Terra', nivel: 1 },
      { id: 'bio', sigla: 'BIO', nome: 'Ciências Biológicas', nivel: 1 },
      { id: 'eng', sigla: 'ENG', nome: 'Engenharias', nivel: 1 },
      { id: 'sau', sigla: 'SAU', nome: 'Ciências da Saúde', nivel: 1 },
      { id: 'agr', sigla: 'AGR', nome: 'Ciências Agrárias', nivel: 1 },
      { id: 'soc', sigla: 'SOC', nome: 'Ciências Sociais Aplicadas', nivel: 1 },
      { id: 'hum', sigla: 'HUM', nome: 'Ciências Humanas', nivel: 1 },
      { id: 'lla', sigla: 'LLA', nome: 'Linguística, Letras e Artes', nivel: 1 }
    ];

    for (const area of grandesAreas) {
      await prisma.areaConhecimento.create({
        data: area
      });
    }

    // PASSO 2: Áreas específicas (nível 2)
    console.log('Criando áreas específicas...');
    const areasEspecificas = [
      // Ciências Exatas e da Terra
      { id: 'mat', sigla: 'MAT', nome: 'Matemática', nivel: 2, paiId: 'ext' },
      { id: 'fis', sigla: 'FIS', nome: 'Física', nivel: 2, paiId: 'ext' },
      { id: 'qui', sigla: 'QUI', nome: 'Química', nivel: 2, paiId: 'ext' },
      { id: 'ccp', sigla: 'CCP', nome: 'Ciência da Computação', nivel: 2, paiId: 'ext' },
      { id: 'est', sigla: 'EST', nome: 'Estatística', nivel: 2, paiId: 'ext' },
      
      // Ciências Humanas
      { id: 'edu', sigla: 'EDU', nome: 'Educação', nivel: 2, paiId: 'hum' },
      { id: 'his', sigla: 'HIS', nome: 'História', nivel: 2, paiId: 'hum' },
      { id: 'geo2', sigla: 'GEO2', nome: 'Geografia', nivel: 2, paiId: 'hum' },
      { id: 'psi', sigla: 'PSI', nome: 'Psicologia', nivel: 2, paiId: 'hum' },
      { id: 'soci', sigla: 'SOCI', nome: 'Sociologia', nivel: 2, paiId: 'hum' },
      
      // Ciências Biológicas
      { id: 'bot', sigla: 'BOT', nome: 'Botânica', nivel: 2, paiId: 'bio' },
      { id: 'zoo', sigla: 'ZOO', nome: 'Zoologia', nivel: 2, paiId: 'bio' },
      { id: 'eco2', sigla: 'ECO2', nome: 'Ecologia', nivel: 2, paiId: 'bio' },
      { id: 'gen', sigla: 'GEN', nome: 'Genética', nivel: 2, paiId: 'bio' },
      
      // Engenharias
      { id: 'civ', sigla: 'CIV', nome: 'Engenharia Civil', nivel: 2, paiId: 'eng' },
      { id: 'ele', sigla: 'ELE', nome: 'Engenharia Elétrica', nivel: 2, paiId: 'eng' },
      { id: 'mec', sigla: 'MEC', nome: 'Engenharia Mecânica', nivel: 2, paiId: 'eng' },
      { id: 'equ', sigla: 'EQU', nome: 'Engenharia Química', nivel: 2, paiId: 'eng' },
      
      // Linguística, Letras e Artes
      { id: 'let', sigla: 'LET', nome: 'Letras', nivel: 2, paiId: 'lla' },
      { id: 'art', sigla: 'ART', nome: 'Artes', nivel: 2, paiId: 'lla' },
      { id: 'lin', sigla: 'LIN', nome: 'Linguística', nivel: 2, paiId: 'lla' }
    ];

    for (const area of areasEspecificas) {
      await prisma.areaConhecimento.create({
        data: area
      });
    }

    // PASSO 3: Subáreas (nível 3)
    console.log('Criando subáreas...');
    const subareas = [
      // Matemática
      { sigla: 'MAA', nome: 'Álgebra', nivel: 3, paiId: 'mat' },
      { sigla: 'MAN', nome: 'Análise', nivel: 3, paiId: 'mat' },
      { sigla: 'MAG', nome: 'Geometria e Topologia', nivel: 3, paiId: 'mat' },
      { sigla: 'MAM', nome: 'Matemática Aplicada', nivel: 3, paiId: 'mat' },
      
      // Educação
      { sigla: 'EFU', nome: 'Fundamentos da Educação', nivel: 3, paiId: 'edu' },
      { sigla: 'EEN', nome: 'Ensino-Aprendizagem', nivel: 3, paiId: 'edu' },
      { sigla: 'ECU', nome: 'Currículo', nivel: 3, paiId: 'edu' },
      { sigla: 'ETE', nome: 'Tecnologia Educacional', nivel: 3, paiId: 'edu' },
      
      // Letras
      { sigla: 'LLP', nome: 'Língua Portuguesa', nivel: 3, paiId: 'let' },
      { sigla: 'LLE', nome: 'Línguas Estrangeiras', nivel: 3, paiId: 'let' },
      
      // Artes
      { sigla: 'AVI', nome: 'Artes Visuais', nivel: 3, paiId: 'art' },
      { sigla: 'MUS', nome: 'Música', nivel: 3, paiId: 'art' },
      { sigla: 'TEA', nome: 'Teatro', nivel: 3, paiId: 'art' }
    ];

    for (const area of subareas) {
      await prisma.areaConhecimento.create({
        data: area
      });
    }

    const total = grandesAreas.length + areasEspecificas.length + subareas.length;
    console.log(`Sucesso! ${total} áreas criadas:`);
    console.log(`- ${grandesAreas.length} grandes áreas`);
    console.log(`- ${areasEspecificas.length} áreas específicas`);
    console.log(`- ${subareas.length} subáreas`);
    
  } catch (error) {
    console.error('Erro ao popular áreas:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedAreasCNPq();
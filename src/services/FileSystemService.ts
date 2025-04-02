export class FileSystemService {
  private static async callFileSystemApi(operation: string, path: string, content?: string) {
    try {
      const response = await fetch('/api/filesystem', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ operation, path, content }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      };
    }
  }

  /**
   * Verifica se um diretório existe e cria se não existir
   */
  static async ensureDirectoryExists(dirPath: string): Promise<{ success: boolean; error?: string }> {
    return this.callFileSystemApi('ensureDir', dirPath);
  }

  /**
   * Verifica se um arquivo existe
   */
  static async fileExists(filePath: string): Promise<boolean> {
    const result = await this.callFileSystemApi('fileExists', filePath);
    return result.exists;
  }

  /**
   * Cria um arquivo com o conteúdo especificado
   */
  static async createFile(filePath: string, content: string): Promise<{ success: boolean; error?: string }> {
    return this.callFileSystemApi('createFile', filePath, content);
  }

  /**
   * Verifica permissões de escrita em um diretório
   */
  static async checkWritePermission(dirPath: string): Promise<{ success: boolean; error?: string }> {
    return this.callFileSystemApi('checkWritePermission', dirPath);
  }

  /**
   * Valida a estrutura completa de um caminho
   */
  static async validatePath(basePath: string, pageName: string): Promise<{ 
    success: boolean; 
    paths?: { 
      pageDir: string; 
      componentsDir: string; 
      apiDir: string; 
    }; 
    error?: string 
  }> {
    try {
      const pageDir = `${basePath}/${pageName}`;
      const componentsDir = `${pageDir}/components`;
      const apiDir = `${pageDir}/api`;

      // Verificar/criar diretórios
      const dirs = [pageDir, componentsDir, apiDir];
      for (const dir of dirs) {
        const result = await FileSystemService.ensureDirectoryExists(dir);
        if (!result.success) {
          return result;
        }

        // Verificar permissões
        const permResult = await FileSystemService.checkWritePermission(dir);
        if (!permResult.success) {
          return permResult;
        }
      }

      return {
        success: true,
        paths: {
          pageDir,
          componentsDir,
          apiDir
        }
      };
    } catch (error) {
      return {
        success: false,
        error: `Erro ao validar estrutura de diretórios: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
      };
    }
  }
} 
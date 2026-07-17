// ============================================================================
// RESOLVER UPLOAD - Mutations para subida de archivos
// ============================================================================

import { IResolvers } from '@graphql-tools/utils';
import { FileUploadService, FileUploadConfig } from '../../../aplicacion/servicios/FileUploadService';
import { ErrorHandler } from './ErrorHandler';
import { getBucket } from '../../config/googleCloudStorage';

export class UploadResolver {
  getResolvers(): IResolvers {
    return {
      Mutation: {
        /**
         * Sube un archivo individual usando el FileUploadService
         */
        subirArchivo: async (_: unknown, args: { file: any; config: any }) => {
          return await ErrorHandler.handleError(
            async () => {
              const { file, config } = args;

              // Config del tipo + overrides + subcarpeta opcional
              const finalConfig = this.buildFinalConfig(config);

              // Usar el FileUploadService para subir el archivo
              const result = await FileUploadService.uploadGraphQLFile(file, finalConfig);
              
              return {
                url: result.url,
                filename: result.filename,
                originalName: result.originalName,
                size: result.size,
                mimetype: result.mimetype,
              };
            },
            'subirArchivo',
            { tipo: args.config.tipo }
          );
        },

        /**
         * Sube múltiples archivos en lote
         */
        subirMultiplesArchivos: async (_: unknown, args: { files: any[]; config: any }) => {
          return await ErrorHandler.handleError(
            async () => {
              const { files, config } = args;

              // Config del tipo + overrides + subcarpeta opcional
              const finalConfig = this.buildFinalConfig(config);

              // Usar el FileUploadService para subir múltiples archivos
              const result = await FileUploadService.uploadMultipleGraphQLFiles(files, finalConfig);
              
              return {
                successful: result.successful.map(file => ({
                  url: file.url,
                  filename: file.filename,
                  originalName: file.originalName,
                  size: file.size,
                  mimetype: file.mimetype,
                })),
                failed: result.failed.map(error => ({
                  filename: error.file?.name || 'unknown',
                  error: error.error,
                })),
              };
            },
            'subirMultiplesArchivos',
            { 
              tipo: args.config.tipo,
              cantidadArchivos: args.files.length 
            }
          );
        },

        /**
         * Elimina un archivo del storage
         */
        eliminarArchivo: async (_: unknown, args: { url: string }) => {
          return await ErrorHandler.handleError(
            async () => {
              const { url } = args;
              
              // Extraer el path del archivo desde la URL
              const urlObj = new URL(url);
              const bucket = getBucket();
              const bucketName = bucket.name;
              const fileName = urlObj.pathname.slice(bucketName.length + 2); // Remover /bucket/ del path
              
              // Usar el FileUploadService para eliminar el archivo
              try {
                await FileUploadService.deleteFile(fileName);
              } catch (error) {
                // Si el archivo no existe, considerarlo como éxito (ya está eliminado)
                if (!(error instanceof Error) || !error.message.includes('No such object')) {
                  throw error;
                }
              }
              
              return true;
            },
            'eliminarArchivo',
            { url: args.url }
          );
        },
      },

      Query: {
        /**
         * Obtiene la configuración de subida para un tipo específico
         */
        obtenerUploadConfig: async (_: unknown, args: { tipo: string }) => {
          return await ErrorHandler.handleError(
            async () => {
              const config = this.getUploadConfigByTipo(args.tipo);
              return {
                maxFileSize: config.maxFileSize || 10 * 1024 * 1024, // 10MB por defecto
                allowedTypes: config.allowedMimeTypes || [],
                accept: this.getAcceptString(config.allowedMimeTypes || []),
              };
            },
            'obtenerUploadConfig',
            { tipo: args.tipo }
          );
        },
      },
    };
  }

  /**
   * Construye la config final: config del tipo + overrides del cliente +
   * subcarpeta opcional (sanitizada) anexada a la carpeta base.
   */
  private buildFinalConfig(config: any): FileUploadConfig {
    const base = this.getUploadConfigByTipo(config.tipo);
    const finalConfig: FileUploadConfig = {
      ...base,
      ...(config.maxFileSize && { maxFileSize: config.maxFileSize }),
      ...(config.allowedTypes && { allowedMimeTypes: config.allowedTypes }),
    };
    const sub = this.sanitizarSubcarpeta(config.subcarpeta);
    if (sub) {
      finalConfig.folder = `${base.folder}/${sub}`;
    }
    return finalConfig;
  }

  /** Deja solo [a-z0-9_-] para evitar traversal/paths raros en el bucket. */
  private sanitizarSubcarpeta(value: unknown): string {
    return String(value ?? '')
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9_-]/g, '')
      .slice(0, 64);
  }

  /**
   * Obtiene la configuración predefinida según el tipo de archivo
   */
  private getUploadConfigByTipo(tipo: string): FileUploadConfig {
    switch (tipo.toUpperCase()) {
      case 'CV_DOCUMENTOS':
        return FileUploadService.CV_DOCUMENTOS_CONFIG;
      case 'FOTOS_CANDIDATO':
        return FileUploadService.FOTOS_CANDIDATO_CONFIG;
      case 'EVIDENCIAS_ENTREVISTA':
        return FileUploadService.EVIDENCIAS_ENTREVISTA_CONFIG;
      case 'COMENTARIOS':
        return FileUploadService.COMENTARIOS_CONFIG;
      case 'DOCUMENTOS_CONVOCATORIA':
        return FileUploadService.DOCUMENTOS_CONVOCATORIA_CONFIG;
      case 'IMAGENES':
        return FileUploadService.IMAGENES_CONFIG;
      default:
        // Configuración por defecto
        return FileUploadService.IMAGENES_CONFIG;
    }
  }

  /**
   * Convierte array de MIME types a string aceptado por input file
   */
  private getAcceptString(mimeTypes: string[]): string {
    return mimeTypes.map(mime => {
      if (mime.startsWith('image/')) return 'image/*';
      if (mime === 'application/pdf') return '.pdf';
      if (mime.includes('word')) return '.doc,.docx';
      if (mime.includes('excel')) return '.xls,.xlsx';
      return mime;
    }).join(',');
  }
}

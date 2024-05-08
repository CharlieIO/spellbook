export interface ILlmService {
  generateDescriptionForClass(className: string): Promise<string>;
}

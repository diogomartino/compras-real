import type { TScrappedData } from '@myapp/shared';

interface IScrapper {
  id: ScrapperId;
  baseUrl: string;
  scrap(url: string): Promise<TScrappedData>;
}

enum ScrapperId {
  CONTINENTE = 'continente'
}

export { ScrapperId };
export type { IScrapper };

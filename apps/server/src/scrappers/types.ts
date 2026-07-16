import { ScrapperId } from '@myapp/shared';
import z from 'zod';

const scrappedProduct = z.object({
  name: z.string(),
  imageUrl: z.url(),
  category: z.string().optional()
});

interface IScrapper {
  id: ScrapperId;
  baseUrl: string;
  scrap(url: string): Promise<TScrappedProduct>;
  search?(query: string): Promise<TSearchProduct[]>;
}

type TScrappedProduct = z.infer<typeof scrappedProduct>;
type TSearchProduct = TScrappedProduct & {
  source: ScrapperId;
  url: string | null;
};

export { ScrapperId, scrappedProduct };
export type { IScrapper, TScrappedProduct, TSearchProduct };

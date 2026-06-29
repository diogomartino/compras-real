import z from 'zod';

const scrappedProduct = z.object({
  name: z.string(),
  imageUrl: z.url(),
  category: z.string().optional(),
});

interface IScrapper {
  id: ScrapperId;
  baseUrl: string;
  scrap(url: string): Promise<TScrappedProduct>;
}

enum ScrapperId {
  CONTINENTE = 'continente'
}

type TScrappedProduct = z.infer<typeof scrappedProduct>;

export { ScrapperId, scrappedProduct };
export type { IScrapper, TScrappedProduct };

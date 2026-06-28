import type { TScrappedData } from '@myapp/shared';
import { ScrapperId, type IScrapper } from './types';

class ContinenteScrapper implements IScrapper {
  public id = ScrapperId.CONTINENTE;
  public baseUrl = 'https://www.continente.pt';

  public scrap = async (): Promise<TScrappedData> => {
    return {
      title: 'Gelado Chocolate Clássico, Amêndoa e Chocolate Branco Magnum',
      imageUrl:
        'https://www.continente.pt/dw/image/v2/BDVS_PRD/on/demandware.static/-/Sites-col-master-catalog/default/dw72a43b6a/images/col/797/7975649-frente.png?sw=2000&sh=2000'
    };
  };
}

export { ContinenteScrapper };

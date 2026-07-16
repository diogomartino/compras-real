import { scrapSearch } from './scrappers';

const query = 'coca cola';

const results = await scrapSearch(query);

console.log(results);

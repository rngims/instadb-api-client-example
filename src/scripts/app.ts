import { fetchIndexData } from "../lib/apiclient.js";

console.log('app start');


const query = `select * from market_person_20240813 where (first_name = 'john')`;

const result = await fetchIndexData({ query });



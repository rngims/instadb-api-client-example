import { csvToObjectArray, downloadFile, fetchDataAndCreateCsvAsync, fetchIndexData, getIndexDetails } from "../lib/apiclient.js";

// npm run queryx csv
let csv = process.argv[2] === 'csv' ? true : false;
let csvtojson = process.argv[2] === 'csvtojson' ? true : false;
if( csvtojson ) {
	csv = true;
}
// console.log('csv: ', csv);
// console.log('csvtojson: ', csvtojson);

const results = await getIndexDetails();
console.log('results: ', results);




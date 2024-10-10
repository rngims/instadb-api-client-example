import { csvToObjectArray, downloadFile, fetchDataAndCreateCsvAsync, fetchIndexData } from "../lib/apiclient.js";

// npm run queryx csv
let csv = process.argv[2] === 'csv' ? true : false;
let csvtojson = process.argv[2] === 'csvtojson' ? true : false;
if( csvtojson ) {
	csv = true;
}
// console.log('csv: ', csv);
// console.log('csvtojson: ', csvtojson);

let query = `select * from intellizence where (company_type in ('private', 'public') and announceddate between '2023-10-01' and '2024-09-30' and amount > '500000' and company_industries like '%technology%' and investors like '%ventures%' and fundinground not in ('series a', 'series c', 'series d', 'series b'))`;

if( csv ) {
	const results = await fetchDataAndCreateCsvAsync({ query });
	console.log('results: ', results);

	if(!results.success) {
		console.log('CSV generation failed. ');
	}

	// fetch csv
	if(results.files  && results.files?.length > 0) {
		results.files.forEach(async (val, idx) => {
			const dlfile_endpoint = val;
			const dl_result = await downloadFile(dlfile_endpoint);
			console.log(`dl_result: `, dl_result);

			if(csvtojson && dl_result.success) {
				const records = await csvToObjectArray(dl_result.download_path);
				console.log(`'${dl_result.download_path}' parsed to ${records.length} object array records.`);

				// console.log(records);
			}
		});
	}
	else {
		console.log('no CSV files generated. ')
	}

}
else {
	const results = await fetchIndexData({ query, batchsize: 1000, });
	// console.log('results: ', results);
	console.log('results returned: ', results?.length);

	// output first 2 records as an example
	if(results?.length && results?.length > 1) {
		const firstTwo = [ results[0], results[1] ];
		console.log('firstTwo returned: ', firstTwo);	
	}
}


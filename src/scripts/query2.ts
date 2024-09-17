import { downloadFile, fetchDataAndCreateCsvAsync, fetchIndexData } from "../lib/apiclient.js";

// npm run queryx csv
const csv = process.argv[2] === 'csv' ? true : false;
console.log('csv: ', csv);

let query = `-- fill in query`;

if( csv ) {
	const results = await fetchDataAndCreateCsvAsync({ query });
	console.log('results: ', results);

	if(!results.success) {
		console.log('CSV generation failed. ');
	}

	// fetch csv
	if(results.files  && results.files?.length > 0) {
		results.files.forEach((val, idx) => {
			const dlfile_endpoint = val;
			downloadFile(dlfile_endpoint);
		});
	}
	else {
		console.log('no CSV files generated. ')
	}

}
else {
	const results = await fetchIndexData({ query, batchsize: 1000, });
	console.log('results: ', results);
}



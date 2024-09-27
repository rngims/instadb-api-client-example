import csvParser from "csv-parser";
import { FetchDataAndCreateCsvAsyncResponse } from "./models/FetchDataAndCreateCsvAsyncResponse.js";
import { FetchIndexDataRequest } from "./models/FetchIndexDataRequest.js";
import { FetchIndexDataResponse } from "./models/FetchIndexDataResponse.js";
import { TabularResult } from "./models/TabularResult.js";
import { existsSync, mkdirSync, createReadStream } from 'node:fs';
import { writeFile } from 'node:fs/promises';

export async function fetchIndexData(input: FetchIndexDataRequest) {
	const HOST_API = process.env.HOST_API || '';
	const API_ACCESS_JWT = process.env.API_ACCESS_JWT || '';
	const endpoint = `${HOST_API}/FetchIndexData`;
	const batchsize = input.batchsize || 10;

	if(!HOST_API) {
		throw Error('missing HOST_API');
	}
	if(!API_ACCESS_JWT) {
		throw Error('missing API_ACCESS_JWT');
	}
	if(!input.query) {
		throw Error('missing query');
	}

	const payload = input;

	console.log('endpoint: ', endpoint);
	console.log('payload: ', payload);

	const response = await fetch(endpoint, {
		method: 'post',
		body: JSON.stringify(payload),
		headers: {
			'Content-Type': 'application/json',
			'Accept': 'application/json',
			'Authorization': `Bearer ${API_ACCESS_JWT}`,
		}
	})

	console.log('response.status: ', response.status);
	console.log('response.statusText: ', response.statusText);

	const data = await response.json() as FetchIndexDataResponse;
	console.log('data.recordcount: ', data.recordcount);

	if(data.recordcount === 0) {
		console.log('no results');
		return;
	}

	const results = convertApiResultToObjectArray(data?.instantjsonsresult, false)

	return results;
}

export async function fetchDataAndCreateCsvAsync(input: FetchIndexDataRequest) {
	const HOST_API = process.env.HOST_API || '';
	const API_ACCESS_JWT = process.env.API_ACCESS_JWT || '';
	const endpoint = `${HOST_API}/FetchDataAndCreateCsvAsync`;

	if(!HOST_API) {
		throw Error('missing HOST_API');
	}
	if(!API_ACCESS_JWT) {
		throw Error('missing API_ACCESS_JWT');
	}
	if(!input.query) {
		throw Error('missing query');
	}

	const payload = input;

	console.log('endpoint: ', endpoint);
	console.log('payload: ', payload);

	const response = await fetch(endpoint, {
		method: 'post',
		body: JSON.stringify(payload),
		headers: {
			'Content-Type': 'application/json',
			'Accept': 'application/json',
			'Authorization': `Bearer ${API_ACCESS_JWT}`,
		}
	})

	console.log('response.status: ', response.status);
	console.log('response.statusText: ', response.statusText);

	const data = await response.json() as FetchDataAndCreateCsvAsyncResponse;
	console.log('data.recordcount: ', data.recordcount);

	return data;
}

export async function downloadFile(endpoint: string) {
	const HOST_API = process.env.HOST_API || '';
	const API_ACCESS_JWT = process.env.API_ACCESS_JWT || '';
	const DOWNLOAD_DIR = process.env.DOWNLOAD_DIR || 'downloads';

	if(!HOST_API) {
		throw Error('missing HOST_API');
	}
	if(!API_ACCESS_JWT) {
		throw Error('missing API_ACCESS_JWT');
	}
	if(!downloadFile) {
		throw Error('missing downloadFile');
	}

	// const endpoint = `${HOST_API}/DownloadFile?filePath=${filePath}`;
	console.log('endpoint: ', endpoint);

	const response = await fetch(endpoint, {
		method: 'get',
		headers: {
			'Accept': 'application/json',
			'Authorization': `Bearer ${API_ACCESS_JWT}`,
		}
	})

	console.log('response.status: ', response.status);
	console.log('response.statusText: ', response.statusText);

	const buf = await response.arrayBuffer();
	const buffer = Buffer.from(buf);
	const contentdisposition = response.headers.get('content-disposition');
	// console.log('content-disposition: ', contentdisposition);
	const cdfn_regex = /\s(filename=([\w\-_]+\.csv);)\s/;
	const matches = contentdisposition?.match(cdfn_regex);
	const filename = matches?.[2] || 'unknown.csv';

	const returnVal = {
		success: false,
		download_path: '',
	}

	if(filename && buf) {
		if(!existsSync(DOWNLOAD_DIR)) {
			console.log(`mkdir '${DOWNLOAD_DIR}'`);
			mkdirSync(DOWNLOAD_DIR);
		}

		const dl_path = `${DOWNLOAD_DIR}/${filename}`;
		try {
			await writeFile(dl_path, buffer);
			returnVal.success = true;
			returnVal.download_path = dl_path;
			console.log(`file '${dl_path}' saved.`);
		}
		catch(err) {
			console.log('error: ', err);
		}
	}
	return returnVal;
}

function convertApiResultToObjectArray(responseJson: string, createId: boolean) {
	const obj = JSON.parse(responseJson) as TabularResult;

	if(!obj.columns) {
		throw Error('invalid columns');
	}

	const dataRows = obj.rows.map((row, rowindex) => {
		const rowData: {[key: string] : string } = {};
		row.forEach((cell, index) => {
			const key = obj.columns[index]?.name || '';
			if(key) {
				rowData[key] = cell;
			}
		});
		if (createId) {
			return { id: rowindex, ...rowData };
		}
		return rowData;
	});
	return dataRows || [];
};

export async function csvToRecordCallback(csvFilepath: string, recordCallback: Function) {
	// console.log(`csvToRecordCallback(${csvFilepath}), recordCallback`);
	let i = 0;
	
	return new Promise(function(resolve,reject) {
		createReadStream(csvFilepath)
		.pipe(csvParser())
		.on("data", (data) => {
			i++;
			recordCallback(data, i);
		})
		.on("end", () => {
			console.log(`csv processing complete '${csvFilepath}'`);
			resolve({ records: i });
		})
		.on('error', reject);
	});
}

export async function csvToObjectArray(csvFilepath: string) {
	// console.log(`csvToObjectArray(${csvFilepath})`);
	let records: Array<{[key: string]: string}> = [];
	const recordCallback = (item: {[key: string]: string}, idx: number) => {
		// console.log(`recordCallback(item, ${idx})`);
		records.push(item);
		// console.log(item);
	};
	const rv = await csvToRecordCallback(csvFilepath, recordCallback);
	// console.log('rv: ', rv);
	return records;
}

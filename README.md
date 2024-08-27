
# instadb-api-client-example

Sample client code in TypeScript / Javascript for the InstaDB API.

# installing 

The example was coded with [NodeJS](https://nodejs.org/en) v20.

```
git clone https://github.com/rngims/instadb-api-client-example.git
cd ./instadb-api-client-example
npm install
```

Copy the .env.example file to .env, and fill in your values for HOST_API and API_ACCESS_JWT, 
as supplied by IMS.

`cp .env.example .env`

# .env file /  environment variables

After onboarding, your API url and access token will be provided to you. 

### HOST_API

InstaDB API url

### API_ACCESS_JWT

InstaDB access token

### DOWNLOAD_DIR

Where the CSV file gets saved locally. 

defaults to ./downloads

# query example

from [src/scripts/query1.ts](./src/scripts/query1.ts)

```
import { downloadFile, fetchDataAndCreateCsvAsync, fetchIndexData } from "../lib/apiclient.js";

// npm run queryx csv
const csv = process.argv[2] === 'csv' ? true : false;
console.log('csv: ', csv);

let query = `select * from universal_person where (personal_state in ('hi') and personal_emails_validation_status in ('valid (catch-all)') and homeowner in ('y') and children in ('y'))`;

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
```

# running example

API call examples are in ./src/scripts/*.ts

You may modify the query SQL as desired. 

Note that the TypeScript .ts files get compiled to Javascript and then run. 

`npm run query1`

returns results in JSON for further use. 

`npm run query1 csv`

generates a CSV file on the server then downloads locally for use. 


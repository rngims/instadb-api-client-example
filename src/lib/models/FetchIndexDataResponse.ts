export class FetchIndexDataResponse {
	success: boolean | null | undefined;
	timespan: number | null | undefined; // ms
	message: string | null | undefined;
	recordcount: number | null | undefined;
	instantjsonsresult: string = ''; // JSON

	public constructor(init?:Partial<FetchIndexDataResponse>) {
			Object.assign(this, init);
	}
}

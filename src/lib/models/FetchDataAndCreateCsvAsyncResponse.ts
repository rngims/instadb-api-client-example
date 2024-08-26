export class FetchDataAndCreateCsvAsyncResponse {
	success: boolean | null | undefined;
	timespan: number | null | undefined; // ms
	message: string | null | undefined;
	recordcount: number | null | undefined;
	files: string[] | null | undefined;

	public constructor(init?:Partial<FetchDataAndCreateCsvAsyncResponse>) {
			Object.assign(this, init);
	}
}

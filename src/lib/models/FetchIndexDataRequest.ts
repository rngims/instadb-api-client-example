export class FetchIndexDataRequest {
	query: string | undefined | null;
	queryid?: string | undefined | null;
	scheduleid?: string | undefined | null;
	batchsize?: number = 1000;

	public constructor(init?:Partial<FetchIndexDataRequest>) {
			Object.assign(this, init);
	}
}

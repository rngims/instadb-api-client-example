export class IndexDetailsSimple {
	indexName: string | null | undefined;
	alias: string | null | undefined;
	friendlyName: string | null | undefined;
	tableGroup: string | null | undefined;

	public constructor(init?:Partial<IndexDetailsSimple>) {
			Object.assign(this, init);
	}
}

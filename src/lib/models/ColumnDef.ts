export class ColumnDef {
	name: string | undefined | null;
	type: string | undefined | null;

	public constructor(init?:Partial<ColumnDef>) {
			Object.assign(this, init);
	}
}

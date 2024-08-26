import { ColumnDef } from "./ColumnDef.js";

export class TabularResult {
	columns: Array<ColumnDef> = [];
	rows: Array<Array<string>> = [];

	public constructor(init?:Partial<TabularResult>) {
			Object.assign(this, init);
	}
}

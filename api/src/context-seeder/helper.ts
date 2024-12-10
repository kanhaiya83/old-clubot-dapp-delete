export type FieldMapping<T, U> = {
	[K in keyof T]: keyof U;
};

export function convertArray<T, U>(
	data: T[],
	fieldMapping: FieldMapping<T, U>
): U[] {
	return data.map((item) => {
		const newItem = {} as U;
		for (const key in fieldMapping) {
			if (fieldMapping.hasOwnProperty(key)) {
				const newKey = fieldMapping[key];
				(newItem as any)[newKey] = item[key as keyof T];
			}
		}
		return newItem;
	});
}

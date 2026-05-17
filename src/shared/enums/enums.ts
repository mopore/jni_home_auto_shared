export const enums = {
	/**
	 * This function is used to convert a string to an enum value.
	 * It will throw an error if the conversion fails. 
	 * @param enumObj The enum type with a string to convert to
	 * @param value The string to convert to enum
	 * @returns The enum value
	 */
	to: <E extends { [s: string]: string }>(
		enumObj: E, 
		value: string
	): E[keyof E] => {
		const enumValues = Object.values(enumObj);
		if (enumValues.includes(value)) {
			return value as unknown as E[keyof E];
		}
		const errMsg = `Could not convert "${value}" to enum value`;
		throw new Error(errMsg);
	},

	/**
	 * This function is used to convert a string to an enum value.
	 * It will throw an error if the conversion fails. 
	 * @param enumObjA The A enum type with string values to convert to
	 * @param enumObjB The B enum type with string values to convert to
	 * @param value The string to convert to enum
	 * @returns The enum value
	 */
	toAB: <A extends { [s: string]: string }, B extends { [s: string]: string }>(
		enumObjA: A,
		enumObjB: B,
		value: string
	): A[keyof A] | B[keyof B] => {
		const valuesA = Object.values(enumObjA);
		const valuesB = Object.values(enumObjB);

		if (valuesA.includes(value)) {
			return value as unknown as A[keyof A];
		} else if (valuesB.includes(value)) {
			return value as unknown as B[keyof B];
		}

		const errMsg = `Could not convert "${value}" to enum value`;
		throw new Error(errMsg);
	},
}
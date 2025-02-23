import { assert } from 'chai';
import { enums } from '../src/shared/enums/enums.js';

enum AEnum {
	A1 = "A1",
	A2 = "A2",
	A3 = "A3",
}

enum BEnum { // We want to avoid enums with integer values
	B1,
	B2,
	B3,
}

enum CEnum {
	C1 = "C1",
	C2 = "C2",
	C3 = "C3",
}

describe("enums package", () => {
	it("returns enum value", () => {
		assert.equal(enums.to(AEnum, "A1"), AEnum.A1);
		assert.equal(enums.to(AEnum, "A2"), AEnum.A2);
		assert.equal(enums.to(AEnum, "A3"), AEnum.A3);

		const aEnumFromUppercased = enums.to(AEnum, "A1".toUpperCase());
		assert.equal(AEnum.A1, aEnumFromUppercased);

		// const bEnumFromString = enums.to(BEnum, "B2"); // Will not compile!
	});

	it("returns enum value from multiple enums", () => {
		assert.equal(enums.toAB(AEnum, CEnum, "A1"), AEnum.A1);
		assert.equal(enums.toAB(AEnum, CEnum, "A2"), AEnum.A2);
		assert.equal(enums.toAB(AEnum, CEnum, "A3"), AEnum.A3);

		assert.equal(enums.toAB(AEnum, CEnum, "C1"), CEnum.C1);
		assert.equal(enums.toAB(AEnum, CEnum, "C2"), CEnum.C2);
		assert.equal(enums.toAB(AEnum, CEnum, "C3"), CEnum.C3);

		const aEnumFromUppercased = enums.toAB(AEnum, CEnum, "a1".toUpperCase());
		assert.equal(AEnum.A1, aEnumFromUppercased);

		const cEnumFromUppercased = enums.toAB(AEnum, CEnum, "c1".toUpperCase());
		assert.equal(CEnum.C1, cEnumFromUppercased);

		// const cEnumFromString = enums.toAB(AEnum, BEnum, "C2"); // Will not compile!
	});


});
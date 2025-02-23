import { assert } from "chai";
import { Option, none, optionalDefined, some } from "../src/shared/optional/optional.js";

const someWithOptionDefined = (): Option<string> => optionalDefined("some");
const optionWithSome = (): Option<string> => some("some");
const optionWithNone = (): Option<string> => none();

describe("optional package", () => {
	it("optionaldefined function returns option with some", () => {
		assert.isTrue(someWithOptionDefined().isSome());
		assert.isFalse(someWithOptionDefined().isNone());
		const someString = someWithOptionDefined().unwrap();
		assert.equal(someString, "some");
	});

	it("option created with 'some' returns option with some", () => {
		assert.isTrue(optionWithSome().isSome());
		assert.isFalse(optionWithSome().isNone());
		const someString = optionWithSome().unwrap();
		assert.equal(someString, "some");
	});

	it("option created with none returns option with none", () => {
		assert.isTrue(optionWithNone().isNone());
		assert.isFalse(optionWithNone().isSome());
		assert.throws( () => optionWithNone().unwrap());
	})
});

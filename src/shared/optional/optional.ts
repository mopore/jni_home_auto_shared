import { log } from "../logger/log.js";

export abstract class Option<T> {
	abstract isNone(): boolean;
	abstract isSome(): boolean;
	abstract unwrap(): T;
	abstract unwrapOr(defaultValue: T): T;
	abstract unwrapExpect(errMessage: string): T;
}

export class None<T> extends Option<T> {

	_type = 'none' as const;

	isNone(): this is None<T> {
		return true;
	}

	isSome(): this is Some<T> {
		return false;
	}

	unwrap(): T {
		const errMessageOut = "Unwrap failed option";
		log.error(errMessageOut);
		log.trace();
		throw new Error(errMessageOut);
	}

	unwrapOr(defaultValue: T): T {
		return defaultValue;
	}

	unwrapExpect(errMessage: string): T {
		const errMessageOut = `Unwrap failed: ${errMessage}`;
		log.error(errMessageOut);
		log.trace();
		throw new Error(errMessageOut);
	}
}

export class Some<T> extends Option<T> {
	_type = 'some' as const;

	constructor(public value: T) {
		super();
	}

	isNone(): this is None<T> {
		return false;
	}

	isSome(): this is Some<T> {
		return true;
	}

	unwrap(): T {
		return this.value;
	}

	unwrapOr(_defaultValue: T): T {
		if (this.isNone()){
			return _defaultValue;
		}
		return this.value;
	}

	unwrapExpect(_errMessage: string): T {
		if (this.isNone()){
			const errMessageOut = `Unwrap failed, expected: ${_errMessage}`;
			log.error(errMessageOut);
			log.trace();
			throw new Error(errMessageOut);
		}
		return this.value;
	}
}

export const none = <T>(): None<T> => new None<T>();
export const some = <T>(value: T): Some<T> => new Some(value);


export function optionalCatch<T>(fn: () => T): Option<T> {
	try {
		return some(fn());
	} catch {
		return none();
	}
}

export async function optionalResolve<T>(promise: Promise<T>): Promise<Option<T>> {
	try {
		return some(await promise);
	} catch {
		return none();
	}
}

function toOptional<I, O extends I>(fn: (input: I) => input is O) {
	return function(arg: I): Option<O> {
		try{
			if (fn(arg)) {
				return some(arg);
			}
			return none();
		} catch {
			return none();
		}
	}
}

export const optionalDefined = toOptional(<T>(arg: T | undefined | null): arg is T => arg != null);


// /*
//  * Example usage of optional functions
//  */
// function getTimeDiff(arr: Array<Date>): number {
// 	const start = optionalDefined(arr[0]);
// 	const end = optionalDefined(arr[1]);

// 	const startVal = start.unwrapExpect("Start date is not defined").valueOf();
// 	const endVal = end.unwrapOr(new Date()).valueOf();

// 	return endVal - startVal;
// }

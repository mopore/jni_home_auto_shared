import { log } from "./logger/log.js";

export function parseEnvVariable(envName: string): string{
	const envRawValue = process.env[envName];
	let envValue: string;
	try {
		envValue = String(envRawValue ?? "");
		if (envValue.trim().length === 0 ){
			throw new Error( `Value for environment variable "${envName}" not set.`);
		}
		return envValue;
	}
	catch (error) {
		const errorMessage = `Could not parse environment variable "${envName}": ${error}`;
		console.error(errorMessage);
		console.trace();
		throw new Error(errorMessage);
	}
}

export const sleepAsync = async (ms: number): Promise<void> => {
	return new Promise(resolve => setTimeout(resolve, ms))
};

export const managedCallAsync = async <T>(
	func: () => Promise<T>,
	retryCount: number,
	retryDelayMs: number,
): Promise<T> => {
	for (let i = 0; i <= retryCount; i++){
		try {
			return await func();
		}
		catch (err: unknown){
			log.warn(`Call failed. Retrying in ${retryDelayMs} ms. Error: ${err}`);
			await sleepAsync(retryDelayMs);
		}
	}
	const errorMessage = `Call failed after ${retryCount}`;
	log.error(errorMessage);
	log.trace();
	throw new Error(errorMessage);
}

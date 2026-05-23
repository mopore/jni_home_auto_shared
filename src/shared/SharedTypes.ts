export const NO_PROOF_PROVIDED_TEXT = "<no proof provided>";

export type PresenceEvent = {
	name: string,
	start: boolean,
	end: boolean,
	utcTime: Date,
	proof?: string,
}

export type AlertEvent = {
	subject: string,
	message: string,
	urgent: boolean,
	utcTime: Date,
}

export type CommandRegistration = {
	service: string,
	command: string,
	commandAlternatives: string[] | undefined,
	extendable: boolean,
	description: string,
	callbackTopic: string,
}

export type CommandCallback = {
	command: string,
	source: string,
	timestamp: string,
}

export enum ActionSource {
	USER = "USER",
	SYSTEM = "SYSTEM",
	UNKNOWN = "UNKNOWN",
}
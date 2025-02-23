import neo4j from "neo4j-driver";
import { none, Option, some } from "../src/shared/optional/optional.js";

interface Person {
  name: string;
//   [key: string]: string; // To accommodate additional properties in the Neo4j node
}

export type NeoDbArgs = {
	port: number;
	username: string;
	password: string;
}

/**
 * This is for testing a neo4j database connection to Yasm database
 * It is not meant to be actually used with PAN in production
 */ 
export class NeoDbIntegration {

	readonly #port: number;
	readonly #username: string;
	readonly #password: string;

	constructor({port, username, password}: NeoDbArgs){
		this.#port = port;
		this.#username = username;
		this.#password = password;
	}

	async checkForName(personName: string): Promise<Option<string>> {
		let option: Option<string> = none();
		const conUrl = `neo4j://localhost:${this.#port}`;
		const driver = neo4j.driver(
				conUrl, 
				neo4j.auth.basic(this.#username, this.#password)
		);
		const session = driver.session();
		
		const result = await session.run(`
			MATCH (p:Person)
			WHERE p.name = $name
			RETURN p
			`,
			{
				name: personName
			}
		);
		if (result.records.length == 1) {
				const pNode = result.records[0].get("p").properties as Person;
				const retrievedName = pNode.name;
				option = some(retrievedName);
		}
		await session.close();
		await driver.close();
		return option;
	}

}


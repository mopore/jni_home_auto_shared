import { GenericContainer, StartedTestContainer, Wait } from "testcontainers";
import neo4j from "neo4j-driver";
import { expect } from "chai";
import { NeoDbIntegration } from "./NeoDbIntegration.js";
import { none, Option, some } from "../src/shared/optional/optional.js";

const DB_EXPOSED_PORT = 7687;  // Use a different port
const DB_USERNAME = "neo4j";
const DB_PASSWORD = "my_secret";
const TEST_PERSON_NAME = "Cleetus Spider";
const IMAGE_TAG = "neo4j:5";

describe("Neo4jAvailabilityAndQuery", () => {
	   
	let containerOption: Option<StartedTestContainer> = none();
	   
	before(async () => {
		const c = await new GenericContainer(IMAGE_TAG)
			.withExposedPorts(DB_EXPOSED_PORT)
			.withEnvironment({"NEO4J_AUTH": `${DB_USERNAME}/${DB_PASSWORD}`})
			.withWaitStrategy(Wait.forLogMessage("Started."))
			.start();
		
		const port = c.getMappedPort(DB_EXPOSED_PORT);
		const url = `neo4j://${c.getHost()}:${port}`;
		const driver = neo4j.driver(url, neo4j.auth.basic(DB_USERNAME, DB_PASSWORD));
		const session = driver.session();
		try {
			await session.run(
				`CREATE (p:Person {name: $name})`,
				{name: TEST_PERSON_NAME}
			);
		} finally{
			await session.close();
			await driver.close();
		}
		containerOption = some(c);
	})

    describe("ConnectionAndQuery", () => {
        it("should connect to database and check for test person's name", async () => {
			if (containerOption.isNone()) {
				throw new Error("DB test container not started");
			}
			const c = containerOption.unwrap();
			const neoInt = new NeoDbIntegration({
				port: c.getMappedPort(DB_EXPOSED_PORT), 
				username: DB_USERNAME, 
				password: DB_PASSWORD
			});			

			const nameOption = await neoInt.checkForName(TEST_PERSON_NAME);
				expect(nameOption.isSome()).equals(true);
            expect(TEST_PERSON_NAME).equals(nameOption.unwrap());
        });
    });

	after(async () => {
		if (containerOption.isSome()) {
			await containerOption
				.unwrap()
				.stop();
		}
	})
});

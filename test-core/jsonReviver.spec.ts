import { expect } from "chai"
import fs from "fs";
import jsonReviver from "../src/shared/json/jsonReviver.js";
const PATH_PAN_CHECK_RESULTS_JSON = "resources/test/reviver_test.json";


interface ResultsContainer {
	results: PanCheckResult[];
}

interface PanCheckResult {
	name: string;
	lastRunTime?: Date;
	result: boolean;
}

const readResults = (): ResultsContainer => {
	let content: string;
	content = fs.readFileSync(PATH_PAN_CHECK_RESULTS_JSON, "utf8");
	const container = JSON.parse(content, jsonReviver) as ResultsContainer;
	return container;
}

describe("jsonReviver", () => {
	describe("revive", () => {

		// cat resources/pan_check/results.json | jq .
		// {
		//   "results": [
		//     {
		//       "name": "panOfficePi",
		//       "lastRunTime": "2024-05-12T19:32:00Z",
		//       "result": true
		//     },
		//     {
		//       "name": "panOfficePi_beta",
		//       "result": false
		//     },
		//     {
		//       "name": "panOfficePi_playground",
		//       "lastRunTime": "2024-04-09T20:28:00Z",
		//       "result": true
		//     }
		//   ]
		// }
		it("Should revive plausible dates", () => {
			const container = readResults();
			for (const result of container.results) {
				if (result.result) {
					if (result.lastRunTime !== undefined) {
						expect(result.lastRunTime.getTime()).to.be.above(0);
					}
				}
			}
		});
	});
});

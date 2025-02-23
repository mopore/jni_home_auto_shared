import { log } from '../src/shared/logger/log.js';


describe("logger", () => {
	it("logs a message on info without an error", () => {
		log.info("This is a test message");
	});

	it("logs a message on error without an error", () => {
		log.error("This is a test message");
	});

	it("logs a message on warn without an error", () => {
		log.warn("This is a test message");
	});

	it("logs a message on debug without an error", () => {
		log.debug("This is a test message");
	});

	it("can trace without an error", () => {
		log.trace();
	});
});
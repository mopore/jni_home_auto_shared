import { assert } from 'chai';
import { MqttServerConnection } from '../src/shared/mqtt/MqttServerConnection.js';


describe("Test MqttServerConnection", () => {
	
	describe("Error when initializing with undefined string", ()=>{
		it("Throws an error when initializing with undefined string", () => {
			const url = String(undefined);
			try{
				new MqttServerConnection(url);
				assert.fail();
			}
			catch (error){
				// Expected
			}
		});
	});
});
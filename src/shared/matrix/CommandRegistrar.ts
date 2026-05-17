import { log } from "../logger/log.js";
import { MqttServerConnection } from "../mqtt/MqttServerConnection.js";
import { CommandRegistration } from "../SharedTypes.js";


const ONE_SECOND_IN_MILLIS = 1000;
const REGISTER_COMMANDS_EVERY_SECS = 60;
const REGISTER_COMMANDS_TOPIC_NAME = "jniHome/services/matrixBot/registerCommands";

export class CommandRegistrar {


	private _keepAlive = true;
	private _secondCounter = 0;
	

	constructor( 
		private _commandRegistrations: CommandRegistration[], 
		private readonly _mqttConnection: MqttServerConnection){
		setTimeout(this.tick.bind(this), ONE_SECOND_IN_MILLIS);
	}


	private registerCommands(): void {
		const asyncFunc = async (): Promise<void> => {
			const commandsMessage = JSON.stringify(this._commandRegistrations);
			await this._mqttConnection.publishAsync(REGISTER_COMMANDS_TOPIC_NAME, commandsMessage);
		}
		asyncFunc().catch(error => {
			log.error(`Error registering commands via MQTT server: ${error}`);
			log.trace();
			// We can accept this error. The Alive Ticker will trigger a reset of the service
			// anyway if the MQTT server is not available.
		});
	}


	private tick(): void {
		if (this._secondCounter > REGISTER_COMMANDS_EVERY_SECS){
			this._secondCounter = 0;
		}
		if (this._secondCounter === 0){
			this.registerCommands();
		}
		if (this._keepAlive){
			this._secondCounter ++;
			setTimeout(this.tick.bind(this), ONE_SECOND_IN_MILLIS);
		}
	}


	exit(): void {
		this._keepAlive = false;
	}


	updateCommands(commandRegistrations: CommandRegistration[]): void {
		this._commandRegistrations = commandRegistrations;
	}
}

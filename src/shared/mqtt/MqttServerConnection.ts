import MQTT, { MqttClient } from "mqtt";
import { log } from "../logger/log.js";

const UNDEFINED_STRING = "undefined";


const sleep = async (ms: number): Promise<void> =>{
	return new Promise( resolve => setTimeout(resolve, ms) );
}

const THREE_SECS = 3000;
export class MqttServerConnection {

	private _client: MqttClient | undefined;
	private _connected = false;
	private _firstConnectionAttempt = true;
	private _reconnecting = false;
	private _connectionLosses = 0;
	private _connectionLostTimestamp = -1;
	private _exitRequested = false;


	constructor(
		private readonly _mqttServerUrl: string
	){
		if (_mqttServerUrl === UNDEFINED_STRING){
			const errMsg = "MQTT server URL is not defined!";
			log.error(errMsg);
			log.trace();
			throw new Error(errMsg);
		}
	}

	private connectAsync(): void {
		log.info(`Connecting to MQTT server via "${this._mqttServerUrl}"...`);
		try {
			this._client = MQTT.connect(this._mqttServerUrl, {
				connectTimeout: 10000,
				keepalive: 60,
			});
			
			// Will be called when the client has a connection (also after reconnection)
			this._client.on("connect", () => {
				this._connected = true;
				this._firstConnectionAttempt = false;
				if (this._reconnecting) {
					const timeDiff = Date.now() - this._connectionLostTimestamp;
					const timeDiffSeconds = timeDiff / 1000;
					log.warn(`Reestablished connection to MQTT` +
						` server after ${timeDiffSeconds.toFixed(0)} second(s).`);
					this._reconnecting = false;
				}
				else {
					log.info("Connected to MQTT server!");
				}
			});

			// Will be called AFTER failed connect attempt 
			this._client.on("reconnect", () => {
				if (this._firstConnectionAttempt){
					return;
				}
				if (this._reconnecting === false) {
					this._connectionLosses++;
					log.error(`Connection loss No. ${this._connectionLosses}`);
					log.warn("Reconnecting to MQTT...");
					this._reconnecting = true;
					this._connectionLosses++;
					this._connectionLostTimestamp = Date.now();
				}
			});

			// Will be called each often (e.g. a reconnect attempt fails (every second))
			this._client.on("error", () => {
				if (this._firstConnectionAttempt) {
					this._connected = false;
				}
				if (this._connected){
					this._connected = false;
					log.error( "Connection to MQTT server lost!");
					log.trace();
				}
			});

			// Will be called when the client commands to disconnect
			this._client.on("end", () => {
				log.warn("Actively closed connection to MQTT server!");
				this._connected = false;
			})

			this._client.setMaxListeners(15);
		}
		catch (error) {
			let message: string
			if (error instanceof Error){
				message = error.message
			}
			else {
				message = String(error)
			}
			log.error(`Error connecting to MQTT server: ${message}`);
			log.trace();
		}
	}

	async connectAndWaitAsync(waitTimeMillis: number): Promise<void> {
		const startTime = Date.now();
		this.connectAsync();
		log.info(`Waiting ${(waitTimeMillis/1000)/60} minutes for connection...`);
		while(! this._connected) {
			await sleep(100);
			const timeDiff = Date.now() - startTime;
			if (timeDiff > waitTimeMillis) {
				this._client?.end();
				throw new Error(`Client not connected within ${waitTimeMillis} milliseconds`);
			}
		}
	}


	// Getter for connected
	get connected(): boolean {
		return this._connected;
	}


	/**
	 * This method is used to publish a message to a topic.
	 * It will throw an error after 3 seconds if the client is not connected.
	 * @param topic The topic to publish to
	 * @param message 
	 */
	async publishAsync(topic: string, message: string): Promise<void>{
		if (this._exitRequested){
			return;
		}
		try {
			// Wait max 3 seconds before subscribing to the topic if not connected.
			const startTime = Date.now();
			while (!this._connected) {
				await sleep(100);
				const timeDiff = Date.now() - startTime;
				if (timeDiff > THREE_SECS) {
					throw new Error('Client not available for 3 seconds.');
				}
			}
			this._publish(topic, message);
		} catch (error) {
			const errorMessage = `Error publishing: ${error}`;
			log.error(errorMessage);
			log.trace();
			throw new Error(errorMessage, { cause: error });
		}
	}


	private _publish(topic: string, message: string): void{
		this.checkClientAndConnection();
		if (this._client)
			this._client.publish(topic, message);
	}


	/**
	 * This method is used to subscribe to a topic.
	 * It will throw an error after 3 seconds if the client is not connected.
	 * @param topic The topic to subscribe to
	 * @param handler 
	 */
	async subscribeAsync(topic: string, handler: (message: string, topic?: string) => void): Promise<void>{
		try{
			// Wait max 3 seconds before subscribing to the topic if not connected.
			const startTime = Date.now();
			while (!this._connected){
				await sleep(100);
				const timeDiff = Date.now() - startTime;
				if (timeDiff > THREE_SECS)
					break
			}
			this._subscribe(topic, handler);
		} catch (error) {
			const errorMessage = `Error subscribing: ${error}`;
			log.error(errorMessage);
			log.trace();
			if (!this._exitRequested){
				throw new Error(errorMessage, { cause: error });
			}
		}
	}

	private _subscribe(topic: string, handler: (message: string, topic?: string) => void): void{
		this.checkClientAndConnection();
		if (this._client){
			this._client.subscribe(topic, (error => {
				if (!error) {
					this.checkClientAndConnection();
					if (this._client){
						this._client.on("message", (recTopic, recMessage) => {
							if (recTopic === topic){
								handler(recMessage.toString(), topic);
							}
						});
					}
				}
				else {
					const errorMessage = `Error subscribing: ${error}`;
					log.error(errorMessage);
					log.trace();
					throw new Error(errorMessage);
				}
			}));
		}
	}


	/**
	 * The default number of listeners is 10. With this method the number of listeners can be 
	 * overwritten.
	 * @param limit The maximum number of connection losses to tolerate
	 */
	setMaxListeners(limit: number): void {
		if (this._client)
			this._client.setMaxListeners(limit)
	}


	/**
	 * This will close the connection to the MQTT server. The client will not be usable anymore.
	 */
	exit(): void {
		log.warn("Shutdown for MQTT Server Connection requested...");
		this._exitRequested = true;
		try {
			this.checkClientAndConnection();
		}
		catch (error) {
			const errorMessage = `Errors decteted before exiting MqttServerConnection: ${error}`;
			log.error(errorMessage);
			log.trace();
		}
		if (this._client){
			this._connected = false;
			try {
				this._client.end();
			}
			catch (error) {
				const errorMessage = `Error calling "end" on MQTT client: ${error}`;
				log.error(errorMessage);
				log.trace();
			}
		}
	}


	private checkClientAndConnection(): void {
		if (! this._connected) {
			const errorMessage = `There is no active connection!`;
			log.error(errorMessage)
			log.trace();
			throw new Error(errorMessage);
		}
		if (! this._client) {
			const errorMessage = "Client was not yet initialized!";
			log.error(errorMessage);
			log.trace();
			throw new Error(errorMessage);
		}
	}
}

import { AliveTicker } from "./AliveTicker.js";
import { ExitResetListener } from "./mqtt/ExitResetListener.js";
import { IService } from "./IService.js";
import { AlertEvent } from "./SharedTypes.js";
import { sharedTopics } from "./SharedTopics.js";
import { log } from "./logger/log.js";
import { MqttServerConnection } from "./mqtt/MqttServerConnection.js";

const FIVE_SECS = 5000;
const TWENTY_MIN_IN_MILLIES = 20 * 60 * 1000;

export class ServiceFrame {

	private _mqttConnection: MqttServerConnection;
	private _ticker: AliveTicker | undefined;
	private _service: IService | undefined;
	private _resetReason: string | undefined;

	constructor(
		private readonly _mqttServerUrl: string,
	){
		log.warn("Service Init...");
		this._mqttConnection = new MqttServerConnection(_mqttServerUrl);
	}

	
	/**
	 * Initializes the service frame with the given service.
	 * This method will also start an AliveTicker and a listener for exit and reset commands.
	 * The method should be called for initial setup and will be called by the frame for a potential reset.
	 * If a reset has happened, the reset reason will be alerted to briefing service after 5 seconds.
	 * @param service 
	 */
	async initFrameAsync(service: IService): Promise<void>{
		try {
			await this._mqttConnection.connectAndWaitAsync(TWENTY_MIN_IN_MILLIES);
		}
		catch (error) {
			const errMessage = `Could not establish essential connection to MQTT server: ${error}`;
			log.error(errMessage);
			throw new Error(errMessage, { cause: error });
		}

		if (this._resetReason){
			const msg = `ServiceFrame.initFrameAsync was invoked after a reset with reason: ` +
				`"${this._resetReason}"`;
			log.info(msg);
			setTimeout( this.alertResetReasonAfterReset.bind(this), FIVE_SECS);
		}

		this._service = service;
		this._ticker = new AliveTicker(this, service.getServiceName());
		new ExitResetListener(this._mqttConnection, service.getServiceName(), this);
		await this._service.initAsync(this);
		log.info(`Service "${this._service.getServiceName()}" initialized.`);
	}


	get mqttConnection(): MqttServerConnection{
		return this._mqttConnection;
	}

	/**
	 * Shuts down the service frame in a graceful way. 
	 * This will call the onExit method of the service.
	 * All connections the MQTT server will be closed after 5 seconds.
	 */
	exit(): void {
		if (this._service) {
			log.error(`Initiating exit for service "${this._service.getServiceName()}"`);
			try {
				this._service.onExit();
			}
			catch(error){
				log.error(`Error while exiting service "${this._service.getServiceName()}":`);
				log.error(error);
				log.trace();
			}
		}
		if (this._ticker){
			this._ticker.exit();
		}
		setTimeout( this.endServiceInFiveSeconds.bind(this), FIVE_SECS);
	}

	private endServiceInFiveSeconds(): void {
		this._mqttConnection.exit();
		if (this._service){
			log.error(`Will exit the process for service "${this._service.getServiceName()}" NOW!!!`);	
		}
        process.exit();
    }

	/**
	 * Resets the service frame. This will call the onReset method of the service. And tries to to
	 * close all connection to MQTT server. After 5 seconds the initFrameAsync method will be called.
	 * Another reset will be ignored if a reset is already in progress.
	 * It will wait up to 20 minutes for a MQTT connection. After a successful connection the the
	 * briefing service will be called to inform about the reset.
	 * @param reason The reason for the reset.
	 */
	reset(reason: string): void {
		if (this._resetReason !== undefined){
			const msg = `Reset with reason "${reason}" will be ignored because reset with reason ` +
				`"${this._resetReason}" is already in progress.`;
			log.error(msg);
			log.trace();
			return;
		}

		this._resetReason = reason;
		if (this._service) {
			const msg = `Initiating reset for service "${this._service.getServiceName()}" for ` +
				`reason: "${reason}"`;
			log.warn(msg);
			try {
				this._service.onReset();
			}
			catch(error){
				log.error(`Error while resetting service "${this._service.getServiceName()}":`);
				log.error(error);
				log.trace();
			}
		}
		if (this._ticker){
			this._ticker.exit();
			this._ticker = undefined;
		}
		this.mqttConnection.exit();
		setTimeout( this.resettingInFiveSeconds.bind(this), FIVE_SECS);
	}
	
	/**
	 * Publishes an alert to briefing service via MQTT.
	 * It throws an error if the alert could not be published.
	 * @param subject The subject of the alert 
	 * @param message The message of the alert 
	 * @param urgent If true, the alert will not only queued but also sent to JNI via Matrix 
	 */
	async alertAsync(subject: string, message: string, urgent: boolean): Promise<void> {
		try{
			const alertEvent: AlertEvent = {
				subject: subject,
				message: message,
				urgent: urgent,
				utcTime: new Date()
			}
			const jsonString = JSON.stringify(alertEvent);
			await this._mqttConnection.publishAsync(sharedTopics.BRIEFING_ALERT, jsonString);
		}
		catch( error ){
			const errMessage = `Error publishing alert for subject "${subject}": ${error}`;
			log.error(errMessage);
			log.trace();
			throw new Error(errMessage, { cause: error });
		}
	}

	private resettingInFiveSeconds(): void{
		const asyncFunc = async (): Promise<void> => {
			log.info("Resetting service...")
			this._mqttConnection = new MqttServerConnection(this._mqttServerUrl);
			if (!this._service){
				throw new Error("No service available for reset.");
			}
			await this.initFrameAsync(this._service);
		}
		asyncFunc().catch(error => {
			log.error(`Error while resetting service:`);
			log.error(error);
			log.trace();
			this.exit();
		});
	}

	private alertResetReasonAfterReset(): void {
		const asyncFunc = async (): Promise<void> => {
			const serviceName = this._service?.getServiceName();
			const reason = this._resetReason;
			if (!serviceName){
				const errMessage = `Did not have a service to alert reset reason "${reason}"`;
				log.error(errMessage);
				log.trace();
				throw new Error(errMessage);
			}
			if (!reason){
				const errMessage = `Did not have a reset reason to alert for service "${serviceName}"`;
				log.error(errMessage);
				log.trace();
				throw new Error(errMessage);
			}
			try{
				log.info(`Alerting reset reason after reset for service "${serviceName}": "${reason}"`);
				await this.alertAsync(
					`${serviceName} Reset`,
					`Service "${serviceName}" was reset for reason: ${reason}`,
					true,
				);
				this._resetReason = undefined;
			}
			catch (error){
				const errMessage = `Could not alert reset reason for service "${serviceName}": ${error}`
				log.error(errMessage);
				log.trace();
				throw new Error(errMessage, { cause: error });
			}
		}
		asyncFunc().catch(error => {
			const errMsg = `Panicing since alerting reason after reset faild: ${error}`;
			log.error(errMsg);
			log.trace();
			throw new Error(errMsg);
		});
	}

}

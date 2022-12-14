/* from the Stanford Sleepiness Scale */
/* https://web.stanford.edu/~dement/sss.html */

import { SleepData } from './sleep-data';

export class StanfordSleepinessData extends SleepData {
	public static ScaleValues = [undefined,//Sleepiness scale starts at 1
	'Feeling active, vital, alert, or wide awake', //1
	'Functioning at high levels, but not at peak; able to concentrate', //2
	'Awake, but relaxed; responsive but not fully alert', //3
	'Somewhat foggy, let down', //4
	'Foggy; losing interest in remaining awake; slowed down', //5
	'Sleepy, woozy, fighting sleep; prefer to lie down', //6
	'No longer fighting sleep, sleep onset soon; having dream-like thoughts']; //7

	private loggedValue:number;
	private notes:string;
	public identifier: string;

	constructor(loggedValue:number, loggedAt:Date = new Date(), notes = "") {
		super();
		this.loggedValue = loggedValue;
		this.loggedAt = loggedAt;
		this.notes = notes;
		this.identifier = "StanfordSleepinessData";
	}

	getJournal():string {
		return this.notes;
	}

	dateString():string {
		return `${this.loggedAt.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })} at ${this.loggedAt.toLocaleTimeString()}`;
	}

	summaryString():string {
		return this.loggedValue + ": " + StanfordSleepinessData.ScaleValues[this.loggedValue];
	}
}

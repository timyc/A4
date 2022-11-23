import { SleepData } from './sleep-data';

export class OvernightSleepData extends SleepData {
	private sleepStart:Date;
	private sleepEnd:Date;
	private journal:string;
	public identifier: string;
	public goalMet:boolean;

	constructor(sleepStart:Date, sleepEnd:Date) {
		super();
		this.sleepStart = sleepStart;
		this.sleepEnd = sleepEnd;
		this.journal = "";
		this.identifier = "OvernightSleepData";
		this.goalMet = false;
	}

	summaryString():string {
		const sleepStart_ms = this.sleepStart.getTime();
		const sleepEnd_ms = this.sleepEnd.getTime();
		const difference_ms = sleepEnd_ms - sleepStart_ms;
		return Math.floor(difference_ms / (1000*60*60)) + " hours, " + Math.floor(difference_ms / (1000*60) % 60) + " minutes.";
	}

	dateString():string {
		return "Night of " + this.sleepStart.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
	}

	getJournal():string {
		return this.journal;
	}

	setJournal(journal:string) {
		this.journal = journal;
	}

	sleepTime():number {
		const sleepStart_ms = this.sleepStart.getTime();
		const sleepEnd_ms = this.sleepEnd.getTime();
		return (sleepEnd_ms - sleepStart_ms) / 1000; // seconds
	}
}

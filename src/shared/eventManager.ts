interface EventOption {
    layer: number
    filter?: (...args: Array<any>) => boolean
}

interface CallbackFunction  {
    (callbackStop: () => void, ...args: Array<any>) : void;
}

interface CallbackObject {
    callback: CallbackFunction,
    option: EventOption,
}

interface Event {
    name: string,
    callbacks: Array<CallbackObject>
}

interface StackEvent extends Array<Event> {
    [index: number]: Event
}

class EventManager {
    private events: StackEvent = [];

    /**
     * Register event
     * 
     * @param eventName is the name of event
     */
    public add(eventName: string): Event {
        const foundEvent = this.events.find((event: Event) => event.name === eventName);
        if (foundEvent) return foundEvent;

        const event = {
            name: eventName,
            callbacks: []
        };

        this.events.push(event);

        return event
    }

    /**
     * Register events
     * 
     * @param eventNames is the names of events
     */
    public addMultiple(...eventNames: Array<string>) {
        eventNames.forEach(eventName => this.add(eventName));
    } 

    /**
     * Attach callback when event
     * 
     * @param eventName is the name of event
     * @param option is for defined function filter or layer
     * @param callback the callback attached to event
     */
    public on(eventName: string, option: any, callback: CallbackFunction) {
        const event = this.getEventByName(eventName, true);

        if (!option.layer) option.layer = Infinity; // If not layer call this callback in last

        // Found pos in callback stack
        const position = event.callbacks.findIndex(cbObject => cbObject.option.layer > option.layer);
        if (position != -1) {
            event.callbacks.splice(position, 0, {
                callback,
                option
            });
        }
        else {
            event.callbacks.push({
                callback,
                option
            });
        }
    }

    /**
     * Call callbacks linked to the event
     * 
     * @param eventName is the name of event
     * @param args argument send to callbacks
     */
    public call(eventName: string, args: Array<any>) {
        const event = this.getEventByName(eventName);
        let stopCallback = false;

        const callbackStop = () => {
            stopCallback = true;
        }

        event.callbacks.forEach((callback) => {
            if (stopCallback) return;

            if (callback.option.filter) {
                if (callback.option.filter(...args)) {
                    callback.callback(callbackStop, ...args);
                }
            }
            else {
                callback.callback(callbackStop, ...args);
            }
        });
    }

    /**
     * Find event by name.
     * 
     * @param eventName the event name finded
     * @param force if is true and event is not found this function create the event
     */
    private getEventByName(eventName: string, force: boolean = false): Event {
        let event = this.events.find((event: Event) => event.name === eventName);

        if (!event) {
            if (!force) throw new Error(`The event ${eventName} is not found, please check if as been declared`);
            event = this.add(eventName);
        }
    
        return event;
    }
}

export default new EventManager();
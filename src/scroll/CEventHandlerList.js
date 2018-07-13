export default class CEventHandlerList {

    /**
     * @constructor
     */
    constructor() {

        if (!CEventHandlerList._eventList) {
            CEventHandlerList._eventList = [];
        }

        CEventHandlerList._eventList.push(this);
        this.eventHandlerList = [];
        return this;
    }

    /**
     * destructor
     */
    destroy(options) {

        for (var i = CEventHandlerList._eventList.length - 1; i >= 0; i--) {
            if (CEventHandlerList._eventList[i] == this) {
                CEventHandlerList._eventList.splice(i, 1);
                break;
            }
        }

        this.removeAllEventHandler();
        this.eventHandlerList.length = 0;
        delete this.eventHandlerList;
    }

    /**
     * on
     */
    on(target, event_name, event_handler) {

        if (PIXI.utils.isMobile.any && event_name == 'click') {
            event_name = 'pointertap';
        }

        this.off(target, event_name, event_handler);
        if (target.on)
            target.on(event_name, event_handler);
        else if (target.addEventListener)
            target.addEventListener(event_name, event_handler);

        this.eventHandlerList.push({
            target       : target,
            event_name   : event_name,
            event_handler: event_handler
        });
    }

    /**
     * off
     */
    off(target, event_name, event_handler) {

        if (!target) {
            return false;
        }

        for (var i = this.eventHandlerList.length - 1; i >= 0; i--) {
            if (this.eventHandlerList[i].target === target && this.eventHandlerList[i].event_name === event_name && this.eventHandlerList[i].event_handler === event_handler) {
                if (target.off)
                    target.off(event_name, event_handler);
                else if (target.removeEventListener)
                    target.removeEventListener(event_name, event_handler);
                delete this.eventHandlerList[i].target;
                delete this.eventHandlerList[i].event_name;
                delete this.eventHandlerList[i].event_handler;
                this.eventHandlerList[i] = null;
                this.eventHandlerList.splice(i, 1);
            }
        }

        return true;
    }

    /**
     * offAll
     */
    offAllByEvent(target, event_name) {

        if (!target) {
            return false;


            for (var i = this.eventHandlerList.length - 1; i >= 0; i--) {
                if (this.eventHandlerList[i].target === target && this.eventHandlerList[i].event_name === event_name) {

                    target.removeAllListeners(event_name);

                    delete this.eventHandlerList[i].target;
                    delete this.eventHandlerList[i].event_name;
                    delete this.eventHandlerList[i].event_handler;
                    this.eventHandlerList[i] = null;
                    this.eventHandlerList.splice(i, 1);
                }
            }

            return true;
        }

        /**
         * offAll
         */
        offAll(target)
        {

            if (!target) {
                return false;
            }

            for (var i = this.eventHandlerList.length - 1; i >= 0; i--) {
                if (this.eventHandlerList[i].target === target) {

                    let event_name = this.eventHandlerList[i].event_name;
                    if (event_name) {
                        target.removeAllListeners(event_name);

                        delete this.eventHandlerList[i].target;
                        delete this.eventHandlerList[i].event_name;
                        delete this.eventHandlerList[i].event_handler;
                        this.eventHandlerList[i] = null;
                        this.eventHandlerList.splice(i, 1);
                    }


                }
            }

            return true;
        }

        /**
         * removeAllEventHandler
         */
        removeAllEventHandler()
        {

            if (this.eventHandlerList) {
                for (var i = this.eventHandlerList.length - 1; i >= 0; i--) {
                    if (this.eventHandlerList[i].target) {
                        if (this.eventHandlerList[i].target.off)
                            this.eventHandlerList[i].target.off(this.eventHandlerList[i].event_name, this.eventHandlerList[i].event_handler);
                        else if (this.eventHandlerList[i].target.removeEventListener)
                            this.eventHandlerList[i].target.removeEventListener(this.eventHandlerList[i].event_name, this.eventHandlerList[i].event_handler);
                        delete this.eventHandlerList[i].target;
                        delete this.eventHandlerList[i].event_name;
                        delete this.eventHandlerList[i].event_handler;
                        this.eventHandlerList[i] = null;
                        this.eventHandlerList.splice(i, 1);
                    }
                }
            }
        }

    }
}
import { PhotoEvent } from "./photo-event";

export class Event {
    constructor(public id: number, public eventName: string, public eventMainPhotoUrl: string, public photos: PhotoEvent[]) { }
}
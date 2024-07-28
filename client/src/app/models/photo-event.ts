export class PhotoEvent {
    constructor(public eventId: number, public id: number, public url: string, public isMain: boolean
        , public publicId: string, public title: string, public description: string, public uploadDateTime: Date) { }
}
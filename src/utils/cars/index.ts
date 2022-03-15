import {GeoPoint, Timestamp} from "firebase/firestore";

export type Location = {
    address: string
    location: GeoPoint
    date: Timestamp
};

export type Car = {
    id: string
    project: string
    convoi: string
    name: string
    numberPlate: string
    crew: number
    guests: number
    from?: Location
    position?: Location
    heading?: GeoPoint
    destination?: GeoPoint
    updatedAt: Timestamp
}

export * from './useConvoiCars';
export * from './useCarStatus';

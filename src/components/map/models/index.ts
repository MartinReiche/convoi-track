import {GeoPoint, Timestamp} from "firebase/firestore";
import {format} from 'date-fns';

type latlng = { lat: number, lng: number }

interface MapLocationProps {
    coordinates?: google.maps.places.PlaceResult | google.maps.GeocoderResult | GeoPoint | latlng
    date?: Date | Timestamp
    address?: string
}

export class MapLocation {
    readonly address: string | undefined;
    readonly coordinates: GeoPoint | undefined;
    readonly date: Timestamp | undefined;

    constructor({coordinates, address, date}: MapLocationProps) {
        if (coordinates) {
            if (coordinates instanceof GeoPoint) {
                this.coordinates = coordinates;
            } else if ("geometry" in coordinates && coordinates.geometry?.location) {
                this.coordinates = new GeoPoint(coordinates.geometry.location.lat(), coordinates.geometry.location.lng());
                this.address = coordinates.formatted_address
            } else if ("lat" in coordinates && "lng" in coordinates) {
                this.coordinates = new GeoPoint(coordinates.lat, coordinates.lng)
            }
        }

        if (date && "getTime" in date) {
            this.date = new Timestamp(date.getTime(), 0)
        } else if (date) this.date = date;
        if (address) this.address = address;
        return this;
    }

    dateToString(dateFormat = 'dd.MM.yyyy HH:mm [zzz]') {
        if (!this.date) return undefined;
        return format(this.date.toDate(), dateFormat);
    }
}
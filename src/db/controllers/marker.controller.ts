import { db_connect } from './db.controller'
import mongoose from 'mongoose';
import { Imarker, NewMarkerData } from '../../schema/markers';

export class marker_controller {
    #marker_model: mongoose.Model<Imarker>
    constructor(database: db_connect) {
        this.#marker_model = database.markers_model
    }

    async createMarker(data: NewMarkerData): Promise<Imarker> {
        const newMarker = new this.#marker_model(data)
        return await newMarker.save()
    }
}
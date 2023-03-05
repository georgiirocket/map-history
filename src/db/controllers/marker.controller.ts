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
    async markersInfo(id: string): Promise<Imarker | null> {
        const marker = await this.#marker_model.findOne({ _id: id, ondelete: false }, {
            owner: 1,
            privet: 1,
            title: 1,
            position: 1
        })
        return marker
    }
    async markersInfoDetail(id: string): Promise<Imarker | null> {
        const marker = await this.#marker_model.findOne({ _id: id, ondelete: false }, {
            ondelete: 0,
            dateCreate: 0
        })
        return marker
    }
}
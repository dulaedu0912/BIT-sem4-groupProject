import mongoose from "mongoose";
import { CATEGORIES,ORIGIN,MAX_RADIUS_KM,haversineKm } from "../constants.js";

const placeSchema = new mongoose.Schema(
    {
        name:{
            type:String,requied: [true, 'Name is required.'], 
            trim:true, 
            maxlength: 120
        },

        Category:{
            type: String,
            required:[true, 'Category is required'],
            enum:{values:CATEGORIES, message: 'invaild category.'}
        },
        
        description:{
            type: String,
            required:[true, 'Description is required.'],
            trim: true,
            maxlength: 2000
        },

        coordinates:{
            latitude:{ type:Number, required:['Latitude is required'], min: -90, max: 90},
            longitude:{ type:Number, required:['Longitude is required'], min: -180, max: 180},
        },

        distanceKm: {type:Number, min: 0},
        openingHours: {type:String, trim:true, maxlength:200},
        travelTips:{type:String, trim:true, maxlength:500}
    },
    {
        timestamps: true
    }
)

placeSchema.index({Category:1, distanceKm:1})
placeSchema.set('toJSON', {vituals: true})
placeSchema.virtual('distance').get(function(){
    return this.distanceKm
})

placeSchema.pre('validate', function(next){
    const{ latitude, longitude} = this.coordinates ?? {}

    if (latitude != null && longtitude != null){
        this.distanceKm = haversineKm(ORIGIN, {latitude, longtitude})

        if(this.distanceKm > MAX_RADIUS_KM){
            this.invalidate(
                'coordinates',
                `This place is ${this.distanceKm} km from Ganemulla. The maximum allowed radius is ${MAX_RADIUS_KM} km.`
            )
        }
    }
    next()
})

export const Place = mongoose.model('Place', placeSchema)
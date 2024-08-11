import mongoose, {Schema} from "mongoose";

const levelSchema = new Schema({
    levelName:{
        type : String,
        require : true,
        uniqie : true,
        lowercase : true,
        trim : true,
        index : true
    },
    levelContent:{
        type : String,
        require : true,
        uniqie : true,
        lowercase : true,
        trim : true,
        index : true
    }
    
},
{
    timestamps : true
}
)

export const Level = mongoose.model("Level", levelSchema);
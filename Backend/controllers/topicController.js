const Topic = require('../models/topicModel')

// TO INSERT TOPIC
exports.postTopic = async(req,res)=>{
    let topic = new Topic({
        topic_name: req.body.topic_name
    })

    // to check if data already exits or not
    Topic.findOne({topic_name: topic.topic_name})
    .then(async(topics)=>{
        if(topics){
            return res.status(400).json({error: 'Topic already exits, it must be unique'})
        }
        else{
            topic = await topic.save()
            
            if(!topic){
                return res.status(400).json({error: 'Something went wrong.'})
            }
            res.send(topic)
        }
    })
    .catch(err=>res.status(400).json({error:err}))
}

// TO LIST ALL TOPICS
exports.topicList = async(req, res)=>{
    const topic = await Topic.find()
    if(!topic){
        return res.status(400).json({error: 'Something went wrong.'})
    }
    res.send(topic)
}

// TO VIEW A TOPIC DETAILS
exports.topicDetails = async (req,res)=>{
    const topic = await Topic.findById(req.params.id)
    if(!topic){
        return res.status(400).json({error: 'Something went wrong.'})
    }
    res.send(topic)
}

// TO UPDATE TOPIC
exports.updateTopic = async (req, res)=>{
    const topic = await Topic.findByIdAndUpdate(
        req.params.id, {
            topic_name: req.body.topic_name
        }, 
        {new:true}
    )

    if(!topic){
        return res.status(400).json({error: 'Something went wrong.'})
    }
    res.send(topic)
}

// TO DELETE TOPIC
exports.deleteTopic = (req, res)=>{
    Topic.findByIdAndUpdate(req.params.id)
    .then(topic=>{
        if(!topic){
            return res.status(404).json({error: 'Topic not found.'})
        }
        else{
            return res.status(200).json({message:"Topic deleted successfully."})
        }
    })
    .catch(err=>{
        return res.status(400).json({error:err})
    })
}
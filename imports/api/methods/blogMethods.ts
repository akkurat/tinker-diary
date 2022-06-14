import { BlogCollection } from "../collections/blog"
import { extractMdastAndMetaInfo } from "./extractMdastAndMetaInfo"

Meteor.publish('blogs', () => BlogCollection.find())
Meteor.publish('blog.one',
    (id) => BlogCollection.find({ _id: id })
)

Meteor.methods({
    'blog.update': (_id, payload) => {
        BlogCollection.update(_id, { $set: payload })
    },
    'blog.push': (_id, payload) =>
        BlogCollection.update(_id, { $addToSet: payload }),
    'blog.pull': (_id, payload) =>
        BlogCollection.update(_id, { $pull: payload }),
    'blog.add': () => {
        return BlogCollection.insert({  })
    },
    'blog.setMd': (_id, md) => {
       const {mdast, meta } = extractMdastAndMetaInfo(md) 
       console.log(meta)
       BlogCollection.update(_id, { $set: {md, t:meta.title, h:meta.head}, $addToSet: {files: { $each: meta.files}}} ) 
    }
})

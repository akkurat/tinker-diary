import { BlogCollection } from "../collections/blog"

Meteor.publish('blogs', () => BlogCollection.find())
Meteor.publish('blog.one',
    (id) => BlogCollection.find({ _id: id })
)

Meteor.methods({
    'blog.update': (_id, payload) => {
        BlogCollection.update(_id, { $set: payload })
    },
    'blog.push': (_id, payload) =>
        BlogCollection.update(_id, { $push: payload }),
    'blog.add': () => {
        return BlogCollection.insert({  })
    }
})

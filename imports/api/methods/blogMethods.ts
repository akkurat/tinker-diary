import { Document } from "bson"
import { LoremIpsum } from "lorem-ipsum"
import { Mongo } from "meteor/mongo"
import { BlogCollection } from "../collections/blog"
import { extractMdastAndMetaInfo } from "./extractMdastAndMetaInfo"

Meteor.publish('blogs', () => BlogCollection.find())
Meteor.publish('blog.one',
    (id) => BlogCollection.find({ _id: id })
)
const setMd = (_id: string | Mongo.ObjectID | Mongo.Selector<Document>, md: string ) => {
    const { mdast, meta } = extractMdastAndMetaInfo(md)
    console.log(meta)
    BlogCollection.update(_id, { $set: { md, t: meta.title, h: meta.head }, $addToSet: { files: { $each: meta.files } } })
}

Meteor.methods({
    'blog.update': (_id, payload) => {
        BlogCollection.update(_id, { $set: payload })
    },
    'blog.push': (_id, payload) =>
        BlogCollection.update(_id, { $addToSet: payload }),
    'blog.pull': (_id, payload) =>
        BlogCollection.update(_id, { $pull: payload }),
    'blog.add': () => {
        const id = BlogCollection.insert({creationDate: new Date()})
        setMd(id, genMd() )
    },
    'blog.setMd': setMd
})

const l = new LoremIpsum({
    sentencesPerParagraph: {
        max: 6,
        min: 1
    },
    wordsPerSentence: {
        max: 10,
        min: 2
    }
})
const genMd = () => `# ${l.generateSentences(1)}

## ${l.generateWords(2)}

${l.generateParagraphs(40)}`

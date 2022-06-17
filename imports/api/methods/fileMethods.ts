import { UserFiles } from "../collections/files";

Meteor.publish('files.all', () =>
    UserFiles.find().cursor)
Meteor.publish('files.in', (ids: string[]) =>
    UserFiles.find({ _id: { $in: ids } }).cursor)

Meteor.methods({
    'files.updateTags': (id: string, tags: string[]) => {
        UserFiles.update(id,
            { $addToSet: { 'meta.tags': { $each: tags } } })
    }
})


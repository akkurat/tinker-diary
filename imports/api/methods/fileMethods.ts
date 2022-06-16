import { UserFiles } from "../collections/files";

Meteor.publish('files.all', () =>
    UserFiles.find().cursor)
Meteor.publish('files.in', (ids: string[]) =>
    UserFiles.find({ _id: { $in: ids } }).cursor)

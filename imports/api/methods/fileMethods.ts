import createThumbnails from "../../../server/createThumbnails";
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

UserFiles.find().forEach(fObj => {
    if (!fObj.versions.thumbnail) {
        createThumbnails(UserFiles, fObj, (error, fileRef) => {
            if (error) {
                console.log(error)
            } else {
                console.log("thumb for " + fObj)
            }
        })
    }
})


UserFiles.on('afterUpload', function (fileRef) {
    // Run `createThumbnails` only over PNG, JPG and JPEG files
    if (/png|jpe?g/i.test(fileRef.extension || '')) {
        createThumbnails(this, fileRef, (error, fileRef) => {
            if (error) {
                console.error(error);
            }
        });
    }
});

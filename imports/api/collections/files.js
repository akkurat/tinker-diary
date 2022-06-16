import { FilesCollection } from 'meteor/ostrio:files';
// const path = require('path')
import path from 'path'

const determineStoragePath = (suffix) => () => {
    if (Meteor.isDevelopment) {
        const pwd = path.resolve('./');
        const appPath = pwd.match(/.*(?=.meteor)/)[0]
        const persistentDataDir = path.join(appPath, 'persistent_data', suffix)
        return persistentDataDir;
    }
    return suffix
}



export const UserFiles = new FilesCollection({
    collectionName: 'userfiles',
    storagePath: determineStoragePath('uploads')
});

export const ThumbnailFiles = new FilesCollection({
    collectionName: 'thumbnails',
    storagePath: determineStoragePath('thumbnails')
});

// optionally attach a schema
// UserFiles.attachSchema(FilesCollection.schema);
import { FilesCollection } from 'meteor/ostrio:files';
// const path = require('path')
import path from 'path'

const determineStoragePath = () => {
    if (Meteor.isDevelopment) {
        const pwd = path.resolve('./');
        const appPath = pwd.match(/.*(?=.meteor)/)[0]
        const persistentDataDir = path.join(appPath, 'persistent_data')
        return persistentDataDir;
    }
    return 'uploads'
}

export const UserFiles = new FilesCollection({
    collectionName: 'userfiles',
    storagePath: determineStoragePath
});

// optionally attach a schema
// UserFiles.attachSchema(FilesCollection.schema);
import * as React from 'react';

import { FunctionComponent, RefObject, useRef, useState } from "react";
import { UserFiles } from "../api/collections/files";




interface FileUploadToCollectionProps {
    onSuccess?: (fileId: string) => void
}

export const FileUploadToCollection: FunctionComponent<FileUploadToCollectionProps> = (props) => {

    const [uploading, setUploading] = useState([])
    const [progress, setProgress] = useState(0)
    const [inPogress, setInProgress] = useState(false)

    const refFileupload: RefObject<HTMLInputElement> = useRef()


    const resetUpload = () => {
        setUploading([])
        setProgress(0)
        setInProgress(false)
        refFileupload.current.value = ''
    }


    const uploadIt = (e) => {
        e.preventDefault();

        let self = this;

        if (e.currentTarget.files && e.currentTarget.files[0]) {
            // We upload only one file, in case
            // there was multiple files selected
            var file = e.currentTarget.files[0];

            if (file) {
                let uploadInstance = UserFiles.insert({
                    file: file,
                    meta: {
                        // locator: self.props.fileLocator,
                        userId: Meteor.userId() // Optional, used to check on server for file tampering
                    },
                    chunkSize: 'dynamic',
                    allowWebWorkers: true // If you see issues with uploads, change this to false
                }, false)

                setUploading(uploadInstance) // Keep track of this instance to use below
                setInProgress(true) // Show the progress bar now

                // These are the event functions, don't need most of them, it shows where we are in the process
                uploadInstance.on('start', function () {
                    console.log('Starting');
                })

                uploadInstance.on('end', function (error, fileObj) {
                    console.log('On end File Object: ', fileObj);
                })

                uploadInstance.on('uploaded', function (error, fileObj) {
                    console.log('uploaded: ', fileObj);
                    props?.onSuccess(fileObj)
                    resetUpload()
                })

                uploadInstance.on('error', function (error, fileObj) {
                    // todo: gui
                    console.log('Error during upload: ' + error)
                });

                uploadInstance.on('progress', function (progress, fileObj) {
                    console.log('Upload Percentage: ' + progress)
                    // Update our progress bar
                    setProgress(progress)
                });

                uploadInstance.start(); // Must manually start the upload
            }
        }
    }

    return <div>
        <input type='file' ref={refFileupload} disabled={inPogress}
            onChange={uploadIt} />
    </div>
}

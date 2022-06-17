import * as React from 'react'
import { useState, DragEvent, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { FileUploadToCollection } from './FileuploadComponent'
import { MediaDropzone } from './MediaUploadZone'
export const Home = () => {
    const [file,setFile] = useState({})
    return (
    <div>
        127.0.0.1
        <FileUploadToCollection onSuccess={setFile} />
        <div>{JSON.stringify(file)}</div>
        <MediaDropzone />
    </div>
)}


import * as React from 'react'
import { useState } from 'react'
import { FileUploadToCollection } from './FileuploadComponent'
export const Home = () => {
    const [file,setFile] = useState({})
    return (
    <div>
        127.0.0.1
        <FileUploadToCollection onSuccess={setFile} />
        <div>{JSON.stringify(file)}</div>
    </div>
)}
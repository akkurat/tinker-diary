import { useCallback } from "react"
import { useDropzone } from "react-dropzone"
import * as React from 'react'
import { useState } from "react"
import { UserFiles } from "../api/collections/files"

export const MediaDropzone = () => {

  const [uploading, setUploading] = useState(false)
  const [currentFile, setCurrentFile] = useState('')

  async function uploadFiles(acceptedFiles: Array<File>) {
    setUploading(true)
    for (const file of acceptedFiles) {
      setCurrentFile(file.name)
      await uploadOnefile(file)
    }
    setUploading(false)
    setCurrentFile('')
  }

  const onDrop = useCallback(acceptedFiles => {
    // Do something with the files
    uploadFiles(acceptedFiles)
    console.log(acceptedFiles)
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, disabled: uploading })

  return (
    <div {...getRootProps()}>
      {uploading && <h1>{currentFile}</h1>}
      <input {...getInputProps()} />
      {
        isDragActive ?
          <p>Drop the files here ...</p> :
          <p>Drag 'n' drop some files here, or click to select files</p>
      }
    </div>
  )
}

function uploadOnefile(file: File) {
  return new Promise((resolve, reject) => {
    const upload = UserFiles.insert({ file, chunkSize: 'dynamic' }, false)
    upload.on('start', () => console.log('start'))
    upload.on('uploaded', (error, fileObj) => {
      if (error) {
        reject(error)
      } else {
        resolve(fileObj)
      }
    })
    upload.start()
  })
}

import { FileObj } from 'meteor/ostrio:files'
import * as React from 'react'
import { MediaTile } from '../MediaManager'
export const LinkedMedia: React.FunctionComponent<{files: FileObj<any>[], className: string}> = ({ files, className }) => {
    return <div className={'mediaManager-linked ' + className}>
        {files && files.map(f => <MediaTile f={f} />)}
    </div>
}
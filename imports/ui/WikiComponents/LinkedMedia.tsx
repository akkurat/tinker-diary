import { FileObj } from 'meteor/ostrio:files'
import * as React from 'react'
import { MediaManager, MediaTile } from '../MediaManager'

import ReactModal from 'react-modal'
interface LinkedMediaProps {
    files: string[]
    className: string
    onAdd?: (f: FileObj<any>) => string
    onRemove?: (f: FileObj<any>) => string
}

export const LinkedMedia: React.FunctionComponent<LinkedMediaProps> = ({ files, className, onAdd, onRemove }) => {
    const [open, setOpen] = React.useState(false);
    const handleSelect = (f: FileObj<any>) => {
        if (onAdd) {
            const response = onAdd(f)
            if (!response) {
                setOpen(false)
            }
            return !response
        }
    }
    return <div className={'mediaManager-linked ' + className}>
        {files && files.map(fid => <MediaTile
            fid={fid} onLongClick={onRemove}
            onSelect={f => onAdd(f)}

        />)}
        <div className='mediaManager-tile icon' onClick={() => setOpen(true)}>+</div>

        <ReactModal
            isOpen={open}
            // onAfterOpen={afterOpenModal}
            onRequestClose={()=>setOpen(false)}
            // style={customStyles}
            contentLabel="Example Modal"
        >
            <MediaManager onSelect={handleSelect} />
        </ReactModal>

    </div>
}
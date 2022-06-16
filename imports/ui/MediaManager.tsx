import * as React from 'react'
import { FileObj, FileRef } from "meteor/ostrio:files"
import { useTracker } from "meteor/react-meteor-data"
import { UserFiles } from "../api/collections/files"
import classNames from 'classnames'
import { DataTable } from 'primereact/datatable';
import { FunctionComponent, useState } from 'react'
import useLongPress from './useLongclick'
import { useSearchParams } from 'react-router-dom'


interface MediaTileProps {
    fid: string
    onSelect?: (f: FileObj<any>, e?: any) => void
    onLongClick?: (fid: string, e?: any) => void
}

export const MediaTile: FunctionComponent<MediaTileProps> = ({ fid, onSelect, onLongClick }) => {
    const { ready, fref } = useOneImage(fid)
    let handleLongpress = {}
    handleLongpress = useLongPress(() => onLongClick && onLongClick(fid), e => onSelect && onSelect(fid, e))
    return <div
        {...handleLongpress}
        className='mediaManager-tile'
        onDragStart={event => {
            const tag = `\n\n![](${fid})\n\n`;
            event.dataTransfer.setData('text/plain', tag);
            event.dataTransfer.effectAllowed = 'linkMove';
            event.dataTransfer.setData('text/x-img-id', fid);
            //    setDragInProgress(img._id)
        }
        } >
        {ready && <img src={fref.link()} />}
        <label>{fref.name}</label>
    </div>
}


export interface MediaManagerProps {
    onSelect: (file: FileObj<any>) => boolean
    className?: string
}
export const MediaManager: FunctionComponent<MediaManagerProps> = (props) => {
    const [layout, setLayout] = useState('grid')

    const [searchString, setSearchString] = useState('')

    const { ready, files } = useTracker(() => {
        const fhandle = Meteor.subscribe('files.all')
        const files: FileObj<any>[] = UserFiles.find(q(searchString)).fetch();
        return { ready: fhandle.ready(), files }
    })
    console.log(ready)
    if (ready)
        return <div className={'widget-mediaManager ' + props.className}>
            <ul className='toolbar'>
                <li onClick={() => setLayout('list')}>List</li>
                <li onClick={() => setLayout('grid')}>Grid</li>
                <input value={searchString} onChange={({currentTarget:{value}})=>setSearchString(value)}/>
                <div>X</div>
            </ul>
            <ul className={layout}>
                {files.map(f => <li><MediaTile fid={f._id} onSelect={props.onSelect} /></li>)}
            </ul>
        </div>
    else
        return <div>Loading</div>
}


export const useOneImage = (_id: string): { ready: boolean; fref: FileRef<any> } => {
    return useTracker(() => {
        const fhandle = Meteor.subscribe('files.all')
        const fref = UserFiles.findOne(_id)
        return { ready: fhandle.ready(), fref }
    })
}

export const TImage = node => {
    console.log(node)
    const a = useOneImage(node.src)
    return a.ready ? <img src={a.fref.link()} className={node.alt} /> : <img />
}

function q(searchString: string) {
    if (searchString === '') {
        return;
    }
    return { name: { $regex: new RegExp(searchString) } }
}
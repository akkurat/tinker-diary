import * as React from 'react'
import { FileObj, FileRef } from "meteor/ostrio:files"
import { useTracker } from "meteor/react-meteor-data"
import { UserFiles } from "../api/collections/files"
import classNames from 'classnames'
import { DataTable } from 'primereact/datatable';
import { FunctionComponent, useState } from 'react'


export const MediaTile: FunctionComponent<{f: FileObj<any>, select?: (FileObj) => void}> = ({f, select}) => {
    const { ready, fref } = useOneImage(f._id)
    return <div 
    onClick={e => select(f,e)} 
    className='mediaManager-tile'
    onDragStart={ event => {
        const tag = `\n\n![](${f._id})\n\n`;
               event.dataTransfer.setData('text/plain', tag);
               event.dataTransfer.effectAllowed = 'linkMove';
               event.dataTransfer.setData('text/x-img-id', f._id);
            //    setDragInProgress(img._id)
    }
    }
    >
        {ready && <img src={fref.link()} /> }
        <label>{fref.name}</label>
    </div>
}


export interface MediaManagerProps {
    onSelect: (file: FileObj<any>) => boolean
    className?: string
}
export const MediaManager: FunctionComponent<MediaManagerProps> = (props) => {
    const [layout, setLayout] = useState('grid')

    const { ready, files } = useTracker(() => {
        const fhandle = Meteor.subscribe('files.all')
        const files: FileObj<any>[] = UserFiles.find().fetch();
        return { ready: fhandle.ready(), files }
    })
    if (ready)
        return <div className={'widget-mediaManager ' + props.className}>
            <ul className='toolbar'><li onClick={()=>setLayout('list')}>List</li><li onClick={()=>setLayout('grid')}>Grid</li></ul>
            <ul className={layout}>
                {files.map(f => <li><MediaTile f={f} select={props.onSelect} /></li>)}
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
   const a = useOneImage(node.src) 
   return a.ready ? <img src={a.fref.link() } /> : <img />
}

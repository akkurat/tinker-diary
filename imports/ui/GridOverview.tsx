import { LoremIpsum, loremIpsum } from "lorem-ipsum"
import { useTracker } from "meteor/react-meteor-data"
import * as React from 'react'
import { useEffect, useRef, useState } from "react"
import ReactMarkdown from "react-markdown"
import { Link, Route, Routes, useLocation, useNavigate, useParams, useResolvedPath } from "react-router-dom"
import { BlogCollection } from "../api/collections/blog"
import { UserFiles } from "../api/collections/files"
import { FileUploadToCollection } from "./FileuploadComponent"
import { unified } from "unified";
import remarkParse from "remark-parse";
import find from "unist-util-find";
import { toString } from "mdast-util-to-string";
import { visit } from "unist-util-visit";
import { useRemark } from "react-remark"
import { useRemarkMeta2 } from "./metaRemarkHook"
import { MediaManager, useOneImage } from "./MediaManager"
import { LinkedMedia } from "./WikiComponents/LinkedMedia"
import { FileObj } from "meteor/ostrio:files"
import classNames from "classnames"
import ReactImageGallery, { ReactImageGalleryItem } from "react-image-gallery"

import '../../node_modules/react-image-gallery/styles/css/image-gallery.css'




const l = new LoremIpsum({
    sentencesPerParagraph: {
        max: 8,
        min: 4
    },
    wordsPerSentence: {
        max: 16,
        min: 4
    }
})

const GridElement = ({ g, i }) => (<div key={i} className={classNames('blogGridChild', { 'span-2': g.files?.length > 1 })}>
    <h3><Link to={g._id}>{g.h}</Link></h3>
    <h2><Link to={g._id}>{g.t}</Link></h2>
    <p><Link to={g._id}>{g?.md?.substring(0, 200)}</Link></p>
    {g.files?.map(f => {
        const { ready, fref } = useOneImage(f)
        return ready ? <img src={fref.link()} /> : <img />
    })}
</div>)

const DummyGridelement = ({ i }) => (<div key={i} className="dummy blogGridChild">
    <h3>{l.generateWords(3)}</h3>
    <h2>{l.generateSentences(1)}</h2>
    {/* <div>{l.generateParagraphs(1).split("\n").map(p => <p>{p}</p>)}</div> */}
</div>)

const BlogGrid = () => {
    const { handle, grids } = useTracker(() => {
        const handle = Meteor.subscribe('blogs');
        const grids = BlogCollection.find().fetch()
        return { handle, grids }
    })
    const handleAdd = () => Meteor.call('blog.add')
    if (handle.ready()) {
        return <div className="blogGrid">
            {grids.map((g, i) => <GridElement g={g} i={i} />)}
            <div className="blogGridChild" onClick={handleAdd}>Add</div>
        </div>
    } else {
        return (
            <div className="blogGrid dummy">{[...Array(12).keys()].map(i => <DummyGridelement i={i} />)}</div>
        )
    }

}
const Preview = ({ md, className }: { md: string, className: string }) => {
    const [reactMetaContent, setMetaRact] = useRemarkMeta2()
    useEffect(() => {
        setMetaRact(md);
    }, [md, setMetaRact]);
    const { ready, fileRefs } = useTracker(() => {
        const fhandle = Meteor.subscribe('files.all');
        const fileRefs = reactMetaContent?.meta?.files
            .map((fid: string) => UserFiles.findOne(fid))
        return { fileRefs, ready: fhandle.ready() }
    })
    console.log(ready )
    const items: ReactImageGalleryItem = fileRefs
        ?.map(fref => fref.link())
        ?.map(url => ({ original: url }))
    return <div className={className}>
        {reactMetaContent?.vdom}
        {ready && <ReactImageGallery items={items} />}
    </div>
}

const GridElementLarge = () => {

    const { idx } = useParams()
    const { g, ready, files } = useOneBlog(idx)



    const handleUpdate = prop => ev =>
        Meteor.call('blog.update', idx, { [prop]: ev.currentTarget.innerText })
    const handleFiles = ev =>
        // debugger
        Meteor.call('blog.push', idx, { files: ev._id })


    const navigate = useNavigate()
    const handleRightClick = e => {
        e.preventDefault()
        navigate('edit')
    }

    if (ready) {
        return (<div className="articleContainer" onContextMenu={handleRightClick}>
            {/* {files && files.map(f => <img src={UserFiles.findOne(f._id).link()} />)} */}
            {/* <div id="edit" onClick={ev => setEditable(!editable)}>Edit</div> */}
            <Preview className="article" md={g.md} />
            {/* <FileUploadToCollection onSuccess={handleFiles} /> */}
        </div>
        )
    } else {
        return <h1>Loading...</h1>
    }
}


const EditInt = ({ g, files }) => {

    const [md, setMd] = useState(g.md)
    const navigate = useNavigate()
    const location = useLocation()

    const mdComp = <ReactMarkdown children={md} />

    const handleMdChange = ({ currentTarget }) => {
        const text = currentTarget.value
        setMd(text)
    }

    const loc = location.pathname
    const newLocation = loc.match(/^.*\//)[0]

    const handleClick = (ev) => {
        ev.preventDefault()
        if (ev.button == 2) {
            Meteor.call('blog.setMd', g._id, md,
                (err, res) => { if (err) { alert(err) } else { navigate(newLocation) } })
        }
    }
    const handleMediaSelect = (fid) =>
        Meteor.call('blog.push', g._id, { files: fid })
    const handleMediaRemove = (fid) =>
        Meteor.call('blog.pull', g._id, { files: fid })

    return <div className="view-articleEdit">
        <LinkedMedia files={files && files.map(f => f._id)} className="linkedMedia" onAdd={handleMediaSelect} onRemove={handleMediaRemove} />
        <Preview className="preview article" md={md} />
        <div className="editor">
            {/* <div>Parsed Title: {meta.head} / {meta.title} </div> */}
            <textarea onContextMenu={handleClick} value={md} onChange={handleMdChange}></textarea>
        </div>
    </div>
}

const Edit = () => {

    const { idx } = useParams()
    const { g, ready, files } = useOneBlog(idx)
    if (!ready)
        return <div>Loading...</div>
    else
        return <EditInt g={g} files={files} />

}


export const LeGrid = () => <Routes>
    <Route path="/" element={<BlogGrid />} />
    <Route path="/:idx" element={<GridElementLarge />} />
    <Route path="/:idx/edit" element={<Edit />} />
</Routes >
function useOneBlog(idx: string): { g: any; ready: boolean, files: FileObj } {
    return useTracker(() => {
        const handle = Meteor.subscribe('blog.one', idx)
        const handle2 = Meteor.subscribe('files.all', idx)
        const g = BlogCollection.findOne(idx)
        const files = g && g.files && UserFiles.find({ _id: { $in: g.files } }).fetch()
        return { g, ready: handle.ready() && handle2.ready(), files }
    })
}


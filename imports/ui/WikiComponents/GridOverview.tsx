import { LoremIpsum } from "lorem-ipsum"
import { useTracker } from "meteor/react-meteor-data"
import * as React from 'react'
import { Link, Route, Routes, useParams } from "react-router-dom"
import { BlogCollection } from "../../api/collections/blog"
import { UserFiles } from "../../api/collections/files"
import { useOneImage } from "../MediaManager"
import { FileObj } from "meteor/ostrio:files"
import classNames from "classnames"

import '../../../node_modules/react-image-gallery/styles/css/image-gallery.css'
import { GridElementLarge } from "./GridElementLarge"
import { EditInt } from "./EditInt"
import moment from "moment"




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
    <div>{moment(g.creationDate).format()}</div>
    <h3><Link to={g._id}>{g.h}</Link></h3>
    <h2><Link to={g._id}>{g.t}</Link></h2>
    <section className="lead"><Link to={g._id}>{g?.md?.substring(0, 200)}</Link></section>
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
export function useOneBlog(idx: string): { g: any; ready: boolean, files: FileObj } {
    return useTracker(() => {
        const handle = Meteor.subscribe('blog.one', idx)
        const handle2 = Meteor.subscribe('files.all', idx)
        const g = BlogCollection.findOne(idx)
        const files = g && g.files && UserFiles.find({ _id: { $in: g.files } }).fetch()
        return { g, ready: handle.ready() && handle2.ready(), files }
    })
}


import { LoremIpsum, loremIpsum } from "lorem-ipsum"
import { useTracker } from "meteor/react-meteor-data"
import * as React from 'react'
import { useRef, useState } from "react"
import ReactMarkdown from "react-markdown"
import { Link, Route, Routes, useNavigate, useParams, useResolvedPath } from "react-router-dom"
import { BlogCollection } from "../api/collections/blog"
import { UserFiles } from "../api/collections/files"
import { FileUploadToCollection } from "./FileuploadComponent"
import { unified } from "unified";
import remarkParse from "remark-parse";
import find from "unist-util-find";
import { toString } from "mdast-util-to-string";
import { visit } from "unist-util-visit";
import { useRemark } from "react-remark"
import { useRemarkMeta, useRemarkMeta2 } from "./metaRemarkHook"



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

const GridElement = ({ g, i }) => (<div key={i} id={'asdfsf' + i} className="blogGridChild">
    <h3>{g.h}</h3>
    <h2><Link to={g._id}>{g.t}</Link></h2>
    <div>{g.p.split("\n").map(p => <p>{p}</p>)}</div>
</div>)

const DummyGridelement = ({ i }) => (<div key={i} id={'asdfsf' + i} className="dummy blogGridChild">
    <h3>{l.generateWords(3)}</h3>
    <h2>{l.generateSentences(1)}</h2>
    <div>{l.generateParagraphs(1).split("\n").map(p => <p>{p}</p>)}</div>
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

const GridElementLarge = () => {

    const { idx } = useParams()
    const { g, handle, files } = useTracker(() => {
        const handle = Meteor.subscribe('blog.one', idx)
        const handle2 = Meteor.subscribe('files.all', idx)
        const g = BlogCollection.findOne(idx)
        const files = g && g.files && UserFiles.find({ _id: { $in: g.files } }).fetch()
        return { g, handle, files }
    })
    const [editable, setEditable] = useState(false)


    const handleUpdate = prop => ev =>
        Meteor.call('blog.update', idx, { [prop]: ev.currentTarget.innerText })
    const handleFiles = ev =>
        // debugger
        Meteor.call('blog.push', idx, { files: ev._id })



    if (handle.ready()) {
        return (<div className="articleContainer">
            {files && files.map(f => <img src={UserFiles.findOne(f._id).link()} />)}
            <div id="edit" onClick={ev => setEditable(!editable)}>Edit</div>
            <div className="article">
                <ReactMarkdown children={g.md} />
            </div>
            <FileUploadToCollection onSuccess={handleFiles} />
        </div>
        )
    } else {
        return <h1>Loading...</h1>
    }
}

const getTitle = (mdast) => {
    let h1 = find(mdast, { type: "heading", depth: 1 });
    return toString(h1 || "(Ohne Titel)");
}


const Edit = () => {
    const [md, setMd] = useState('')
    const navigate = useNavigate()
    const { idx } = useParams()

    const [reactMetaContent, meta, setMetaRact] = useRemarkMeta2()

    const mdComp = <ReactMarkdown children={md} />

    const handleMdChange = ({ currentTarget }) => {
        const text = currentTarget.value
        setMetaRact(text)
    }


    const handleClick = (ev) => {
        console.log(ev)
        if (ev.button == 2) {
            ev.preventDefault()
            Meteor.call('blogs.update', idx, { md, meta },
                (err, res) => { if (!err) navigate('..') })
        }
    }

    console.log(reactMetaContent)

    return <div className="articleEdit">
        <div>Parsed Title: {meta} </div>
        <textarea onClick={handleClick} onChange={handleMdChange}></textarea>
        {reactMetaContent}
    </div>
}


export const LeGrid = () => <Routes>
    <Route path="/" element={<BlogGrid />} />
    <Route path="/:idx" element={<GridElementLarge />} />
    <Route path="/:idx/edit" element={<Edit />} />
</Routes >

import { LoremIpsum, loremIpsum } from "lorem-ipsum"
import * as React from 'react'
import { Link, Route, Routes, useMatch, useParams, useResolvedPath } from "react-router-dom"



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
const grids = [...Array(12).keys()].map(idx => ({ t: l.generateSentences(4), h: l.generateWords(2), p: l.generateParagraphs(40) }))

const GridElement = ({ g, i }) => (<div key={i} id={'asdfsf' + i} className="blogGridChild">
    <h3>{g.h}</h3>
    <h2><Link to={"" + i}>{g.t}</Link></h2>
    <div>{g.p.split("\n").map(p => <p>{p}</p>)}</div>
</div>)

const GridElementLarge = () => {

    const { idx } = useParams()
    const g = grids[idx]
        return (<div className="article">
            <h3>{g.h}</h3>
            <h2><Link to={"" + idx}>{g.t}</Link></h2>
            <div>{g.p.split("\n").map(p => <p>{p}</p>)}</div>
        </div>)
}

export const LeGrid = () => {


    return <Routes>
        <Route path="/" element={
            <div className="blogGrid">
                <>
                    {grids.map((g, i) => <GridElement g={g} i={i} />)}
                </>
            </div>}>
        </Route>
        <Route path="/:idx" element={
            <GridElementLarge  />
        }>
        </Route>
    </Routes>
}
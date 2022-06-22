import * as React from 'react'
import { LoremIpsum } from "lorem-ipsum"
import { useEffect, useState } from 'react'
import { useTracker } from 'meteor/react-meteor-data'
import { UserFiles } from '../api/collections/files'

const lor = new LoremIpsum()
export const Projects = () => {

    const { ready, files } = useTracker(() => {
        const fhandle = Meteor.subscribe('files.all')
        const files = UserFiles.find().map(fo => UserFiles.findOne(fo._id))
        const ready = fhandle.ready()
        return { ready, files }
    })
    function convertToElement(node, y) {
        // @ts-ignore
        return <div className='node'
            style={{ '--fac': y }}
        >
            <div>{ready && <img src={files[node.i % files.length].link('thumbnail')} />}</div>
            <div >{node.children.map(n => convertToElement(n, 1.5 * y))}</div>
        </div>
    }

    const graph = React.useMemo(() => {const cunt = {i:0}; return [...Array(20).keys()].map(() => createGraph(randInt(3),cunt))}, [])
    const y = useScroll('mainContainer')
    return <div className="graph">
        {graph.map((node, i) => convertToElement(node, (i + y / 10)))}
    </div>
}

function useScroll(id?: string) {
    const [scrollPosition, setScrollPosition] = useState(0);
    const handleScroll = (ev) => {
        const position = ev.currentTarget.scrollLeft;
        setScrollPosition(position);
    };

    useEffect(() => {
        const element = id ? document.getElementById(id) : window
        if (element) {
            element.addEventListener('scroll', handleScroll, { passive: true });

            return () => {
                element.removeEventListener('scroll', handleScroll);
            };
        }
    }, []);
    return scrollPosition;
}



function createGraph(depth = 5, cunt: {i: number}) {
    const i = cunt.i++;
    let children
    if (depth > 0) {
        children = [...Array(randInt(0, 5))].map(
            () => createGraph(depth - 1, cunt)
        )
    } else {
        children = []
    }
    return {
        text: lor.generateWords(2),
        i,
        children
    }
}




function randInt(max, min = 0) {
    return Math.floor(Math.random() * max) + min
}
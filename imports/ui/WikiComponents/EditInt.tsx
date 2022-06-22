import * as React from 'react';
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { useLocation, useNavigate } from "react-router-dom";
import { LinkedMedia } from "./LinkedMedia";
import { Preview } from "./Preview";


export const EditInt = ({ g, files }) => {

    const [md, setMd] = useState(g.md);
    const navigate = useNavigate();
    const location = useLocation();

    const mdComp = <ReactMarkdown children={md} />;

    const handleMdChange = ({ currentTarget }) => {
        const text = currentTarget.value;
        setMd(text);
    };

    const loc = location.pathname;
    const newLocation = loc.match(/^.*\//)[0];

    const handleClick = (ev) => {
        ev.preventDefault();
        if (ev.button == 2) {
            Meteor.call('blog.setMd', g._id, md,
                (err, res) => { if (err) { alert(err); } else { navigate(newLocation); } });
        }
    };
    const handleMediaSelect = (fid) => Meteor.call('blog.push', g._id, { files: fid });
    const handleMediaRemove = (fid) => Meteor.call('blog.pull', g._id, { files: fid });

    return <div className="view-articleEdit">
        <LinkedMedia files={files && files.map(f => f._id)} className="linkedMedia" onAdd={handleMediaSelect} onRemove={handleMediaRemove} />
        <Preview className="preview article" md={md} />
        <div className="editor">
            {/* <div>Parsed Title: {meta.head} / {meta.title} </div> */}
            <textarea onContextMenu={handleClick} value={md} onChange={handleMdChange}></textarea>
        </div>
    </div>;
};

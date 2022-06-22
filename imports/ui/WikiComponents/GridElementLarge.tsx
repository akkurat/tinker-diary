import moment from 'moment';
import * as React from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { useOneBlog } from "./GridOverview";
import { Preview } from "./Preview";

export function GridElementLarge() {

    const { idx } = useParams();
    const { g, ready, files } = useOneBlog(idx);

    const navigate = useNavigate();
    const handleRightClick = e => {
        e.preventDefault();
        navigate('edit');
    };

    return <div className="articleContainer" onContextMenu={handleRightClick}>
        {ready ?
            <>
                <div>{moment(g.creationDate).format()}</div>
                <Preview className="article" md={g.md} />
            </>
            :
            <div className='loading'></div>
        }
    </div>
}

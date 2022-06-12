import * as React from 'react'
import { BottomNav } from './App'
import Fileuploads from './Fileuploads'

export const Up = () => {
    const bottomNav = React.useContext(BottomNav)
    const memo = React.useMemo(() => <div>Quark!!!</div>, [])
    bottomNav(p => { console.log(p); return memo })

    React.useEffect(() => () => {
        bottomNav(<>Friss brot...</>)
    }, [])

    return <>
        <h1>Üpload</h1>
        <Fileuploads />

    </>
}

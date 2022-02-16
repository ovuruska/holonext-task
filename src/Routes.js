import React from "react"
import {Route, Routes} from "react-router-dom"
import Homepage from "./pages/home/index"

export default () => (<Routes>
    <Route path="/"  element={<Homepage/>}/>
</Routes>)
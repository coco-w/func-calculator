import React from 'react'
import Home from './page/home'
import TemplatePage from '@/page/template'
import 'antd/dist/antd.css'
import { Route, Switch, HashRouter } from 'react-router-dom'
function App(): JSX.Element {
  return (
    
    <div className="App">
      <HashRouter>
        <Switch>
          <Route exact path="/" component={Home}/>
          <Route exact path="/template" component={TemplatePage}/>
        </Switch>
      </HashRouter>
    </div>
  );
}

export default App;

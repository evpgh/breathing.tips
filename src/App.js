import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Homepage } from './components/homepage/homepage.component';
import { Switch, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import * as Panelbear from "@panelbear/panelbear-js";

const Practice = lazy(() => import('./components/practice/practice.component'));

function App() {
  Panelbear.load("EeEam2n4ral");
  return (
    <div className="App">
      <Suspense fallback={<div className="container col-12 d-flex justify-content-center"><p className="mx-auto">Loading...</p></div>}>
        <Switch>
          <Route exact path='/' component={Homepage} />
          <Route path='/practice/:tipId' component={Practice} />
        </Switch>
      </Suspense>
    </div>
  );
}

export default App;

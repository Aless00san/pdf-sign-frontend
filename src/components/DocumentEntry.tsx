import type {Document} from "../types/types";
import "./App.css";

function DocumentEntry({ document } : { document: Document }) {
  return <>
    <div className="box border-box m-2 is-flex is-justify-content-space-between w-half has-background-blue-light">
        <h3 className="subtitle is-5">{document.name.substring(0, 35)}{document.name.length > 35 && "..."}</h3>
        <div className="buttons">
          <button className="button is-primary">Sign</button>
          <button className="button is-danger">Delete</button>
        </div>
    </div>
  </>;
}

export default DocumentEntry;

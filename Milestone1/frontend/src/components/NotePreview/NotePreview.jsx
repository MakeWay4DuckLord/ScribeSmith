import './notePreview.css'
import Tag from "../Tag/Tag";

export default function Note(note) {
   return (
        <div className="notePreviewComponent">
            <header>
                <img className="icon" src="https://robohash.org/veniamdoloresenim.png?size=64x64&set=set1" alt="user icon" />
                <h2>Note Title</h2>
                <time>1hr ago</time>
            </header>
            
            <p>In tempor, turpis nec euismod scelerisque, quam turpis adipiscing lorem, vitae mattis nibh ligula nec sem. Duis aliquam convallis nunc. Proin at turpis a pede posuere nonummy.</p>
            <div className="tagContainer">
                <Tag content={"session1"} />
                <Tag content={"ideas"} />
            </div>
        </div>

   ) 
}
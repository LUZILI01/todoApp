import { useEffect, useRef, useState, useCallback } from "react"; 
import Popup from "reactjs-popup"; 
import "reactjs-popup/dist/index.css"; 
import Webcam from "react-webcam"; 
import { addPhoto,deletePhoto, GetPhotoSrc } from "../db.jsx"; 
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";


function Todo(props) {
  const [isEditing, setEditing] = useState(false);
  const [newName, setNewName] = useState("");
  const editButtonRef = useRef(null);
  const [returnToMain, setReturnToMain] = useState(false);
  const [imgSrc, setImgSrc] = useState(null);

  function handleChange(e) {
    setNewName(e.target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();
    props.editTask(props.id, newName);
    setNewName("");
    setEditing(false);
  }
  

  const editingTemplate = (
    <form className="stack-small" onSubmit={handleSubmit}>

    <div className="form-group">
      <label className="todo-label" htmlFor={props.id}>
        New name for {props.name}
      </label>
      <input
          id={props.id}
          className="todo-text"
          type="text"
          value={newName}
          onChange={handleChange}
        />
    </div>
    <div className="btn-group">
    <button
  type="button"
  className="btn todo-cancel"
  onClick={() => setEditing(false)}>
  Cancel
  <span className="visually-hidden">renaming {props.name}</span>
</button>

      <button type="submit" className="btn btn__primary todo-edit">
        Save
        <span className="visually-hidden">new name for {props.name}</span>
      </button>
    </div>
  </form>
);
const viewTemplate = (
  <div className="stack-small">
  <div className="c-cb">
  <input
  id={props.id}
  type="checkbox"
  defaultChecked={props.completed}
  onChange={() => props.toggleTaskCompleted(props.id)}
  />
  <label className="todo-label" htmlFor={props.id}>
  {props.name}

  <a href={props.location.mapURL}>(map)</a>
  &nbsp; | &nbsp;
  <a href={props.location.smsURL}>(sms)</a> 
 
  </label>
  </div>
  <div className="btn-group">
  <button
  type="button"
  className="btn"
  onClick={() => {
  setEditing(true);
  }}
  ref={editButtonRef}
  >
  Edit <span className="visually-hidden">{props.name}</span>
  </button>
  <Popup 
  trigger={
  <button type="button" className="btn">
  {" "}
  Take Photo{" "}
  </button>
  }
  modal
  >
  <div>
  <WebcamCapture id={props.id} photoedTask={props.photoedTask} 
  imgSrc={imgSrc} setImgSrc={setImgSrc}/>
  </div>
  </Popup>
  
  <Popup 
  
  trigger={
    
  <button type="button" className="btn">
  {" "}
  View Photo{" "}
  </button>
  }
  modal
  >
  <div>
  <ViewPhoto id={props.id} alt={props.name} />
  </div>
  </Popup>
  <button
  type="button"
  className="btn btn__danger"
  onClick={() => props.deleteTask(props.id)}
  >
  Delete <span className="visually-hidden">{props.name}</span>
  </button>
  </div>
  </div>
  );


return <li className="todo">{isEditing ? editingTemplate : viewTemplate}</li>;

  }

const WebcamCapture = ({ imgSrc, setImgSrc, ...props }) => {
    const webcamRef = useRef(null);
    
    const [imgId, setImgId] = useState(null);
    const [photoSave, setPhotoSave] = useState(false);
  
    useEffect(() => {
    if (photoSave) {
    console.log("useEffect detected photoSave");
    props.photoedTask(imgId);
    setPhotoSave(false);
    }
    });
    console.log("WebCamCapture", props.id);
   
  
    const capture = useCallback( (id) => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImgSrc(imageSrc);
    console.log("capture", imageSrc.length, id);
    },
    [webcamRef, setImgSrc]
    );
 
    const savePhoto = (id, imgSrc) => {
    console.log("savePhoto", imgSrc.length, id);
    addPhoto(id, imgSrc);
    setImgId(id);
    setPhotoSave(true);
    setReturnToMain(true);
    };
    const [returnToMain, setReturnToMain] = useState(false); 

    const cancelPhoto = (id, imgSrc) => {
      if (!imgSrc) {
       alert("img is empty");
        return;
      }else{
        alert("cancelPhoto", imgSrc.length, id);
        setImgSrc(null);
      }
      
   

      
    };
    return (
    <>
    {!imgSrc && (
    <Webcam audio={false} ref={webcamRef} screenshotFormat="image/jpeg" />
    )}
    {imgSrc && <img src={imgSrc} />}
    <div className="btn-group">
    {!imgSrc && ( 
    <button
    type="button"
    className="btn"
    onClick={() => capture(props.id)}>
    Capture photo
    </button>
    )}
    {imgSrc && ( 
    <button
    type="button"
    className="btn"
    onClick={() => savePhoto(props.id, imgSrc)}>
    Save Photo
    </button>
    )}
    <button 
    type="button"
    className="btn todo-cancel"
    onClick={() => cancelPhoto(props.id, imgSrc)
    
    }>
    Cancel
    </button>
    </div>
    </>);
   };


   const ViewPhoto = (props) => {
    const photoSrc = GetPhotoSrc(props.id);
    
    if (GetPhotoSrc(props.id)==null) {
      alert("ID is empty.");
      return null; 
    }
  
    const handleDeletePhoto = () => {
      deletePhoto(props.id);
    };
    
    return (
      
    <>
    <div style={{margin: 'auto' }}>

    <img src={photoSrc} alt={props.name} />
    
    <button
              type="button"
              className="btn btn__danger"
              onClick={() => {
                handleDeletePhoto();
              }}
            >
              Delete Photo
            </button>
       
    
    
    </div>
    </>
    );
   };
  
  export default Todo;
  
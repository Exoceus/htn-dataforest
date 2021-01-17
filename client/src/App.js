
import React, { useState, useEffect, useRef } from "react"
import "./App.css"

const App = () => {

  const canvas = useRef(null)
  const ctxRef = useRef(null)

  const [image, setImage] = useState(null)
  const [imageURL, setURL] = useState('')

  const [isDrawing, setIsDrawing] = useState(false)
  const [boxOriginX, setBoxOriginX] = useState(0)
  const [boxOriginY, setBoxOriginY] = useState(0)

  const [currentLabel, setCurrentLabel] = useState("0")

  const [boxesHistory, setBoxesHistory] = useState([])

  useEffect(() => {
    const rawImage = new Image();
    rawImage.src = imageURL
    rawImage.onload = () => setImage(rawImage)

  }, [imageURL])

  useEffect(() => {
    if (image && canvas) {
      const ctx = canvas.current.getContext("2d")
      ctx.canvas.height = image.naturalHeight * 2
      ctx.canvas.width = image.naturalWidth * 2

      canvas.current.style.width = `${image.naturalWidth}px`;
      canvas.current.style.height = `${image.naturalHeight}px`;


      ctx.scale(2, 2);
      ctx.lineWidth = 2;

      ctx.drawImage(image, 0, 0)

      ctxRef.current = canvas.current.getContext("2d")
    }
  }, [image])

  if (image && ctxRef.current) {
    ctxRef.current.clearRect(0, 0, canvas.width, canvas.height);
    ctxRef.current.drawImage(image, 0, 0)

    boxesHistory.forEach(boxes => {
      if (boxes.label == "0") {
        ctxRef.current.strokeStyle = "blue";
      }

      else {
        ctxRef.current.strokeStyle = "red";
      }

      ctxRef.current.strokeRect(boxes.x, boxes.y, boxes.width, boxes.height);
    });
  }

  const startDrawing = ({ nativeEvent }) => {
    if (image) {
      const { offsetX, offsetY } = nativeEvent;
      //ctxRef.current.moveTo(offsetX, offsetY);
      ctxRef.current.beginPath()
      setBoxOriginX(offsetX)
      setBoxOriginY(offsetY)
      setIsDrawing(true);
    }
  };

  const finishDrawing = ({ nativeEvent }) => {
    if (image) {
      const { offsetX, offsetY } = nativeEvent;
      ctxRef.current.closePath();

      ctxRef.current.clearRect(0, 0, canvas.width, canvas.height);
      ctxRef.current.drawImage(image, 0, 0)

      boxesHistory.forEach(boxes => {
        if (boxes.label == "0") {
          ctxRef.current.strokeStyle = "blue";
        }

        else {
          ctxRef.current.strokeStyle = "red";
        }

        ctxRef.current.strokeRect(boxes.x, boxes.y, boxes.width, boxes.height);
      });

      ctxRef.current.strokeRect(boxOriginX, boxOriginY, offsetX - boxOriginX, offsetY - boxOriginY);

      const newboxesHistory = [...boxesHistory, { label: currentLabel, x: boxOriginX, y: boxOriginY, width: offsetX - boxOriginX, height: offsetY - boxOriginY }];

      setBoxesHistory(newboxesHistory)

      setIsDrawing(false);
    }
  };

  const draw = ({ nativeEvent }) => {
    const { offsetX, offsetY } = nativeEvent;

    if (!isDrawing) {
      return;
    }

    if (ctxRef.current.isPointInPath(offsetX, offsetY)) {
      console.log('Tee')
    }

    else if (image) {
      ctxRef.current.clearRect(0, 0, canvas.width, canvas.height);
      ctxRef.current.drawImage(image, 0, 0)

      boxesHistory.forEach(boxes => {
        if (boxes.label == "0") {
          ctxRef.current.strokeStyle = "blue";
        }

        else {
          ctxRef.current.strokeStyle = "red";
        }

        ctxRef.current.strokeRect(boxes.x, boxes.y, boxes.width, boxes.height);
      });

      ctxRef.current.setLineDash([4]);
      if (currentLabel == "0") {
        ctxRef.current.strokeStyle = "blue";
      }

      else {
        ctxRef.current.strokeStyle = "red";
      }

      ctxRef.current.strokeRect(boxOriginX, boxOriginY, offsetX - boxOriginX, offsetY - boxOriginY);

      ctxRef.current.setLineDash([0]);

    }
  };


  if (image) {
    var image_specs = <span>Image Width: {image.naturalWidth}, Height:  {image.naturalHeight}</span>

    var labels_heading = <h4>Labels</h4>
    var label_selection = <><input type="radio" value={0} onChange={e => { setCurrentLabel(e.target.value); }} checked={currentLabel == "0"} />Adult Cheetahs  <input type="radio" name="drivers" value={1} onChange={e => setCurrentLabel(e.target.value)} checked={currentLabel == "1"} />Baby Cheetahs </>
  }

  if (boxesHistory.length > 0) {
    var boxes_legend = <h4>Bounding Boxes</h4>

    var boxes_list = boxesHistory.map((item, index) =>
      <div>Label: {item.label}, X: {item.x}, Y: {item.y}, Width: {item.width}, Height: {item.height} <button onClick={() => remove(index)}>Delete</button></div>
    );

  }

  const remove = (index) => {
    console.log("it works")
    const newBoxes = [...boxesHistory];
    newBoxes.splice(index, 1);

    setBoxesHistory(newBoxes);

    ctxRef.current.clearRect(0, 0, canvas.width, canvas.height);
    ctxRef.current.drawImage(image, 0, 0)

    boxesHistory.forEach(boxes => {
      if (boxes.label == "0") {
        ctxRef.current.strokeStyle = "blue";
      }

      else {
        ctxRef.current.strokeStyle = "red";
      }

      ctxRef.current.strokeRect(boxes.x, boxes.y, boxes.width, boxes.height);
    });
  }

  console.log(boxesHistory, currentLabel);

  return (
    <div>
      <h1>Please provide an image and label it</h1>
      {image_specs}
      <br />
      <div>
        <input type="text"
          className="image-url-input"
          value={imageURL}
          onChange={e => setURL(e.target.value)}
        />

      </div>
      <br />
      {labels_heading}
      {label_selection}
      <br />
      <br />
      <div>
        <canvas
          ref={canvas}
          onMouseDown={startDrawing}
          onMouseUp={finishDrawing}
          onMouseMove={draw}

          className="labelling-canvas"
        />
      </div>
      {boxes_legend}
      {boxes_list}

    </div>
  )
}

export default App
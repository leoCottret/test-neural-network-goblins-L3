export const drawRect = (detections, ctx) =>{
  // Loop through each prediction
  // eg [ [class: cellphone] [class: person]]
  detections.forEach(prediction => {

    // Extract boxes and classes
    const [x, y, width, height] = prediction['bbox'];
    const text = prediction['class']; 

    // Set styling
    const color = 'green'// Math.floor(Math.random()*16777215).toString(16);
    ctx.strokeStyle = color// '#' + color
    ctx.font = '18px Arial';

    // Draw rectangles and text
    ctx.beginPath();   
    ctx.fillStyle = '#' + color
    ctx.fillText(text, x, y); // write what has been detected
    ctx.rect(x, y, width, height); // set a rectangle around each one of the predictions
    ctx.stroke(); // draw everything
  });
}

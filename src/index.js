// Encapsulate scrpit in an immediately invoked function
(function()
{
	'use strict';
	
	// Global variables
	const canvasWidth = 800, canvasHeight = 600;
	let ctx;
	let x = .01, y = 0, z = 0;
	let xPrev = .01, yPrev = 0, zPrev = 0;
	let a = 5, b = 29, c = 8/3;
	let scale = 8;
	let counter = 0;
	let transitionTime = 1000;
	let invertX = false;
	let invertY = false;
	let innerScale = 100;
	let decimate = 100;
	let mode = 0;
	
	// Call init once the window loads
	window.onload = init;
	
	// Initialize canvas
	function init(){
	  ctx = canvas.getContext("2d");
	  canvas.width = canvasWidth;
	  canvas.height = canvasHeight;
	  ctx.fillRect(0,0,canvasWidth,canvasHeight);
	  
	  // Begin loop
	  update();
	}
	
	// Update loop
	function update()
	{
		// The magic behind the framerate
		requestAnimationFrame(update);
		
		// Increment over time
		counter++;
		
		// Time scalar
		let dt = .01;
		
		// Calculate change in variables
		let dx = (a * (y-x)) * dt;
		let dy = (x * (b-z) - y) * dt;
		let dz = (x * y - c * z) * dt;
		
		// Store previous frame data
		xPrev = x;
		yPrev = y;
		zPrev = z;
		
		// Update to current values
		x = xPrev + dx;
		y = yPrev + dy;
		z = zPrev + dz;
		
		// Obtain a reference to the Reflect Horizontally checkbox event handler
		document.querySelector('#reflectX').onchange = function(e)
		{
			// On change, clear the screen
			ctx.save();
			ctx.fillStyle = "black";
			ctx.fillRect(0,0,canvasWidth,canvasHeight);
			ctx.restore();
			
			if(e.target.checked)
			{
				invertX = true;
			}
			else
			{
				invertX = false;
			}
		}

		// Obtain a reference to the Reflect Vertically checkbox event handler
		document.querySelector('#reflectY').onchange = function(e)
		{
			// On change, clear the screen
			ctx.save();
			ctx.fillStyle = "black";
			ctx.fillRect(0,0,canvasWidth,canvasHeight);
			ctx.restore();
			
			if(e.target.checked)
			{
				invertY = true;
			}
			else
			{
				invertY = false;
			}
		}
		
		// Obtain a reference to the wireframe mode radio buttons
		document.querySelector('#wiremode').onchange = function(e)
		{
			// Adjust mode toggle
			mode = document.querySelector('#wiremode').value;
			
			// On change, clear the screen
			ctx.save();
			ctx.fillStyle = "black";
			ctx.fillRect(0,0,canvasWidth,canvasHeight);
			ctx.restore();
		}
		
		// Obtain a reference to the poly mode radio buttons
		document.querySelector('#polymode').onchange = function(e)
		{
			// Adjust mode toggle
			mode = document.querySelector('#polymode').value;
			
			// On change, clear the screen
			ctx.save();
			ctx.fillStyle = "black";
			ctx.fillRect(0,0,canvasWidth,canvasHeight);
			ctx.restore();
		}
		
		// Obtain a reference to the inner scale slider
		document.querySelector('#innerScale').oninput = function(e)
		{
			// On input adjust the scalar
			innerScale = document.querySelector('#innerScale').value;
		}
			
		// If in wireframe mode
		if(mode == 0)
		{
			// Draw the Lorenz Attractor
			drawLorenz(scale, scale);

			// If both Reflections are checked
			if(invertX && invertY)
			{
				// Draw with both axis inverted
				drawLorenz(scale * (-1), scale);
				drawLorenz(scale, scale * (-1));
				drawLorenz(scale * (-1), scale * (-1));
			}
			else
			{
				// If Reflect Horizontally is checked
				if(invertX)
				{
					// Draw again with inverted X scale
					drawLorenz(scale * (-1), scale);
				}

				// If Reflect Vertically is checked
				if(invertY)
				{
					// Draw again with inverted X scale
					drawLorenz(scale, scale * (-1));
				}
			}
		}
		
		// If in poly mode
		if(mode == 1)
		{
			// Draw the Lorenz Attractor
			drawTris(scale, scale);

			// If both Reflections are checked
			if(invertX && invertY)
			{
				// Draw with both axis inverted
				drawTris(scale * (-1), scale);
				drawTris(scale, scale * (-1));
				drawTris(scale * (-1), scale * (-1));
			}
			else
			{
				// If Reflect Horizontally is checked
				if(invertX)
				{
					// Draw again with inverted X scale
					drawTris(scale * (-1), scale);
				}

				// If Reflect Vertically is checked
				if(invertY)
				{
					// Draw again with inverted X scale
					drawTris(scale, scale * (-1));
				}
			}
		}
	}
	
	// Draw Lorenz pattern in wire frame mode
	function drawLorenz(_scaleX, _scaleY)
	{
		// Draw segments between lorenz points at ORIGINAL scale
		ctx.save();
		ctx.translate(canvasWidth/2,canvasHeight/2);
		ctx.strokeStyle = `hsl(${z * scale},100%,50%)`;
		ctx.beginPath();
		ctx.moveTo(xPrev * 2 * _scaleX, yPrev * _scaleY);
		ctx.lineTo(x * 2 * _scaleX, y * _scaleY);
		ctx.stroke();
		ctx.restore();

		 //Draw segments between lorenz points at REDUCED X scale
		ctx.save();
		ctx.translate(canvasWidth/2,canvasHeight/2);
		ctx.strokeStyle = `hsl(${z * scale},100%,50%)`;
		ctx.beginPath();
		ctx.moveTo(xPrev * _scaleX  * (innerScale / decimate), yPrev * _scaleY);
		ctx.lineTo(x * _scaleX * (innerScale / decimate), y * _scaleY);
		ctx.stroke();
		ctx.restore();

		// Connect the two above paths
		ctx.save();
		ctx.translate(canvasWidth/2,canvasHeight/2);
		ctx.strokeStyle = `hsl(${z * scale},100%,50%)`;
		ctx.beginPath();
		ctx.moveTo(xPrev * 2 * _scaleX, yPrev * _scaleY);
		ctx.lineTo(x * _scaleX * (innerScale / decimate), y * _scaleY);
		ctx.stroke();
		ctx.restore();		
	}
	
	// Draw polygonal version of Lorenz
	function drawTris(_scaleX, _scaleY)
	{
		// Draw triangles
		ctx.save();
		ctx.translate(canvasWidth/2,canvasHeight/2);
		ctx.fillStyle = `hsl(${z * scale},100%,50%)`;
		ctx.strokeStyle = "black";
		ctx.beginPath();
		ctx.moveTo(xPrev * 2 * _scaleX, yPrev * _scaleY);
		ctx.lineTo(x * 2 * _scaleX, y * _scaleY);
		ctx.lineTo(x * _scaleX * (innerScale / decimate), y * _scaleY);
		ctx.closePath();
		ctx.lineTo(x * _scaleX * (innerScale / decimate), y * _scaleY);
		ctx.closePath();
		ctx.stroke();
		ctx.fill();
		ctx.restore();
		
		// Connect points of tris
		ctx.save();
		ctx.translate(canvasWidth/2,canvasHeight/2);
		ctx.strokeStyle = `hsl(${z * scale},100%,50%)`;
		ctx.beginPath();
		ctx.moveTo(xPrev * _scaleX  * (innerScale / decimate), yPrev * _scaleY);
		ctx.lineTo(x * _scaleX * (innerScale / decimate), y * _scaleY);
		ctx.stroke();
		ctx.restore();
	}
	
})()
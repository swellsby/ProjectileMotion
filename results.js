document.addEventListener("DOMContentLoaded", function () {
    // Function to extract query parameters from the URL
    function getQueryParams() {
      const params = new URLSearchParams(window.location.search);
      return {
        initialVelocity: parseFloat(params.get("initialVelocity")),
        launchAngle: parseFloat(params.get("launchAngle")),
        viewingAxis: params.get("viewingAxis"),
      };
    }
  
    // Function to calculate simulation results
    function calculateSimulationResults(initialVelocity, launchAngleRad) {
      // Replace this section with your actual simulation calculations
      const timeTaken = 2 * initialVelocity * Math.sin(launchAngleRad) / 9.81;
      const maxHeight = (initialVelocity ** 2) * (Math.sin(launchAngleRad) ** 2) / (2 * 9.81);
      const distanceTraveled = initialVelocity ** 2 * Math.sin(2 * launchAngleRad) / 9.81;
  
      return {
        timeTaken,
        maxHeight,
        distanceTraveled,
      };
    }
  
    // Function to update the content of the simulationResults div
    function displaySimulationResults(results) {
      const simulationResultsDiv = document.getElementById("simulationResults");
      simulationResultsDiv.innerHTML = `
        <p>Initial Velocity: ${results.initialVelocity} m/s</p>
        <p>Launch Angle: ${results.launchAngle} degrees</p>
        <p>Viewing Axis: ${results.viewingAxis}</p>
        <p>Time Taken: ${results.timeTaken.toFixed(2)} seconds</p>
        <p>Maximum Height: ${results.maxHeight.toFixed(2)} meters</p>
        <p>Distance Traveled: ${results.distanceTraveled.toFixed(2)} meters</p>
      `;
    }
    
    // Defining the appropriate scale factor
    function calculateScaleFactor(distanceTraveled) {
        const scaleFactor = 2 - Math.floor(Math.log10(distanceTraveled));
        return scaleFactor;
    }

    // Function to draw the animation of the projectile path
    function drawProjectilePath(initialVelocity, launchAngleRad, viewingAxis, distanceTraveled) {
        const canvas = document.getElementById("animationCanvas");
        const context = canvas.getContext("2d");
        const tMax = 2 * initialVelocity * Math.sin(launchAngleRad) / 9.81;
        // Calculate the scale factor based on distanceTraveled
        const scaleFactor = calculateScaleFactor(distanceTraveled);
        
        // Clear the canvas
        context.clearRect(0, 0, canvas.width, canvas.height);

        // Set up the initial position
        let x = 0;
        let y = 0;
        let t = 0;
        const dt = 0.01; // Time step for animation
        const g = (10 ** scaleFactor) * 9.81;

        // Adjust ball size based on canvas size
        const ballSize = Math.max(5, canvas.width * 0.01);

        // Set up the initial position for the ball
        let ballX = 0;
        let ballY = 0;

        // Array to store path segments
        const pathSegments = [];

        // Calculate the center of the canvas based on the viewing axis
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        
        // Animation loop
        const animationInterval = setInterval(function () {
        if (t > tMax) {
            clearInterval(animationInterval);
        }

        // Update x and y based on the chosen viewing axis
        if (viewingAxis === "x") {
            x = (initialVelocity * 10 ** scaleFactor) * Math.cos(launchAngleRad) * t;
            y = centerY; // centerY is set outside the loop to keep the animation centered
        } else if (viewingAxis === "y") {
            x = centerX; // centerX is set outside the loop to keep the animation centered
            y = (initialVelocity * 10 ** scaleFactor) * Math.sin(launchAngleRad) * t - (0.5 * g * t * t);
        } else if (viewingAxis === "z") {
            x = (initialVelocity * 10 ** scaleFactor) * Math.cos(launchAngleRad) * t;
            y = (initialVelocity * 10 ** scaleFactor) * Math.sin(launchAngleRad) * t - (0.5 * g * t * t);
        }

        // Invert y-coordinate to match normal Cartesian coordinate system
        y = canvas.height - y;

        // Clear the canvas for each frame to create animation effect
        context.clearRect(0, 0, canvas.width, canvas.height);

        // Draw the border for each frame
        context.strokeStyle = "black";
        context.lineWidth = 5;
        context.strokeRect(0, 0, canvas.width, canvas.height);

        // Draw grid lines and axis labels
        const numGridLines = 10;
        const gridSpacingX = canvas.width / numGridLines;
        const gridSpacingY = canvas.height / numGridLines;
        const yAxisLabelOffset = 20; // Offset for y-axis labels
        context.strokeStyle = "rgba(0, 0, 0, 0.1)"; // Faint grid line color

        for (let i = 1; i < numGridLines; i++) {
            // Draw vertical grid lines
            context.beginPath();
            context.moveTo(i * gridSpacingX, 0);
            context.lineTo(i * gridSpacingX, canvas.height);
            context.stroke();

            // Draw horizontal grid lines
            context.beginPath();
            context.moveTo(0, i * gridSpacingY);
            context.lineTo(canvas.width, i * gridSpacingY);
            context.stroke();

            // Draw x-axis labels for x and z viewing axes
            if (viewingAxis === "x" || viewingAxis === "z") {
                context.fillStyle = "black";
                context.font = "12px Arial";
                context.textAlign = "center";
                const labelValue = (i * gridSpacingX) / (10 ** scaleFactor);
                context.fillText(labelValue, i * gridSpacingX, canvas.height - 5);
            }

            // Draw y-axis labels for y and z viewing axes
            if (viewingAxis === "y" || viewingAxis === "z") {
                context.fillStyle = "black";
                context.font = "12px Arial";
                context.textAlign = "left";
                const labelValue = (i * gridSpacingY) / (10 ** scaleFactor);
                context.fillText(labelValue, yAxisLabelOffset, canvas.height - (i * gridSpacingY));
            }
        }

        // Add the current position to the path segments array
        pathSegments.push({ x, y });

        // Draw the blue path
        context.beginPath();
        context.moveTo(pathSegments[0].x, pathSegments[0].y);
        for (let i = 1; i < pathSegments.length; i++) {
            context.lineTo(pathSegments[i].x, pathSegments[i].y);
        }
        context.strokeStyle = "blue"; // Change path color to blue
        context.lineWidth = 5;
        context.stroke();

        // Draw the ball representing the current position
        context.beginPath();
        context.arc(x, y, ballSize, 0, 2 * Math.PI);
        context.fillStyle = "red"; // Change ball color to red
        context.fill();

        t += dt;
        ballX = x; // Update the current position of the ball
        ballY = y; // Update the current position of the ball
        }, 10); // Adjust the interval for smoother animation (e.g., 10ms)
    }

  
    // Get the query parameters from the URL
    const queryParams = getQueryParams();
  
    // Convert launch angle from degrees to radians
    const launchAngleRad = (queryParams.launchAngle * Math.PI) / 180;
  
    // Calculate simulation results using the query parameters
    const simulationResults = calculateSimulationResults(queryParams.initialVelocity, launchAngleRad);
  
    // Display the simulation results on the page
    displaySimulationResults({
      ...queryParams,
      ...simulationResults,
    });
  
    // Draw the animation of the projectile path
    drawProjectilePath(queryParams.initialVelocity, launchAngleRad, queryParams.viewingAxis, simulationResults.distanceTraveled);
});

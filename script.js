// Wait for the DOM to load before attaching event listeners
document.addEventListener("DOMContentLoaded", function () {
    // Get a reference to the simulation form
    const simulationForm = document.getElementById("simulationForm");
  
    // Attach an event listener to the form submission
    simulationForm.addEventListener("submit", function (event) {
      // Prevent the default form submission behavior
      event.preventDefault();
  
      // Get user inputs
      const initialVelocity = parseFloat(document.getElementById("initialVelocity").value);
      const launchAngle = parseFloat(document.getElementById("launchAngle").value);
      const viewingAxis = document.getElementById("viewingAxis").value;
  
      // Validate user inputs (you can add additional validation if needed)
      if (isNaN(initialVelocity) || isNaN(launchAngle)) {
        alert("Please enter valid numeric values for initial velocity and launch angle.");
        return;
      }
  
      // Redirect to the results page with simulation parameters as query parameters
      const queryParams = new URLSearchParams({
        initialVelocity: initialVelocity,
        launchAngle: launchAngle,
        viewingAxis: viewingAxis,
      });
  
      const resultsPageUrl = "results.html?" + queryParams.toString();
      window.location.href = resultsPageUrl;
    });
  });
  
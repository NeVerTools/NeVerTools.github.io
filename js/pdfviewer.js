// If absolute URL from the remote server is provided, configure the CORS
// header on that server.
// TODO maybe look for a better approach (maybe load the file as a binary)
let url = 'https://raw.githubusercontent.com/NeVerTools/NeVerTools.github.io/master/assets/doc/never2.pdf';

// Loaded via <script> tag, create shortcut to access PDF.js exports.
let pdfjsLib = window['pdfjs-dist/build/pdf'];

// The workerSrc property shall be specified.
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.js';

// Changes the page dimensions
let scale = 1.5;

// Asynchronous download of PDF
let loadingTask = pdfjsLib.getDocument(url);
loadingTask.promise.then(function(pdf) {
  
  // Function to fetch and render a page
  function renderPage(pageNumber) {
    pdf.getPage(pageNumber).then(function(page) {
      
      let viewport = page.getViewport({scale: scale});

      // Prepare canvas using PDF page dimensions
      let canvas = document.getElementById('slide-canvas');
      let context = canvas.getContext('2d');
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      // Render PDF page into canvas context
      let renderContext = {
        canvasContext: context,
        viewport: viewport
      };
      let renderTask = page.render(renderContext);
      renderTask.promise.then(function () {
        // Code after page renders
      });
    });
  }

  // Fetch and render first page
  let currentPageNumber = 1;
  renderPage(currentPageNumber);

  let leftArrow = document.getElementById("left-arrow");
  let rightArrow = document.getElementById("right-arrow");

  // Function to modify the status of the arrows consistently with their status
  function restyleArrows() {
    if (currentPageNumber == 1) {
      leftArrow.classList.remove("active-arrow");
      leftArrow.classList.add("inactive-arrow");
    } else if (currentPageNumber == pdf.numPages) {
      rightArrow.classList.remove("active-arrow");
      rightArrow.classList.add("inactive-arrow");
    } else {
      leftArrow.classList.remove("inactive-arrow");
      leftArrow.classList.add("active-arrow");
      rightArrow.classList.remove("inactive-arrow");
      rightArrow.classList.add("active-arrow");
    }
  }
  
  // Go back after clicking on the left arrow
  leftArrow.addEventListener("click", () => {
    if (currentPageNumber > 1) {
      currentPageNumber--;
      renderPage(currentPageNumber);
    } 
    restyleArrows();
  });

  // Go forward after clicking on the right arrow
  rightArrow.addEventListener("click", () => {
    if (currentPageNumber < pdf.numPages) {
      currentPageNumber++;
      renderPage(currentPageNumber);
    } 
    restyleArrows();
  });

}, function (reason) {
  // PDF loading error
  console.error(reason);
});
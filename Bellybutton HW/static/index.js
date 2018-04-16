
// Function to generate a color 
function pickHex(color1, color2, weight) {
  console.log("inside pickHex()");
  
  var w1 = weight * 50;
  var w2 = 1 - w1;
  var rgb = [Math.round(color1[0] * w1 + color2[0] * w2),
  Math.round(color1[1] * w1 + color2[1] * w2),
  Math.round(color1[2] * w1 + color2[2] * w2)];
  return rgb;
}


// Function to add the dropdown for samples
function addDropdown() {
  console.log("inside addDropdown()");
  
  // put list of sample names into an array
  sampleNames = [];
  // queryURL = 'https://herokuapp.com/names';
  queryURL = 'http://localhost:5000/names';
  // Take response and assign to sampleNames array
  d3.json(queryURL, function (error, response) {
    if (error) {
      console.log(error);
    }
    else {
      sampleNames = response;

      // Add each item as option to dropdown  
      for (var i = 0; i < sampleNames.length; i++) {
        d3.select("#samplesDropdown").append("option")
          .attr("value", sampleNames[i]["name"])
          .text(sampleNames[i]);
      }

      optionChanged(sampleNames[0]);

    }
  });

}



// Function to create a default pie chart and scatter plot
function init() {
  console.log("inside init()");
  
  // default pie chart 
  var data = [{
    values: [19, 26, 55, 88],
    labels: ["Section 1", "Section 2", "Section 3", "Section 4"],
    text: ["A", "B", "C", "D"],
    type: "pie"
  }];

  var layout = {
    margin: {
      b: 0,
      t: 10,
      pad: 0
    },
    title: false,
    height: 375,
    width: 500
  };

  Plotly.plot("pie", data, layout);



  // Create default scatter plot 
  var trace1 = {
    x: [1, 2, 3, 4],
    y: [10, 11, 12, 13],
    text: ['A size: 40', 'B size: 60', 'C size: 80', 'D size: 100'],
    mode: 'markers',
    hoverinfo: 'text',
    marker: {
      color: ['rgb(93, 164, 214)', 'rgb(255, 144, 14)', 'rgb(44, 160, 101)', 'rgb(255, 65, 54)'],
      size: [40, 60, 80, 100]
    }
  };

  var data = [trace1];

  var layout = {
    margin: {
      l: 25,
      r: 200,
      b: 35,
      t: 10,
      pad: 0
    },
    xaxis: {title: "OTU ID's"},

    showlegend: false,
    height: 400,
    width: 1200
  };

  Plotly.newPlot('scatterPlot', data, layout);

}



// Function to restyle Pie chart and Scatter Plot
function updatePlots(newdata) {
  console.log("inside updatePlots()");
  
  // Declare variables
  scatterPlotText = [];
  scatterPlotColor = []; 
  otuDescTop10 = []; 
  otuDescAll  = [];

  // Get the otu_id 
  // queryURL = 'https://herokuapp.com/otu';
  queryURL = 'http://localhost:5000/otu';

  d3.json(queryURL, function (error, response) {
    otuDescAll = response;

    // Add top 10 otu_id's to array for pie
    for (var i = 0; i < 10; i++) {
      otuDescTop10.push(otuDescAll[newdata[0].otu_id[i]]);
    }

    // Add description corresponding to all otu_id's to array for scatter plot
    for (var i = 0; i < newdata[0].otu_id.length; i++) {
      scatterPlotText.push("(" + newdata[0].otu_id[i] + "," + newdata[0].sample_values[i] + ")" + "<br>" + otuDescAll[newdata[0].otu_id[i]]);
      color1 = pickHex([0, 0, 51], [51, 0, 0], ((i) / newdata[0].otu_id.length));
      color2 = 'rgb(' + color1[0] + ', ' + color1[1] + ', ' + color1[2] + ')';
      scatterPlotColor.push(color2);
    }

    // Restyle scatter plot 
    Plotly.restyle("scatterPlot", "text", [scatterPlotText]);
    Plotly.restyle("scatterPlot", "marker.color", [scatterPlotColor]);


  });

  // Get html element for pie chart
  var PIE = document.getElementById("pie");
    
  // Restyle the pie chart   
  Plotly.restyle(PIE, "values", [[newdata[0].sample_values][0].slice(0, 10)]);
  Plotly.restyle(PIE, "labels", [[newdata[0].otu_id][0].slice(0, 10)]);
  Plotly.restyle(PIE, "text", [otuDescTop10]);


  // Restyle the scatter plot  
  Plotly.restyle("scatterPlot", "x", [newdata[0].otu_id]);
  Plotly.restyle("scatterPlot", "y", [newdata[0].sample_values]);
  Plotly.restyle("scatterPlot", "marker.size", [newdata[0].sample_values]);

}



// Function to generate gauge for washing frequency
function generateNewGauge(washFreq){
  
  console.log("inside generateNewGauge()");
  
  if (washFreq > 4) {
    var level = washFreq * 20;
  }
  else if (washFreq == 4) {
    var level = washFreq * 15;
  }
  else {
    var level = washFreq * 10;
  }

  var degrees = 180 - level,
    radius = .5;
  var radians = degrees * Math.PI / 180;
  var x = radius * Math.cos(radians);
  var y = radius * Math.sin(radians);

  
  var mainPath = 'M -.0 -0.025 L .0 0.025 L ',
    pathX = String(x),
    space = ' ',
    pathY = String(y),
    pathEnd = ' Z';
  var path = mainPath.concat(pathX, space, pathY, pathEnd);

  var data = [{
    type: 'scatter',
    x: [0], y: [0],
    marker: { size: 28, color: '850000' },
    showlegend: false,
    name: 'scrubs/week',
    text: washFreq,
    hoverinfo: 'text+name'
  },
  {
    values: [50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50],
    rotation: 90,
    text: ["8-9", "7-8", "6-7", "5-6", "4-5", "3-4", "2-3", "1-2", "0-1", ""],
    textinfo: 'text',
    textposition: 'inside',
    marker: {
      colors: ['rgba(14, 127, 0, .5)', 'rgba(110, 154, 22, .5)',
        'rgba(170, 202, 42, .5)', 'rgba(202, 209, 95, .5)',
        'rgba(210, 206, 145, .5)', 'rgba(232, 226, 202, .5)',
        'rgba(14, 127, 0, .5)', 'rgba(110, 154, 22, .5)',
        'rgba(170, 202, 42, .5)',
        'rgba(255, 255, 255, 0)']
    },
    labels: ['9', '8', '7', '6', '5', '4', '3', '2', '1', '0'],
    hoverinfo: 'label',
    hole: .5,
    type: 'pie',
    showlegend: false
  }];

  var layout = {
    shapes: [{
      type: 'path',
      path: path,
      fillcolor: '850000',
      line: {
        color: '850000'
      }
    }],
    title: '<b>Belly Button Washing Frequency</b> <br> Scrubs per Week',
    height: 450,
    width: 400,
    xaxis: {
      zeroline: false, showticklabels: false,
      showgrid: false, range: [-1, 1]
    },
    yaxis: {
      zeroline: false, showticklabels: false,
      showgrid: false, range: [-1, 1]
    }
  };

  Plotly.newPlot('gauge', data, layout);

}

// Function to update the page after selection is changed
function optionChanged(selectedOption) {

    console.log("inside optionChanged()");

    // Get metadata information for the specific sample from the metadata url/endpoint
    // queryURL1 = 'https://herokuapp.com/metadata/' + selectedOption;
    queryURL1 = 'http://localhost:5000/metadata/' + selectedOption;
    metaDataInfo = "";
  
    d3.json(queryURL1, function (error, response) {
      if (error) {
        console.log(error);
      }
      else {
        metaDataInfo = response;
  
        // Remove old metadata 
        d3.select("#table").selectAll("p").remove();
    
        // Add new metadata for this sample 
        for (var key in metaDataInfo) {
          if (metaDataInfo.hasOwnProperty(key)) {
            d3.select("#table").append("p")
              .text(key + " : " + metaDataInfo[key]);
          }
        }
      }
    });
  

  // Get list of otu_id's and sample_count  
  
  // queryURL2 = 'https://herokuapp.com/samples/' + selectedOption;
  queryURL2 = 'http://localhost:5000/samples/' + selectedOption;
  otuIdAndSampleCount = [];

  d3.json(queryURL2, function (error, response) {
    if (error) {
      console.log(error);
    }
    else {
      otuIdAndSampleCount = response;
      // Call updatePlots to restyle Pie chart and Scatter Plot 
       updatePlots(otuIdAndSampleCount);

    }
  });


  // Get washing frequency for the sample
  // queryURL3 = 'https://herokuapp.com/wfreq/' + selectedOption;
  queryURL3 = 'http://localhost:5000/wfreq/' + selectedOption;
  washFreq = "";

  d3.json(queryURL3, function (error, response) {
    washFreq = response;
    // Call generateNewGauge to show washing frequency 
    generateNewGauge(washFreq);
  });


}

// Calling init to create default Pie Chart and Scatter Plot
init();

// Calling addDropdown to crate dropdown list of samples
addDropdown();


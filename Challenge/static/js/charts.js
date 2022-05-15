function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// Create the buildChart function.
function buildCharts(sample) {
  // Use d3.json to load the samples.json file 
  d3.json("samples.json").then((data) => {
    console.log(data);

    // Create a variable that holds the samples array. 
    var samplesArray = data.samples;
    // Create a variable that filters the samples for the object with the desired sample number.
    var resultSample = samplesArray.filter(sampleObj => sampleObj.id == sample);
    // Create a variable that filters the metadata array for the object with the desired sample number.
    var resultArray = data.metadata;
    var resultMeta = resultArray.filter(metaObj => metaObj.id == sample);

    // Create a variable that holds the first sample in the array.
    var result = resultSample[0];

    // Create a variable that holds the first sample in the metadata array.
    var results = resultMeta[0];

    // Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otu_ids = result.otu_ids;
    var otu_labels = result.otu_labels;
    var sample_values = result.sample_values;

    // Create a variable that holds the washing frequency.
    var wfreq = results.wfreq;

    // Create the yticks for the bar chart.
    var name = otu_ids.slice(0,10);
    name.forEach(fixName);
    function fixName(id, index, arr){
      arr[index] = "OTU " + id;
    }
    
    var yticks = name.reverse();
    var xticks = result.sample_values.slice(0, 10).reverse();

    // Use Plotly to plot the bar data and layout.
    var barData = [
      trace = {
        x: xticks,
        y: yticks,
        type: "bar",
        orientation: "h"
      }
    ];

    var barLayout = {
     title: "Top 10 Bacteria Cultures Found"
    };

    Plotly.newPlot("bar", barData, barLayout)
    
    // Use Plotly to plot the bubble data and layout.
    var bubbleData = [
      trace = {
        x: otu_ids,
        y: sample_values,
        text: otu_labels,
        mode: 'markers',
        marker: {
          color: otu_ids,
          size: sample_values
        } 
      }
    ];

    var bubbleLayout = {
      title: "Bacteria Cultures per Sample",
      showlegend: false
    };

    Plotly.newPlot('bubble', bubbleData, bubbleLayout); 
   
    // 4. Create the trace for the gauge chart.
    var gaugeData = [
      {
        value: wfreq,
        title: { text: "Scrubs per Week" },
        type: "indicator",
        mode: 'gauge+number',
        gauge: {
          axis: { range: [null, 10], tickwidth: 1, tickcolor: "black" },
          bar: { color: "black" },
          bgcolor: "white",
          borderwidth: 2,
          bordercolor: "gray",
          steps: [
          {range: [0,2], color: "red"},
          {range: [2,4], color: "orange"},
          {range: [4,6], color: "yellow"},
          {range: [6,8], color: "lightgreen"},
          {range: [8,10], color: "green"}
          ]
        }
      }
    ];
    
    // // 5. Create the layout for the gauge chart.
    var gaugeLayout = {
      title: "Belly Button Washing Frequency"
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot('gauge', gaugeData, gaugeLayout);
  });
}
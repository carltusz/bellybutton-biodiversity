const data_directory = "Resources/data/samples.json"

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json(data_directory).then((data) => {
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
  d3.json(data_directory).then((data) => {
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

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json(data_directory).then((data) => {
    //console.log(sample)
    //console.log(data);
    // 3. Create a variable that holds the samples array. 
    var samples_arr = data.samples;
    //console.log(samples_arr);
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var filt_samples_arr = samples_arr.filter(obj => obj.id == sample);
    //console.log(filt_samples_arr)
    //  5. Create a variable that holds the first sample in the array.
    var first_sample = filt_samples_arr[0];
    //console.log(first_sample);

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otu_ids = first_sample.otu_ids;
    var otu_labels = first_sample.otu_labels;
    var sample_values = first_sample.sample_values;

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

    var yticks = sample_values.sort((a,b)=> b - a).slice(0,10);
    //console.log(yticks);
    //console.log(otu_ids.map(id => "OTU " + String(id)).slice(0,10))
    
    var trace = {
      x: yticks.reverse(),
      y: otu_ids.map(id => "OTU " + String(id)).slice(0,10).reverse(),
      text: otu_labels.slice(0,10).map(str => str.replaceAll(";",", ")).reverse(),
      type: "bar",
      orientation: "h"
    }

    // 8. Create the trace for the bar chart. 
    var barData = [trace];
    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "<b>Top 10 Bacteria Cultures Found</b>",
      //xaxis: {title: "Values"}
      //yaxis: {title: "OTU ID"}
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar",barData, barLayout)


    //create bubble chart
    // 1. Create the trace for the bubble chart.
    var bubbleTrace = {
      y: sample_values,
      x: otu_ids,
      text: otu_labels.slice(0,10).map(str => str.replaceAll(";",", ")),
      mode: "markers",
      marker: {
        size: sample_values,
        opacity: 0.5,
        color: otu_ids,
        colorscale: "Earth"
      }
    }

    var bubbleData = [
      bubbleTrace
    ];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "<b>Bacteria Cultures per Sample</b>",
      xaxis: {title: "OTU ID"},
      //paper_bgcolor: rgb(0,0,0,0)
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);




    //create gauge chart
    // 1. Create a variable that filters the metadata array for the object with the desired sample number.
    console.log(sample)
    console.log(data.metadata)
    var filtered_metadata = data.metadata.filter(obj => obj.id === parseInt(sample));
    //console.log(filtered_metadata)
    // Create a variable that holds the first sample in the array.
    // 2. Create a variable that holds the first sample in the metadata array.
    var sample_metadata = filtered_metadata[0];

    //console.log(sample_metadata)
    // 3. Create a variable that holds the washing frequency.
    var sample_frequency = sample_metadata.wfreq

    // 4. Create the trace for the gauge chart.
    var gaugeData = [{
      type: "indicator",
      mode: "gauge+number",
      value: sample_frequency,
      gauge: {
        axis: {range:[0,10]},
        steps: [{range:[0,2], color: "red"},
          {range:[2,4], color:"orange"},
          {range:[4,6], color:"yellow"},
          {range:[6,8], color:"lightgreen"},
          {range:[8,10], color:"green"}],
        bar: {
          color: "black"
        }
      }
    }
     
    ];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
      title: {text: "<b>Belly Button Washing Frequency</b><br>Scrubs per Week"}
    };

    // 6. Use Plotly to plot the gauge data and layout.
   Plotly.newPlot("gauge", gaugeData, gaugeLayout);
    
  });
}

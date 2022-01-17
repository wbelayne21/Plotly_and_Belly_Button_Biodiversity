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

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var samplesArray = data.samples;
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var filteredSample = samplesArray.filter(chosenSampleId=>chosenSampleId.id== sample );
    //  5. Create a variable that holds the first sample in the array.
    var firstSample = filteredSample[0];

    // 1. Create a variable that filters the metadata array for the 
    // object with the desired sample number.
    var metadataArray = data.metadata;
    var filteredMetadata = metadataArray.filter(chosenMetadataId=>chosenMetadataId.id==sample);
    var firstMetadata = filteredMetadata[0];

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otuId = firstSample.otu_ids;
    var otuLabel = firstSample.otu_labels;
    var sampleValue = firstSample.sample_values;

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 
   
    var yticks = otuId.slice(0,10).map(otuId=>`otuId${otuId}`).reverse();
    
  //----------------BAR CHART----------------------------------------------

    // 8. Create the trace for the bar chart. 
    var barData = [{
      x: sampleValue.slice(0,10).reverse(),
      y: yticks,
      type: 'bar',
      text: otuLabel.slice(0,10),
      orientation: 'h'
    }];
    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: 'Top 10 Bacteria Cultures Found',

    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout)

//-----------------BUBBLE CHART--------------------------------------------
   
  // Deliverable 1 Step 10. Use Plotly to plot the data with the layout. 
        
    // 1. Create the trace for the bubble chart.
    var bubbleData = [{
      x: otuId,
      y: sampleValue,
      text: otuLabel,
      mode: "markers",
      marker: {size:sampleValue, color:otuId, colorscale:'Picnic'}
            
    }];
    
    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "Bacterial Culture per Sample",
      xaxis: {title: "OTU ID"},
      hovermode: `closest`
    };
    
      // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout); 

//--------------------GAUGE--------------------------------------------------
     // 3. Create a variable that holds the washing frequency.
    var wFreq = firstMetadata.wfreq;
    // Create the yticks for the bar chart.
    
    
    // 4. Create the trace for the gauge chart.
    var gaugeData = [{
      value: wFreq,
      type: "indicator",
      mode: "gauge+number",
      gauge: {
        bar: {color: "balck"},
        axis: { range: [null, 10]},
        steps: [
          { range: [0, 2], color: "red" },
          { range: [2, 4], color: "orange" },
          { range: [4, 6], color: "gold" },
          { range: [6, 8], color: "olivedrab" },
          { range: [8, 10], color: "darkgreen" }
        ],
        
      }
      
    }];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
      title: {text: "<b>Belly Button Washing Frequency</b><br>Scrubs per Week"},
      width: 400,
      height: 400,
      font: {color: "black", family: "Arial"},
      paper_bgcolor: "white",
      margin: { t: 25, r: 25, l: 25, b: 25 },
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);
  });
};





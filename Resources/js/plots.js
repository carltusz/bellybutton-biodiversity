function init() {
    var selector = d3.select("#selDataset");
  
    d3.json("Resources/data/samples.json").then((data) => {
      console.log(data);
      var sampleNames = data.names;
      sampleNames.forEach((sample) => {
        selector
          .append("option")
          .text(sample)
          .property("value", sample);
      });
  })}
  
function optionChanged(newSample) {
  //console.log(newSample);
  buildMetadata(newSample);
  //buildCharts(newSample);
}

function buildMetadata(sample){
  console.log(sample)
  d3.json("Resources/data/samples.json").then((data) => {
    var metadata = data.metadata;
    var resultArray = metadata.filter(sampleObj => sampleObj.id === parseInt(sample));
    var result = resultArray[0]
    var PANEL = d3.select("#sample-metadata");

    //console.log(result)
    var entries = Object.entries(result)
    console.log(entries)

    PANEL.html("");
    PANEL.append("h6").text("ID: " + result.id);
    PANEL.append
    PANEL.append("h6").text("LOCATION: " + result.location);
    for(i=0; i<entries.length; i++){
        objKey = entries[i][0]
        objVal = entries[i][1]
        objKey=objKey.toUpperCase()
        PANEL.append("h6").text(objKey + ": " + objVal)
    }
  });
}



init();
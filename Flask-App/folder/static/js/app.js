// Submit Button handler
function handleSubmit() {
  // Prevent the page from refreshing
  d3.event.preventDefault();

  var text1 =document.getElementById("selDataset").value
  console.log(text1);
  
  // clear the input value
  d3.select("selDataset").node().value = "";

  // Build the plot with the new stock
  buildCharts(text1);
}





















//grab the use sample from the drop down menu creating constant variable 
var text1 =document.getElementById("selDataset").value
//create function to build the meta data

function buildMetadata() {
  //grab the use sample from the drop down menu 
   var text1 =document.getElementById("selDataset").value
  
  //create url for d3.json to go to using f print with the value the user selects
  var defaulturl = `/metadata/${text1}`;
  
  //use d3.json to go to the url, grab the data and then console log it out
  d3.json(defaulturl).then(function(response) {
    console.log(response);

    // Grab values from the response json object to build the plots
    var age = response.AGE;
    var bbtype = response.BBTYPE;
    var ethnicity = response.ETHNICITY;
    var gender = response.GENDER;
    var location = response.LOCATION;
    var wfreq = response.WFREQ;
    var sample = response.sample;
    //console log a variable to ensure it is working
    console.log(age);
    
  
    var data = response;

    // Use d3 to select the panel with id of `#sample-metadata`
    var panel = d3.select(".panel-body");
    // Use `.html("") to clear any existing metadata
      panel.html("")
      //for loop down the panel 1 time, each time adding a row with data, then another row with 1 piece of data
      for (var i = 0; i < 1; i++) {
      trow = panel.append("tr");
      trow.append("td").text(`Age:${age}`);
      trow = panel.append("tr");
      trow.append("td").text(`BBTYPE:${bbtype}`);
      trow = panel.append("tr");
      trow.append("td").text(`ETHNICITY:${ethnicity}`);
      trow = panel.append("tr");
      trow.append("td").text(`GENDER:${gender}`);
      trow = panel.append("tr");
      trow.append("td").text(`LOCATION:${location}`);
      trow = panel.append("tr");
      trow.append("td").text(`WFREQ:${wfreq}`);
      trow = panel.append("tr");
      trow.append("td").text(`SAMPLE:${sample}`);}
   });   
}

function buildCharts(text1) {


    //create event handler to campute the users selection 
    var text2 =document.getElementById("selDataset").value
    //console log to ensure we are getting a value
    console.log(text2)
    //create a new url taking the sample selected- change the route to sample api
    var defaulturl1 = `/samples/${text2}`;
    //console log to ensure we are getting an accurate api url
    console.log(defaulturl1)
    //use d3.json to go to the api url to gather the data- print the data
    d3.json(defaulturl1).then(function(response){
      console.log(response);
     var otu_ids = response.otu_ids;
     //confirm you are getting results
     console.log(otu_ids);
     var otu_labels = response.otu_labels;
     console.log(otu_labels);
     var sample_values = response.sample_values;
     console.log(sample_values);

     /// create variables for the pie chart
     var ten_sample_values = sample_values.sort().slice(0, 10);
     console.log(ten_sample_values);
     var ten_otu_ids = otu_ids.sort().slice(0, 10);
     console.log(ten_otu_ids);
     var ten_otu_labels = otu_labels.sort().slice(0, 10);
     console.log(ten_otu_labels);
    



    // @TODO: Build a Bubble Chart to populate the field when the app is first initiated. 
    //create a trace first 
    var trace1 = {
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: 'markers',
      marker: {
        size: sample_values,
        color: otu_ids}
       };
    
    var data1 = [trace1];
    
    var layout1 = {
      title: 'Bacteria Bubbles',
      showlegend: false,
      height: 1200,
      width: 1200
    };
    
    Plotly.newPlot('bubble', data1, layout1);



    // Build a Pie Chart to populate the field when the app is first initiated.
      var trace2 = {
      labels: ten_otu_ids,
      values: ten_sample_values,
      type: 'pie',
      hovertemplate: ten_otu_labels
      };

      var data2 = [trace2];

      var layout2 = {
      title: {
        text: 'Belly Button Bacteria by Type',
        font:{
          family: 'Courier New, monospace',
          size: 24
        },
      },
     };

     Plotly.newPlot("pie", data2, layout2);
    });











}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();

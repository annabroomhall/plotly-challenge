// create the function for the initial data rendering
function init() {
    // select dropdown menu 
    var dropdown = d3.select("#selDataset");
  
    // read the data 
    d3.json("samples.json").then((data)=> {
        //sanity check data call
        //console.log(data)
  
        // get the id data to the dropdown menu
        data.names.forEach(function(name) {
            dropdown.append("option").text(name).property("value");
        });
  
        // call the functions to display the data and the plots to the page
        buildPlot(data.names[0]);
    });
  }
  
  //on change in the dropdown initial buildPlot function
  d3.selectAll("#selDataset").on("change", buildPlot);
  
  //unpack function
  function unpack(rows, index) {
      return rows.map(function(row) {
          return row[index];
      });
  }
  //Buildplot function - triggers all plots and table
  function buildPlot(id) {
      d3.json("samples.json").then(function(bellies) {
        console.log(bellies)
        var id = d3.select("#selDataset").node().value;
        console.log(id);
        //var asArray = Object.entries(bellies);
        var result = bellies.samples.filter(data => data.id.toString() === id)[0];
        console.log(result)
        // Grab values from the data json object to build the plots
        var samplesIds = result.otu_ids;
        var samplesValues = result.sample_values;
        var samplesLabels = result.otu_labels;
        var sortedById = samplesIds.sort((a, b) => b.otu_ids - a.otu_ids);
        var slicedOtus = sortedById.slice(0, 10).reverse();
        var slicedLabels = samplesLabels.slice(0, 10).reverse();
        var slicedValues = samplesValues.slice(0, 10).reverse();
        var OTU_id = slicedOtus.map(d => "OTU " + d);
        var metadata = bellies.metadata;
        //sanity checking in the console
        //console.log(samplesIds)
        //console.log(samplesValues)
        //console.log(samplesLabels)
        //console.log(slicedOtus)
        //console.log(slicedLabels)
        //console.log(slicedValues)
        //console.log(metadata)
        var meta_result = metadata.filter(meta => meta.id.toString() === id)[0];
        var demographicInfo = d3.select("#sample-metadata");
        demographicInfo.html("");
        Object.entries(meta_result).forEach((key) => {   
            demographicInfo.append("h5").text(key[0].toUpperCase() + ": " + key[1] + "\n");    
        })
  
        //set trace for bar plot
        var trace_bar = {
          x: slicedValues,
          y: OTU_id,
          text: slicedLabels,
          type: "bar",
          orientation: 'h'
        };
  
        //set data for bar plot
        var data = [trace_bar];
  
        //set bar plot layout
        var layout = {
                };
  
        //create bar plot
        Plotly.newPlot('bar', data, layout);
  
        //set trace for bubble plot
        var trace_bubble = {
          y: samplesValues,
          x: samplesIds,
          mode: 'markers',
          marker: {
              color: samplesIds,
              size: samplesValues
          },
          text: slicedLabels,
          type: "bubble"
        };
  
        //set data for bubble plot
        var data = [trace_bubble];
  
        //set bubble plot layout
        var layout = {
          height: 600,
          width: 1000
                };
                
        //create bubble plot
        Plotly.newPlot('bubble', data, layout);
      })
  }
  

    function optionChanged(id) {
      buildPlot(id);
    }
  
   
  init();
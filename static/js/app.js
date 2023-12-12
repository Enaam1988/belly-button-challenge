// URL of the JSON file
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";
// Function to initialize the dashboard
function init(){ 
     // Load JSON data
    d3.json(url).then(function(data){
         // Select the dropdown menu
        let dropdownMenu = d3.select("#selDataset");
        let names = data.names;
        names.forEach(function(id){
            dropdownMenu
            .append("option")
            .text(id)
            .property("value");
        });
         // Build initial charts and metadata for the first sample
        buildCharts(names[0]);
        metadata(names[0]);
    });
};
// Function to handle a change in the selected sample
function optionChanged(newSample) {
    buildCharts(newSample);
    metadata(newSample);
};
// Function to build charts
function buildCharts(newSample){
     // Load JSON data
    d3.json(url).then(function(data){
        // Extract sample data
        let samples = data.samples;
        let id = samples.filter(takeObj=>takeObj.id == newSample);
        let sample_values = id[0].sample_values; 
        let otu_ids = id[0].otu_ids; 
        let otu_labels = id[0].otu_labels; 
        // Call the charts function with the extracted data
        charts(sample_values, otu_ids, otu_labels);
    });
};
// Function to create charts
function charts(sample_values, otu_ids, otu_labels){
     // Load JSON data
    d3.json(url).then(function(data) {
        // Bar chart data
        let bar_data = [{
            type: 'bar',
            x: sample_values.slice(0,10).reverse(),
            y: otu_ids.slice(0,10).map(id => `OTU ${id}`).reverse(),
            text: otu_labels,
            orientation: 'h'
        }];
        // Bar chart layout
        let bar_layout = {
            title: 'Bar Chart',
            height: 500,
            width: 400            
        }; 
         // Create the bar chart
        Plotly.newPlot('bar', bar_data, bar_layout);

        // Bubble chart data
        let bubble_data = [{
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: 'markers',
            marker:{
                color: otu_ids,
                colorscale: 'Earth',
                size: sample_values
            }
        }];

         // Bubble chart layout
        let bubble_layout = {
            title: 'Bubble Chart',
            xaxis: {
                title: 'OTU ID'},
            height: 550,
            width: 1000 
        };

         // Create the bubble chart
        Plotly.newPlot('bubble', bubble_data, bubble_layout);
    });
};
// Function to display metadata
function metadata(newSample){
     // Load JSON data
    d3.json(url).then(function(data){
        // Extract metadata
        let samples = data.metadata;
        let id = samples.filter(takeObj=>takeObj.id == newSample);
        let sample_metadata = d3.select('#sample-metadata').html('');
         // Display each key-value pair in metadata
        Object.entries(id[0]).forEach(([key, value]) => {
            sample_metadata.append("h5").text(`${key}: ${value}`);
        });
    });
};
init();

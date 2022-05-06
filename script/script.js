var margin=50;
var width=900-margin-margin;
var height=450-margin-margin;
var fetchedData;
var svg=d3.select("#svg").append("g")
        .attr("transform","translate("+margin+","+margin+")")


var x=d3.scaleTime().range([0,width])
var y=d3.scaleLinear().range([height,0])



        
d3.json("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json").then(
    data=>{
        fetchedData=data.data;
        fetchedData.forEach(d=>d[0]=d3.timeParse("%Y-%m-%d")(d[0]));
        update(fetchedData)
    }
)        
//separate update function for rendering of graph based on data.
function update(data) {
    x.domain(d3.extent(data,d=>d[0]))
    y.domain([0,d3.extent(data,d=>d[1])[1]])

    //remove all previous rendered axes 
    d3.selectAll("#y-axis")
            .remove();

    d3.selectAll("#x-axis")
            .remove();
    //render new axes with transition effect based on new data
    svg.append("g")
            .attr("transform","translate(0,"+height+")")
            .attr("id","x-axis")
            .attr("opacity","0")
        .call(d3.axisBottom(x))
        .transition().duration(1500)
            .attr("opacity","1")
            
    
    svg.append("g")
            .attr("id","y-axis")
            .attr("opacity","0")
        .call(d3.axisLeft(y))
        .transition().duration(1500)
            .attr("opacity","1")

    //check for any rendered y-axis title before
    if (!d3.select(".y-axis-title")._groups[0][0]) 
    svg.append("text")
            .attr("transform","translate(0,-15)")
            .attr("class","y-axis-title")
            .text("GDP(Billions)")
            .style("fill","#1C768F")
    

    //input section to render with transition effect
    d3.select(".input").transition().duration(1500)
            .style("opacity","1")


    //data update,enter and exit with transition effect
    var update=svg.selectAll("rect")
        .data(data)

    update.transition().duration(1500)
        .attr("transform",d=>"translate("+x(d[0])+","+y(d[1])+")")
        .attr("width",width/data.length)
        .attr("height",d=>height-y(d[1]))

    var enter=update.enter().append("rect")
            .attr("transform",d=>"translate("+x(d[0])+","+height+")")
            .attr("width",width/data.length)
            .attr("height","0")
            .attr("opacity","0")
            .attr("data-date",d=>d3.timeFormat("%Y-%m-%d")(d[0]))
            .attr("data-gdp",d=>d[1])
            .attr("class","bar")
            .on("mouseover",(d,i,nodes)=>{
                d3.select("#tooltip")
                        .attr("data-date",d3.timeFormat("%Y-%m-%d")(d[0]))
                        .html("Date: "+d3.timeFormat("%d-%m-%Y")(d[0])+"<br>GDP(Billion): "+d3.format(",")(d[1].toFixed(1)))
                        .style("left",(d3.event.pageX+20)+"px")
                        .style("top",(d3.event.pageY-20)+"px")
                    .transition().duration(300)
                        .style("opacity","0.9");

                d3.select(nodes[i])
                        .style("fill","#1C768F") 
                        
            })
            .on("mouseout",(d,i,nodes)=>{
                d3.select("#tooltip")
                    .transition().duration(300)
                        .style("opacity","0");

                d3.select(nodes[i])
                        .style("fill","#032539") 
            })
        .transition().duration(1500)
            .attr("transform",d=>"translate("+x(d[0])+","+y(d[1])+")")
            .attr("height",d=>height-y(d[1]))
            .attr("opacity","1")
    
    var exit=update.exit()
        .transition().duration(1500)
            .attr("transform",d=>"translate("+x(d[0])+","+height+")")
            .attr("height","0")
            .attr("opacity","0")
            .remove();
            
}
//interactive button for filtering data by date
document.getElementById("button-date").addEventListener("click",e=>{
    e.preventDefault();
    console.log('fubar')
    var input1=document.getElementById("input-date1");
    var input2=document.getElementById("input-date2")
    var filteredData;
    if (!input1.value|!input2.value) {
        alert("Please Fully Complete Date Range Field")
        return;
    }
    
    filteredData=fetchedData.filter(d=>
            d[0]>new Date(input1.value) && d[0]<new Date(input2.value)
        )
        
    update(filteredData)
})





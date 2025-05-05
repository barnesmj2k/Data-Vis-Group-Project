class DensityView {
    constructor(data, con, w, h) {
        this.con = con;
        this.size = {
            margin : 40,
            width  : w - 80,
            height : h - 80
        }
        const svg = con.root.append('div')
            .style('width', `${w}px`)
            .style('height', `${h}px`)
        .append('svg')
            .attr('width', w)
            .attr('height', h)
        .append('g')
            .attr('transform', `translate(${this.size.margin},${this.size.margin})`);

        //Define relevant columns for the vis
        var victory_status_col = data.map(function(d) 
            {return d.victory_status})
        var avg_rating_col = data.map(function(d) 
            {return (parseInt(d.white_rating) + parseInt(d.black_rating)) / 2})
        console.log(victory_status_col)
        console.log(avg_rating_col)
        console.log(Math.max.apply(null, avg_rating_col))
        
        //Create axes and color scale
        var x = d3.scaleLinear()
            .domain([0, Math.max.apply(null, avg_rating_col)])
            .range([0, this.size.width])
        svg.append("g")
            .attr("transform", `translate(0, ${this.size.height})`)
            .call(d3.axisBottom(x));
        var y = d3.scaleLinear()
            //Should probably define this based on the actual data but this works for now
            .domain([10, 0])
            .range([0, this.size.height])
        svg.append("g")
            .call(d3.axisLeft(y));

        const histogram = d3.histogram().domain(x.domain()).thresholds(x.ticks(40));
        const bins = histogram(data);
        console.log(bins);

        svg.append("path")
            .datum(bins)
            .attr("fill", "#69b3a2")
            .attr("stroke", "#333")
            .attr("stroke-width", 1)
            .attr("opacity", 0.6)
            .attr("d", d3.line()
                .curve(d3.curveBasis)
                .x(d => x((d.x0 + d.x1) / 2))
                .y(d => y(d.length)));
    }
}

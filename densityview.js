
class DensityView {
    constructor(con, width, height) {
        this.con = con;
        const svg = con.root.append('div')
            .style('width', `${width}px`)
            .style('height', `${height}px`)
        .append('svg')
            .attr('width', width)
            .attr('height', height)
        .append('g')
            .attr('transform', 'translate(40,20)');

        const data = d3.range(1000).map(() => d3.randomNormal(5, 1.5)());
        const x = d3.scaleLinear().domain([0, 10]).range([0, width - 60]);
        const histogram = d3.histogram().domain(x.domain()).thresholds(x.ticks(40));
        const bins = histogram(data);
        const y = d3.scaleLinear().domain([0, d3.max(bins, d => d.length)]).range([height - 40, 0]);

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

        svg.append("g")
            .attr("transform", `translate(0,${height - 40})`)
            .call(d3.axisBottom(x));

        svg.append("g")
            .call(d3.axisLeft(y));
    }
}


class LineView {
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

        const data = d3.range(20).map(i => ({ x: i, y: Math.sin(i / 2) }));
        const x = d3.scaleLinear().domain([0, 19]).range([0, width - 60]);
        const y = d3.scaleLinear().domain([-1, 1]).range([height - 40, 0]);

        svg.append("path")
            .datum(data)
            .attr("fill", "none")
            .attr("stroke", "#69b3a2")
            .attr("stroke-width", 2)
            .attr("d", d3.line().x(d => x(d.x)).y(d => y(d.y)));

        svg.append("g")
            .attr("transform", `translate(0,${height - 40})`)
            .call(d3.axisBottom(x));

        svg.append("g")
            .call(d3.axisLeft(y));
    }
}

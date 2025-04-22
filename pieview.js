
class PieView {
    constructor(con, width, height) {
        this.con = con;
        const svg = con.root.append('div')
            .style('width', `${width}px`)
            .style('height', `${height}px`)
        .append('svg')
            .attr('width', width)
            .attr('height', height)
        .append('g')
            .attr('transform', `translate(${width / 2}, ${height / 2})`);

        const data = [10, 20, 30, 40];
        const pie = d3.pie()(data);
        const arc = d3.arc().innerRadius(0).outerRadius(Math.min(width, height) / 2 - 10);

        svg.selectAll("path")
            .data(pie)
            .enter()
            .append("path")
            .attr("d", arc)
            .attr("fill", (d, i) => con.color(i))
            .attr("stroke", "black");
    }
}

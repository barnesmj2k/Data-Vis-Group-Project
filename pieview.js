class PieView {
    constructor(data, con, width, height) {
        this.con = con;
        con.color = d3.scaleOrdinal(d3.schemeSet1);


        const svg = con.root.append('div')
            .style('width', `${width}px`)
            .style('height', `${height}px`)
            .append('svg')
            .attr('width', width)
            .attr('height', height)
            .append('g')
            .attr('transform', `translate(${width / 2}, ${height / 2})`);

        // Count wins by higher-rated vs lower-rated players
        let higherWins = 0;
        let lowerWins = 0;

        data.forEach(d => {
            const whiteRating = +d.white_rating;
            const blackRating = +d.black_rating;
            const winner = d.winner;

            if (winner === "white" && whiteRating > blackRating) {
                higherWins++;
            } else if (winner === "white" && whiteRating < blackRating) {
                lowerWins++;
            } else if (winner === "black" && blackRating > whiteRating) {
                higherWins++;
            } else if (winner === "black" && blackRating < whiteRating) {
                lowerWins++;
            }
        });

        // Format data for pie chart
        const pieData = [
            { label: "Higher-rated Wins", value: higherWins },
            { label: "Lower-rated Wins", value: lowerWins }
        ];

        // Create pie layout
        const pie = d3.pie().value(d => d.value)(pieData);
        const arc = d3.arc().innerRadius(0).outerRadius(Math.min(width, height) / 2 - 10);

        // Draw pie slices
        svg.selectAll("path")
            .data(pie)
            .enter()
            .append("path")
            .attr("d", arc)
            .attr("fill", (d, i) => con.color(i))
            .attr("stroke", "black");

        // Add labels
        svg.selectAll("text")
            .data(pie)
            .enter()
            .append("text")
            .attr("transform", d => `translate(${arc.centroid(d)})`)
            .attr("text-anchor", "middle")
            .style("font-size", "12px")
            .text(d => `${d.data.label}: ${d.data.value}`);
    }
}

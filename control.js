
new (class Control 
{
    constructor(data) {
        const fullWidth = 1000;
        const fullHeight = 600;
        const halfWidth = fullWidth / 2;
        const topHeight = fullHeight / 3;
        const bottomHeight = fullHeight * 2 / 3;

        this.root = d3.select('body').append('div')
            .attr('id', 'root')
            .style('width', `${fullWidth}px`)
            .style('height', `${fullHeight}px`);

        this.color = d3.scaleOrdinal(d3.schemeCategory10);

        this.pieView = new PieView(this, halfWidth, topHeight);
        this.lineView = new LineView(this, halfWidth, topHeight);
        this.densityView = new DensityView(this, fullWidth, bottomHeight);
        this.scatterView = new ScatterView(this, halfWidth, topHeight);
    }
})();

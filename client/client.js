
Template.candidates.frameworks= function(){
	return Candidates.find({}, {sort: {votes: -1, name: 1}});
};

Template.candidates.events({
	'click input.vote': function () {
		Meteor.call('setVote',Session.get("selected_framework"));
	}
});

Template.framework.events({
    'click': function () {
      Session.set("selected_framework", this._id);
    }
 });

Template.candidates.selected_candidate = function () {
    var candidate = Candidates.findOne(Session.get("selected_framework"));    
    return candidate;
};

Template.d3vis.created = function () {
    _.defer(function () {
          window.d3vis = {}
      Deps.autorun(function () {
        if (Deps.currentComputation.firstRun) {
          window.d3vis.margin = {top: 15, right: 5, bottom: 5, left: 5},
          window.d3vis.width = 600 - window.d3vis.margin.left - window.d3vis.margin.right,
          window.d3vis.height = 120 - window.d3vis.margin.top - window.d3vis.margin.bottom;

          window.d3vis.x = d3.scale.ordinal()
              .rangeRoundBands([0, window.d3vis.width], .1);

          window.d3vis.y = d3.scale.linear()
              .range([window.d3vis.height-2, 0]);

          window.d3vis.color = d3.scale.category10();

          window.d3vis.svg = d3.select('#d3vis')
              .attr("width", window.d3vis.width + window.d3vis.margin.left + window.d3vis.margin.right)
              .attr("height", window.d3vis.height + window.d3vis.margin.top + window.d3vis.margin.bottom)
            .append("g")
              .attr("class", "wrapper")
              .attr("transform", "translate(" + window.d3vis.margin.left + "," + window.d3vis.margin.top + ")");
        }

        // Get the colors based on the sorted names
        names = Candidates.find({}, {sort: {name: 1}}).fetch()
        window.d3vis.color.domain(names.map(function(d) { return d.name}));

        // Get the players
        players = Candidates.find({}, {sort: {votes: -1, name: 1}}).fetch()
        window.d3vis.x.domain(players.map(function(d) { return d.name}));
        window.d3vis.y.domain([0, d3.max(players, function(d) { return d.votes; })]);

        // Two selectors (this could be streamlined...)
        var bar_selector = window.d3vis.svg.selectAll(".bar")
          .data(players, function (d) {return d.name})
        var text_selector = window.d3vis.svg.selectAll(".bar_text")
          .data(players, function (d) {return d.name})

        bar_selector
          .enter().append("rect")
          .attr("class", "bar")
        bar_selector
          .transition()
          .duration(100)
          .attr("x", function(d) { return window.d3vis.x(d.name);})
          .attr("width", window.d3vis.x.rangeBand())
          .attr("y", function(d) { return window.d3vis.y(d.votes); })
          .attr("height", function(d) { return window.d3vis.height - window.d3vis.y(d.votes); })
          .style("fill", function(d) { return window.d3vis.color(d.name);})

        text_selector
          .enter().append("text")
          .attr("class", "bar_text")
        text_selector
          .transition()
          .duration(100)
          .attr()
          .attr("x", function(d) { return window.d3vis.x(d.name) + 10;})
          .attr("y", function(d) { return window.d3vis.y(d.votes) - 2; })
          .text(function(d) {return d.votes;})
          .attr("height", function(d) { return window.d3vis.height - window.d3vis.y(d.votes); })
      });
    });
  }
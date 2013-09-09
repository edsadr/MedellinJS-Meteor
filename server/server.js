Meteor.methods({
    setVote: function(id){
      Candidates.update(id, {$inc: {votes: 1}});
    }
});

Meteor.startup(function () {
    if (Candidates.find().count() === 0) {
      var fw = [
                    ["Express","express.png"],
                    ["Meteor","meteor.png"],
                    ["Sails","sails.png"],
                    ["Hapi","hapi.png"],
                    ["Sin framework (eso es para niñitas)","chuck.jpg"]
                 ];
      for (var i = 0, k= fw.length; i < k; i++)
        Candidates.insert({name: fw[i][0],image: fw[i][1], votes: 0});
    }
  });
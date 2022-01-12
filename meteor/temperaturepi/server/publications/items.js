Meteor.publish("all-items-pub", function(){
    return Items.find({}, {sort: {date: -1}, limit: 200});
});
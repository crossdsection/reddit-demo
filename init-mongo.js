print('Start #################################################################');

db = db.getSiblingDB('reddit-demo');
db.createUser(
  {
    user: 'reddituser',
    pwd: 'redditpass',
    roles: [{ role: 'readWrite', db: 'reddit-demo'}],
  },
);

db.createCollection('reactiontypes');
db.reactiontypes.insert([{"codes":"1F44D","char":"👍","name":"thumbs up","category":"People & Body (hand-fingers-closed)","group":"People & Body","subgroup":"hand-fingers-closed"}, {"codes":"1F44E","char":"👎","name":"thumbs down","category":"People & Body (hand-fingers-closed)","group":"People & Body","subgroup":"hand-fingers-closed"}, {"codes":"1F4AF","char":"💯","name":"hundred points","category":"Smileys & Emotion (emotion)","group":"Smileys & Emotion","subgroup":"emotion"}]);

print('END #################################################################');

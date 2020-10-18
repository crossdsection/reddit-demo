FROM mongo
COPY threeReactions.json /threeReactions.json
CMD mongoimport --host mongodb --db reddit-demo --collection reactiontypes --drop --file ./threeReactions.json --jsonArray

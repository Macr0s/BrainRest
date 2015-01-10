var brain = require("brain");
var async = require("async");

var BrainRest = function (config){
	if (typeof config.token != "undefined" &&
		typeof config.get != "undefined" &&
		typeof config.save != "undefined" &&
		typeof config.app != "undefined"){

		var persist = false;
		if (typeof config.persist != "undefined"){
			persist = config.persist;
		}

		var brains = {};
		
		config.app.post("/run", function (req, res){
			var id = config.token("");
			var brain = null;
			if (persist){
				var j = config.get(id);
				brain = new brain.NeuralNetwork();
				brain.fromJSON(j);
			}else{
				if (typeof brains[id] != "undefined"){
					brain = brains[id];
				}else{
					var j = config.get(id);
					brain = new brain.NeuralNetwork();
					brain.fromJSON(j);
					brains[id] = brain;
				}
			}

			res.json({
				output: brain.run(req.body);
			});
			res.end();
		});

		config.app.post("/train", function (req, res){
			var id = config.token("");
			var brain = null;
			if (persist){
				var j = config.get(id);
				brain = new brain.NeuralNetwork();
				brain.fromJSON(j);
			}else{
				if (typeof brains[id] != "undefined"){
					brain = brains[id];
				}else{
					var j = config.get(id);
					brain = new brain.NeuralNetwork();
					brain.fromJSON(j);
					brains[id] = brain;
				}
			}

			var data = req.body.data;
			var data_config = (typeof req.body.config == "undefined")?null:req.body.config;

			res.json({
				status: true
			});
			res.end();

			async.series([
				function (){
					if (data_config){
						brain.train(data, data_config);
					}else{
						brain.train(data);
					}
					config.save(id, brain.toJSON());
				}
			])
		});

	}else{
		throw "Wrong Config"
	}
}
// import { csv } from 'd3-request';
// import url from 'path/to/data.csv';
const fs = require("fs");

// csv(url, function(err, data) {
// 	console.log(data);
// })

function read_rules(filename) {
	let a = fs.readFileSync(filename, "utf8")
	var data = a.split("\n")
	var headers = data[0].split(",")
	var rule_list = []
	for (var i=1; i<data.length; i++) {
		if (data[i].length > 0 && data[i][0] != "#") {
			var split_rule = data[i].split(",")
			var rule_dict = {}
			for (var j=0; j<headers.length; j++) {
				rule_dict[headers[j]] = split_rule[j]
			}
			rule_list.push(rule_dict)
		}
	}
	return rule_list
}

class SubRule {
	constructor(rule, classes) {
		// TODO
	}
}

class AlphabetToIpa {
  constructor(rule_filepath) {
    this.rule_list = read_rules(rule_filepath);
    this.classes = {}
    this.subs = new Set([])
    this.ipasubs = new Set([])
    this.words = {}
    this.pre = []
    this.NO_TRANSLATE = "@"

    // Iterate over rules:
    for (var i=0; i<this.rule_list.length; i++) {
    	let rule = this.rule_list[i]
    	console.log(rule["type"])
    	if (rule["type"] == "pre") { 
    		this.pre.push((rule["sfrom"], rule["sto"]))
    	} else if (rule["type"] == "class") {
    		this.classes[rule["sfrom"]] = rule["sto"]
    	} else if (rule["type"] == "sub") {
    		let subrule = new SubRule(rule, this.classes)
    	}
    }

    console.log(this.pre)
  }
}
	
let a2ipa = new AlphabetToIpa("es.rules")
// import { csv } from 'd3-request';
// import url from 'path/to/data.csv';
const fs = require("fs");

// csv(url, function(err, data) {
// 	console.log(data);
// })

function print(val) { console.log(val) }

function read_rules(filename) {
	const a = fs.readFileSync(filename, "utf8")
	const data = a.split("\n")
	let headers = data[0].split(",")
	// Get headers:
	for (var i=0; i<data.length; i++) {
		if (data[i].length > 0 && data[i][0] != "#") {
			headers = data[i].split(",")
			break
		}
	}
	// Get rules:
	var rule_list = []
	for (var i=0; i<data.length; i++) {
		if (data[i].length > 0 && data[i][0] != "#") {
			var split_rule = data[i].split(",")
			if (split_rule[0] != headers[0]) { // ignore header
				var rule_dict = {}
				for (var j=0; j<headers.length; j++) {
					rule_dict[headers[j]] = split_rule[j]
				}
				rule_list.push(rule_dict)
			}
		}
	}
	return rule_list
}

class SubRule {
	constructor(rule, classes) {
		const headers = ["sfrom", "sto", "precede", "follow", "weight"]
		for (var i=0; i<headers.length; i++) {
			let key = headers[i]
			let value = rule[key]
			const re = new RegExp('{.*}')
			// Handles classes and subclasses
			while (re.test(value)) {
				// Replacement for Python dictionary format() method:
				value = value.replace(/[\{\}']+/g,'')
				let format_value = value.replace(/[\{\}\(\)\[\]']+/g,'')
				value = value.replace(format_value, classes[format_value])
			}
			this[key] = value
		}
		this.weight = parseFloat(this.weight)
		this.sfrom_save = this.sfrom
        this.sfrom = new RegExp(this.sfrom)
        this.precede = new RegExp(this.precede+"$")
        this.follow = new RegExp("^"+this.follow)
	}

	sub_score(sfrom, precede, follow) {
		if (this.sfrom.test(sfrom) && this.precede.test(precede) && this.follow.test(follow)) {
            return this.weight
		} else {
            return null 
        }
	}

	sub(x) {
        return x.replace(this.sfrom_save, this.sto)
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
    	if (rule["type"] == "pre") { 
    		this.pre.push([rule["sfrom"], rule["sto"]])
    	} else if (rule["type"] == "class") {
    		this.classes[rule["sfrom"]] = rule["sto"]
    	} else if (rule["type"] == "sub") {
    		let subrule = new SubRule(rule, this.classes)
    		this.subs.add(subrule)
    	} else if (rule["type"] == "ipasub") {
    		let ipasubrule = new SubRule(rule, this.classes)
    		this.ipasubs.add(ipasubrule)
    	} else if (rule["type"] == "word") {
    		this.words[rule["sfrom"]] = rule["sto"].split()
    	} else {
    		console.log("Unrecognized rule type.")
    	}
    }
  }

  translate(source) {
  	// Check if previously translated:
  	if (source in this.words) {
  		return this.words[source]
  	} else {
  		// Preprocess:
  		for (var i=0; i<this.pre.length; i++) {
  			let prerule = this.pre[i]
  			source = source.replace(prerule[0], prerule[1])
  		}
  		source = source.toLowerCase()

  		var source_list = source.split("")
        var target_list = []
        for (var i=0; i<source_list.length; i++) {
        	let sfrom = source_list[i]
        	let precede = source_list.slice(0,i).join("")
            let follow = source_list.slice(i+1).join("")

            var translations = []
            this.subs.forEach(function(subrule) {
            	let trans = [subrule.sub_score(sfrom, precede, follow), subrule.sub(sfrom)]
            	translations.push(trans)
            })
            // Exclude translations that didn't apply, and sort by weight:
            translations = translations.filter(trans => trans[0])
            if (translations.length > 0) {
            	var translation = translations.sort(function(a,b) { return(b[0] - a[0]) })[0][1]
            	if (translation.length > 0) {
	            	target_list.push(translation)
	            }
            } else {
            	target_list.push(this.NO_TRANSLATE)
            }
        }
        var target_string = (target_list).join(" ")
        print(target_string)

        var ipa_translations = []
        this.subs.forEach(function(ipasubrule) {
        	let ipa_trans = [ipasubrule.weight, ipasubrule]
        	ipa_translations.push(ipa_trans)
        })
        ipa_translations = ipa_translations.sort(function(a,b) { return(b[0] - a[0]) })
        for (var i=0; i<ipa_translations.length; i++) {
        	let ipasubrule = ipa_translations[i][1]
        	target_string = ipasubrule.sub(target_string)
        }

        return target_string.split()
  	}
  }
}
	
let a2ipa = new AlphabetToIpa("es.rules")
a2ipa.translate("llama")
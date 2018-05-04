var emass_lib = require("./index");
var molFormula = require('molecular-formula');

var formula = new molFormula('H2O');

var emass = new emass_lib();
console.log(emass.calculate([], [{'Mass':0,'Abundance':1}], formula.composition, 0, 0));


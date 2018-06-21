var emass_lib = require("./index");
var molFormula = require('molecular-formula');
var options = {
  'cutoff': 0.01,
  'limit': 1E-18, // This is the prune limit
  'abundanceDecimals': 4,
  'massDecimals': 3,
  'customIsotopes': {
    'H': {
      'Isotopes': [
        {
          "Mass": 1.0078246,
          "Abundance": 0.99985
        },
        {
          "Mass": 2.0141021,
          "Abundance": 0.00015
        }
      ]
    }
  }
};

var emass = new emass_lib();

/*emass.addCustomIsotopes('H', [
  {
    "Mass": 1.0078246,
    "Abundance": 0.99985
  },
  {
    "Mass": 2.0141021,
    "Abundance": 0.00015
  }
]);*/
console.log(emass);
var formula = new molFormula('C100');
var isotopes = emass.calculate(formula.composition, 0);
console.log(isotopes);


  
console.log(formula.composition);
isotopomers = emass.calculate(formula.composition, 0);

console.log('==========');
for(var i=0; i<isotopomers.length; i++) {
    console.log('Mass: '+isotopomers[i].Mass+', Abundance: '+isotopomers[i].Abundance);
}





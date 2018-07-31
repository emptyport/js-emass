var emass_lib = require("./index");
var molFormula = require('molecular-formula');
/*var options = {
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
};*/

var emassNatural = new emass_lib();
var emassLabelled = new emass_lib();

emassLabelled.addCustomIsotopes('C', [
  {
    "Mass": 12,
    "Abundance": 0.8893
  },
  {
    "Mass": 13.00335483507,
    "Abundance": 0.1107
  }
]);

var formula = new molFormula('C10');
var isotopesNatural = emassNatural.calculate(formula.composition, 0);
console.log(isotopesNatural);

var isotopesLabelled = emassLabelled.calculate(formula.composition, 0);
console.log(isotopesLabelled);


  
/*console.log(formula.composition);
isotopomers = emass.calculate(formula.composition, 0);

console.log('==========');
for(var i=0; i<isotopomers.length; i++) {
    console.log('Mass: '+isotopomers[i].Mass+', Abundance: '+isotopomers[i].Abundance);
}*/





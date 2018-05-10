var emass_lib = require("./index");
var molFormula = require('molecular-formula');

var formula = new molFormula('C100');

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

  /*emass.addCustomIsotopes('O', [
    {
      "Mass": 15.9949141,
      "Abundance": 0.997590
    },
    {
      "Mass": 16.9991322,
      "Abundance": 0.000374
    },
    {
        "Mass": 17.9991616,
        "Abundance": 0.002036
      }
  ]);*/

  /*emass.addCustomIsotopes('C', [
    {
      "Mass": 12.0000000,
      "Abundance": 0.988930
    },
    {
      "Mass": 13.0033554,
      "Abundance": 0.011070
    }
  ]);
*/
emass.setPruneLimit(0);
  
console.log(formula.composition);
isotopomers = emass.calculate(formula.composition, 0);

for(var i=0; i<isotopomers.length; i++) {
    console.log('Mass: '+isotopomers[i].Mass+', Abundance: '+isotopomers[i].Abundance);
}





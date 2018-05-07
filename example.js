var emass_lib = require("./index");
var molFormula = require('molecular-formula');

var formula = new molFormula('H2O');

var emass = new emass_lib();
isotopomers = emass.calculate([], [{'Mass':0,'Abundance':1}], formula.composition, 0, 0);

var maxVal = -1;
for(var i=0; i<isotopomers.length; i++) {
    if(isotopomers[i].Abundance > maxVal) {
        maxVal = isotopomers[i].Abundance;
    }
}

for(var i=0; i<isotopomers.length; i++) {
    console.log('Mass: '+isotopomers[i].Mass+', Abundance: '+isotopomers[i].Abundance/maxVal * 100);
}




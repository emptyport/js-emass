var emass_lib = require('../index');
var molFormula = require('molecular-formula');
var test = require('tape');

test('Default Settings', function(t) {
  var emass = new emass_lib();
  var formula = new molFormula('H2O');
  var isotopes = emass.calculate(formula.composition, 0);

  t.equal(isotopes.length, 3, 'Number of peaks');
  t.equal(isotopes[0].Mass, 18.010565, 'm0 correct');
  t.equal(isotopes[1].Mass, 19.015557, 'm1 correct');
  t.equal(isotopes[2].Mass, 20.014810, 'm2 correct');
  t.equal(isotopes[0].Abundance, 1.00000000, 'i0 correct');
  t.equal(isotopes[1].Abundance, 0.00061095, 'i1 correct');
  t.equal(isotopes[2].Abundance, 0.00205509, 'i2 correct');
  t.end();
});

test('Can change prune limit', function(t) {
  var emass = new emass_lib();
  var formula = new molFormula('H2O');
  emass.setPruneLimit(0.1);
  var isotopes = emass.calculate(formula.composition, 0);

  t.equal(emass.limit, 0.1, 'Prune limit was changed');
  t.equal(isotopes.length, 1, 'Prune limit affects output');
  t.end();
});

test('Custom isotopes', function(t) {
  var custom_isotope_emass = new emass_lib();
  var formula = new molFormula('H2O');

  custom_isotope_emass.addCustomIsotopes('H', [
    {
      "Mass": 1.0078246,
      "Abundance": 0.99985
    },
    {
      "Mass": 2.0141021,
      "Abundance": 0.00015
    }
  ]);

  custom_isotope_emass.addCustomIsotopes('O', [
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
  ]);

  var custom_isotopes = custom_isotope_emass.calculate(formula.composition, 0);

  t.equal(custom_isotopes.length, 3, 'Correct number of peaks');
  t.equal(custom_isotopes[0].Mass, 18.010563, 'm0 correct');
  t.equal(custom_isotopes[1].Mass, 19.015697, 'm1 correct');
  t.equal(custom_isotopes[2].Mass, 20.014811, 'm2 correct');
  t.equal(custom_isotopes[0].Abundance, 1.00000000, 'i0 correct');
  t.equal(custom_isotopes[1].Abundance, 0.00067495, 'i1 correct');
  t.equal(custom_isotopes[2].Abundance, 0.00204105, 'i2 correct');

  custom_isotope_emass.deleteCustomIsotopes('O');

  custom_isotopes = custom_isotope_emass.calculate(formula.composition, 0);

  t.equal(custom_isotope_emass.customIsotopes['O'], undefined, 'O was removed');
  t.equal(custom_isotopes[1].Mass, 19.015689, 'm1 correct');
  t.equal(custom_isotopes[1].Abundance, 0.00068097, 'i1 correct');

  custom_isotope_emass.clearCustomIsotopes();
  t.equal(custom_isotope_emass.customIsotopes['H'], undefined, 'H was also removed');
  t.end();
});

test('Can change cutoff', function(t) {
  var emass = new emass_lib();
  var formula = new molFormula('H2O');
  emass.setCutoff(0.1);
  var isotopes = emass.calculate(formula.composition, 0);

  t.equal(emass.cutoff, 0.1, 'Cutoff limit was changed');
  t.equal(isotopes.length, 1, 'Cutoff limit affects output');
  t.end();
});

test('Can set significant figures', function(t) {
  var emass = new emass_lib();
  var formula = new molFormula('H2O');
  emass.setAbundanceDecimals(3);
  emass.setMassDecimals(4);
  var isotopes = emass.calculate(formula.composition, 0);

  t.equal(isotopes.length, 3, 'Number of peaks');
  t.equal(isotopes[0].Mass, 18.0106, 'm0 correct');
  t.equal(isotopes[1].Mass, 19.0156, 'm1 correct');
  t.equal(isotopes[2].Mass, 20.0148, 'm2 correct');
  t.equal(isotopes[0].Abundance, 1, 'i0 correct');
  t.equal(isotopes[1].Abundance, 0.001, 'i1 correct');
  t.equal(isotopes[2].Abundance, 0.002, 'i2 correct');
  t.end();

});

test('Adding a charge works', function(t){
  var emass = new emass_lib();
  var formula = new molFormula('C100');

  // Grab the values from the original emass
  emass.addCustomIsotopes('C', [
    {
      "Mass": 12.0000000,
      "Abundance": 0.988930
    },
    {
      "Mass": 13.0033554,
      "Abundance": 0.011070
    }
  ]);

  var isotopes = emass.calculate(formula.composition, 0);
  t.equal(isotopes[3].Mass, 1203.010066, 'm3 correct for charge 0');
  t.equal(isotopes[3].Abundance, 0.202616, 'i3 correct for charge 0');

  t.end();
});


/*

describe('Matches original emass output', function() {
  var emass = new emass_lib();
  var formula = new molFormula('H2O');




});

*/
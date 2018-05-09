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
  t.end();
});

/*

describe('Matches original emass output', function() {
  var emass = new emass_lib();
  var formula = new molFormula('H2O');




});

*/
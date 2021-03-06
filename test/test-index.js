var emass_lib = require('../index');
var molFormula = require('molecular-formula');
var test = require('tape');

test('Default Settings', function(t) {
  var emass = new emass_lib();
  var formula = new molFormula('H2O');
  var isotopes = emass.calculate(formula.composition);

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
  var isotopes = emass.calculate(formula.composition);
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

  var custom_isotopes = custom_isotope_emass.calculate(formula.composition);

  t.equal(custom_isotopes.length, 3, 'Correct number of peaks');
  t.equal(custom_isotopes[0].Mass, 18.010563, 'm0 correct');
  t.equal(custom_isotopes[1].Mass, 19.015697, 'm1 correct');
  t.equal(custom_isotopes[2].Mass, 20.014811, 'm2 correct');
  t.equal(custom_isotopes[0].Abundance, 1.00000000, 'i0 correct');
  t.equal(custom_isotopes[1].Abundance, 0.00067495, 'i1 correct');
  t.equal(custom_isotopes[2].Abundance, 0.00204105, 'i2 correct');

  custom_isotope_emass.deleteCustomIsotope('O');

  custom_isotopes = custom_isotope_emass.calculate(formula.composition);

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
  var isotopes = emass.calculate(formula.composition);

  t.equal(emass.cutoff, 0.1, 'Cutoff limit was changed');
  t.equal(isotopes.length, 1, 'Cutoff limit affects output');
  t.end();
});

test('Can set significant figures', function(t) {
  var emass = new emass_lib();
  var formula = new molFormula('H2O');
  emass.setAbundanceDecimals(3);
  emass.setMassDecimals(4);
  var isotopes = emass.calculate(formula.composition);

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

  emass.setAbundanceDecimals(6);
  var isotopes = emass.calculate(formula.composition, 0);
  t.equal(isotopes[3].Mass, 1203.010066, 'm3 correct for charge 0');
  t.equal(isotopes[3].Abundance, 0.202616, 'i3 correct for charge 0');

  var isotopes = emass.calculate(formula.composition, 3);
  t.equal(isotopes[3].Mass, 401.002807, 'm3 correct for charge 3');
  t.equal(isotopes[3].Abundance, .202616, 'i3 correct for charge 3');

  var isotopes = emass.calculate(formula.composition, -4);
  t.equal(isotopes[3].Mass, 300.753065, 'm3 correct for charge -4');
  t.equal(isotopes[3].Abundance, .202616, 'i3 correct for charge -4');
  t.end();
});

test('Matches original emass output', function(t) {
  var emass = new emass_lib();
  var formula = new molFormula('C10000');

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

  emass.setAbundanceDecimals(8);
  emass.setPruneLimit(0);
  emass.setCutoff(0.00000001);

  var isotopes = emass.calculate(formula.composition);
  t.equal(isotopes[44].Mass, 120097.325474, 'm44 correct');
  t.equal(isotopes[44].Abundance, 0.43597577, 'i44 correct');
  t.end();
});

test('Options work', function(t) {
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

  var emass = new emass_lib(options);
  var formula = new molFormula('H2O');
  var isotopes = emass.calculate(formula.composition);

  t.equal(0.01, emass.cutoff, 'Cutoff was set');
  t.equal(1E-18, emass.limit, 'Prune limit was set');
  t.equal(4, emass.abundance_decimals, 'Abundance decimals were set');
  t.equal(3, emass.mass_decimals, 'Mass decimals were set');
  t.equal(1.0078246, emass.customIsotopes['H']['Isotopes'][0].Mass, 'Custom isotopes were set');
  t.equal(1, isotopes.length, 'Peak list length is correct');
  t.equal(18.011, isotopes[0].Mass, 'm0 is correct');

  t.end();
});

# js-emass

The original paper can be found [here](https://www.sciencedirect.com/science/article/pii/S1044030505010160) and I strongly recommend taking a look at the paper to better understand how the algorithm works.

This implementation is functionally identical to the original emass but it will provide slightly different values because it is using the isotope data from [here](https://github.com/emptyport/isotope-abundances). You can, however, provide custom mass/abundance information. If you use the isotope information from the original emass, this module will give the same output.

#### Useful links:
* The original emass site - http://www.helsinki.fi/science/lipids/software.html
* A modified version of emass for easier compilation - https://github.com/princelab/emass
* A partial Ruby implementation - https://github.com/princelab/ruby-emass
* A modified Python implementation - https://github.com/JC-Price/DeuteRater
  * The core algorithm is the same as the original, but it has been integrated into a larger package that deals with peptides rather than molecular formula. 

View this module on npm [here](https://www.npmjs.com/package/js-emass).

## Installation
npm install js-emass --save

## Usage

### Quickstart
```javascript
var emass_lib = require('js-emass');
var molFormula = require('molecular-formula');

var formula = new molFormula('C100');

var emass = new emass_lib();
  
isotopomers = emass.calculate(formula.composition, 0);

console.log(formula.composition);

for(var i=0; i<isotopomers.length; i++) {
    console.log('Mass: '+isotopomers[i].Mass+', Abundance: '+isotopomers[i].Abundance);
}
```
Output:
```
Mass: 1200, Abundance: 0.92457944
Mass: 1201.003355, Abundance: 1
Mass: 1202.00671, Abundance: 0.53537855
Mass: 1203.010065, Abundance: 0.18915663
Mass: 1204.013419, Abundance: 0.04961227
Mass: 1205.016774, Abundance: 0.01030258
Mass: 1206.020129, Abundance: 0.00176431
Mass: 1207.023484, Abundance: 0.00025625
```

### Functions
#### addCustomIsotopes(c, [])
This function allows you to add custom masses/relative abundances for each element. The first argument is the elemental symbol and the second element is an array of Mass/Abundance objects.
```javascript
emass.addCustomIsotopes('H', [
    {
      "Mass": 1.0078246,
      "Abundance": 0.99985
    },
    {
      "Mass": 2.0141021,
      "Abundance": 0.00015
    }
  ]);
```

#### deleteCustomIsotopes(c)
This function allows you to selectively delete any custom isotopes you may have added. This function accepts an elemental symbol as an argument.
```javascript
emass.deleteCustomIsotopes('H');
```

#### clearCustomIsotopes()
This function will remove all custom isotopes at once.
```javascript
emass.clearCustomIsotopes();
```

#### setPruneLimit(f)
This function sets the pruning limit used during calculations. As the isotopic envelope is calculated, peaks with a relative abundance below the prune limit will be removed to help speed up the calculations. The default value is 1E-10.
```javascript
emass.setPruneLimit(0.000001);
```

#### setCutoff(f)
This function sets the abundance cutoff to be used on the returned values. This filtering is performed after the relative abundances have been normalized to the most intense peak. The default value is 0.0001.
```javascript
emass.setCutoff(0.000001);
```

#### setAbundanceDecimals(i)
This function sets the number of decimal places to keep for the abundance values. The default is 8.
```javascript
emass.setAbundanceDecimals(4);
```

#### setMassDecimals(i)
This function sets the number of decimal places to keep for the mass values. The default is 6.
```javascript
emass.setMassDecimals(2);
```

#### new(options)
Additionally you can pass these options in when you create a new emass object.
```javascript
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
```

## Tests
You can run `npm test` to run the tests after installing the development dependencies.

## Future functionality
No future functionality is planned.

## License
This software is released under the MIT license.

The following notice appears with the original copy of emass:

>Copyright (c) 2005 Perttu Haimi and Alan L. Rockwood
>
>All rights reserved.
>
>Redistribution and use in source and binary forms,
with or without modification, are permitted provided
that the following conditions are met:
>
>    * Redistributions of source code must retain the
      above copyright notice, this list of conditions
      and the following disclaimer.
>    * Redistributions in binary form must reproduce
      the above copyright notice, this list of conditions
      and the following disclaimer in the documentation
      and/or other materials provided with the distribution.
>    * Neither the author nor the names of any contributors
      may be used to endorse or promote products derived
      from this software without specific prior written
      permission.
>
>THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND
CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES,
INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR
CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT
NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION)
HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE
OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

## Support this project!

[![Support this project on Patreon!](https://c5.patreon.com/external/logo/become_a_patron_button.png)](https://www.patreon.com/MikeTheBiochem)

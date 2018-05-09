/*
Port of emass done by Michael Porter

Based on an algorithm developed by Alan L. Rockwood.

Published in 
Rockwood, A.L. and Haimi, P.: "Efficent calculation of 
Accurate Masses of Isotopic Peaks",
Journal of The American Society for Mass Spectrometry
JASMS 03-2263, in press

which contained the following copyright and disclaimer: 


Copyright (c) 2005 Perttu Haimi and Alan L. Rockwood

All rights reserved.

Redistribution and use in source and binary forms,
with or without modification, are permitted provided
that the following conditions are met:

    * Redistributions of source code must retain the
      above copyright notice, this list of conditions
      and the following disclaimer.
    * Redistributions in binary form must reproduce
      the above copyright notice, this list of conditions
      and the following disclaimer in the documentation
      and/or other materials provided with the distribution.
    * Neither the author nor the names of any contributors
      may be used to endorse or promote products derived
      from this software without specific prior written
      permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND
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

*/

var isoAbund = require('isotope-abundances');

module.exports =  class emass {
  constructor(options) {
    this.ELECTRON = .00054858;

    this.limit = this.opt(options, 'limit', 1E-10);
    this.customIsotopes = this.opt(options, 'customIsotopes', {});
    this.abundance_decimals = this.opt(options, 'abundanceDecimals', 8);
    this.mass_decimals = this.opt(options, 'massDecimals', 6);
    this.cutoff = this.opt(options, 'cutoff', 0.0001);
  }

  // From here https://stackoverflow.com/questions/23577632/optional-arguments-in-nodejs-functions
  opt(options, name, default_value){
    return options && options[name]!==undefined ? options[name] : default_value;
  }

  addCustomIsotopes(element, isotopes) {
    this.customIsotopes[element] = {
      "Isotopes": isotopes
    };
  }

  clearCustomIsotopes() {
    this.customIsotopes = {};
  }

  deleteCustomIsotopes(element) {
    delete this.customIsotopes[element];
  }

  setPruneLimit(limit) {
    this.limit = limit;
  }

  setCutoff(cutoff) {
    this.cutoff = cutoff;
  }

  setAbundanceDecimals(abundance_decimals) {
    this.abundance_decimals = abundance_decimals;
  }

  setMassDecimals(mass_decimals) {
    this.mass_decimals = mass_decimals;
  }

  print_list(l) {
    var out = "";
    for(var i=0; i<l.length; i++) {
      out += JSON.stringify(l[i]);
    }
    return out;
  }

  // This code comes from https://stackoverflow.com/questions/15762768/javascript-math-round-to-two-decimal-places
  round(n, digits) {
    if (digits === undefined) {
        digits = 0;
    }

    var multiplicator = Math.pow(10, digits);
    n = parseFloat((n * multiplicator).toFixed(11));
    return parseFloat((Math.round(n) / multiplicator).toFixed(digits));
  }

  create_atom_list(isotopes) {
    var atom_list = [];
    for(var i=0; i<isotopes.length; i++) {
      atom_list.push({'Mass':isotopes[i].Mass, 'Abundance':isotopes[i].Abundance})
    }
    return atom_list;
  }

  normalize(results) {
    var maxVal = -1;
    for(var i=0; i<results.length; i++) {
      if(results[i].Abundance > maxVal) {
        maxVal = results[i].Abundance;
      }
    }

    for(var i=0; i<results.length; i++) {
      results[i].Mass = this.round(results[i].Mass, this.mass_decimals);
      results[i].Abundance = this.round(results[i].Abundance/maxVal, this.abundance_decimals);
    }

    return results;
  }

  prune(f) {
    var prune = [];
    var counter = 0;

    var goodPeaks = []

    for(var i=0; i<f.length; i++) {
      var peak = f[i];
      if(peak.Abundance > this.limit) {
        goodPeaks.push(peak);
        break;
      }
      prune.push(counter);
      counter++;
    }

    counter = f.length - 1;

    for(var i=f.length-1; i>=0; i--) {
      var peak = f[i];
      if(peak.Abundance > this.limit) {
        break;
      }
      prune.push(counter);
      counter--;
    }

    prune = [...new Set(prune)];
    prune = prune.sort();
    prune = prune.reverse();

    for(var i=0; i<prune.length; i++) {
      f.splice(prune[i], 1);
    }

    return f;
    //return goodPeaks;
  }

  convolute(g, f) {
    var h = [];
    var g_n = g.length;
    var f_n = f.length;
    if(g_n === 0 || f_n === 0) {
      return h;
    }
    for(var k=0; k<g_n+f_n-1; k++) {
      var sumweight = 0;
      var summass = 0;
      var start;
      var end;

      if(k < f_n-1) { start = 0; }
      else { start = k-f_n+1; }

      if(k < g_n-1) { end = k; }
      else { end = g_n - 1; }

      for(var i=start; i<end+1; i++) {
        var weight = g[i].Abundance * f[k-i].Abundance;
        var mass = g[i].Mass + f[k-i].Mass;
        sumweight += weight;
        summass += weight * mass;
      }

      var p;
      if(sumweight === 0) {
        p = {'Mass':-1, 'Abundance':sumweight};
      }
      else {
        p = {'Mass':summass/sumweight, 'Abundance':sumweight};
      }
      h.push(p)
    }

    return h;

  }

  calculate(formula, charge) {
    var tmp = [];
    var result = [{'Mass':0,'Abundance':1}];
    for (var element in formula) {
      if (formula.hasOwnProperty(element)) {

        var n = parseInt(formula[element]);
        var j = 0;
        var atom_list = [];

        if (!(element in this.customIsotopes)) {
          atom_list = [this.create_atom_list(isoAbund(element).Isotopes)];
        }
        else {
          atom_list = [this.create_atom_list(this.customIsotopes[element].Isotopes)];
        }

        while(n > 0) {
          var size = atom_list.length;
          if(j === size) {
            atom_list.push([]);
            atom_list[j] = this.convolute(atom_list[j-1], atom_list[j-1]);
            atom_list[j] = this.prune(atom_list[j])
          }
          if(n & 1) {
            tmp = this.convolute(result, atom_list[j]);
            atom_list[j] = this.prune(tmp);
            var swap = tmp;
            tmp = result;
            result = swap;
          }
          n = (n >> 1);
          j++;
        }

      }
    }
    
    if(charge !== 0) {
      for(var i=0; i<result.length; i++) {
        if(charge>0) {
          result[i].Mass = result[i].Mass/Math.abs(charge) - this.ELECTRON;
        }
        else {
          result[i].Mass = result[i].Mass/Math.abs(charge) + this.ELECTRON;
        }
      }
    }

    result = this.normalize(result);

    var filtered_result = [];
    for(var i=0; i<result.length; i++) {
      if(result[i].Abundance >= this.cutoff) {
        filtered_result.push(result[i]);
      }
    }
    
    return filtered_result;
  }
  
}
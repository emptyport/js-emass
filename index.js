var isoAbund = require('isotope-abundances');

module.exports =  class emass {
  constructor() {
    
  }

  print_list(l) {
    var out = "";
    for(var i=0; i<l.length; i++) {
      out += JSON.stringify(l[i]);
    }
    return out;
  }

  create_atom_list(isotopes) {
    var atom_list = [];
    for(var i=0; i<isotopes.length; i++) {
      atom_list.push({'Mass':isotopes[i].Mass, 'Abundance':isotopes[i].Abundance})
    }
    return atom_list;
  }

  prune(f, limit) {
    var prune = [];
    var counter = 0;

    var goodPeaks = []

    for(var i=0; i<f.length; i++) {
      var peak = f[i];
      if(peak.Abundance > limit) {
        goodPeaks.push(peak);
        break;
      }
      prune.push(counter);
      counter++;
    }

    counter = f.length - 1;

    for(var i=f.length-1; i>=0; i--) {
      var peak = f[i];
      if(peak.Abundance > limit) {
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

  calculate(tmp, result, formula, limit, charge) {
    for (var element in formula) {
      if (formula.hasOwnProperty(element)) {

        var n = parseInt(formula[element]);
        var j = 0;
        var atom_list = [this.create_atom_list(isoAbund(element).Isotopes)];

        while(n > 0) {
          var size = atom_list.length;
          if(j === size) {
            atom_list.push([]);
            atom_list[j] = this.convolute(atom_list[j-1], atom_list[j-1]);
            atom_list[j] = this.prune(atom_list[j], limit)
          }
          if(n & 1) {
            tmp = this.convolute(result, atom_list[j]);
            atom_list[j] = this.prune(tmp, limit);
            var swap = tmp;
            tmp = result;
            result = swap;
          }
          n = (n >> 1);
          j++;
        }

      }
    }
    return result;
  }
  
}
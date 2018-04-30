var should = require('chai').should();
var emass = require('../index');

describe('Default Values', function() {
  defaultValues = new peptideCutter();

  it('enzyme is trypsin', function() {
    defaultValues.enzyme.should.equal('trypsin');
  });
  it('missed cleavages is 0', function() {
    defaultValues.num_missed_cleavages.should.equal(0);
  });
  it('min length is 8', function() {
    defaultValues.min_length.should.equal(8);
  });
  it('max length is 30', function() {
    defaultValues.max_length.should.equal(30);
  });
  it('regex should be for trypsin', function() {
    regex = new RegExp("([KR](?=[^P]))|((?<=W)K(?=P))|((?<=M)R(?=P))", "g");
    defaultValues.regex.should.match(regex);
  });
});

describe('Setting Values', function() {
  passedValues = new peptideCutter({
    'enzyme': 'lysc',
    'num_missed_cleavages': 2,
    'min_length': 6,
    'max_length': 24
  });

  it('enzyme is lysc', function() {
    passedValues.enzyme.should.equal('lysc');
  });
  it('missed cleavages is 2', function() {
    passedValues.num_missed_cleavages.should.equal(2);
  });
  it('min length is 6', function() {
    passedValues.min_length.should.equal(6);
  });
  it('max length is 24', function() {
    passedValues.max_length.should.equal(24);
  });
  it('regex should be for lysc', function() {
    regex = new RegExp("K", "g");
    passedValues.regex.should.match(regex);
  });
});

describe('Enzymes cleaving correctly', function() {
  it('arg-c works', function() {
    argc = new peptideCutter({
      'enzyme': 'arg-c'
    });
    peptides = argc.cleave('ARGININE');
    it('peptide should match', function() {
      peptides[0].should.equal('GININE');
    });
  });

  it('asp-n works', function() {
    aspn = new peptideCutter({
      'enzyme': 'asp-n'
    });
    peptides = aspn.cleave('MYPEPTIDE');
    it('peptide should match', function() {
      peptides[0].should.equal('MYPEPTI');
    });
  });

  it('bnps-skatole works', function() {
    bnps = new peptideCutter({
      'enzyme': 'bnps-skatole'
    });
    peptides = bnps.cleave('VERYDIRTYWATER');
    it('peptide should match', function() {
      peptides[0].should.equal('VERYDIRTY');
    });
  });

  it('caspase 1 works', function() {
    caspase1 = new peptideCutter({
      'enzyme': 'caspase 1'
    });
    peptides = caspase1.cleave(interleukinBeta);
    it('peptide should match', function() {
      peptides.length.should.equal(1);
      peptide[0].should.equal('MAEVPELASEMMAYYSGNEDDLFFEAD');
    });
  });

  it('caspase 2 works', function() {
    caspase2 = new peptideCutter({
      'enzyme': 'caspase 2'
    });
    peptides = caspase2.cleave('PEPTIDEDVADYTRRHL');
    it('peptide should match', function() {
      peptide[0].should.equal('PEPTIDEDVAD');
    });
  });

  it('caspase 3 works', function() {
    caspase3 = new peptideCutter({
      'enzyme': 'caspase 3'
    });
    peptides = caspase3.cleave('PEPTIDEDMQDYTRRHL');
    it('peptide should match', function() {
      peptide[0].should.equal('PEPTIDEDMQD');
    });
  });

  it('caspase 4 works', function() {
    caspase4 = new peptideCutter({
      'enzyme': 'caspase 4'
    });
    peptides = caspase4.cleave('PEPTIDELEHDAYTRRHL');
    it('peptide should match', function() {
      peptide[0].should.equal('PEPTIDELEHD');
    });
  });

  it('caspase 5 works', function() {
    caspase5 = new peptideCutter({
      'enzyme': 'caspase 5'
    });
    peptides = caspase5.cleave('PEPTIDELEHDAYTRRHL');
    it('peptide should match', function() {
      peptide[0].should.equal('PEPTIDELEHD');
    });
  });

  it('caspase 6 works', function() {
    caspase6 = new peptideCutter({
      'enzyme': 'caspase 6'
    });
    peptides = caspase6.cleave('PEPTIDEVEIDAYTRRHL');
    it('peptide should match', function() {
      peptide[0].should.equal('PEPTIDEVEID');
    });
  });

  it('caspase 7 works', function() {
    caspase7 = new peptideCutter({
      'enzyme': 'caspase 7'
    });
    peptides = caspase7.cleave('PEPTIDEDEVDAYTRRHL');
    it('peptide should match', function() {
      peptide[0].should.equal('PEPTIDEDEVD');
    });
  });

  it('caspase 8 works', function() {
    caspase8 = new peptideCutter({
      'enzyme': 'caspase 8'
    });
    peptides = caspase8.cleave('PEPTIDEIETDAYTRRHL');
    it('peptide should match', function() {
      peptide[0].should.equal('PEPTIDEIETD');
    });
  });

  it('caspase 9 works', function() {
    caspase9 = new peptideCutter({
      'enzyme': 'caspase 9'
    });
    peptides = caspase9.cleave('PEPTIDELEHDAYTRRHL');
    it('peptide should match', function() {
      peptide[0].should.equal('PEPTIDELEHD');
    });
  });

  it('caspase 10 works', function() {
    caspase10 = new peptideCutter({
      'enzyme': 'caspase 10'
    });
    peptides = caspase10.cleave('PEPTIDEIEADAYTRRHL');
    it('peptide should match', function() {
      peptide[0].should.equal('PEPTIDEIEAD');
    });
  });

  it('chymotrypsin high specificity works', function() {
    chymotrypsinHi = new peptideCutter({
      'enzyme': 'chymotrypsin high specificity'
    });
    peptides = chymotrypsinHi.cleave('PEPTIDEFAPEPTIDEMAPEPTIDEFPEPTIDE');
    it('peptides should match', function() {
      peptides.length.should.equal(2);
    });
  });

  it('chymotrypsin low specificity works', function() {
    chymotrypsinLo = new peptideCutter({
      'enzyme': 'chymotrypsin low specificity'
    });
    peptides = chymotrypsinLo.cleave('PEPTIDEFAPEPTIDEMAPEPTIDEFPEPTIDE');
    it('peptides should match', function() {
      peptides.length.should.equal(3);
    });
  });

  it('clostripain works', function() {
    clostripain = new peptideCutter({
      'enzyme': 'clostripain'
    });
    peptides = clostripain.cleave('ARGININE');
    it('peptide should match', function() {
      peptides[0].should.equal('GININE');
    });
  });

  it('cnbr works', function() {
    cnbr = new peptideCutter({
      'enzyme': 'cnbr'
    });
    peptides = cnbr.cleave('IREALLYLIKEMASSSPEC');
    it('peptide should match', function() {
      peptides[0].should.equal('IREALLYLIKEM');
    });
  });

  it('enterokinase works', function() {
    enterokinase = new peptideCutter({
      'enzyme': 'enterokinase'
    });
    peptides = enterokinase.cleave('PEPTIDEDDDKHI');
    it('peptide should match', function() {
      peptides[0].should.equal('PEPTIDEDDDK');
    });
  });

  it('factor xa works', function() {
    factorXa = new peptideCutter({
      'enzyme': 'factor xa'
    });
    peptides = factorXa.cleave('PEPTIDEIDGRHI');
    it('peptide should match', function() {
      peptides[0].should.equal('PEPTIDEIDGR');
    });
  });

  it('formic acid works', function() {
    formicAcid = new peptideCutter({
      'enzyme': 'formic acid'
    });
    peptides = formicAcid.cleave('MASSSPECPEPTIDE');
    it('peptide should match', function() {
      peptides[0].should.equal('MASSSPECPEPTID');
    });
  });

  it('glutamyl endopeptidase works', function() {
    glutamylEndopeptidase = new peptideCutter({
      'enzyme': 'glutamyl endopeptidase'
    });
    peptides = glutamylEndopeptidase.cleave('VERYDIRTYWATER');
    it('peptide should match', function() {
      peptides[0].should.equal('RYDIRTYWAT');
    });
  });

  it('granzyme b works', function() {
    granzymeB = new peptideCutter({
      'enzyme': 'granzyme b'
    });
    peptides = granzymeB.cleave('WATERIEPDPEPTIDE');
    it('peptide should match', function() {
      peptides[0].should.equal('WATERIEPD');
    });
  });

  it('hydroxylamine works', function() {
    hydroxylamine = new peptideCutter({
      'enzyme': 'hydroxylamine'
    });
    peptides = hydroxylamine.cleave('WHYNOSLEEPINGINCLASS');
    it('peptide should match', function() {
      peptides[0].should.equal('WHYNOSLEEPIN');
    });
  });

  it('iodosobenzoic acid works', function() {
    iodosobenzoicAcid = new peptideCutter({
      'enzyme': 'iodosobenzoic acid'
    });
    peptides = iodosobenzoicAcid.cleave('MASSSPECWINS');
    it('peptide should match', function() {
      peptides[0].should.equal('MASSSPECW');
    });
  });

  it('lysc works', function() {
    lysc = new peptideCutter({
      'enzyme': 'lysc'
    });
    peptides = lysc.cleave('PLEASEDRINKWATER');
    it('peptide should match', function() {
      peptides[0].should.equal('PLEASEDRINK');
    });
  });

  it('ntcb works', function() {
    ntcb = new peptideCutter({
      'enzyme': 'ntcb'
    });
    peptides = ntcb.cleave('PLEASEDRINKCLEAN');
    it('peptide should match', function() {
      peptides[0].should.equal('PLEASEDRINKC');
    });
  });

  it('pepsin ph1.3 works', function() {
    pepsinPH13 = new peptideCutter({
      'enzyme': 'pepsin ph1.3'
    });
    peptides = pepsinPH13.cleave('MAEVPELASEMMAYYSGNEDDLFFEADGPKQMKCSF');
    it('peptide should match', function() {
      peptides.length.should.equal(2);
    });
  });

  it('pepsin ph2.0 works', function() {
    pepsinPH20 = new peptideCutter({
      'enzyme': 'pepsin ph2.0'
    });
    peptides = pepsinPH20.cleave('MAEVPELASEMMAYYSGNEDDLFFEADGPKQMKCSF');
    it('peptide should match', function() {
      peptides.length.should.equal(1);
    });
  });

  it('proline endopeptidase works', function() {
    prolineEndopeptidase = new peptideCutter({
      'enzyme': 'proline endopeptidase'
    });
    peptides = prolineEndopeptidase.cleave('WATERHPEPTIDEHPPEPTIDE');
    it('peptide should match', function() {
      peptides[0].should.equal('EPTIDEHPPEPTIDE');
    });
  });

  it('proteinase k works', function() {
    proteinaseK = new peptideCutter({
      'enzyme': 'proteinase k',
      'min_length': 4
    });
    peptides = proteinaseK.cleave('ILIKEMASSSPEC');
    it('peptide should match', function() {
      peptides[0].should.equal('SSSPE');
    });
  });

  it('staphylococcal peptidase i works', function() {
    staphylococcalPeptidaseI = new peptideCutter({
      'enzyme': 'staphylococcal peptidase i',
      'min_length': 6
    });
    peptides = staphylococcalPeptidaseI.cleave('ILIKEMASSSPEC');
    it('peptide should match', function() {
      peptides.length.should.equal('MASSSPE');
    });
  });

  it('thermolysin works', function() {
    thermolysin = new peptideCutter({
      'enzyme': 'thermolysin',
      'min_length': 7
    });
    peptides = thermolysin.cleave('PLEASESTAYHERE');
    it('peptide should match', function() {
      peptides[0].should.equal('LEASEST');
    });
  });

  it('thrombin works', function() {
    thrombin = new peptideCutter({
      'enzyme': 'thrombin'
    });
    peptides = thrombin.cleave('PEPTIDEAAGRG');
    it('peptide should match', function() {
      peptides[0].should.equal('PEPTIDEAAGR');
    });
  });

  it('trypsin works', function() {
    trypsin = new peptideCutter({
      'enzyme': 'trypsin'
    });
    peptides = trypsin.cleave('PEPTIDELIKEMEHARPISTPLAY');
    it('peptide should match', function() {
      peptides.length.should.equal(2);
    });
  });

});

describe('Parameters', function() {
  it('min length works', function() {
    minLength = new peptideCutter({
      'enzyme': 'lysc',
      'min_length': 10
    });
    peptides = minLength.cleave('AAAAAAAAAKAAAAAAAAA');
    peptides.length.should.equal(1);
  });

  it('max length works', function() {
    maxLength = new peptideCutter({
      'enzyme': 'lysc',
      'max_length': 10
    });
    peptides = maxLength.cleave('AAAAAAAAKAAAAAAAAAKAAAAAAAAAAA');
    peptides.length.should.equal(2);
  });

  it('missed cleavages works', function() {
    missed = new peptideCutter({
      'enzyme': 'lysc',
      'min_length': 2,
      'num_missed_cleavages': 2
    });
    peptides = missed.cleave('AKGKYK');
    peptides.length.should.equal(6);
  });
});
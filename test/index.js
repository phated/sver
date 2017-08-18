var sver = require('../sver.js');
var Semver = sver.Semver;
var SemverRange = sver.SemverRange;
var convertRange = require('../convert-range.js');
var assert = require('assert');

suite('Semver Major and Minor Ranges', function() {

  test('Range test 1', function() {
    assert.equal(SemverRange.match('0.0.1', '0.0.1'), true);
    assert.equal(SemverRange.match('0.0.1', '0.0.0'), false);
    assert.equal(SemverRange.match('0.0.1', '0.0.2'), false);
    assert.equal(SemverRange.match('0.0.1', '0.0.1-betaasdf-asdf'), false);
    assert.equal(new SemverRange('0.1').toString(), '0.1');
    assert.equal(new SemverRange('~0.1').toString(), '0.1');
    assert.equal(new SemverRange('^0.1').toString(), '0.1');
  });
  test('Range test 2', function() {
    assert.equal(new Semver('0.1.0-').lt('0.1.0'), true);
    assert.equal(SemverRange.match('0.1', '0.1.1'), true);
    assert.equal(SemverRange.match('0.1', '0.1.4'), true);
    assert.equal(SemverRange.match('0.1', '0.1.23423-sdf'), false);
    assert.equal(SemverRange.match('0.1', '0.1'), false);
    assert.equal(SemverRange.match('0.1', '1.1.1'), false);
    assert.equal(SemverRange.match('0.1', '0.0.1'), false);
  });
  test('Range test 3', function() {
    var range = new SemverRange('0');
    assert.equal(range.contains('0.0.1'), true);
    assert.equal(range.contains('0.1.1'), true);
    assert.equal(range.contains('0.1.1-beta'), true);
    assert.equal(range.contains('1.1.1-beta'), false);
  });
  test('Range test 4', function() {
    var range = new SemverRange('1');
    assert.equal(range.contains('1.5'), true);
    assert.equal(range.contains('1.5.2'), true);
    assert.equal(range.contains('1.0.0'), true);
    assert.equal(range.contains('1.5.3-beta1'), true);
    assert.equal(range.contains('2.0.0-beta1'), false);
    assert.equal(range.contains('0.1.1'), false);
  });
  test('Range test 5', function() {
    assert.equal(SemverRange.match('1.2', '1.2.0'), true);
    assert.equal(SemverRange.match('1.2', '1.2.1'), true);
    assert.equal(SemverRange.match('1.2', '1.2.1-beta'), false);
    assert.equal(SemverRange.match('1.2', '1.2.1-beta', true), true);
    assert.equal(SemverRange.match('2.0', '2.1.0'), false);
  });
  test('Range test 6', function() {
    assert.equal(SemverRange.match('4.3.2', '4.3.2-beta'), false);
    assert.equal(SemverRange.match('4.3.2', '4.3.2'), true);
    assert.equal(SemverRange.match('4.3.2', '4.3.3'), false);
  });
  test('Range test 7', function() {
    assert.equal(SemverRange.match('4.3.2-beta.4', '4.3.2-beta.4'), true);
    assert.equal(SemverRange.match('^4.3.2-beta.4', '4.3.2-beta.5'), true);
    assert.equal(SemverRange.match('^4.3.2-beta.4', '4.3.2-beta.3'), false);
    assert.equal(SemverRange.match('^4.3.2-beta.4', '4.3.3-beta.5'), false);
    assert.equal(SemverRange.match('4.3.2-beta.4', '4.3.2'), false);
    assert.equal(SemverRange.match('^4.3.2-beta.4', 'asdfa'), false);
  });
  test('Range test 8', function() {
    assert.equal(SemverRange.match('ksdufh8234-', 'asdfa'), false);
    assert.equal(SemverRange.match('ksdufh8234-', 'ksdufh8234-'), true);
  });
  test('Range test 9', function() {
    assert.equal(Semver.compare('0.2.0', 'master'), 1);
    assert.equal(Semver.compare('wip/here/some-thing', '0.3.0-alpha'), -1);
    assert.equal(Semver.compare('wip%2Fhere%2Fsome%2Fthing', '0.3.0-alpha'), -1);
    assert.equal(Semver.compare('1.2.a', '0.0.1'), -1);
    assert.equal(Semver.compare('1.2.3-beta', '1.2.3-alpha'), 1);
    assert.equal(Semver.compare('1.2.3-beta.1', '1.2.3-beta.11'), -1);
    assert.equal(Semver.compare('1.2.3-beta.1', '1.2.3-beta.11'), -1);
    assert.equal(Semver.compare('1.2.3-beta.2', '1.2.3-beta.1'), 1);
    assert.equal(Semver.compare('1.2.3', '1.2.3-beta.1'), 1);
  });
  test('Range test 10', function() {
    assert.equal(Semver.compare('1.0.0-alpha', '1.0.0-alpha.1'), -1);
    assert.equal(Semver.compare('1.0.0-alpha.1', '1.0.0-alpha.beta'), -1);
    assert.equal(Semver.compare('1.0.0-alpha.beta', '1.0.0-beta'), -1);
    assert.equal(Semver.compare('1.0.0-beta', '1.0.0-beta.2'), -1);
    assert.equal(Semver.compare('1.0.0-beta.2', '1.0.0-beta.11'), -1);
    assert.equal(Semver.compare('1.0.0-beta.11', '1.0.0-rc.1'), -1);
    assert.equal(Semver.compare('1.0.0-rc.1', '1.0.0'), -1);
  });
  test('Range test 11', function() {
    var versions = ['1.2.3', '1.3.4-alpha', '1.3.4-alpha.1', '1.3.4-beta', '1.2.3+b', '1.2.3+a'];
    var range = new SemverRange('*');

    var bestStableMatch = range.bestMatch(versions);
    var s = new Semver('1.2.3+b');
    assert.equal(bestStableMatch.toString(), '1.2.3');

    range = new SemverRange('');

    var bestUnstableMatch = range.bestMatch(versions, true);
    assert.equal(bestUnstableMatch.toString(), '1.3.4-beta');
  });
});

suite('Semver Compare', function() {

  test('Version Compare 1', function() {
    assert.equal(Semver.compare('1.0.1', '1.0.11'), -1);
    assert.equal(Semver.compare('1.0.3', '1.2.11'), -1);
    assert.equal(Semver.compare('1.2.11', '1.2.1'), 1);
    assert.equal(Semver.compare('1.2.10', '1.2.1'), 1);
  });

  test('Range Compare 1', function() {
    assert.equal(SemverRange.compare('1.4', '1.4.5'), -1);
    assert.equal(SemverRange.compare('1.4.5', '1.4'), 1);
    assert.equal(SemverRange.compare('1.4', '2.0.0'), -1);
    assert.equal(SemverRange.compare('1.0.0', '1.4'), -1);
    assert.equal(SemverRange.compare('1', '2'), -1);
    assert.equal(SemverRange.compare('1.4.0', '1'), 1);
    assert.equal(SemverRange.compare('1.0.1', '1.0.11'), -1);
    assert.equal(SemverRange.compare('1.0.3', '1.2.11'), -1);
    assert.equal(SemverRange.compare('1.2.11', '1.2.1'), 1);
    assert.equal(SemverRange.compare('1.2.10', '1.2.1'), 1);
  });

  test('Compare 2', function() {
    assert.equal(Semver.compare('2.0', '2.1.0'), -1);
  });

  test('Semver sort', function() {
    var versions = ['1.0.3', '1.0.4', '1.0.5', '1.0.6', '1.0.7', '1.0.8', '1.2.0', '1.2.1', '1.2.10', '1.2.11', '1.2.12', '1.2.2', '1.2.3', '1.2.4', '1.2.5', '1.2.6', '1.2.7', '1.2.8', '1.2.9'];
    versions.sort(Semver.compare);
    assert.equal(versions.pop(), '1.2.12');
  });

  test('Compare with build numbers', function() {
    assert.equal(Semver.compare('0.2.0-build.2+sha.c4e21ef', '0.2.0-build.1+sha.9db70d3'), 0);
  });

  test('Contains', function() {
    assert.equal(SemverRange.match('0.1', '0.1.0-alpha', true), true);
    assert.equal(new SemverRange('0.1').contains('0.1.0-beta'), true);
  });

  test('Sorting', function() {
    var ranges1 = ['0.0.1-beta', '0.0.1', '0.1.0', '0.1', '0.1.3-beta.1', '^0.1.0', '*', '2.0.1', '2.1', '2.1.0-beta', '~2.1.0', '^2.0.0'];
    assert.equal(JSON.stringify(ranges1.sort(SemverRange.compare)), JSON.stringify([
      '0.0.1-beta', '0.0.1', '0.1', '^0.1.0', '0.1.0', '0.1.3-beta.1', '^2.0.0', '2.0.1', '2.1', '2.1.0-beta', '~2.1.0', '*'
    ]));

    var versions = ['2.4.5', '2.3.4-alpha', '1.2.3', '2.3.4-alpha.2'];
    var ranges2 = ['^1.2.3', '1.2', '2.3.4'];

    assert.equal(JSON.stringify(versions.sort(Semver.compare)), JSON.stringify([
      '1.2.3', '2.3.4-alpha', '2.3.4-alpha.2', '2.4.5'
    ]));
    assert.equal(JSON.stringify(ranges2.sort(SemverRange.compare)), JSON.stringify([
      '1.2', '^1.2.3', '2.3.4'
    ]));
  });

});


suite('Semver Compatibility Ranges', function() {

  test('Basic compatibility', function() {
    assert.equal(SemverRange.match('^1.5.2', '1.4.0'), false);
    assert.equal(SemverRange.match('1', '1.4.0'), true);
    assert.equal(SemverRange.match('0.1', '0.1.0'), true);
    assert.equal(SemverRange.match('0.1', '0.2.0'), false);
    assert.equal(SemverRange.match('1.1', '1.2.0'), false);
    assert.equal(SemverRange.match('1.1', '1.1.0'), true);
    assert.equal(SemverRange.match('^0.0.2', '1.0.2'), false);
    assert.equal(SemverRange.match('^0.0.1', '0.0.1'), true);
    assert.equal(SemverRange.match('^0.0.1', '0.0.2'), false);
    assert.equal(SemverRange.match('^0.0.1', '1.0.2'), false);
    assert.equal(SemverRange.match('^0.0.1', '1.0.1'), false);
    assert.equal(SemverRange.match('^0.1.0', '0.1.0'), true);
    assert.equal(SemverRange.match('^0.1.0', '0.2.0'), false);
    assert.equal(SemverRange.match('^0.1.0', '1.1.0'), false);
    assert.equal(SemverRange.match('1.0.0-beta.13', '1.0.0-beta.5b'), false);
  });

  test('Semver compatibility', function() {
    assert.equal(SemverRange.match('^1.1.12', '1.1.12'), true);
    assert.equal(SemverRange.match('^1.1.12', '1.1.11'), false);
    assert.equal(SemverRange.match('^1.1.12', '1.1.345'), true);
    assert.equal(SemverRange.match('^1.1.12', '1.10.345'), true);
    assert.equal(SemverRange.match('^1.1.12', '2.10.345'), false);
  });

  test('Prerelease ranges', function() {
    assert.equal(SemverRange.match('^1.0.4-alpha.1', '1.0.4-alpha.1'), true);
    assert.equal(SemverRange.match('^1.0.4-alpha.1', '1.0.4-alpha.2'), true);
    assert.equal(SemverRange.match('^1.0.4-alpha.1', '1.0.4-beta'), true);
    assert.equal(SemverRange.match('^1.0.4-alpha.1', '1.0.4-beta.10'), true);
    assert.equal(SemverRange.match('^1.0.4-alpha.1', '1.0.4'), true);
  });

});

suite('Fuzzy Compatibility Ranges', function() {

  test('Basic compatibility', function() {
    assert.equal(SemverRange.match('^1.5.2', '1.4.0'), false);
    assert.equal(SemverRange.match('~0.0.0', '0.1.0'), false);
    assert.equal(SemverRange.match('~0.0.0', '1.2.0'), false);
    assert.equal(SemverRange.match('~1.0.0', '1.2.0'), false);
    assert.equal(SemverRange.match('~1.0.0', '2.4.0'), false);
    assert.equal(SemverRange.match('~0.1.0', '0.1.0'), true);
    assert.equal(SemverRange.match('~0.1.0', '0.2.0'), false);
    assert.equal(SemverRange.match('~1.1.0', '1.2.0'), false);
    assert.equal(SemverRange.match('~1.1.0', '1.1.0'), true);
    assert.equal(SemverRange.match('~0.0.2', '1.0.2'), false);
    assert.equal(SemverRange.match('~0.0.1', '0.0.1'), true);
    assert.equal(SemverRange.match('~0.0.1', '0.0.2'), true);
    assert.equal(SemverRange.match('~0.0.1', '1.0.2'), false);
    assert.equal(SemverRange.match('~0.0.1', '1.0.1'), false);
    assert.equal(SemverRange.match('~0.1.0', '0.1.0'), true);
    assert.equal(SemverRange.match('~0.1.0', '0.2.0'), false);
    assert.equal(SemverRange.match('~0.1.0', '1.1.0'), false);
  });

  test('Semver compatibility', function() {
    assert.equal(SemverRange.match('~1.1.12', '1.1.12'), true);
    assert.equal(SemverRange.match('~1.1.12', '1.1.11'), false);
    assert.equal(SemverRange.match('~1.1.12', '1.1.345'), true);
    assert.equal(SemverRange.match('~1.1.12', '1.10.345'), false);
    assert.equal(SemverRange.match('~1.1.12', '2.10.345'), false);
  });

  test('Prerelease ranges', function() {
    assert.equal(SemverRange.match('~1.0.4-alpha.1', '1.0.4-alpha.1'), true);
    assert.equal(SemverRange.match('~1.0.4-alpha.1', '1.0.4-alpha.2'), true);
    assert.equal(SemverRange.match('~1.0.4-alpha.1', '1.0.4-beta'), true);
    assert.equal(SemverRange.match('~1.0.4-alpha.1', '1.0.4-beta.10'), true);
    assert.equal(SemverRange.match('~1.0.4-alpha.1', '1.0.4'), true);
    assert.equal(SemverRange.match('~1.0.4-alpha.1', '1.0.5-alpha.1', true), true);
    assert.equal(SemverRange.match('~1.0.4-alpha.1', '1.0.5-alpha.2', true), true);
    assert.equal(SemverRange.match('~1.0.4-alpha.1', '1.0.4-alpha', true), false);
    assert.equal(SemverRange.match('~1.0.4-alpha.1', '1.0.4-alpha.0', true), false);
    assert.equal(SemverRange.match('~1.0.4-alpha.1', '1.1.4-alpha', true), false);
  });

});

suite('Range functions', function() {
  test('Range contains', function() {
    assert.equal(new SemverRange('~1.1.0').contains('~1.1.1'), true);
    assert.equal(new SemverRange('~1.1.0').contains('~1.1.1-alpha'), true);
    assert.equal(new SemverRange('~1.1.0').contains('1.1.100'), true);
    assert.equal(new SemverRange('~1.1.0').contains('~1.2.1'), false);
    assert.equal(new SemverRange('^1.1.0').contains('1.2.1-alpha'), true);
    assert.equal(new SemverRange('^1.1.0').contains('~1.0.1'), false);
    assert.equal(new SemverRange('^1.1.0').contains('1.3'), true);
    assert.equal(new SemverRange('^1.1.0').contains('^1.2.1'), true);
    assert.equal(new SemverRange('^1.1.0').contains('~1.3.1-alpha'), true);
    assert.equal(new SemverRange('^1.1.0').contains('1.3.3-alpha'), true);
  });

  test('Range intersections', function() {
    assert.equal(new SemverRange('~1.1.0').intersect('~1.1.1').toString(), '~1.1.1');
    assert.equal(new SemverRange('~1.1.0').intersect('~1.1.1-alpha').toString(), '~1.1.1-alpha');
    assert.equal(new SemverRange('~1.1.0').intersect('1.1.100').toString(), '1.1.100');
    assert.equal(new SemverRange('~1.1.0').intersect('~1.2.1'), undefined);
    assert.equal(new SemverRange('^1.1.0').intersect('1.2.1-alpha').toString(), '1.2.1-alpha');
    assert.equal(new SemverRange('^1.1.0').intersect('~1.0.1'), undefined);
    assert.equal(new SemverRange('^1.1.0').intersect('1.3').toString(), '1.3');
    assert.equal(new SemverRange('^1.1.0').intersect('~1.3').toString(), '1.3');
    assert.equal(new SemverRange('^1.1.0').intersect('^1.3').toString(), '^1.3');
    assert.equal(new SemverRange('^1.1.0').intersect('^1.3.0').toString(), '^1.3.0');
    assert.equal(new SemverRange('^1.1.0').intersect('^1.2.1').toString(), '^1.2.1');
    assert.equal(new SemverRange('^1.1.0').intersect('~1.3.1-alpha').toString(), '~1.3.1-alpha');
    assert.equal(new SemverRange('^1.1.0').intersect('1.3.3-alpha').toString(), '1.3.3-alpha');
    assert.equal(new SemverRange('^1.0.5').intersect('~1.0.7').toString(), '~1.0.7');
    assert.equal(new SemverRange('^1.0.5').intersect('~1.0.3').toString(), '~1.0.5');
    assert.equal(new SemverRange('~2.5.0').intersect('^2.5.0-alpha.1').toString(), '~2.5.0');
    assert.equal(new SemverRange('~2.5.0').intersect('^2.5.1-alpha.1').toString(), '~2.5.1-alpha.1');
  });
});

suite('Range conversion', function() {
  test('Semver conversions', function() {
    assert.equal(convertRange('>=2.3.4 <3.0.0').toString(), '^2.3.4');
    assert.equal(convertRange('1 || 2 || 3 || 2.1').toString(), '^3.0.0');
    assert.equal(convertRange('>=2.3.4 <2.4.0').toString(), '~2.3.4');
    assert.equal(convertRange('1 2 3').toString(), '3.0.0');
    assert.equal(convertRange('hello-world').toString(), 'hello-world');
    assert.equal(convertRange('^0.2.3').toString(), '~0.2.3');
    assert.equal(convertRange('^0.0.3').toString(), '0.0.3');
    assert.equal(convertRange('>2.0.0 <=2.5.3').toString(), '2.5.3');
    assert.equal(convertRange('>2.0.0 <2.5.3').toString(), '~2.5.0');
    assert.equal(convertRange('>2.5.0 <2.5.3').toString(), '~2.5.1');
    assert.equal(convertRange('>2.5.1-alpha <2.5.3').toString(), '~2.5.1-alpha.1');
    assert.equal(convertRange('^2.3.4 || ~2.5.0').toString(), '^2.3.4');
    assert.equal(convertRange('> =3.1.10').toString(), '^3.1.10');
    assert.equal(convertRange('=0.1.20').toString(), '0.1.20');
    assert.equal(convertRange('=0.1.20 || =0.1.21 || 0.1.22 || 0.0.1').toString(), '0.1.22');
    assert.equal(convertRange('=0.1.20 || =0.1.21 || 0.1.22 || ^2 || 0.0.1').toString(), '^2.0.0');
    assert.equal(convertRange('=0.1.20 || ^0.1').toString(), '~0.1.0');
    assert.equal(convertRange('=1.1.20 || 1 || ^1.1').toString(), '^1.0.0');
    assert.equal(convertRange('2.1 2 || 1').toString(), '~2.1.0');
    assert.equal(convertRange('1.2.x').toString(), '~1.2.0');
    assert.equal(convertRange('1.x.x').toString(), '^1.0.0');
    assert.equal(convertRange('x.x.x').toString(), '*');
    assert.equal(convertRange('0').toString(), '0');
    assert.equal(convertRange('>=0.5').toString(), '~0.5.0');
    assert.equal(new SemverRange('0').has('0.5.0'), true);
    assert.equal(new SemverRange('0.5').has('0.5.4'), true);
    assert.equal(convertRange('>=0.5 0').toString(), '~0.5.0');
  });
});

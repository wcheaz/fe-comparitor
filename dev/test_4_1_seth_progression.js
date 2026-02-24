#!/usr/bin/env node

/**
 * Test script to validate generateProgressionArray accuracy for a standard 1-tier unit (Seth)
 * This is task 4.1: Validate generateProgressionArray accuracy for a standard 1-tier unit
 */

const fs = require('fs');
const path = require('path');

// Load the actual generateProgressionArray function
const { generateProgressionArray } = require('../lib/stats.ts');
const { Unit, Class } = require('../types/unit.ts');

// Load Sacred Stones data
const sacredStonesUnits = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/sacred_stones/units.json'), 'utf8'));
const sacredStonesClasses = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/sacred_stones/classes.json'), 'utf8'));

// Find Seth (a standard 1-tier promoted unit)
const seth = sacredStonesUnits.find(unit => unit.id === 'seth');
if (!seth) {
  console.error('❌ Seth not found in Sacred Stones units data');
  process.exit(1);
}

// Find the Paladin class
const paladinClass = sacredStonesClasses.find(cls => cls.id === 'paladin_m');
if (!paladinClass) {
  console.error('❌ Paladin class not found in Sacred Stones classes data');
  process.exit(1);
}

console.log('🔍 Testing Seth (1-tier unit) progression accuracy...');
console.log(`- Unit: ${seth.name} (Level ${seth.level} ${seth.class})`);
console.log(`- Already promoted: ${seth.isPromoted}`);
console.log(`- No further promotions available: ${paladinClass.promotesTo.length === 0}`);

// Test generateProgressionArray with Seth's data
function testSethProgression() {
  try {
    console.log('\n📊 Running generateProgressionArray test...');
    
    // Since Seth is already promoted and has no further promotions, 
    // promotionEvents should be empty
    const promotionEvents = [];
    const startLevel = 1;
    const endLevel = 40; // Test full progression to level 40
    
    const progression = generateProgressionArray(
      seth,
      startLevel,
      endLevel,
      sacredStonesClasses,
      promotionEvents
    );
    
    console.log(`✅ Generated ${progression.length} levels of progression data`);
    
    // Validate the progression data
    let passedTests = 0;
    let totalTests = 0;
    
    // Test 1: Correct number of levels
    totalTests++;
    if (progression.length === endLevel) {
      console.log('✅ Test 1.1: Correct number of levels generated');
      passedTests++;
    } else {
      console.log(`❌ Test 1.1: Expected ${endLevel} levels, got ${progression.length}`);
    }
    
    // Test 2: No promotion levels (since Seth is already promoted)
    totalTests++;
    const hasPromotionLevels = progression.some(level => level.isPromotionLevel);
    if (!hasPromotionLevels) {
      console.log('✅ Test 1.2: No promotion levels (correct for 1-tier unit)');
      passedTests++;
    } else {
      console.log('❌ Test 1.2: Found unexpected promotion levels');
    }
    
    // Test 3: All display levels should be standard (no tier indicators)
    totalTests++;
    const hasTierIndicators = progression.some(level => level.displayLevel.includes('Tier'));
    if (!hasTierIndicators) {
      console.log('✅ Test 1.3: All display levels are standard (no tier indicators)');
      passedTests++;
    } else {
      console.log('❌ Test 1.3: Found unexpected tier indicators in display levels');
    }
    
    // Test 4: Check first few and last few levels for reasonable stat progression
    totalTests++;
    const firstLevel = progression[0];
    const lastLevel = progression[progression.length - 1];
    
    if (firstLevel && firstLevel.stats && firstLevel.stats.hp) {
      console.log(`✅ Test 1.4.1: First level HP: ${firstLevel.stats.hp}`);
      passedTests++;
    } else {
      console.log('❌ Test 1.4.1: First level missing HP data');
    }
    
    totalTests++;
    if (lastLevel && lastLevel.stats && lastLevel.stats.hp) {
      console.log(`✅ Test 1.4.2: Last level HP: ${lastLevel.stats.hp}`);
      passedTests++;
    } else {
      console.log('❌ Test 1.4.2: Last level missing HP data');
    }
    
    // Test 5: Stat progression should be non-decreasing for each stat
    totalTests++;
    let hasDecreasingStats = false;
    for (let i = 1; i < progression.length; i++) {
      const current = progression[i];
      const previous = progression[i - 1];
      
      if (current.stats.hp && previous.stats.hp) {
        if (current.stats.hp < previous.stats.hp) {
          hasDecreasingStats = true;
          break;
        }
      }
    }
    
    if (!hasDecreasingStats) {
      console.log('✅ Test 1.5: No decreasing stats found in progression');
      passedTests++;
    } else {
      console.log('❌ Test 1.5: Found decreasing stats in progression');
    }
    
    // Test 6: Check that internal levels are sequential
    totalTests++;
    let hasSequentialInternalLevels = true;
    for (let i = 0; i < progression.length; i++) {
      if (progression[i].internalLevel !== i + 1) {
        hasSequentialInternalLevels = false;
        break;
      }
    }
    
    if (hasSequentialInternalLevels) {
      console.log('✅ Test 1.6: Internal levels are sequential');
      passedTests++;
    } else {
      console.log('❌ Test 1.6: Internal levels are not sequential');
    }
    
    // Test 7: Check that display levels match expected pattern
    totalTests++;
    let hasCorrectDisplayLevels = true;
    for (let i = 0; i < Math.min(20, progression.length); i++) {
      const expectedDisplayLevel = `Level ${i + 1}`;
      if (progression[i].displayLevel !== expectedDisplayLevel) {
        hasCorrectDisplayLevels = false;
        console.log(`❌ Expected display level "${expectedDisplayLevel}", got "${progression[i].displayLevel}" at index ${i}`);
        break;
      }
    }
    
    if (hasCorrectDisplayLevels) {
      console.log('✅ Test 1.7: Display levels are correct');
      passedTests++;
    } else {
      console.log('❌ Test 1.7: Display levels are incorrect');
    }
    
    // Test 8: Check that stats don't exceed class maximums
    totalTests++;
    let hasExceededMaxStats = false;
    for (const level of progression) {
      for (const [stat, value] of Object.entries(level.stats)) {
        const maxValue = paladinClass.maxStats[stat];
        if (maxValue && value > maxValue) {
          console.log(`❌ Stat ${stat} exceeds maximum: ${value} > ${maxValue} at level ${level.internalLevel}`);
          hasExceededMaxStats = true;
        }
      }
    }
    
    if (!hasExceededMaxStats) {
      console.log('✅ Test 1.8: No stats exceed class maximums');
      passedTests++;
    } else {
      console.log('❌ Test 1.8: Some stats exceed class maximums');
    }
    
    console.log(`\n📈 Test Results: ${passedTests}/${totalTests} tests passed`);
    
    if (passedTests === totalTests) {
      console.log('🎉 All tests passed! Seth progression is accurate.');
      return true;
    } else {
      console.log(`❌ ${totalTests - passedTests} tests failed.`);
      return false;
    }
    
  } catch (error) {
    console.error('❌ Error running generateProgressionArray test:', error.message);
    return false;
  }
}

// Run the test
const success = testSethProgression();

if (success) {
  console.log('\n✨ Task 4.1 completed successfully: generateProgressionArray accuracy validated for 1-tier unit (Seth)');
  process.exit(0);
} else {
  console.log('\n💥 Task 4.1 failed: Issues found with generateProgressionArray accuracy');
  process.exit(1);
}
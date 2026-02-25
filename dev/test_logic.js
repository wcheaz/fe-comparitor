function getDisplayInfo(level, promotionEvents, currentClass, unit) {
  let pastPromotions = promotionEvents.filter(event => event.level < level);
  
  if (pastPromotions.length === 0 && level > 20 && currentClass?.promotesTo?.length > 0 && !unit.isPromoted) {
     pastPromotions = [{ level: 20, selectedClassId: currentClass.promotesTo[0] }];
  }
  
  const tier = pastPromotions.length + 1;
  const lastPromotion = pastPromotions[pastPromotions.length - 1];
  const segmentStartLevel = lastPromotion ? lastPromotion.level : unit.level;
  const displayLevelNum = tier === 1 ? level : level - segmentStartLevel;

  return { tier, displayLevel: displayLevelNum, segmentStartLevel };
}

const unit = { level: 1, isPromoted: false };
const currentClass = { promotesTo: ["hero"] };
const promotionEvents = [];

for (let i = 1; i <= 25; i++) {
  const info = getDisplayInfo(i, promotionEvents, currentClass, unit);
  // simulate isSkipped checks
  let isSkipped = false;
  const currentPromotionLevel = 20; // default for empty events

  if (info.tier === 1) {
    if (!unit.isPromoted && i > currentPromotionLevel) {
      isSkipped = true;
    }
  }

  console.log(`Level ${i} -> Tier ${info.tier}, DisplayLevel ${info.displayLevel}, isSkipped: ${isSkipped}`);
}

export interface AttributeBadge {
  icon: string;
  label: string;
}

const MAX_BADGES = 6;

export function getAttributeBadges(attrs: Record<string, any> | null | undefined): AttributeBadge[] {
  if (!attrs) return [];
  const badges: AttributeBadge[] = [];

  // Priority 1: Accessibility
  const acc = attrs.accessibility;
  if (acc && (acc.wheelchairEntrance || acc.wheelchairParking || acc.wheelchairRestroom || acc.wheelchairSeating)) {
    badges.push({ icon: '♿', label: 'Wheelchair Accessible' });
  }

  // Priority 2: Parking
  const park = attrs.parking;
  if (park) {
    if (park.freeParkingLot || park.freeGarageParking) badges.push({ icon: '🅿️', label: 'Free Parking' });
    else if (park.freeStreetParking) badges.push({ icon: '🅿️', label: 'Street Parking' });
    else if (park.valetParking) badges.push({ icon: '🅿️', label: 'Valet' });
  }

  // Priority 3: Payment
  const pay = attrs.payment;
  if (pay) {
    if (pay.cashOnly) badges.push({ icon: '💵', label: 'Cash Only' });
    else if (pay.creditCards) badges.push({ icon: '💳', label: 'Credit Cards' });
    if (pay.nfc) badges.push({ icon: '📱', label: 'Contactless' });
  }

  // Priority 4: Atmosphere
  const atm = attrs.atmosphere;
  if (atm) {
    if (atm.outdoorSeating) badges.push({ icon: '☀️', label: 'Outdoor Seating' });
    if (atm.allowsDogs) badges.push({ icon: '🐕', label: 'Dog Friendly' });
    if (atm.goodForChildren) badges.push({ icon: '👶', label: 'Kid Friendly' });
    if (atm.liveMusic) badges.push({ icon: '🎵', label: 'Live Music' });
  }

  return badges.slice(0, MAX_BADGES);
}

/** Advisory evidence risk, not an eligibility determination or hiring prediction. */
export function analysisRisk(input: {gaps: unknown[]; complianceScore: number; specializedScore: number}): 'Low' | 'Moderate' | 'High' {
  if (input.gaps.length > 0 || input.specializedScore < 18) return 'High';
  if (input.complianceScore < 16 || input.specializedScore < 25) return 'Moderate';
  return 'Low';
}

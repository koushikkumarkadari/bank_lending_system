function combineLists(list1, list2) {
  // Merge and sort by left_position
  const merged = [...list1, ...list2].sort((a, b) => a.positions[0] - b.positions[0]);
  const result = [];

  for (let i = 0; i < merged.length; i++) {
    let current = { ...merged[i], values: [...merged[i].values] };
    let j = i + 1;

    while (j < merged.length) {
      const next = merged[j];
      const left1 = current.positions[0];
      const right1 = current.positions[1];
      const left2 = next.positions[0];
      const right2 = next.positions[1];

      // Calculate overlap
      const overlapStart = Math.max(left1, left2);
      const overlapEnd = Math.min(right1, right2);
      const overlapLength = Math.max(0, overlapEnd - overlapStart);
      const length1 = right1 - left1;
      const length2 = right2 - left2;
      const minLength = Math.min(length1, length2);
      const overlapPercentage = overlapLength / minLength;

      if (overlapPercentage > 0.5) {
        // Combine values, keep first element's positions
        current.values = [...new Set([...current.values, ...next.values])]; // Remove duplicates
        merged.splice(j, 1); // Remove combined element
      } else {
        j++;
      }
    }

    result.push(current);
  }

  return result;
}

module.exports = combineLists;
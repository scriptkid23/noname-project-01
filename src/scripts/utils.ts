export function createRandomChallenge() {
    const lengths = [5, 5, 8, 8, 8, 8, 10, 10, 12, 12];
    const elements = [1, 2, 3, 4];
  
    const randomArray = Array.from({ length: lengths.length }, (_, index) => {
      const length = lengths[index];
      const randomSubArray = Array.from({ length: length - 1 }, () => {
        const randomIndex = Math.floor(Math.random() * elements.length);
        return elements[randomIndex];
      });
      const lastElement = elements[Math.floor(Math.random() * elements.length)];
      return [...randomSubArray, lastElement];
    });
  
    return randomArray;
  }
  
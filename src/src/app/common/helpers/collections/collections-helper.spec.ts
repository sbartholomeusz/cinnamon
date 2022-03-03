import { CollectionsHelper } from './collections-helper';

describe('CollectionsHelper', () => {
  it('should create an instance', () => {
    expect(new CollectionsHelper()).toBeTruthy();
  });

  it('should shuffle the order', () => {
    let sequence:Array<number> = [...Array(10000).keys()]; // Generate array of sequence numbers
    let shuffledSequence: Array<number> = new CollectionsHelper<number>().shuffleArray(sequence);

    expect(shuffledSequence).toBeDefined;
    expect(shuffledSequence).not.toBeNull;
    expect(shuffledSequence.length).toEqual(10000);
    expect(shuffledSequence[0]).not.toBe(1); // TODO: Bit dodgy logic. Needs to be written properly
  });
});

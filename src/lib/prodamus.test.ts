
import {
  createProdamusSignature,
  sortObjectKeys,
  flattenObject,
  parseProdamusBody,
  convertNumericKeysToArrays,
} from './prodamus';

describe('prodamus', () => {
  describe('convertNumericKeysToArrays', () => {
    it('should handle arrays', () => {
      const obj = {
        '0': 'a',
        '1': 'b',
      };
      const result = convertNumericKeysToArrays([obj]);
      expect(result).toEqual([['a', 'b']]);
    });
  });
  describe('sortObjectKeys', () => {
    it('should sort object keys recursively', () => {
      const obj = {
        c: 1,
        a: {
          e: 3,
          d: 2,
        },
        b: [
          { g: 5, f: 4 },
          { i: 7, h: 6 },
        ],
      };
      const sorted = sortObjectKeys(obj);
      expect(JSON.stringify(sorted)).toBe(
        '{"a":{"d":2,"e":3},"b":[{"f":4,"g":5},{"h":6,"i":7}],"c":1}'
      );
    });
  });

  describe('createProdamusSignature', () => {
    it('should create a valid signature', () => {
      const data = {
        order_id: '123',
        amount: '100.00',
        products: [
          {
            name: 'Test Product',
            price: '100.00',
            quantity: 1,
          },
        ],
      };
      const secretKey = 'test-secret';
      const signature = createProdamusSignature(data, secretKey);
      expect(signature).toBe('ffd348c29050276dd52e16fbea73d718a73ae9fa8c4f861e0abec7b42d8cc899');
    });
  });

  describe('flattenObject', () => {
    it('should flatten an object', () => {
      const obj = {
        a: 1,
        b: {
          c: 2,
          d: {
            e: 3,
          },
        },
        f: [4, 5],
      };
      const flattened = flattenObject(obj);
      expect(flattened).toEqual({
        'a': '1',
        'b[c]': '2',
        'b[d][e]': '3',
        'f[0]': '4',
        'f[1]': '5',
      });
    });
  });

  describe('parseProdamusBody', () => {
    it('should parse a prodamus body', () => {
      const body = 'a=1&b[c]=2&b[d][e]=3&f[0]=4&f[1]=5';
      const parsed = parseProdamusBody(body);
      expect(parsed).toEqual({
        a: '1',
        b: {
          c: '2',
          d: {
            e: '3',
          },
        },
        f: ['4', '5'],
      });
    });
  });
});

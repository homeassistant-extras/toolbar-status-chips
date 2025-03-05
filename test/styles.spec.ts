import { chipStyles, styles } from '@/styles';
import { expect } from 'chai';
import { css } from 'lit';
import { styleMap } from 'lit-html/directives/style-map.js';

const expecteStyle = css`
  #chips {
    --stack-card-gap: 0;
  }
`;

describe('styles.ts', () => {
  describe('styles', () => {
    it('should define CSS for chips with zero card gap', () => {
      // Convert styles to string for easy comparison
      const stylesString = String(styles);

      expect(stylesString).to.contain(expecteStyle);
    });
  });

  describe('chipStyles', () => {
    it('should return fixed position styles when not in edit mode', () => {
      const result = chipStyles(false);

      expect(result).to.deep.equal(
        styleMap({
          position: 'fixed',
          top: '10px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: '5',
        }),
      );
    });

    it('should return flexible layout styles when in edit mode', () => {
      const result = chipStyles(true);

      expect(result).to.deep.equal(
        styleMap({
          position: 'inherit',
          display: 'flex',
          transform: 'none',
          justifyContent: 'center',
          alignItems: 'center',
          flexWrap: 'wrap',
        }),
      );
    });
  });
});

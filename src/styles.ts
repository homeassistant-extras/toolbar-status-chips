import { css } from 'lit';
import type { DirectiveResult } from 'lit-html/directive';
import {
  type StyleMapDirective,
  styleMap,
} from 'lit-html/directives/style-map.js';

export const styles = css`
  #chips {
    --stack-card-gap: 0;
  }
`;

export const chipStyles = (
  editMode: boolean,
): DirectiveResult<typeof StyleMapDirective> => {
  return styleMap(
    editMode
      ? {
          position: 'inherit',
          display: 'flex',
          transform: 'none',
          justifyContent: 'center',
          alignItems: 'center',
          flexWrap: 'wrap',
        }
      : {
          position: 'fixed',
          top: '10px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: '5',
        },
  );
};

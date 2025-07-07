import { css } from 'lit';

export const styles = css`
  :host {
    --stack-card-gap: 0;
    width: fit-content;
    position: fixed;
    top: 10px;
    left: 0;
    right: 0;
    margin-left: auto;
    margin-right: auto;
    z-index: 5;
  }

  /* Styles for edit mode or preview mode */
  :host([edit-mode]),
  :host([preview]) {
    position: inherit;
    display: flex !important;
    justify-content: center;
    flex-wrap: wrap;
  }
`;

import ToolbarStatusChips from './card';

declare global {
  interface Window {
    customCards: Array<Object>;
  }
}

// Register our custom card
customElements.define('toolbar-status-chips', ToolbarStatusChips);

window.customCards = window.customCards || [];
window.customCards.push({
  type: 'toolbar-status-chips',
  name: 'Toolbar Status Chips',
  description:
    'Display status chips on the toolbar for entities with the status label',
});

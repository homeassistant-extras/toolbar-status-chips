/**
 * Room Summary Card Registration Module
 *
 * This module handles the registration of the Room Summary Card custom element
 * with the browser and Home Assistant's custom card registry. It makes the
 * component available for use in Home Assistant dashboards.
 */

import ToolbarStatusChips from '@/card';
import { ToolbarStatusChipsEditor } from '@/editor';

// Register the custom element with the browser
customElements.define('toolbar-status-chips', ToolbarStatusChips);
customElements.define('toolbar-status-chips-editor', ToolbarStatusChipsEditor);

// Ensure the customCards array exists on the window object
window.customCards = window.customCards || [];

// Register the card with Home Assistant's custom card registry
window.customCards.push({
  // Unique identifier for the card type
  type: 'toolbar-status-chips',

  // Display name in the UI
  name: 'Toolbar Status Chips',

  // Card description for the UI
  description:
    'Display status chips on the toolbar for entities with the status label',

  // Show a preview of the card in the UI
  preview: true,

  // URL for the card's documentation
  documentationURL:
    'https://github.com/homeassistant-extras/toolbar-status-chips',
});

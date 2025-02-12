import { expect } from 'chai';
import { stub, type SinonStub } from 'sinon';

describe('index.ts', () => {
  let customElementsStub: SinonStub;
  let customCardsStub: Array<Object> | undefined;

  beforeEach(() => {
    // Stub customElements.define to prevent actual registration
    customElementsStub = stub(customElements, 'define');

    // Create a stub for window.customCards
    customCardsStub = [];
    Object.defineProperty(window, 'customCards', {
      get: () => customCardsStub,
      set: (value) => {
        customCardsStub = value;
      },
      configurable: true,
    });
  });

  afterEach(() => {
    // Restore the original customElements.define
    customElementsStub.restore();
    customCardsStub = undefined;
    delete require.cache[require.resolve('@/index.ts')];
  });

  it('should register both toolbar-status-chips and editor custom elements', () => {
    require('@/index.ts');
    expect(customElementsStub.calledTwice).to.be.true;
    expect(customElementsStub.firstCall.args[0]).to.equal(
      'toolbar-status-chips',
    );
    expect(customElementsStub.secondCall.args[0]).to.equal(
      'toolbar-status-chips-editor',
    );
  });

  it('should initialize window.customCards if undefined', () => {
    customCardsStub = undefined;
    require('@/index.ts');

    expect(window.customCards).to.be.an('array');
  });

  it('should add card configuration with all fields to window.customCards', () => {
    require('@/index.ts');

    expect(window.customCards).to.have.lengthOf(1);
    expect(window.customCards[0]).to.deep.equal({
      type: 'toolbar-status-chips',
      name: 'Toolbar Status Chips',
      description:
        'Display status chips on the toolbar for entities with the status label',
      preview: true,
      documentationURL:
        'https://github.com/homeassistant-extras/toolbar-status-chips',
    });
  });

  it('should preserve existing cards when adding new card', () => {
    // Add an existing card
    window.customCards = [
      {
        type: 'existing-card',
        name: 'Existing Card',
      },
    ];

    require('@/index.ts');

    expect(window.customCards).to.have.lengthOf(2);
    expect(window.customCards[0]).to.deep.equal({
      type: 'existing-card',
      name: 'Existing Card',
    });
  });

  it('should handle multiple imports without duplicating registration', () => {
    require('@/index.ts');
    require('@/index.ts');

    expect(window.customCards).to.have.lengthOf(1);
    expect(customElementsStub.callCount).to.equal(2); // Called twice for initial registration only
  });
});

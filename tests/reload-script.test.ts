import { describe, it, expect } from 'vitest';
import { getReloadScript } from '../src/reload-script.js';

describe('reload-script', () => {
  describe('getReloadScript', () => {
    it('should return a script tag', () => {
      const script = getReloadScript();
      expect(script).toContain('<script>');
      expect(script).toContain('</script>');
    });

    it('should include EventSource connection to /events', () => {
      const script = getReloadScript();
      expect(script).toContain('EventSource');
      expect(script).toContain('/events');
    });

    it('should include reload on message', () => {
      const script = getReloadScript();
      expect(script).toContain('location.reload');
    });

    it('should listen for reload event', () => {
      const script = getReloadScript();
      expect(script).toContain('reload');
    });
  });
});

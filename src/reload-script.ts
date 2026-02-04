export function getReloadScript(): string {
  return `<script>
(function() {
  let retryDelay = 1000;
  const maxRetryDelay = 30000;

  function connect() {
    const eventSource = new EventSource('/events');

    eventSource.addEventListener('reload', function() {
      location.reload();
    });

    eventSource.onopen = function() {
      retryDelay = 1000;
    };

    eventSource.onerror = function() {
      eventSource.close();
      console.log('SSE connection lost, reconnecting in ' + (retryDelay / 1000) + 's...');
      setTimeout(connect, retryDelay);
      retryDelay = Math.min(retryDelay * 2, maxRetryDelay);
    };
  }

  connect();
})();
</script>`;
}

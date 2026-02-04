export function getReloadScript(): string {
  return `<script>
(function() {
  const eventSource = new EventSource('/events');
  eventSource.addEventListener('reload', function() {
    location.reload();
  });
  eventSource.onerror = function() {
    console.log('SSE connection lost, attempting to reconnect...');
  };
})();
</script>`;
}

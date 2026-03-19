interface MessageBannerProps {
  title: string;
  message: string;
  tone: 'success' | 'error';
  onClose: () => void;
}

function MessageBanner({ title, message, tone, onClose }: MessageBannerProps) {
  return (
    <section className={`message-banner ${tone === 'error' ? 'message-banner-error' : 'message-banner-success'}`}>
      <div className="message-banner-copy">
        <strong>{title}</strong>
        <span>{message}</span>
      </div>
      <button
        type="button"
        className="message-banner-close"
        onClick={onClose}
        aria-label={`${title} schliessen`}>
        &times;
      </button>
    </section>
  );
}

export default MessageBanner;

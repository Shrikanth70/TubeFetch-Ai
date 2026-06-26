const SUPPORTED_PLATFORMS = [
  /^https?:\/\/(www\.)?youtube\.com\/watch\?v=/,
  /^https?:\/\/youtu\.be\//,
  /^https?:\/\/(www\.)?youtube\.com\/shorts\//,
  /^https?:\/\/(www\.)?vimeo\.com\/\d+/,
  /^https?:\/\/(www\.|vm\.)?tiktok\.com\//,
  /^https?:\/\/(www\.)?twitter\.com\/.*\/status\//,
  /^https?:\/\/(www\.)?x\.com\/.*\/status\//,
  /^https?:\/\/(www\.)?instagram\.com\/(p|reel)\//,
  /^https?:\/\/(www\.)?reddit\.com\/.*\/comments\//,
];

const PLATFORM_LABELS = {
  0: 'YouTube', 1: 'YouTube', 2: 'YouTube Shorts',
  3: 'Vimeo', 4: 'TikTok', 5: 'Twitter',
  6: 'X (Twitter)', 7: 'Instagram', 8: 'Reddit',
};

/**
 * Validates a URL against the supported platform allowlist.
 */
export function validateUrl(url) {
  const trimmed = url.trim();

  if (!trimmed) {
    return { valid: false, error: 'Please enter a URL.' };
  }

  try {
    new URL(trimmed);
  } catch {
    return { valid: false, error: 'Please enter a valid URL.' };
  }

  const matchIndex = SUPPORTED_PLATFORMS.findIndex((pattern) => pattern.test(trimmed));

  if (matchIndex === -1) {
    return {
      valid: false,
      error: 'Unsupported platform. We support YouTube, Vimeo, TikTok, Instagram, Twitter, and Reddit.',
    };
  }

  return { valid: true, platform: PLATFORM_LABELS[matchIndex] };
}

const parseUserAgent = (userAgentString) => {
  if (!userAgentString) return "Unknown Device";

  let browser = "Unknown Browser";
  let os = "Unknown OS";
  let deviceType = "desktop"; // desktop, mobile, tablet

  // Detect OS
  if (/windows/i.test(userAgentString)) {
    os = "Windows";
  } else if (/macintosh|mac os x/i.test(userAgentString)) {
    os = "macOS";
  } else if (/android/i.test(userAgentString)) {
    os = "Android";
    deviceType = "mobile";
  } else if (/iphone|ipad|ipod/i.test(userAgentString)) {
    os = "iOS";
    deviceType = "mobile";
  } else if (/linux/i.test(userAgentString)) {
    os = "Linux";
  }

  // Detect Browser
  if (/edg/i.test(userAgentString)) {
    browser = "Edge";
  } else if (/chrome|crios/i.test(userAgentString)) {
    browser = "Chrome";
  } else if (/firefox|fxios/i.test(userAgentString)) {
    browser = "Firefox";
  } else if (/safari/i.test(userAgentString)) {
    browser = "Safari";
  } else if (/trident|msie/i.test(userAgentString)) {
    browser = "Internet Explorer";
  }

  return {
    label: `${browser} • ${os}`,
    browser,
    os,
    deviceType,
  };
};

module.exports = {
  parseUserAgent,
};

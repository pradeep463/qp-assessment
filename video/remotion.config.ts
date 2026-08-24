import { Config } from "@remotion/cli/config";

Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);
// Full Chromium (Playwright) is pre-installed and supports the H264 codec
// required for MP4 output. This avoids downloading a separate browser.
Config.setChromiumOpenGlRenderer("angle");

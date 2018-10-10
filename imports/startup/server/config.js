import { loadConfig } from '../common/config';

export function loadServerConfig(env) {
  switch (env) {
    case "production":
    case "staging":
    case "development":
    default:
      loadConfig();
      break;
  }
}

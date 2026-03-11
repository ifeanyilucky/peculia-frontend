import { providerDiscoveryService } from "./providerDiscovery.service";
import { providerProfileService } from "./providerProfile.service";
import { providerManagementService } from "./providerManagement.service";

export const providerService = {
  // Discovery methods
  ...providerDiscoveryService,

  // Profile methods
  ...providerProfileService,

  // Management methods
  ...providerManagementService,
};

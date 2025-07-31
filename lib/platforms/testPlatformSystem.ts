// Test file to demonstrate the platform registration system

import { platformRegistry } from "./platformRegistry";
import { Vehicle } from "@/store/vehiclesSlice";

// Test function to demonstrate the platform system
export function testPlatformSystem() {
  console.log("=== Testing Platform Registration System ===");
  
  // Get all registered platforms
  const platforms = platformRegistry.getRegisteredPlatforms();
  console.log("Registered platforms:", platforms);
  
  // Get platform information
  const info = platformRegistry.getPlatformInfo();
  console.log("Platform info:", info);
  
  // Test creating a platform instance
  const testVehicle: Vehicle = {
    key: "test-vehicle",
    name: "Test Vehicle",
    platform: "ovmsv2api",
    platformParameters: {
      server: "test.server.com",
      wssport: "443"
    }
  };
  
  const platform = platformRegistry.createPlatform("ovmsv2api", testVehicle);
  if (platform) {
    console.log("Successfully created platform instance:", platform.constructor.name);
  } else {
    console.log("Failed to create platform instance");
  }
  
  // Test non-existent platform
  const nonExistentPlatform = platformRegistry.createPlatform("nonexistent", testVehicle);
  if (!nonExistentPlatform) {
    console.log("Correctly handled non-existent platform");
  }
  
  console.log("=== Platform System Test Complete ===");
} 